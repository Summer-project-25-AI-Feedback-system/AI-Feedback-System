import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useGitHub } from "../../context/useGitHub";
import BackButton from "../../components/BackButton";
import BasicHeading from "../../components/BasicHeading";
import MissingSubmissionsList from "./missingSubmissionsTab/MissingSubmissionsTab";
import Spinner from "../../components/Spinner";
import CommonIssuesTab from "./commonIssuesTab/CommonIssuesTab";
import Tabs from "../../components/Tabs";
import AveragePointsTab from "./averageAssignmentPointsTab/AveragePointsTab";
import { useSupabase } from "../../context/supabase/useSupabase";
import type { AnalyticsResponse, AssignmentWithIssues } from "@shared/supabaseInterfaces";

export default function AnalyticsPage() {
  const { orgName } = useParams<{ orgName: string }>();
  const github = useGitHub();
  const supabase = useSupabase();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse | null>(null);
  const [assignmentIssues, setAssignmentIssues] = useState<AssignmentWithIssues[] | null>(null);
  const [orgId, setOrgId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "average-points";

  useEffect(() => {
    const fetchOrgData = async () => {
      if (!orgName) return;
      try {
        github.getOrganization(orgName)
          .then((fetchedOrgData) => {
            console.log("the organization data id in analytics: " + fetchedOrgData.id)
            setOrgId(fetchedOrgData.id)
            supabase.getAnalyticsData(fetchedOrgData.id)
              .then((fetchedAnalyticsData) => {
                console.log("the analytics data id in analytics (from supabase): " + fetchedOrgData.id)
                setAnalyticsData(fetchedAnalyticsData)
              })
            supabase.getAssignmentIssues(fetchedOrgData.id)
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
    if (!analyticsData) return [];
    return [
      {
        id: "average-points",
        label: "Average Assignment Points",
        content: (
          <AveragePointsTab
            analyticsData={analyticsData}
          />
        ),
      },
      {
        id: "common-issues",
        label: "Common Issues",
        content: assignmentIssues ? (
        <CommonIssuesTab assignmentFeedbacks={assignmentIssues} />
        ) : (
            <Spinner />
        ),
      },
      {
        id: "missing-submissions",
        label: "Missing Submissions",
        content: orgId !== null ? (
          <MissingSubmissionsList analyticsData={analyticsData} orgId={orgId}/>
        ) : (
          <Spinner />
        )
      },
    ];
  }, [analyticsData, assignmentIssues, orgId]);

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
          ) : !analyticsData ? (
            <Spinner />
          ) : (
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
          )}
        </div>
      </div>
    </div>
  );
}
