import type { StudentInStudentRoster } from "src/types/StudentInStudentRoster";
import type { OrgReport } from "src/types/OrgReport";

type StudentTableProps = {
  roster: StudentInStudentRoster[]; 
  orgData: OrgReport;
};

// TODO: change whether students are shown based on the "Identifier" or the github username or the student's name based on theacher's opinion
export default function StudentTable({ roster, orgData }: StudentTableProps) {
  const submissions = orgData.submissions; 
  const submissionMap = new Map(submissions.map(s => [s.student, s]));
  const assignmentNames = orgData.assignments;

  const studentsInRoster = roster.map((student) => {
    const submission = submissionMap.get(student.identifier);
    const grades = assignmentNames.map((assignment) => {
      const value = submission?.grades?.[assignment];
      if (value === null || value === undefined) return "N/A";
      if (typeof value === "number") return value;
      return "Error";
    });

    const numericGrades = grades.filter(g => typeof g === "number") as number[];
    const totalPoints = numericGrades.length > 0 ? numericGrades.reduce((a, b) => a + b, 0) : "—";
    const submissionCount = numericGrades.length;

    return {
      ...student,
      grades,
      totalPoints,
      submissionCount,
    };
  });

  const sortedStudents = [...studentsInRoster].sort(
   (a, b) => a.submissionCount - b.submissionCount
  );

  return (
    <table className="table-auto border border-black bg-white w-full text-sm text-left mt-4">
      <thead>
        <tr>
          <th className="border border-black px-4 py-2 bg-gray-100">Identifier</th>
          {assignmentNames.map((assignment) => (
            <th key={assignment} className="border border-black px-4 py-2 bg-gray-100">
              {assignment}
            </th>
          ))}
          <th className="border border-black px-4 py-2 bg-gray-100">Total Points</th>
        </tr>
      </thead>
      <tbody>
        {sortedStudents.map((student) => (
          <tr key={student.identifier} 
              className={
                student.submissionCount === 0 ? "bg-red-100" 
                : student.submissionCount < assignmentNames.length ? "bg-yellow-100" 
                : "bg-green-100"
              }>
            <td className="border border-black px-4 py-2">{student.identifier}</td>
            {student.grades.map((grade, idx) => (
              <td key={idx} className="border border-black px-4 py-2 text-center">
                {grade}
              </td>
            ))}
            <td className="border border-black px-4 py-2 text-center">{student.totalPoints}</td>
          </tr>
        ))}
    </tbody>
   </table>
  );
}
