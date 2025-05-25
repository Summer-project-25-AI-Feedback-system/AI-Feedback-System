import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGitHub } from "../../context/useGitHub";
import type { OrgReport } from "src/types/OrgReport";
import BackButton from "../../components/BackButton";
import BasicHeading from "../../components/BasicHeading";
import GetCSVFileButton from "../assignmentPage/GetCSVFileButton";
import AveragePointsChart from "./averageAssignmentPointsTab/AveragePointsChart";
import TabNavigation from "./TabNavigation";
import MissingSubmissionsList from "./missingSubmissionsTab/MissingSubmissionsList";
import CommonIssuesChart from "./commonIssuesTab/CommonIssuesChart";

// delete this later
const mockOrgData = {
  org: "Mock University",
  assignments: ["Assignment 1", "Assignment 2", "Assignment 3"],
  submissions: [
    {
      student: "alice",
      grades: {
        "Assignment 1": null,
        "Assignment 2": null,
        "Assignment 3": null,
      },
    },
    {
      student: "FuzzyKala",
      grades: {
        "Assignment 1": 18,
        "Assignment 2": null, 
        "Assignment 3": null,
      },
    },
    {
      student: "vima20",
      grades: {
        "Assignment 1": 20,
        "Assignment 2": 10,
        "Assignment 3": 30,
      },
    },
    {
      student: "nonRoster",
      grades: {
        "Assignment 1": null,
        "Assignment 2": 15,
        "Assignment 3": 25,
      },
    },
  ],
};

// TODO: get this from github with real values (preferably with the OrgData and not separately)
const maxPointsPerAssignment = {
  "Assignment 1": 20,
  "Assignment 2": 15,
  "Assignment 3": 30,
}

// TODO: get the real issues from the database(?)
const mockCommonIssues = [
  { student: "alice", issues: ["Poor naming", "No comments"] },
  { student: "FuzzyKala", issues: ["Repeated code", "No comments"] },
  { student: "vima20", issues: ["No comments"] },
  { student: "nonRoster", issues: ["Poor naming", "Repeated code"] },
  { student: "astronautie", issues: ["Bad"] },
];

export default function AnalyticsPage() {
  const { orgName } = useParams<{ orgName: string }>();
  const github = useGitHub();
  const [orgData, setOrgData] = useState<OrgReport | null>(null);
  const [loading, setLoading] = useState(true);
  const tabs = ["Average Assignment Points", "Common Issues", "Missing Submissions"];
  const [activeTab, setActiveTab] = useState(tabs[0]);

 useEffect(() => {
    const fetchOrgData = async () => {
      if (!orgName) return;
      try {
        const data = await github.getAllOrganizationData(orgName);
        setOrgData(data);
      } catch (error) {
        console.error("Failed to fetch org data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrgData();
  }, [orgName, github]);
  
  if (loading) return <div className="p-4">Loading...</div>;
  if (!orgData) return <div className="p-4">No organization data found.</div>;

  return (
    <div className="flex flex-col space-y-20 p-4 md:p-12"> 
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex space-x-4">
            <BackButton to={`/orgs/${orgName}/assignments`}/>
            <BasicHeading heading={`Analytics for ${orgName}`} /> 
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <GetCSVFileButton text="Get CSV Report" orgLogin={orgName}/>
          </div>
        </div>
      </div>
      {orgData && (
        <div className="m-8">
          <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === "Average Assignment Points" && (
            <AveragePointsChart orgData={mockOrgData} maxPointsPerAssignment={maxPointsPerAssignment} /> 
          )}
          {activeTab === "Common Issues" && (
            <CommonIssuesChart issues={mockCommonIssues}/>
          )}
          {activeTab === "Missing Submissions" && (
            <MissingSubmissionsList orgData={mockOrgData}/>
          )}
        </div>
      )}
    </div>
  );
}
