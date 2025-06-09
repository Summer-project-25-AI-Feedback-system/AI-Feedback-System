import RepomixFetcher from "../../repomix";
import { evaluateWithOpenAI } from "../../Aievolution";

export async function runRepomix(repoUrl: string) {
  const fetcher = new RepomixFetcher("output");
  const result = await fetcher.fetchRepositoryAsXml({
    remoteUrl: repoUrl,
    style: "xml",
  });
  return result;
}

export async function runAIEvolution(
  xml: string,
  organizationId: string,
  repoPath: string
) {
  const feedback = await evaluateWithOpenAI(xml, organizationId, repoPath);
  return feedback;
}
