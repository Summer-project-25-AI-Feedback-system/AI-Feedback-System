import { useSearchParams } from "react-router-dom";
import StudentTable from "./StudentTable";
import Tabs from "../../../../components/Tabs";
import type { AnalyticsResponse, RosterWithStudentsInput } from "@shared/supabaseInterfaces";

type StudentTableWithTabsProps = {
  roster: RosterWithStudentsInput;
  analyticsData: AnalyticsResponse;
  selectedTab: string;
  orgId: number;
  orgName?: string;
};

export default function StudentTableWithTabs({ roster, analyticsData, selectedTab, orgName, orgId }: StudentTableWithTabsProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("assignment", tabId); 
    console.log(orgName + " " + analyticsData)
    setSearchParams(params);
  };

  const allAssignments = analyticsData.assignments;

  const tabs = [
    {
      id: "all",
      label: "All Submissions",
      content: <StudentTable roster={roster} analyticsData={analyticsData} orgName={orgName} orgId={orgId}/>
    },
    ...allAssignments.map((assignment) => ({
      id: assignment.id,
      label: assignment.name,
      content: (
        <StudentTable
          roster={roster}
          analyticsData={analyticsData}
          assignmentFilter={[assignment.id]}
          orgName={orgName}
          orgId={orgId}
        />
      )
    }))
  ];

  return (
    <div className="mt-4">
        <Tabs tabs={tabs} activeTab={selectedTab} onTabChange={handleTabChange}/>
    </div>
  );
}