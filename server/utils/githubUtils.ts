export function extractAssignmentName(repoName: string): string {
  // Example: "assignment1-alice" => "assignment1"
  // TODO: modify or change this later if we need something different
  return repoName.replace(/-[a-zA-Z0-9]+$/, "");
}