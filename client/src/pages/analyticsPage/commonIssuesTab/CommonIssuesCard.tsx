import type { SingleAssignmentFeedback } from "src/types/AssignmentFeedback";

type CommonIssuesCardProps = {
  assignment: SingleAssignmentFeedback;
};

export default function CommonIssuesCard({ assignment } : CommonIssuesCardProps) {
  return (
    <div className="pl-3 pb-3">
      <h2 className=" text-gray-700 mb-2">Common issues in {assignment.assignmentName}</h2>
      <ul className="list-disc list-inside text-gray-700">
        {[...new Set(assignment.issues)].map((issue, index) => (
          <li key={index}>{issue}</li>
        ))}
      </ul>
    </div>
  );
}