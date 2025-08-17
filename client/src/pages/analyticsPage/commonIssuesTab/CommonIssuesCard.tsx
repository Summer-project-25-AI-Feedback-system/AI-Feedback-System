import type { AssignmentWithIssues } from "@shared/supabaseInterfaces";

type CommonIssuesCardProps = {
  assignment: AssignmentWithIssues;
};

export default function CommonIssuesCard({ assignment } : CommonIssuesCardProps) {
  const uniqueIssueNames = [...new Set(assignment.issues.map(issue => issue.name))];

  return (
    <div className="pl-3 pb-3">
      <h2 className=" text-gray-700 mb-2">Common issues in {assignment.assignment_name}</h2>
      <ul className="list-disc list-inside text-gray-700">
        {uniqueIssueNames.map((issue, index) => (
          <li key={index}>{issue}</li>
        ))}
      </ul>
    </div>
  );
}