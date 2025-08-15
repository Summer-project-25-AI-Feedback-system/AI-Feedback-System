import { CommonIssues } from "@shared/supabaseInterfaces";

export async function parseAIFeedbackCommonIssues(
  feedback: string
): Promise<CommonIssues[] | null> {

  const issues: CommonIssues[] = [];

  const issuePatterns: { [key: string]: RegExp } = {
  "Missing comments": /\bMissing (Comments|Documentation)\b/i,
  "Poor variable naming": /\b(Poor|Unclear) Variable Naming\b/i,
  "Inconsistent indentation": /\bInconsistent Indentation\b/i,
  "Excessive code duplication": /\bDuplicate Code\b/i,
  "Overly long functions": /\bOverly Long Functions?\b/i,
  "Syntax errors": /\bSyntax Error(s)?\b/i,
  "Logical errors": /\bLogical Error(s)?\b/i,
  "Not handling edge cases": /\bMissing (Edge Cases|Boundary Checks)\b/i,
  "Missing required functionality": /\bMissing Required Functionality\b/i,
  "Hard-coded values": /\bHard-?coded\b/i,
  "Lack of error handling": /\bNo Error Handling\b/i,
  "Inefficient algorithms": /\bInefficient\b/i,
  "Not following naming conventions": /\bNaming Conventions\b/i,
  };

  for (const [name, pattern] of Object.entries(issuePatterns)) {
    if (pattern.test(feedback)) {
      issues.push({name: name});
    }
  }

  return issues.length > 0 ? issues : null;
}