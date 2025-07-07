import { useSearchParams } from "react-router-dom";
import type { OrgReport } from "src/types/OrgReport";
import StudentTable from "./StudentTable";
import Tabs from "../../../../components/Tabs";
import type { RosterWithStudentsInput } from "@shared/supabaseInterfaces";

type StudentTableWithTabsProps = {
  roster: RosterWithStudentsInput;
  orgData: OrgReport;
  selectedTab: string;
  orgName?: string;
};

export default function StudentTableWithTabs({ roster, orgData, selectedTab, orgName }: StudentTableWithTabsProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("assignment", tabId); 
    console.log(orgName + " " + orgData)
    setSearchParams(params);
  };

  const allAssignments = orgData.assignments;

  const tabs = [
    {
      id: "all",
      label: "All Submissions",
      content: <StudentTable roster={roster} orgData={orgData} orgName={orgName}/>
    },
    ...allAssignments.map((assignmentName) => ({
      id: assignmentName,
      label: assignmentName,
      content: (
        <StudentTable
          roster={roster}
          orgData={orgData}
          assignmentFilter={[assignmentName]}
          orgName={orgName}
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