// in here below, get the organization as a prop and make the CSV report of its assignments and submissions

/* 
FORMAT OF CSV DOCUMENT:

Overview of Student Grades and Submissions

Name          Assignment 1      Assignment 2     Assignment 3     Grade Average 
Alice Park        5                 N/A               2              2.33
Micheal Devon     4                 3                 5               4
Willie Wonka      Error             N/A               5              1.66

// maybe later something about students who have done nothing?
*/

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

type OrgReport = {
  org: string;
  repos: { name: string }[]; 
  students: any[]; // TODO: change later
};

export function generateCSVFromOrg(orgData: OrgReport) {
  // get all assignments under the organization
  const assignmentNames = orgData.repos.map((repo) => repo.name);
  const headerRow = ["Name", ...assignmentNames];
  const csvLines = [
    ["Overview of Student Grades and Submissions"], // title row
    headerRow, // header row
    // TODO: get students later
  ];
  const csvContent = csvLines.map((row) => row.join(",")).join("\n");
  downloadCSV(csvContent, `${orgData.org}_assignments_overview.csv`);
} 