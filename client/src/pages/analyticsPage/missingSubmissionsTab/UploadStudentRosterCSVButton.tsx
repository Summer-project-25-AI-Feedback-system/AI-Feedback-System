import { useRef } from "react";
import Papa from "papaparse";
import type { StudentInStudentRoster } from "src/types/StudentInStudentRoster";
import { useParams } from "react-router-dom";

type UploadStudentRosterCSVButtonProps = {
  text: string,
  onUpload: (students: StudentInStudentRoster[]) => void;
};

// TODO: once we have access to database, save (or update if a new roster is provided) uploaded roster for specific organization there
export default function UploadStudentRosterCSVButton({ text, onUpload }: UploadStudentRosterCSVButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { orgName } = useParams<{ orgName: string }>();

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const saveRosterToDB = async (roster: StudentInStudentRoster[]) => {
    if (!orgName) return;
    try {
      const response = await fetch(`/api/orgs/${orgName}/roster`, {
        method: "POST", // in backend if a roster already exists for the specific org, update it instead of posting it (use same backend function for both though)
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roster }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save roster: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error saving roster to DB:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse<StudentInStudentRoster>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validStudents = results.data.filter((s) => s.identifier);
        onUpload(validStudents);
        (async () => {await saveRosterToDB(validStudents);})();
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
