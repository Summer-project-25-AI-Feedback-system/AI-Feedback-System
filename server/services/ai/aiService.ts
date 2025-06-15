import {
  evaluateWithOpenAI,
  parseAIFeedback,
  calculateOverallRating,
  EvaluationResult,
} from "../../Aievolution";
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
  organizationId: string,
  repoName: string,
  assignmentName: string
) {
  const xml = Buffer.from(xmlBase64, "base64").toString("utf-8");
  const feedback = await evaluateWithOpenAI(xml, organizationId);
  const parsedFeedback = await parseAIFeedback(feedback);
  const overallRating = await calculateOverallRating(parsedFeedback.criteria);
  const evaluationResult: EvaluationResult = {
    overallRating,
    criteria: parsedFeedback.criteria,
    summary: parsedFeedback.summary,
    metadata: {
      evaluationDate: new Date().toISOString(),
      submissionId: `submission-${Date.now()}`,
      repoName: repoName,
      assignmentName: assignmentName,
    },
  };
  const markdownContent = generateMarkdownContent(evaluationResult);
  return markdownContent;
}

function generateMarkdownContent(evaluationResult: EvaluationResult): string {
  const evaluationDate = new Date(evaluationResult.metadata.evaluationDate);
  const formattedDate = evaluationDate.toLocaleDateString("en-US", {
    timeZone: "Europe/Helsinki",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Use 24-hour format
  });
  console.log(
    "evaluationResult.overallRating:",
    evaluationResult.overallRating
  );
  return `# Assignment Evaluation

## Summary

${evaluationResult.summary}

Total Score: ${evaluationResult.overallRating.toFixed(1)}/5

## Metadata
- **Evaluation Date:** ${formattedDate}
- **Evaluation ID:** ${evaluationResult.metadata.submissionId}
- **Repository:** ${evaluationResult.metadata.repoName}
- **Assignment:** ${evaluationResult.metadata.assignmentName}
`;
}
