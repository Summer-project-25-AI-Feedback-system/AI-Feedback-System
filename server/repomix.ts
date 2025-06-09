import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs/promises";
import * as path from "path";

// Convert exec function to Promise-based
const execPromise = promisify(exec);

/**
 * Extracts repository name from GitHub URL
 * @param url GitHub repository URL
 * @returns Repository name
 */
function getRepoNameFromUrl(url: string): string {
  return (
    url
      .replace(/\.git$/, "")
      .split("/")
      .pop() || "unknown-repo"
  );
}

/**
 * Repomix command options
 */
interface RepomixOptions {
  remoteUrl: string; // GitHub repository URL
  outputFile?: string; // Output file name (default: repomix-output.xml)
  style?: "xml" | "markdown" | "plain"; // Output format
  ignore?: string; // Files/directories to ignore (comma-separated)
  include?: string; // Files/directories to include (comma-separated)
  verbose?: boolean; // Detailed output
}

/**
 * Repomix command line tool handling
 */
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

/**
 * Main program
 */
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Usage: npm start <github-url>");
    process.exit(1);
  }

  const githubUrl = args[0];
  const repoName = getRepoNameFromUrl(githubUrl);
  const fetcher = new RepomixFetcher();

  const xml = await fetcher.fetchRepositoryAsXml({
    remoteUrl: githubUrl,
    style: "xml",
    outputFile: `${repoName}.xml`,
    ignore:
      "node_modules/*,dist/*,build/*,*.md,*.log,*.lock,*.json,*.yml,*.yaml,*.xml,*.txt,*.gitignore,*.editorconfig,*.prettierrc,*.eslintrc,*.env,*.env.*,*.config.js,*.config.ts,*.d.ts,*.map,*.min.js,*.min.css,*.ico,*.png,*.jpg,*.jpeg,*.gif,*.svg,*.woff,*.woff2,*.ttf,*.eot,*.otf,*.mp3,*.mp4,*.webm,*.webp,*.zip,*.tar,*.gz,*.rar,*.7z,*.pdf,*.doc,*.docx,*.xls,*.xlsx,*.ppt,*.pptx,*.csv,*.tsv,*.sql,*.bak,*.tmp,*.temp,*.swp,*.swo,*.swn,*.sublime-workspace,*.sublime-project,*.vscode/*,*.idea/*,*.DS_Store,Thumbs.db",
    verbose: true,
  });

  console.log("Repository fetched as XML.");
  console.log(`XML file saved to: output/${repoName}.xml`);
}

// Execute main program
main();
