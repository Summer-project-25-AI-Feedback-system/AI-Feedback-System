/* 
FORMAT OF CSV DOCUMENT:

Overview of Student Points and Submissions

Name            GitHub Username     Roster Identifier     Assignment 1      Assignment 2     Assignment 3     Total Points
Alice Park          alice                al3park              5                 N/A               2               7
Micheal Devon       michael               19029               4                 3                 5               12
Willie Wonka        willie                23234             Error               N/A               5               5

*/

import type { OrgReport } from "src/types/OrgReport";
import type { StudentInStudentRoster } from "src/types/StudentInStudentRoster";

function downloadCSV(csvContent: string, filename: string = "report.csv") {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateCSVFromOrg(orgData: OrgReport, roster: StudentInStudentRoster[]) {
  const assignmentNames = orgData.assignments;
  const headerRow = ["Name", "GitHub Username", "Roster Identifier", ...assignmentNames, "Total Points"]; 
  const submissionMap = new Map(
    orgData.submissions.map((s) => [s.student, s.grades])
  );
  const csvLines: string[][] = [
    ["Overview of Student Points and Submissions"], // title row
    headerRow, // header row
  ];
  for (const student of roster) {
    if (!student.identifier) continue;
    const scores = submissionMap.get(student.github_username) || {};
    const row: (string | number)[] = [
      student.name || "N/A",
      student.github_username || "N/A",
      student.identifier || "N/A",
    ];
    let total = 0;
    let count = 0;
    for (const assignment of assignmentNames) {
      const points = scores[assignment];
      if (typeof points === "number") {
        row.push(points);
        total += points;
        count++;
      } else if (points === "Error") {
        row.push("Error");
      } else {
        row.push("N/A");
      }
    }
    row.push(count > 0 ? total : "N/A");
    csvLines.push(row.map(String));
  }

  const csvContent = csvLines.map((row) => row.join(";")).join("\n"); 
  downloadCSV(csvContent, `${orgData.org}_assignments_overview.csv`);
} 