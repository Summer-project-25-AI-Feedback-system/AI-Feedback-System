import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs/promises";
import * as path from "path";

interface RepomixOptions {
  remoteUrl: string; // GitHub repository URL
  outputFile?: string; // Output file name (default: repomix-output.xml)
  style?: "xml" | "markdown" | "plain"; // Output format
  ignore?: string; // Files/directories to ignore (comma-separated)
  include?: string; // Files/directories to include (comma-separated)
  verbose?: boolean; // Detailed output
}

const execPromise = promisify(exec);

export function getRepoNameFromUrl(url: string): string {
  return (
    url
      .replace(/\.git$/, "")
      .split("/")
      .pop() || "unknown-repo"
  );
}

export async function fetchXmlFromRepoUrl(
  repoUrl: string
): Promise<{ xml: string; repoName: string }> {
  const fetcher = new RepomixFetcher();
  const repoName = getRepoNameFromUrl(repoUrl);
  const outputFileName = `${repoName}.xml`;

  const githubToken = process.env.GITHUB_PAT;
  if (!githubToken) {
    throw new Error("Missing GITHUB_PAT in environment.");
  }

  const authedRepoUrl = repoUrl.replace(
    /^https:\/\//,
    `https://${githubToken}@`
  );

  const xml = await fetcher.fetchRepositoryAsXml({
    remoteUrl: authedRepoUrl,
    style: "xml",
    outputFile: outputFileName,
    ignore: getDefaultIgnorePattern(),
    verbose: true,
  });

  return { xml, repoName };
}

export default class RepomixFetcher {
  constructor(private outputDir: string = "output") {}

  private async ensureDir(dir: string) {
    await fs.mkdir(dir, { recursive: true }).catch(() => {});
  }

  /**
   * Fetches GitHub repository content in XML format
   */
  async fetchRepositoryAsXml(options: RepomixOptions): Promise<string> {
    await this.ensureDir(this.outputDir);

    const outputFileName = options.outputFile ?? "repomix-output.xml";
    const outputFile = path.join(this.outputDir, outputFileName);

    let command = `repomix --remote ${options.remoteUrl} --style ${
      options.style ?? "xml"
    } --output "${outputFileName}"`;
    if (options.ignore) command += ` --ignore "${options.ignore}"`;
    if (options.include) command += ` --include "${options.include}"`;
    if (options.verbose) command += ` --verbose`;

    await execPromise(command, {
      env: { ...process.env, PYTHONIOENCODING: "utf-8" },
      cwd: this.outputDir,
    });

    return await fs.readFile(outputFile, "utf-8");
  }
}

export function getDefaultIgnorePattern(): string {
  return [
    "node_modules/*",
    "dist/*",
    "build/*",
    "*.md",
    "*.log",
    "*.lock",
    "*.json",
    "*.yml",
    "*.yaml",
    "*.xml",
    "*.txt",
    "*.gitignore",
    "*.editorconfig",
    "*.prettierrc",
    "*.eslintrc",
    "*.env",
    "*.env.*",
    "*.config.js",
    "*.config.ts",
    "*.d.ts",
    "*.map",
    "*.min.js",
    "*.min.css",
    "*.ico",
    "*.png",
    "*.jpg",
    "*.jpeg",
    "*.gif",
    "*.svg",
    "*.woff",
    "*.woff2",
    "*.ttf",
    "*.eot",
    "*.otf",
    "*.mp3",
    "*.mp4",
    "*.webm",
    "*.webp",
    "*.zip",
    "*.tar",
    "*.gz",
    "*.rar",
    "*.7z",
    "*.pdf",
    "*.doc",
    "*.docx",
    "*.xls",
    "*.xlsx",
    "*.ppt",
    "*.pptx",
    "*.csv",
    "*.tsv",
    "*.sql",
    "*.bak",
    "*.tmp",
    "*.temp",
    "*.swp",
    "*.swo",
    "*.swn",
    "*.sublime-workspace",
    "*.sublime-project",
    "*.vscode/*",
    "*.idea/*",
    "*.DS_Store",
    "Thumbs.db",
  ].join(",");
}
