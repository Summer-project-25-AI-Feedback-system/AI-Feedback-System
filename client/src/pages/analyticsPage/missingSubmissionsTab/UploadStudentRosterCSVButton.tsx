import { useRef } from "react";
import Papa from "papaparse";
import { useParams } from "react-router-dom";
import { useSupabase } from "../../../context/supabase/useSupabase";
import type { RosterWithStudentsInput } from "@shared/supabaseInterfaces";
import type { StudentInStudentRoster } from "src/types/Roster";

type UploadStudentRosterCSVButtonProps = {
  text: string,
  onUpload: (roster: RosterWithStudentsInput) => void;
  orgId: number;
};

export default function UploadStudentRosterCSVButton({ text, onUpload, orgId }: UploadStudentRosterCSVButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { orgName } = useParams<{ orgName: string }>();
  const supabase = useSupabase(); 

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const saveRosterToDB = async (roster: RosterWithStudentsInput) => {
    if (orgName && orgId) {
      const stringId = String(orgId)
      supabase.addRoster(stringId, roster)
      .catch(console.error) 
    } else {
      console.error("Missing orgName or orgId");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    Papa.parse<StudentInStudentRoster>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const expectedHeaders = ["identifier", "github_username", "github_id", "name"];
        const actualHeaders = results.meta.fields;
        const headersValid = actualHeaders && expectedHeaders.length === actualHeaders.length && expectedHeaders.every((h, i) => h === actualHeaders[i]);
        if (!headersValid) {
          console.error("Invalid CSV format. Expected headers:", expectedHeaders, "but got:", actualHeaders);
          alert("Invalid CSV format. Header row must exactly match: identifier,github_username,github_id,name");
          return;
        }
        const validStudents = results.data.filter((s) => s.identifier); 
        if (validStudents.length === 0) {
          console.error("No students found in the CSV file.");
          alert("The uploaded CSV must contain at least one student.");
          return;
        }
        const roster: RosterWithStudentsInput = {
          amount_of_students: validStudents.length,
          roster_students: validStudents.map((student) => ({
            github_roster_identifier: student.identifier,
            github_username: student.github_username,
            github_user_id: student.github_id,
            github_display_name: student.name,
          })),
        };
        onUpload(roster);
        (async () => {await saveRosterToDB(roster);})();
      },
      error: (err) => {
        console.error("CSV parsing error:", err);
      },
    });
    event.target.value = "";
  };

  return (
    <div>
      <button onClick={handleClick} className="flex items-center justify-between border border-[#D9D9D9] px-6 py-3 h-[40px] rounded-full w-fit min-w-[95px] gap-2 bg-[#1D1B20] hover:opacity-90 text-white">
        {text}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
