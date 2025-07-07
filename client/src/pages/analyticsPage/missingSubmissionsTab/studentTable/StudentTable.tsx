import type { OrgReport } from "src/types/OrgReport";
import GetCSVFileButton from "../../../../components/GetCSVFileButton";
import StudentTableHeader from "./StudentTableHeader";
import StudentTableRow from "./StudentTableRow";
import type { RosterWithStudentsInput } from "@shared/supabaseInterfaces";

type StudentTableProps = {
  roster: RosterWithStudentsInput; 
  orgData: OrgReport;
  assignmentFilter?: string[];
  orgName?: string;
};

export default function StudentTable({ roster, orgData, assignmentFilter, orgName }: StudentTableProps) {
  const submissions = orgData.submissions; 
  const submissionMap = new Map(submissions.map(s => [s.student, s]));
  const assignmentNames = assignmentFilter ?? orgData.assignments;
  const students = roster.roster_students;

  // map students in the provided roster
  const studentsInRosterWithSubmissionInfo = students.map((student) => {
    const username = student.github_username;

    // if the student doesn't have a github username or no submission matches the roster student, mark them with no submissions
    if (!username || !submissionMap.has(username)) {
      return {
        ...student,
        grades: assignmentNames.map(() => "N/A"), 
        totalPoints: 0,
        submissionCount: 0,
      };
    }

    const submission = submissionMap.get(username);

    // mark student with their respective grades
    const grades = assignmentNames.map((assignment) => {
      const value = submission?.grades?.[assignment];
      if (value === null || value === undefined) return "N/A";
      if (typeof value === "number") return value;
      return "Error";
    });

    const numericGrades = grades.filter(g => typeof g === "number") as number[];
    const totalPoints = numericGrades.length > 0 ? numericGrades.reduce((a, b) => a + b, 0) : 0;
    const submissionCount = numericGrades.length;

    return {
      ...student,
      grades,
      totalPoints,
      submissionCount,
    };
  });

  const sortedStudents = [...studentsInRosterWithSubmissionInfo].sort(
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
          <StudentTableRow key={student.github_roster_identifier} studentInfo={student} assignmentNames={assignmentNames} />
        ))}
    </tbody>
   </table>
   </div>
  );
}
