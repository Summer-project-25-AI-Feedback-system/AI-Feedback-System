import type { StudentInStudentRoster } from "src/types/StudentInStudentRoster";
import type { OrgReport } from "src/types/OrgReport";
import GetCSVFileButton from "../../../../components/GetCSVFileButton";
import StudentTableHeader from "./StudentTableHeader";
import StudentTableRow from "./StudentTableRow";

type StudentTableProps = {
  roster: StudentInStudentRoster[]; 
  orgData: OrgReport;
  assignmentFilter?: string[];
  orgName?: string;
};

export default function StudentTable({ roster, orgData, assignmentFilter, orgName }: StudentTableProps) {
  const submissions = orgData.submissions; 
  const submissionMap = new Map(submissions.map(s => [s.student, s]));
  const assignmentNames = assignmentFilter ?? orgData.assignments;

  const studentsInRoster = roster.map((student) => {
    const submission = submissionMap.get(student.github_username);
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
    <div>
      <div className="p-2 flex justify-end">
        <GetCSVFileButton 
          text={`Export ${assignmentFilter && assignmentFilter.length === 1 ? assignmentFilter[0] : "All Assignments"} CSV`}
          orgName={orgName}
          roster={roster}
          assignmentFilter={assignmentFilter}
        />
      </div>
    <table className="table-auto border rounded-lg border-gray-300 bg-white w-full text-sm text-left">
      <StudentTableHeader assignmentNames={assignmentNames}/>
      <tbody>
        {sortedStudents.map((student) => (
          <StudentTableRow studentInfo={student} assignmentNames={assignmentNames} />
        ))}
    </tbody>
   </table>
   </div>
  );
}
