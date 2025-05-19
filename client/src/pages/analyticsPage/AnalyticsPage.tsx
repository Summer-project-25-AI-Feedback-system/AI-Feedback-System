import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGitHub } from "../../context/useGitHub";
import BackButton from "../../components/BackButton";
import BasicHeading from "../../components/BasicHeading";
import GetCSVFileButton from "../assignmentPage/GetCSVFileButton";

type OrgReport = {
  org: string;
  assignments: string[];
  submissions: {
    student: string;
    grades: Record<string, number | string | null>; 
  }[];
};

export default function AnalyticsPage() {
  const { orgName } = useParams<{ orgName: string }>();
  const github = useGitHub();
  const [orgData, setOrgData] = useState<OrgReport | null>(null);
  const [loading, setLoading] = useState(true);

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
            <BackButton to={`/orgs`}/>
            <BasicHeading heading={`Analytics for ${orgName}`} /> 
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <GetCSVFileButton text="Get CSV Report" orgLogin={orgName}/>
          </div>
        </div>
      </div>
      {/* show page analytics // tested and all data fetching works */}
      
    </div>
  );
}
