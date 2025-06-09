import type { StudentInfo } from "src/types/StudentInfo";

type StudentTableRowProps = {
  studentInfo: StudentInfo;
  assignmentNames: string[]
};

export default function StudentTableRow({ studentInfo, assignmentNames }: StudentTableRowProps) {
  const { name, github_username, identifier, grades, totalPoints, submissionCount } = studentInfo;

  const rowClass =
    submissionCount === 0 ? "bg-red-100" :
    submissionCount < assignmentNames.length ? "bg-yellow-100" :
    "bg-green-100";

  return (
    <tr key={identifier} className={rowClass}>
      <td className="border border-gray-700 px-4 py-2">{name?.trim() || "N/A"}</td>
      <td className="border border-gray-700 px-4 py-2">{github_username?.trim() || "N/A"}</td>
      <td className="border border-gray-700 px-4 py-2">{identifier}</td>
      {grades.map((grade, idx) => (
        <td key={idx} className="border border-gray-700 px-4 py-2 text-center">{grade}</td>
      ))}
      <td className="border border-gray-700 px-4 py-2 text-center">{totalPoints}</td>
    </tr>
  );
}