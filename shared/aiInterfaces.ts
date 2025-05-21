export interface AssignmentFeedback {
  studentName: string; // Full name of the student
  repoName: string; // GitHub repo name for reference
  assignmentTitle: string; // Human-readable title of the assignment
  feedback: string; // AI-generated feedback text
  grade: string; // Could be letter (A-F) or numeric (85%)
  rubricScores?: Rubric[]; // Optional: detailed scores based on rubric
  fileName: string; // Main file evaluated (e.g., main.py, index.js)
  date: string; // ISO string (e.g., 2025-05-20T14:00:00Z)
}

interface Rubric {
  criterion: string; // e.g., "Code Readability", "Functionality"
  score: number; // e.g., 4 out of 5
  comment?: string; // Optional specific comment per criterion
}
