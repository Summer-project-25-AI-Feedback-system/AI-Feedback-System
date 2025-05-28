import * as fs from 'fs/promises';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as nodemailer from 'nodemailer';
import path from 'path';

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
    throw new Error('Gmail-tunnukset puuttuvat .env-tiedostosta');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};

// Wait for specified time
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all XML files from output directory
async function getXmlFiles(dir: string): Promise<string[]> {
  try {
    const files = await fs.readdir(dir);
    return files.filter(f => f.endsWith('.xml')).map(f => `${dir}/${f}`);
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
}

// Split large XML file into smaller chunks
function splitXmlIntoChunks(xmlContent: string, maxChunkSize: number = 15000): string[] {
  const chunks: string[] = [];
  let currentChunk = '';
  
  // Split XML line by line
  const lines = xmlContent.split('\n');
  
  for (const line of lines) {
    // If current chunk + new line is too large, save chunk and start new one
    if ((currentChunk + line).length > maxChunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = '';
      }
      // If single line is too long, split it into smaller parts
      if (line.length > maxChunkSize) {
        const subChunks = line.match(new RegExp(`.{1,${maxChunkSize}}`, 'g')) || [];
        chunks.push(...subChunks);
      } else {
        currentChunk = line;
      }
    } else {
      currentChunk += (currentChunk ? '\n' : '') + line;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}

// Send XML to OpenAI LLM for evaluation
async function evaluateWithOpenAI(xmlContent: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('OpenAI API key not found in .env file');
  }

  const endpoint = 'https://api.openai.com/v1/chat/completions';

  // Calculate estimated token count (about 4 characters per token)
  const estimatedTokens = Math.ceil(xmlContent.length / 4);
  
  // Leave room for prompt and response (about 1000 tokens)
  const maxContentTokens = 3000;
  
  // Truncate content if it's too long
  const truncatedContent = estimatedTokens > maxContentTokens 
    ? xmlContent.substring(0, maxContentTokens * 4) + "\n... (content truncated)"
    : xmlContent;
    
  const prompt = `
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

Student Code:
${truncatedContent}
`;

  let retries = 3;
  while (retries > 0) {
    try {
      console.log('Sending request to OpenAI API...');
      const response = await axios.post(endpoint, {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.1
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data?.choices?.[0]?.message?.content) {
        return response.data.choices[0].message.content;
      }
      throw new Error('Invalid response from OpenAI API');
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      if (axios.isAxiosError(error)) {
        console.error('API Error details:', error.response?.data);
        if (error.response?.status === 401) {
          throw new Error('Invalid OpenAI API key. Please check your .env file.');
        }
        if (error.response?.status === 429) {
          console.log('Rate limit reached, waiting 20 seconds...');
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

  throw new Error('Failed to get response from OpenAI API after all retries');
}

// Muokataan sähköpostin lähetysfunktio Gmailille
async function sendEmailFeedback(feedbackPath: string, studentEmail: string) {
  try {
    console.log('Yritetään lähettää sähköpostia...');
    
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error('Gmail-tunnukset puuttuvat .env-tiedostosta');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Tarkista yhteys
    await transporter.verify();

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: studentEmail,
      subject: 'Koodin arviointi',
      text: 'Koodin arviointi on liitteenä tässä sähköpostissa.',
      attachments: [
        {
          filename: 'koodin_arviointi.txt',
          path: feedbackPath
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Sähköposti lähetetty onnistuneesti:', info.response);
    return info;
  } catch (error) {
    console.error('Virhe sähköpostin lähetyksessä:', error);
    if (error instanceof Error) {
      console.error('Virheen tiedot:', error.message);
    }
    throw error;
  }
}

async function main() {
  try {
    // Check if output directory exists
    await fs.access('output').catch(async () => {
      console.log('Creating output directory...');
      await fs.mkdir('output', { recursive: true });
    });

    const xmlFiles = await getXmlFiles('output');
    
    if (xmlFiles.length === 0) {
      console.log('No XML files found in output directory');
      return;
    }

    console.log(`Found ${xmlFiles.length} XML files to evaluate`);

    for (const file of xmlFiles) {
      try {
        const xml = await fs.readFile(file, 'utf-8');
        console.log(`Evaluating ${file}...`);
        const feedback = await evaluateWithOpenAI(xml);
        const resultFile = file.replace('.xml', '.feedback.txt');
        await fs.writeFile(resultFile, feedback, 'utf-8');
        console.log(`Feedback saved to ${resultFile}`);

        // Lisää sähköpostin lähetys
        const studentEmail = 'opiskelija@example.com'; // Vaihda opiskelijan sähköpostiin
        await sendEmailFeedback(resultFile, studentEmail);
      } catch (e) {
        console.error(`Error evaluating ${file}:`, e);
      }
    }
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

// Run main program
main().catch(console.error);
