import { generateCSVFromOrg } from "../utils/generateCSVFromOrg";
// import { useGitHub } from "../context/useGitHub";
import UserContext from "../context/UserContext"
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import type { StudentInStudentRoster } from "src/types/StudentInStudentRoster";


interface GetCSVFileButtonProps {
  text: string;
  orgName: string | undefined;
  roster?: StudentInStudentRoster[];
  assignmentFilter?: string[];
}

// delete this later
const mockOrgData = {
  org: "Mock University",
  assignments: ["intro-to-data", "java-assignment", "css-intro-assignment"],
  submissions: [
    {
      student: "astronautie",
      grades: {
        "intro-to-data": 20,
        "java-assignment": 10,
        "css-intro-assignment": null,
      },
    },
    {
      student: "FuzzyKala",
      grades: {
        "intro-to-data": 18,
        "java-assignment": null, 
        "css-intro-assignment": null,
      },
    },
    {
      student: "vima20",
      grades: {
        "intro-to-data": 20,
        "java-assignment": 10,
        "css-intro-assignment": 30,
      },
    },
    {
      student: "nonRoster",
      grades: {
        "intro-to-data": null,
        "java-assignment": 15,
        "css-intro-assignment": 25,
      },
    },
  ],
};

export default function GetCSVFileButton({ text, orgName, roster, assignmentFilter }: GetCSVFileButtonProps) {
  // const github = useGitHub();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const username = user?.username || "unknownuser";

  const handleClick = async () => {
    if (!orgName) return;
    if (!roster || roster.length === 0) {
      navigate(`/orgs/${orgName}/analytics?tab=missing-submissions`); 
      alert("A roster is required to generate the CSV report. Please upload a roster first.");
      return;
    }
    try {
      // const data = await github.getAllOrganizationData(orgName);
      const data = mockOrgData
      const filteredData = assignmentFilter ? {
        ...data,
        assignments: assignmentFilter,
        submissions: data.submissions.map((s: any) => ({ // change the type of s later
          ...s,
          grades: Object.fromEntries(
            Object.entries(s.grades || {}).filter(([k]) =>
              assignmentFilter.includes(k)
            )
          ),
        })),
      } : data;
      generateCSVFromOrg(filteredData, roster); 
      const response = await fetch("http://localhost:5000/api/csv-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rows: data,
           username: username }), 
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Tallennus epäonnistui");
      }
      console.log("✅ Data tallennettu Supabaseen"); 
    } catch (error) {
      console.error("🚫 Virhe tallennuksessa:", error);
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

