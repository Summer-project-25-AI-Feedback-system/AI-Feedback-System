import type { AssignmentFeedback } from "@shared/aiInterfaces";

function generateSummaryFeedback(
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

const feedbackByFile: AssignmentFeedback["feedbackByFile"] = [
  {
    fileName: "App.tsx",
    issues: [
      { id: 1, line: 5, text: "It would be better to use justify-end." },
      { id: 2, line: 34, text: "I couldn't find the import component." },
    ],
  },
  {
    fileName: "Home.tsx",
    issues: [
      {
        id: 1,
        line: 5,
        text: "I couldn't find any useContent component in the App.tsx - compulsory requirement.",
      },
    ],
  },
];

const defaultFeedback: AssignmentFeedback = {
  repoName: "week-2-assignment-tangerinekey380",
  assignmentTitle: "React Todo App",
  grade: "4",
  date: "2025-05-20T15:23:00Z",
  feedbackByFile,
  feedback: generateSummaryFeedback(feedbackByFile),
};

export function getInitialFeedback(): AssignmentFeedback {
  return defaultFeedback;
}
