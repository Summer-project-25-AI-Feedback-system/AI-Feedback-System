import { evaluateWithOpenAI } from "../../Aievolution";
import { fetchXmlFromRepoUrl } from "./repomixHelper";

export async function runRepomix(repoUrl: string) {
  const { xml, repoName } = await fetchXmlFromRepoUrl(repoUrl);

  console.log("Repository fetched as XML.");
  console.log(`XML file saved to: output/${repoName}.xml`);

  const xmlBase64 = Buffer.from(xml).toString("base64");
  return xmlBase64;
}

export async function runAIEvolution(
  xmlBase64: string,
  organizationId: string
) {
  const xml = Buffer.from(xmlBase64, "base64").toString("utf-8");
  const feedback = await evaluateWithOpenAI(xml, organizationId);
  return feedback;
}
