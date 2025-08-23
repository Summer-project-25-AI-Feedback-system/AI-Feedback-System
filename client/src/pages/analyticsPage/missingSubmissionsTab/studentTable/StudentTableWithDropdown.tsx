import { useSearchParams } from "react-router-dom";
import StudentTable from "./StudentTable";
import type { AnalyticsResponse, RosterWithStudentsInput } from "@shared/supabaseInterfaces";
import StudentTableDropdown from "./StudentTableDropdown";
import { useEffect } from "react";

type StudentTableWithDropdownProps = {
  roster: RosterWithStudentsInput;
  analyticsData: AnalyticsResponse;
  selectedTab: string;
};

export default function StudentTableWithDropdown({ roster, analyticsData, selectedTab }: StudentTableWithDropdownProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const allAssignments = analyticsData.assignments;
  const assignmentOptions = allAssignments.map((a) => ({
    id: a.id,
    label: a.name,
  }));

  const selectedAssignment = assignmentOptions.find(
    (a) => a.label === selectedTab
  );

  const handleTabChange = (tabId: string) => {
    const assignment = assignmentOptions.find((a) => a.id === tabId);
    if (!assignment) return;

    const params = new URLSearchParams(searchParams);
    params.set("assignment", assignment.label); 
    setSearchParams(params);
  };

  useEffect(() => {
    if (!selectedAssignment && assignmentOptions.length > 0) {
      const first = assignmentOptions[0];
      const params = new URLSearchParams(searchParams);
      params.set("assignment", first.label);
      setSearchParams(params);
    }
  }, [selectedAssignment, assignmentOptions]);

  return (
    <div className="mt-4 space-y-4">
      <StudentTableDropdown
        options={assignmentOptions}
        value={selectedAssignment?.id ?? ""} 
        onChange={handleTabChange}
      />

      {selectedAssignment && (
        <StudentTable
          roster={roster}
          analyticsData={analyticsData}
          assignmentFilter={[selectedAssignment.id]} 
        />
      )}
    </div>
  );
}