import { generateCSVFromOrg } from "../utils/generateCSVFromOrg";
import { useNavigate } from "react-router-dom";
import { useGitHub } from "../context/useGitHub";
import type { RosterWithStudents } from "@shared/supabaseInterfaces";

interface GetCSVFileButtonProps {
  text: string;
  orgName: string | undefined;
  roster: RosterWithStudents | null;
  assignmentFilter?: string[];
}

interface Submission {
  student: string;
  grades: Record<string, number | null>;
}

export default function GetCSVFileButton({text, orgName, roster, assignmentFilter }: GetCSVFileButtonProps) {
  const navigate = useNavigate();
  const github = useGitHub()

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
      const data = await github.getAllOrganizationData(orgName);
      
      const filteredData = assignmentFilter
        ? {
            ...data,
            assignments: assignmentFilter,
            submissions: data.submissions.map((s: Submission) => ({
              ...s,
              grades: Object.fromEntries(
                Object.entries(s.grades || {}).filter(([k]) =>
                  assignmentFilter.includes(k)
                )
              ),
            })),
          }
        : data;

      generateCSVFromOrg(filteredData, roster);
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
