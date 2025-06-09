import RepomixFetcher from "../../repomix";
import { evaluateWithOpenAI } from "../../Aievolution";

export async function runRepomix(repoUrl: string) {
  const fetcher = new RepomixFetcher("output");

  const xml = await fetcher.fetchRepositoryAsXml({
    remoteUrl: repoUrl,
    style: "xml",
  });

  const xmlBase64 = Buffer.from(xml).toString("base64");
  return xmlBase64;
}

export async function runAIEvolution(xml: string, organizationId: string) {
  const feedback = await evaluateWithOpenAI(xml, organizationId);
  return feedback;
}
