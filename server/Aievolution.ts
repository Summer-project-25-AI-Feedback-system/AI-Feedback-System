import * as fs from "fs/promises";
import axios from "axios";
import * as dotenv from "dotenv";
import * as nodemailer from "nodemailer";
import path from "path";
import { simpleGit, SimpleGit } from "simple-git";
import { existsSync } from "fs";
import { resolve } from "path";

// Load environment variables from .env file
dotenv.config();

// OpenAI API response types
interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// Create email transporter
const createTransporter = () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error("Gmail credentials missing from .env file");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

// Wait for specified time
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Get all XML files from output directory
async function getXmlFiles(dir: string): Promise<string[]> {
  try {
    const files = await fs.readdir(dir);
    return files.filter((f) => f.endsWith(".xml")).map((f) => `${dir}/${f}`);
  } catch (error) {
    console.error("Error reading directory:", error);
    return [];
  }
}

// Split large XML file into smaller chunks
function splitXmlIntoChunks(
  xmlContent: string,
  maxChunkSize: number = 15000
): string[] {
  const chunks: string[] = [];
  let currentChunk = "";

  // Split XML line by line
  const lines = xmlContent.split("\n");

  for (const line of lines) {
    // If current chunk + new line is too large, save chunk and start new one
    if ((currentChunk + line).length > maxChunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = "";
      }
      // If single line is too long, split it into smaller parts
      if (line.length > maxChunkSize) {
        const subChunks =
          line.match(new RegExp(`.{1,${maxChunkSize}}`, "g")) || [];
        chunks.push(...subChunks);
      } else {
        currentChunk = line;
      }
    } else {
      currentChunk += (currentChunk ? "\n" : "") + line;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

// Get value from .env file
const DAILY_CALL_LIMIT = parseInt(process.env.DAILY_CALL_LIMIT || "10");
const WEEKLY_CALL_LIMIT = parseInt(process.env.WEEKLY_CALL_LIMIT || "50");

// Counters
let dailyCallCount = 0;
let weeklyCallCount = 0;
let lastDailyReset = new Date();
let lastWeeklyReset = new Date();

async function checkRateLimits(repoPath: string): Promise<boolean> {
  try {
    const git: SimpleGit = simpleGit(repoPath);

    // Get latest commit
    const lastCommit = await git.revparse(["HEAD"]);

    const dailyCommits = await git.log(['--since="24 hours ago"']);
    const weeklyCommits = await git.log(['--since="7 days ago"']);

    // Check daily limit
    if (dailyCommits.total >= DAILY_CALL_LIMIT) {
      console.log(`Daily AI call limit reached (${DAILY_CALL_LIMIT})`);
      return false;
    }

    if (weeklyCommits.total >= WEEKLY_CALL_LIMIT) {
      console.log(`Weekly AI call limit reached (${WEEKLY_CALL_LIMIT})`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking rate limits:", error);
    return false;
  }
}

// Add these interfaces
interface TokenUsage {
  organizationId: string;
  tokens: number;
  timestamp: number;
}

interface RepoSize {
  organizationId: string;
  size: number;
  lastChecked: number;
}

// Add these variables
const tokenUsageMap = new Map<string, TokenUsage[]>();
const repoSizeMap = new Map<string, RepoSize>();
const MAX_TOKENS_PER_DAY = 1000000; // 1M tokens per day
const MAX_REPO_SIZE = 100000000; // 100MB

// Add this function for token usage tracking
async function trackTokenUsage(organizationId: string, tokens: number) {
  const now = Date.now();
  const dayAgo = now - 24 * 60 * 60 * 1000;

  // Get organization's token usage
  let usage = tokenUsageMap.get(organizationId) || [];

  // Remove old entries (older than 24h)
  usage = usage.filter((u) => u.timestamp > dayAgo);

  // Add new entry
  usage.push({
    organizationId,
    tokens,
    timestamp: now,
  });

  // Update usage
  tokenUsageMap.set(organizationId, usage);

  // Calculate total daily usage
  const dailyUsage = usage.reduce((sum, u) => sum + u.tokens, 0);

  // Check if limit is exceeded
  if (dailyUsage > MAX_TOKENS_PER_DAY) {
    throw new Error(
      `Organization ${organizationId} token usage limit exceeded. Used: ${dailyUsage}, Limit: ${MAX_TOKENS_PER_DAY}`
    );
  }
}

// Add this function to check repository size
async function checkRepoSize(organizationId: string, repoPath: string) {
  const now = Date.now();
  const lastChecked = repoSizeMap.get(organizationId)?.lastChecked || 0;

  // Check size only once per hour
  if (now - lastChecked < 60 * 60 * 1000) {
    return;
  }

  try {
    // Calculate repository size
    const size = await calculateRepoSize(repoPath);

    // Update size
    repoSizeMap.set(organizationId, {
      organizationId,
      size,
      lastChecked: now,
    });

    // Check if limit is exceeded
    if (size > MAX_REPO_SIZE) {
      console.warn(
        `Warning: Repository size exceeds recommended limit. Size: ${size}, Limit: ${MAX_REPO_SIZE}`
      );
      // Don't throw error, continue processing
      return;
    }
  } catch (error) {
    console.error("Error checking repo size:", error);
    // Don't throw error, continue processing
  }
}

// Add this function to calculate repository size
async function calculateRepoSize(repoPath: string): Promise<number> {
  let totalSize = 0;

  async function calculateDirSize(dir: string) {
    const files = await fs.readdir(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = await fs.stat(filePath);

      if (stats.isDirectory()) {
        await calculateDirSize(filePath);
      } else {
        totalSize += stats.size;
      }
    }
  }

  await calculateDirSize(repoPath);
  return totalSize;
}

// Update interface for GitHub stats to match terminal output
interface GitHubStats {
  organizationId: string;
  repoPath: string;
  analysis: {
    timestamp: string;
    lastCommit: {
      hash: string;
      time: string;
    };
    repository: {
      totalCommits: number;
      sizeInMB: number;
      changes24h: number;
    };
    warnings: {
      highCommitCount: boolean;
      largeRepoSize: boolean;
    };
  };
}

// Update function to save GitHub stats to JSON
async function saveGitHubStats(stats: GitHubStats) {
  const outputDir = "output";
  const statsFile = path.join(outputDir, "github_stats.json");

  try {
    // Create output directory if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true });

    // Read existing stats if file exists
    let allStats: GitHubStats[] = [];
    try {
      const existingData = await fs.readFile(statsFile, "utf-8");
      allStats = JSON.parse(existingData);
    } catch (error) {
      // File doesn't exist or is invalid, start with empty array
      allStats = [];
    }

    // Add new stats
    allStats.push(stats);

    // Save updated stats
    await fs.writeFile(statsFile, JSON.stringify(allStats, null, 2), "utf-8");
    console.log(`GitHub stats saved to ${statsFile}`);
  } catch (error) {
    console.error("Error saving GitHub stats:", error);
  }
}

// Add interface for Git info
interface GitInfo {
  organizationId: string;
  repoPath: string;
  lastCommit: string;
  lastCommitTime: number;
  lastChecked: number;
  size: number;
  commitCount: number;
}

// Add variable for storing Git info
const gitInfoMap = new Map<string, GitInfo>();

// Update checkGitRepo function
async function checkGitRepo(organizationId: string, repoPath: string) {
  const now = Date.now();
  const lastChecked = gitInfoMap.get(organizationId)?.lastChecked || 0;

  // Check only once per hour
  if (now - lastChecked < 60 * 60 * 1000) {
    console.log(`Git info was checked recently, using cached value`);
    return;
  }

  const absoluteRepoPath = resolve(repoPath); // ✅ Resolve to absolute path

  if (!existsSync(absoluteRepoPath)) {
    throw new Error(`Git repo path does not exist: ${absoluteRepoPath}`);
  }

  console.log(`[checkGitRepo] Using repoPath: ${absoluteRepoPath}`);

  try {
    console.log(`Analyzing Git repository for ${organizationId}...`);
    const git: SimpleGit = simpleGit(repoPath);

    // Get latest commit and its time
    const lastCommit = await git.revparse(["HEAD"]);
    const lastCommitInfo = await git.show(["--format=%at", "-s", lastCommit]);
    const lastCommitTime = parseInt(lastCommitInfo) * 1000; // Convert to milliseconds

    console.log(`Last commit: ${lastCommit}`);
    console.log(
      `Last commit time: ${new Date(lastCommitTime).toLocaleString()}`
    );

    // Get commit count
    const commitCount = (await git.log()).total;
    console.log(`Total commits: ${commitCount}`);

    // Get repository size
    const size = await calculateRepoSize(repoPath);
    const sizeInMB = size / (1024 * 1024);
    console.log(`Repository size: ${sizeInMB.toFixed(2)} MB`);

    // Get changes in last 24h
    const changes = await git.log(['--since="24 hours ago"']);
    console.log(`Changes in last 24h: ${changes.total} commits`);

    // Check for warnings
    const highCommitCount = changes.total > 50;
    const largeRepoSize = size > MAX_REPO_SIZE;

    if (highCommitCount) {
      console.warn(
        `Warning: High number of commits in last 24h (${changes.total})`
      );
    }

    if (largeRepoSize) {
      console.warn(`Warning: Repository size exceeds limit`);
    }

    // Create stats object matching terminal output
    const stats: GitHubStats = {
      organizationId,
      repoPath,
      analysis: {
        timestamp: new Date(now).toLocaleString(),
        lastCommit: {
          hash: lastCommit,
          time: new Date(lastCommitTime).toLocaleString(),
        },
        repository: {
          totalCommits: commitCount,
          sizeInMB: parseFloat(sizeInMB.toFixed(2)),
          changes24h: changes.total,
        },
        warnings: {
          highCommitCount,
          largeRepoSize,
        },
      },
    };

    // Save stats to JSON
    await saveGitHubStats(stats);

    // Update Git info map
    gitInfoMap.set(organizationId, {
      organizationId,
      repoPath,
      lastCommit,
      lastCommitTime,
      lastChecked: now,
      size,
      commitCount,
    });
  } catch (error) {
    console.error("Error checking Git repository:", error);
  }
}

// Add new interface for evaluation tracking
interface EvaluationRecord {
  submissionId: string;
  timestamp: number;
  evaluatedBy: "AI" | "TEACHER";
  teacherId?: string;
}

// Add new Map for evaluation tracking
const evaluationHistory = new Map<string, EvaluationRecord[]>();

// Modify hasBeenEvaluated function
async function hasBeenEvaluated(file: string): Promise<{
  evaluated: boolean;
  needsUpdate: boolean;
  lastEvaluation: EvaluationRecord | null;
}> {
  const submissionId = path.basename(file, ".xml");
  const markdownFile = path.join("output", "ASSIGNMENT_EVALUATION.md");

  try {
    const xmlLastModified = await getLastModifiedTime(file);
    const markdownLastModified = await getLastModifiedTime(markdownFile);

    const gitInfo = gitInfoMap.get("org123");
    const lastCommitTime = gitInfo?.lastCommitTime || 0;

    const needsUpdate =
      xmlLastModified > markdownLastModified ||
      lastCommitTime > markdownLastModified;

    const evaluations = evaluationHistory.get(submissionId) || [];
    const lastEvaluation = evaluations[evaluations.length - 1] || null;

    if (lastEvaluation?.evaluatedBy === "AI") {
      return {
        evaluated: true,
        needsUpdate: false,
        lastEvaluation,
      };
    }

    return {
      evaluated: true,
      needsUpdate: needsUpdate,
      lastEvaluation,
    };
  } catch {
    return {
      evaluated: false,
      needsUpdate: true,
      lastEvaluation: null,
    };
  }
}

// Add new function to record evaluations
async function recordEvaluation(
  submissionId: string,
  evaluatedBy: "AI" | "TEACHER",
  teacherId?: string
) {
  const evaluations = evaluationHistory.get(submissionId) || [];
  evaluations.push({
    submissionId,
    timestamp: Date.now(),
    evaluatedBy,
    teacherId,
  });
  evaluationHistory.set(submissionId, evaluations);
}

// Funktio promptin hakemiseen tiedostosta
async function getPromptFromFile(): Promise<string> {
  const promptPath = path.resolve(__dirname, 'prompt.txt');
  try {
    return await fs.readFile(promptPath, 'utf-8');
  } catch (error) {
    console.warn('Prompt file not found, using default prompt.');
    // Palauta oletusprompt jos tiedostoa ei löydy
    return `
You are a information technlogy teacher evaluating a student's project or code. Your goal is to provide constructive, concise, and actionable feedback that helps the student learn and improve. Analyze the following and rate it according to the following criteria:

1. Syntax and Validity (0-10): Is the code syntactically correct and does it run/compile without errors?
2. Structure and Organization (0-20): Is the code logically organized and are functions, classes, modules, and other language features used appropriately?
3. Clarity and Readability (0-20): Are the names of variables, functions, and classes descriptive? Is the code well-formed and easy to read?
4. Language-specific features (0-20): Does the code use features and best practices of the programming language in question (e.g., idiomatic constructs, error handling, etc.)?
5. Best practices (0-30): Does the code follow general and language-specific best practices (e.g., modularity, avoiding code duplication, proper error handling)?

Instructions:
- Analyze the code based on the criteria above.
- Provide a brief summary of the overall quality of the code, including strengths and areas for improvement.
- Give rates for each criteria and a total rating (0-5, where 0 is incomplete and 5 is excellent) based on the criteria.
- Keep the feedback clear, supportive, and instructive, student-friendly, and respectful.
- If the code seems unfinished or the context is unclear, note this and suggest possible improvements.
- If the code breaks in the middle of a function, note possible problems, but avoid speculative assumptions.
`;
  }
}

// Esimerkki arviointifunktiosta, joka käyttää prompt.txt-tiedostoa
export async function evaluateWithOpenAI(
  xmlContent: string,
  organizationId: string,
  repoPath: string
): Promise<string> {
  const submissionId = path.basename(repoPath, ".xml");

  // Check evaluation history
  const evaluations = evaluationHistory.get(submissionId) || [];
  const lastEvaluation = evaluations[evaluations.length - 1];

  if (lastEvaluation?.evaluatedBy === "AI") {
    throw new Error(
      "This submission has already been evaluated by AI. Please contact your teacher for re-evaluation."
    );
  }

  // Check Git repository
  await checkGitRepo(organizationId, repoPath);

  // Calculate token count
  const estimatedTokens = Math.ceil(xmlContent.length / 4);
  console.log(`Estimated token count: ${estimatedTokens}`);

  // Track token usage
  await trackTokenUsage(organizationId, estimatedTokens);

  // Check limits
  if (!(await checkRateLimits(repoPath))) {
    throw new Error("AI call limit reached. Try again later.");
  }

  // Increment counters
  dailyCallCount++;
  weeklyCallCount++;
  console.log(
    `Daily calls: ${dailyCallCount}, Weekly calls: ${weeklyCallCount}`
  );

  // Truncate content if it's too long
  const maxContentTokens = 3000;
  const truncatedContent =
    estimatedTokens > maxContentTokens
      ? xmlContent.substring(0, maxContentTokens * 4) +
        "\n... (content truncated)"
      : xmlContent;

  // Haetaan prompt tiedostosta
  const basePrompt = await getPromptFromFile();
  const prompt = `${basePrompt}

Student Code:
${truncatedContent}
`;

  // OpenAI API -kutsu
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OpenAI API key not found in .env file");
  }

  const endpoint = "https://api.openai.com/v1/chat/completions";

  let retries = 3;
  while (retries > 0) {
    try {
      const response = await axios.post(
        endpoint,
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1000,
          temperature: 0.3,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.choices?.[0]?.message?.content) {
        console.log("Response received from OpenAI API");
        // Record evaluation
        await recordEvaluation(submissionId, "AI");
        return response.data.choices[0].message.content;
      }
      throw new Error("Invalid response from OpenAI API");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`Error calling OpenAI API: ${error.message}`);
      } else {
        console.log(`Unknown error calling OpenAI API: ${error}`);
      }
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error("Invalid OpenAI API key. Check .env file.");
        }
        if (error.response?.status === 429) {
          console.log("Rate limit reached, waiting 20 seconds...");
          await sleep(20000);
          retries--;
          continue;
        }
      }
      if (retries === 1) throw error;
      retries--;
      await sleep(20000);
    }
  }

  throw new Error("Failed to get response from OpenAI API after all retries");
}

// Modify email sending function for Gmail
async function sendEmailFeedback(feedbackPath: string, studentEmail: string) {
  try {
    console.log("Attempting to send email...");

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error("Gmail credentials missing from .env file");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Check connection
    await transporter.verify();
    console.log("Email connection verified");

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: studentEmail,
      subject: "Assignment Evaluation",
      text: "Your assignment evaluation is attached to this email.",
      attachments: [
        {
          filename: "ASSIGNMENT_EVALUATION.md",
          path: feedbackPath,
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    return info;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(`Error sending email: ${error.message}`);
    } else {
      console.log("Unknown error sending email:", error);
    }
    throw error;
  }
}

interface EvaluationInfo {
  timestamp: number;
  lastModified: number;
}

async function getLastModifiedTime(file: string): Promise<number> {
  try {
    const stats = await fs.stat(file);
    return stats.mtime.getTime();
  } catch (error) {
    console.error(`Error getting file stats for ${file}:`, error);
    return 0;
  }
}

// Add this function to check token usage
async function getTokenUsage(organizationId: string): Promise<{
  dailyUsage: number;
  weeklyUsage: number;
  last24Hours: TokenUsage[];
}> {
  const now = Date.now();
  const dayAgo = now - 24 * 60 * 60 * 1000;
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

  const usage = tokenUsageMap.get(organizationId) || [];

  return {
    dailyUsage: usage
      .filter((u) => u.timestamp > dayAgo)
      .reduce((sum, u) => sum + u.tokens, 0),
    weeklyUsage: usage
      .filter((u) => u.timestamp > weekAgo)
      .reduce((sum, u) => sum + u.tokens, 0),
    last24Hours: usage.filter((u) => u.timestamp > dayAgo),
  };
}

// Add function to get Git info
async function getGitInfo(
  organizationId: string
): Promise<GitInfo | undefined> {
  return gitInfoMap.get(organizationId);
}

// Fix error handling
async function handleError(error: unknown): Promise<never> {
  if (error instanceof Error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
  console.log("Unknown error occurred");
  throw new Error("Unknown error occurred");
}

// Modify main function
async function main() {
  try {
    // Check output directory
    await fs.access("output").catch(async () => {
      console.log("Creating output directory...");
      await fs.mkdir("output", { recursive: true });
    });

    const xmlFiles = await getXmlFiles("output");

    if (xmlFiles.length === 0) {
      console.log("No XML files found in output directory");
      return;
    }

    console.log(`Found ${xmlFiles.length} XML files to evaluate`);

    for (const file of xmlFiles) {
      try {
        // Check if file has been evaluated
        const evaluationStatus = await hasBeenEvaluated(file);

        if (evaluationStatus.evaluated && !evaluationStatus.needsUpdate) {
          console.log(
            `File ${file} has already been evaluated and is up to date. Skipping...`
          );
          continue;
        }

        if (evaluationStatus.evaluated && evaluationStatus.needsUpdate) {
          console.log(
            `File ${file} has been modified since last evaluation. Re-evaluating...`
          );
        }

        const xml = await fs.readFile(file, "utf-8");
        console.log(`Evaluating file ${file}...`);

        const feedback = await evaluateWithOpenAI(xml, "org123", path.dirname(file));

        // Jäsennä AI:n palaute
        const parsedFeedback = await parseAIFeedback(feedback);

        // Lasketaan kokonaisarvosana
        const overallRating = await calculateOverallRating(parsedFeedback.criteria);

        // Luo arviointitulokset
        const evaluationResult: EvaluationResult = {
          overallRating,
          criteria: parsedFeedback.criteria,
          summary: parsedFeedback.summary,
          metadata: {
            evaluationDate: new Date().toISOString(),
            submissionId: path.basename(file, ".xml"),
            repoName: path.basename(path.dirname(file)),
            assignmentName: "Assignment",
          },
        };

        // Tallenna markdown-tiedosto
        await saveEvaluationToMarkdown(evaluationResult, path.dirname(file));

        // Lähetä sähköposti
        const studentEmail = "student@example.com";
        await sendEmailFeedback(
          path.join(path.dirname(file), "ASSIGNMENT_EVALUATION.md"),
          studentEmail
        );
        console.log(`Feedback sent via email to ${studentEmail}`);
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.log(`Error evaluating file ${file}: ${e.message}`);
        } else {
          console.log("Unknown error evaluating file:", e);
        }
      }
    }
  } catch (error: unknown) {
    await handleError(error);
  }
}

// Kutsu main-funktiota
main().catch(console.error);

interface EvaluationCriteria {
  name: string;
  score: number;
  maxScore: number;
  comments: string[];
}

interface EvaluationResult {
  overallRating: number;
  criteria: EvaluationCriteria[];
  summary: string;
  metadata: {
    evaluationDate: string;
    submissionId: string;
    repoName: string;
    assignmentName: string;
  };
}

async function calculateOverallRating(
  criteria: EvaluationCriteria[]
): Promise<number> {
  const totalScore = criteria.reduce(
    (sum, criteria) => sum + criteria.score,
    0
  );
  const maxScore = criteria.reduce(
    (sum, criteria) => sum + criteria.maxScore,
    0
  );
  // Muunnetaan 100-pistejärjestelmästä 5-pistejärjestelmään
  return (totalScore / maxScore) * 5;
}

async function saveEvaluationToMarkdown(
  evaluationResult: EvaluationResult,
  repoPath: string
): Promise<void> {
  const evaluationPath = path.join("output", "ASSIGNMENT_EVALUATION.md");

  const evaluationDate = new Date(evaluationResult.metadata.evaluationDate);
  const formattedDate = evaluationDate.toLocaleDateString("fi-FI", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Käytetään suoraan evaluationResult.overallRating
  const markdownContent = `# Assignment Evaluation

## Summary

${evaluationResult.summary}

Total Score: ${evaluationResult.overallRating.toFixed(1)}/5

## Metadata
- **Evaluation Date:** ${formattedDate}
- **Evaluation ID:** ${evaluationResult.metadata.submissionId}
- **Repository:** ${evaluationResult.metadata.repoName}
- **Assignment:** ${evaluationResult.metadata.assignmentName}
`;

  try {
    await fs.mkdir("output", { recursive: true });
    await fs.writeFile(evaluationPath, markdownContent, "utf-8");
    console.log(`Evaluation saved to ${evaluationPath}`);
  } catch (error) {
    console.error("Error saving evaluation to markdown:", error);
    throw error;
  }
}

interface ParsedFeedback {
  criteria: EvaluationCriteria[];
  summary: string;
}

async function parseAIFeedback(feedback: string): Promise<ParsedFeedback> {
  const criteria: EvaluationCriteria[] = [];

  // Syntax and Validity (0-10)
  const syntaxMatch = feedback.match(/Syntax and Validity\s*\((\d+)\/(\d+)\)/);
  if (syntaxMatch) {
    criteria.push({
      name: "Syntax and Validity",
      score: parseInt(syntaxMatch[1]),
      maxScore: parseInt(syntaxMatch[2]),
      comments: extractComments(feedback, "Syntax and Validity"),
    });
  }

  // Structure and Organization (0-20)
  const structureMatch = feedback.match(
    /Structure and Organization\s*\((\d+)\/(\d+)\)/
  );
  if (structureMatch) {
    criteria.push({
      name: "Structure and Organization",
      score: parseInt(structureMatch[1]),
      maxScore: parseInt(structureMatch[2]),
      comments: extractComments(feedback, "Structure and Organization"),
    });
  }

  // Clarity and Readability (0-20)
  const clarityMatch = feedback.match(
    /Clarity and Readability\s*\((\d+)\/(\d+)\)/
  );
  if (clarityMatch) {
    criteria.push({
      name: "Clarity and Readability",
      score: parseInt(clarityMatch[1]),
      maxScore: parseInt(clarityMatch[2]),
      comments: extractComments(feedback, "Clarity and Readability"),
    });
  }

  // Language-specific features (0-20)
  const languageMatch = feedback.match(
    /Language-specific features\s*\((\d+)\/(\d+)\)/
  );
  if (languageMatch) {
    criteria.push({
      name: "Language-specific Features",
      score: parseInt(languageMatch[1]),
      maxScore: parseInt(languageMatch[2]),
      comments: extractComments(feedback, "Language-specific features"),
    });
  }

  // Best practices (0-30)
  const practicesMatch = feedback.match(/Best practices\s*\((\d+)\/(\d+)\)/);
  if (practicesMatch) {
    criteria.push({
      name: "Best Practices",
      score: parseInt(practicesMatch[1]),
      maxScore: parseInt(practicesMatch[2]),
      comments: extractComments(feedback, "Best practices"),
    });
  }

  // Poistetaan kaikki Overall Rating -rivit yhteenvedosta
  const summary = feedback
    .replace(/Overall Rating: \d+\/5\n/g, "")
    .replace(/Overall Rating: \d+\/5/g, "")
    .trim();

  return {
    criteria,
    summary,
  };
}

function extractComments(feedback: string, criteriaName: string): string[] {
  const comments: string[] = [];
  const lines = feedback.split("\n");
  let isInCriteria = false;

  for (const line of lines) {
    if (line.includes(criteriaName)) {
      isInCriteria = true;
      continue;
    }
    if (isInCriteria && line.trim().startsWith("-")) {
      comments.push(line.trim().substring(1).trim());
    }
    if (isInCriteria && line.trim() === "") {
      isInCriteria = false;
    }
  }

  return comments;
}
