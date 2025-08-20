import GetCSVFileButton from "../../../../components/GetCSVFileButton";
import StudentTableHeader from "./StudentTableHeader";
import StudentTableRow from "./StudentTableRow";
import type { AnalyticsResponse, RosterWithStudentsInput } from "@shared/supabaseInterfaces";

type StudentTableProps = {
  roster: RosterWithStudentsInput; 
  analyticsData: AnalyticsResponse;
  orgId: number;
  assignmentFilter?: string[]; 
  orgName?: string;
};

export default function StudentTable({ roster, analyticsData, assignmentFilter, orgName, orgId }: StudentTableProps) {
  const submissions = analyticsData.submissions; 
  const submissionMap = new Map(submissions.map(s => [s.student, s]));
  const students = roster.roster_students;

  const assignmentsToDisplay = assignmentFilter
    ? analyticsData.assignments.filter((a) => assignmentFilter.includes(a.id))
    : analyticsData.assignments;

  const studentsInRosterWithSubmissionInfo = students.map((student) => {
    const username = student.github_username;

    if (!username || !submissionMap.has(username)) {
      return {
        ...student,
        grades: assignmentsToDisplay.map(() => "N/A"),
        totalPoints: 0,
        submissionCount: 0,
      };
    }

    const submission = submissionMap.get(username);

    const grades = assignmentsToDisplay.map((assignment) => {
      const gradeEntry = submission?.grades.find(
        (g) => g.assignmentId === assignment.id
      );
      if (!gradeEntry) return "N/A";

      const totalPoints = gradeEntry.evaluations.reduce(
        (sum, ev) => sum + (ev.total_score ?? 0),
        0
      );
      return gradeEntry.evaluations.length > 0
        ? totalPoints / gradeEntry.evaluations.length
        : 0;
    });

    const numericGrades = grades.filter((g) => typeof g === "number") as number[];
    const totalPoints =
      numericGrades.length > 0
        ? numericGrades.reduce((a, b) => a + b, 0)
        : 0;
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

  const selectedAssignments =
  assignmentFilter && assignmentFilter.length === 1
    ? analyticsData?.assignments.find((a) => a.id === assignmentFilter[0])
    : null;

  return (
    <div>
      <div className="p-2 flex justify-end">
        <GetCSVFileButton 
          text={`Export ${selectedAssignments ? selectedAssignments.name : "All Assignments"} CSV`}
          orgName={orgName}
          roster={roster}
          assignmentFilter={assignmentFilter}
          orgId={orgId}
        />
      </div>
    <table className="table-auto border rounded-lg border-gray-300 bg-white w-full text-sm text-left">
      <StudentTableHeader assignmentNames={assignmentsToDisplay.map((a) => a.name)}/>
      <tbody>
        {sortedStudents.map((student) => (
          <StudentTableRow key={student.github_roster_identifier} studentInfo={student} assignmentNames={assignmentsToDisplay.map((a) => a.name)} />
        ))}
    </tbody>
   </table>
   </div>
  );
}
