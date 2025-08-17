import CommonIssuesCollapsible from "./CommonIssuesCollapsible";
import Spinner from "../../../components/Spinner";
import type { AssignmentWithIssues } from "@shared/supabaseInterfaces";

type CommonIssuesTabProps = {
  assignmentFeedbacks: AssignmentWithIssues[];
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
