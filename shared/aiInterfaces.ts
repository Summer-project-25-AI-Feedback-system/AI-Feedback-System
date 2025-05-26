export interface AssignmentFeedback {
  // studentName: string;
  repoName: string;
  assignmentTitle: string;
  grade: string;
  date: string; // ISO format
  feedback: string;
  feedbackByFile: FileFeedback[];
}

interface FileFeedback {
  fileName: string;
  issues: FeedbackIssue[];
}

interface FeedbackIssue {
  id: number;
  line?: number;
  text: string;
}
