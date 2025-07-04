import type { AssignmentFeedbacks } from "src/types/AssignmentFeedback";
import CommonIssuesCollapsible from "./CommonIssuesCollapsible";
import Spinner from "../../../components/Spinner";

type CommonIssuesTabProps = {
  assignmentFeedbacks: AssignmentFeedbacks;
};

export default function CommonIssuesTab({ assignmentFeedbacks }: CommonIssuesTabProps) {
  const loading =
    !assignmentFeedbacks ||
    Object.keys(assignmentFeedbacks).length === 0;

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        assignmentFeedbacks.map((assignment, index) => (
          <CommonIssuesCollapsible key={index} assignment={assignment} />
        ))
      )}
    </div>
  );
}
