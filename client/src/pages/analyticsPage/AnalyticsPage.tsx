import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useGitHub } from "../../context/useGitHub";
import type { OrgReport } from "src/types/OrgReport";
import BackButton from "../../components/BackButton";
import BasicHeading from "../../components/BasicHeading";
import AveragePointsChart from "./averageAssignmentPointsTab/AveragePointsChart";
import MissingSubmissionsList from "./missingSubmissionsTab/MissingSubmissionsTab";
import Spinner from "../../components/Spinner";
import CommonIssuesTab from "./commonIssuesTab/CommonIssuesTab";
import Tabs from "../../components/Tabs";

// delete this later
// const mockOrgData = {
//   org: "Mock University",
//   orgId: 2,
//   assignments: ["intro-to-data", "java-assignment", "css-intro-assignment"],
//   submissions: [
//     {
//       student: "astronautie",
//       grades: {
//         "intro-to-data": 20,
//         "java-assignment": 10,
//         "css-intro-assignment": null,
//       },
//     },
//     {
//       student: "FuzzyKala",
//       grades: {
//         "intro-to-data": 18,
//         "java-assignment": null,
//         "css-intro-assignment": null,
//       },
//     },
//     {
//       student: "vima20",
//       grades: {
//         "intro-to-data": 20,
//         "java-assignment": 10,
//         "css-intro-assignment": 30,
//       },
//     },
//     {
//       student: "nonRoster",
//       grades: {
//         "intro-to-data": null,
//         "java-assignment": 15,
//         "css-intro-assignment": 25,
//       },
//     },
//   ],
// };

// TODO: get this from github with real values (preferably with the OrgData and not separately)
const maxPointsPerAssignment = {
  "intro-to-data": 20,
  "java-assignment": 15,
  "css-intro-assignment": 30,
};

// TODO: get the real issues from the database(?)
const mockAssignmentData = [
  {
    assignmentName: "Assignment 1",
    issues: [
      "Repeating code",
      "Another issue",
      "Another issue",
      "Poor Naming",
      "Poor Naming",
      "Poor Naming",
      "Poor Naming",
    ],
  },
  {
    assignmentName: "Assignment 2",
    issues: [
      "Bad logic",
      "Poor Naming",
      "Poor Naming",
      "Poor Naming",
      "Repeating Code",
      "No imports",
      "No imports",
    ],
  },
  {
    assignmentName: "Assignment 3",
    issues: [
      "Bad logic",
      "Poor naming",
      "Bad logic",
      "Poor naming",
      "Poor naming",
      "Repeating code",
    ],
  },
  {
    assignmentName: "Assignment 4",
    issues: ["Bad logic", "Poor naming", "Poor naming"],
  },
];

export default function AnalyticsPage() {
  const { orgName } = useParams<{ orgName: string }>();
  const github = useGitHub();
  const [orgData, setOrgData] = useState<OrgReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "average-points";

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

  function onTabChange(tabId: string) {
    const assignment = searchParams.get("assignment");
    const params = new URLSearchParams();
    params.set("tab", tabId);
    if (tabId === "missing-submissions" && assignment) {
      params.set("assignment", assignment);
    }
    setSearchParams(params);
  }

  const tabs = useMemo(() => {
    if (!orgData) return [];
    return [
      {
        id: "average-points",
        label: "Average Assignment Points",
        content: (
          <AveragePointsChart
            orgData={orgData}
            maxPointsPerAssignment={maxPointsPerAssignment}
          />
        ),
      },
      {
        id: "common-issues",
        label: "Common Issues",
        content: <CommonIssuesTab assignmentFeedbacks={mockAssignmentData} />,
      },
      {
        id: "missing-submissions",
        label: "Missing Submissions",
        content: <MissingSubmissionsList orgData={orgData} />,
      },
    ];
  }, [orgData]);

  return (
    <div className="flex flex-col space-y-10 p-4 md:p-12">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex space-x-4">
            <BackButton to={`/orgs/${orgName}/assignments`} />
            <BasicHeading heading={`Analytics for ${orgName}`} />
          </div>
        </div>
        <div>
          {loading ? (
            <Spinner />
          ) : !orgData ? (
            <div className="p-4">No organization data found.</div>
          ) : (
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
          )}
        </div>
      </div>
    </div>
  );
}
