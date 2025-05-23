import type { AssignmentFeedback } from "@shared/aiInterfaces";

export function generateSummaryFeedback(
  feedbackByFile: AssignmentFeedback["feedbackByFile"]
): string {
  const summary =
    "Overall, good structure and code readability. Minor issues found.";
  const issues: string[] = [];

  let count = 1;
  for (const file of feedbackByFile) {
    for (const issue of file.issues) {
      issues.push(
        `Issue ${count}: ${issue.text}${
          issue.line ? ` (line ${issue.line}, in ${file.fileName})` : ""
        }`
      );
      count++;
    }
  }

  return [summary, ...issues].join("\n");
}
