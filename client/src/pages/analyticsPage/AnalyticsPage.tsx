import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGitHub } from "../../context/useGitHub";
import BackButton from "../../components/BackButton";
import BasicHeading from "../../components/BasicHeading";
import GetCSVFileButton from "../assignmentPage/GetCSVFileButton";
import AverageGradeChart from "./AverageGradeChart";
import TabNavigation from "./TabNavigation";

type OrgReport = {
  org: string;
  assignments: string[];
  submissions: {
    student: string;
    grades: Record<string, number | string | null>; 
  }[];
};

// delete this later
const mockOrgData = {
  org: "Mock University",
  assignments: ["Assignment 1", "Assignment 2", "Assignment 3"],
  submissions: [
    {
      student: "alice",
      grades: {
        "Assignment 1": 80,
        "Assignment 2": 90,
        "Assignment 3": 75,
      },
    },
    {
      student: "bob",
      grades: {
        "Assignment 1": 70,
        "Assignment 2": null, 
        "Assignment 3": 85,
      },
    },
    {
      student: "charlie",
      grades: {
        "Assignment 1": 90,
        "Assignment 2": 95,
        "Assignment 3": 80,
      },
    },
  ],
};

export default function AnalyticsPage() {
  const { orgName } = useParams<{ orgName: string }>();
  const github = useGitHub();
  const [orgData, setOrgData] = useState<OrgReport | null>(null);
  const [loading, setLoading] = useState(true);
  const tabs = ["Average Grades", "Common Issues"];
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
      {/* show page analytics */}
      {orgData && (
        <div className="mt-8">
          <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === "Average Grades" && (
            <AverageGradeChart orgData={mockOrgData} />
          )}
          {activeTab === "Common Issues" && (
            <div className="text-gray-700">
              <p>Common issues will be displayed here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
