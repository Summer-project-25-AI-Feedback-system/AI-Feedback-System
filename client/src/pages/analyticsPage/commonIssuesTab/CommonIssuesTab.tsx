import CommonIssuesCollapsible from "./CommonIssuesCollapsible";
import Spinner from "../../../components/Spinner";
import type { AssignmentWithIssues } from "@shared/supabaseInterfaces";

type CommonIssuesTabProps = {
  assignmentFeedbacks: AssignmentWithIssues[];
};

export default function CommonIssuesTab({ assignmentFeedbacks }: CommonIssuesTabProps) {
  if (!assignmentFeedbacks) {
    return <Spinner />;
  }

  if (assignmentFeedbacks.length === 0) {
    return (
      <p className="text-gray-500 italic">
        There are no common issues present.
      </p>
    );
  }

  return (
    <div>
      {assignmentFeedbacks.map((assignment, index) => (
        <CommonIssuesCollapsible key={index} assignment={assignment} />
      ))}
    </div>
  );
}
