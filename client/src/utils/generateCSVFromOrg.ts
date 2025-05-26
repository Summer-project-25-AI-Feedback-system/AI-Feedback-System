/* 
FORMAT OF CSV DOCUMENT:

Overview of Student Grades and Submissions

Name          Assignment 1      Assignment 2     Assignment 3     Grade Average 
Alice Park        5                 N/A               2              2.33
Micheal Devon     4                 3                 5               4
Willie Wonka      Error             N/A               5              1.66

// maybe later something about students who have done nothing?
*/

import type { OrgReport } from "src/types/OrgReport";

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

export function generateCSVFromOrg(orgData: OrgReport) {
  // get all assignments under the organization
  const assignmentNames = orgData.assignments;
  const headerRow = ["Username", ...assignmentNames, "Grade Average"]; 

  const csvLines = [
    ["Overview of Student Grades and Submissions"], // title row
    headerRow, // header row
  ];

  for (const submission of orgData.submissions) {
    const { student, grades } = submission;
    const row: (string | number)[] = [student];

    let sum = 0;
    let count = 0;

    for (const assignment of assignmentNames) {
      const grade = grades[assignment];
      if (typeof grade === "number") {
        row.push(grade);
        sum += grade;
        count++;
      } else if (grade === "Error") {
        row.push("Error");
      } else {
        row.push("N/A");
      }
    }

    const average = count > 0 ? (sum / count).toFixed(2) : "N/A";
    row.push(average);
    csvLines.push(row.map(String));
  } 

  const csvContent = csvLines.map((row) => row.join(";")).join("\n");
  downloadCSV(csvContent, `${orgData.org}_assignments_overview.csv`);
} 