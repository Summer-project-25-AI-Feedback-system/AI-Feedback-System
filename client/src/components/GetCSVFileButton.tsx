import { generateCSVFromOrg } from "../utils/generateCSVFromOrg";
import { useNavigate } from "react-router-dom";
import type { AnalyticsResponse, AnalyticsSubmission, RosterWithStudentsInput } from "@shared/supabaseInterfaces";
import { useSupabase } from "../context/supabase/useSupabase";

interface GetCSVFileButtonProps {
  text: string;
  orgName: string | undefined;
  roster: RosterWithStudentsInput | null;
  orgId: number;
  assignmentFilter?: string[];
}

export default function GetCSVFileButton({text, orgName, roster, assignmentFilter, orgId }: GetCSVFileButtonProps) {
  const navigate = useNavigate();
  const supabase = useSupabase();

  const handleClick = async () => {
    if (!orgName) return;

    if (!roster || !roster.roster_students || roster.roster_students.length === 0) {
      navigate(`/orgs/${orgName}/analytics?tab=missing-submissions`);
      alert(
        "A roster is required to generate the CSV report. Please upload a roster first."
      );
      return;
    }

    try {
      const data = await supabase.getAnalyticsData(orgId);
      
      const filteredData: AnalyticsResponse = assignmentFilter
        ? {
            ...data,
            assignments: data.assignments.filter((a) => assignmentFilter.includes(a.id)),
            submissions: data.submissions.map((s: AnalyticsSubmission) => ({
              ...s,
              grades: s.grades.filter((g) => assignmentFilter.includes(g.assignmentId)),
            })),
          }
        : data;

      generateCSVFromOrg(filteredData, roster, orgName);
    } catch (error) {
      console.error("Error generating CSV", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-between border border-[#D9D9D9] px-6 py-3 h-[40px] rounded-full w-fit min-w-[95px] gap-2 bg-[#1D1B20] hover:opacity-90 text-white"
    >
      <span className="text-xs sm:text-sm">{text}</span>
    </button>
  );
}
