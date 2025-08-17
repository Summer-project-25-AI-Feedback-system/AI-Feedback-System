import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useGitHub } from "../../context/useGitHub";
import type { OrgReport } from "src/types/OrgReport";
import BackButton from "../../components/BackButton";
import BasicHeading from "../../components/BasicHeading";
import MissingSubmissionsList from "./missingSubmissionsTab/MissingSubmissionsTab";
import Spinner from "../../components/Spinner";
import CommonIssuesTab from "./commonIssuesTab/CommonIssuesTab";
import Tabs from "../../components/Tabs";
import AveragePointsTab from "./averageAssignmentPointsTab/AveragePointsTab";
import { useSupabase } from "../../context/supabase/useSupabase";
import type { AssignmentWithIssues } from "@shared/supabaseInterfaces";

// TODO: get this from github with real values (preferably with the OrgData and not separately)
const maxPointsPerAssignment = {
  "intro-to-data": 20,
  "java-assignment": 15,
  "css-intro-assignment": 30,
};

export default function AnalyticsPage() {
  const { orgName } = useParams<{ orgName: string }>();
  const github = useGitHub();
  const supabase = useSupabase();
  const [orgData, setOrgData] = useState<OrgReport | null>(null);
  const [assignmentIssues, setAssignmentIssues] = useState<AssignmentWithIssues[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "average-points";

  useEffect(() => {
    const fetchOrgData = async () => {
      if (!orgName) return;
      try {
        github.getAllOrganizationData(orgName)
          .then((fetchedOrgData) => {
            setOrgData(fetchedOrgData)
            supabase.getAssignmentIssues(fetchedOrgData.orgId)
              .then((fetchedAssignmentIssues) => {
                setAssignmentIssues(fetchedAssignmentIssues)
              })
          })
      } catch (error) {
        console.error("Failed to fetch information for analytics page: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrgData();
  }, [orgName, github, supabase]);

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
          <AveragePointsTab
            orgData={orgData}
            maxPointsPerAssignment={maxPointsPerAssignment}
          />
        ),
      },
      {
        id: "common-issues",
        label: "Common Issues",
        content: assignmentIssues ? (
        <CommonIssuesTab assignmentFeedbacks={assignmentIssues} />
        ) : (
          <div className="p-4 text-gray-500">
            <Spinner />
          </div>
        ),
      },
      {
        id: "missing-submissions",
        label: "Missing Submissions",
        content: <MissingSubmissionsList orgData={orgData} />,
      },
    ];
  }, [orgData, assignmentIssues]);

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
