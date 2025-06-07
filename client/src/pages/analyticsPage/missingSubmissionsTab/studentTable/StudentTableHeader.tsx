type StudentTableHeaderProps = {
  assignmentNames: string[];
};

export default function StudentTableHeader({ assignmentNames }: StudentTableHeaderProps) {
  return (
    <thead>
      <tr>
        <th className="border border-gray-700 px-4 py-2 font-medium">Name</th>
        <th className="border border-gray-700 px-4 py-2 font-medium">GitHub Username</th>
        <th className="border border-gray-700 px-4 py-2 font-medium">Roster Identifier</th>
        {assignmentNames.map((assignment) => (
          <th key={assignment} className="border border-gray-700 px-4 py-2 font-medium">
            {assignment}
          </th>
        ))}
        <th className="border border-gray-700 px-4 py-2 font-medium">Total Points</th>
      </tr>
    </thead>
  );
}