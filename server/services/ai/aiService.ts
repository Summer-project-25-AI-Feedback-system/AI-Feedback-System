import RepomixFetcher from "../../repomix";
import { evaluateWithOpenAI } from "../../Aievolution";

export async function runRepomix(repoUrl: string) {
  const fetcher = new RepomixFetcher("output");

  const repoName = getRepoNameFromUrl(repoUrl);
  const outputFileName = `${repoName}.xml`;

  const xml = await fetcher.fetchRepositoryAsXml({
    remoteUrl: repoUrl,
    style: "xml",
    outputFile: outputFileName,
  });

  const xmlBase64 = Buffer.from(xml).toString("base64");
  return xmlBase64;
}

function getRepoNameFromUrl(url: string): string {
  return (
    url
      .replace(/\.git$/, "")
      .split("/")
      .pop() || "unknown-repo"
  );
}

export async function runAIEvolution(xml: string, organizationId: string) {
  const feedback = await evaluateWithOpenAI(xml, organizationId);
  return feedback;
}
