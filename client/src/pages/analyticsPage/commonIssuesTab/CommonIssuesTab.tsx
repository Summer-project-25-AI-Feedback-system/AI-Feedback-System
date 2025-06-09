import type { AssignmentFeedbacks } from "src/types/AssignmentFeedback";
import CommonIssuesCollapsible from "./CommonIssuesCollapsible";

type CommonIssuesTabProps = {
  assignmentFeedbacks: AssignmentFeedbacks;
};

export default function CommonIssuesTab({ assignmentFeedbacks }: CommonIssuesTabProps) {
  return (
    <div>
      {assignmentFeedbacks.map((assignment, index) => (
        <CommonIssuesCollapsible key={index} assignment={assignment} />
      ))}
    </div>
  );
}
