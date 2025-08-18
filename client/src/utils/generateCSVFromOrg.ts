/* 
FORMAT OF CSV DOCUMENT:

Overview of Student Points and Submissions

Name            GitHub Username     Roster Identifier     Assignment 1      Assignment 2     Assignment 3     Total Points
Alice Park          alice                al3park              5                 N/A               2               7
Micheal Devon       michael               19029               4                 3                 5               12
Willie Wonka        willie                23234             Error               N/A               5               5

*/

import type { AnalyticsResponse, AnalyticsSubmission, RosterWithStudentsInput } from "@shared/supabaseInterfaces";

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

export function generateCSVFromOrg(analyticsData: AnalyticsResponse, roster: RosterWithStudentsInput, orgName: string) {
  const assignmentNames = analyticsData.assignments.map((a) => a.name);
  const headerRow = ["Name", "GitHub Username", "Roster Identifier", ...assignmentNames, "Total Points"]; 
  
  const csvLines: string[][] = [
    ["Overview of Student Points and Submissions"], // title row
    headerRow, // header row
  ];

  const students = roster.roster_students ?? [];

  for (const student of students) {
    if (!student.github_roster_identifier) continue;
  
  const submission: AnalyticsSubmission | undefined = analyticsData.submissions.find(
      (s) => s.student === student.github_username || s.student === student.github_display_name
    );

    const row: (string | number)[] = [
      student.github_display_name || "N/A",
      student.github_username || "N/A",
      student.github_roster_identifier || "N/A",
    ];

    let total = 0;
    let count = 0;

    for (const assignment of analyticsData.assignments) {
      const gradeEntry = submission?.grades.find((g) => g.assignmentId === assignment.id);

      if (!gradeEntry || gradeEntry.evaluations.length === 0) {
        row.push("N/A");
        continue;
      }

      const scores = gradeEntry.evaluations.map((ev) => ev.total_score ?? null).filter((s) => s !== null) as number[];

      if (scores.length === 0) {
        row.push("Error"); 
      } else {
        const points = Math.max(...scores); 
        row.push(points);
        total += points;
        count++;
      }
    }

    row.push(count > 0 ? total : "N/A");
    csvLines.push(row.map(String));
  }

  const csvContent = csvLines.map((row) => row.join(";")).join("\n");
  downloadCSV(csvContent, `${orgName}_assignments_overview.csv`);
} 