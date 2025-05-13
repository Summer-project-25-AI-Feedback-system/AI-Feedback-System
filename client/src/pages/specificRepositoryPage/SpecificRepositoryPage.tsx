import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FilterButton from "../../components/FilterButton" 
import BasicHeading from "../../components/BasicHeading";
import BasicList from "../../components/basicList/BasicList";
import type { StudentSubmissionInfo } from "../../types/StudentSubmissionInfo";
import BasicButton from "../../components/BasicButton";
import Subtext from "./Subtext";

// delete mock data once data from backend is retrieved
const mockStudentSubmissions: Record<string, StudentSubmissionInfo[]> = {
  "1": [
    {
      id: "1",
      studentProfilePicture: "https://example.com/profile1.jpg",
      studentName: "Alice Johnson",
      submissionStatus: "Analyzed",
      currentGrade: "4",
      submissionTime: "2 hours ago",
    },
    {
      id: "2",
      studentProfilePicture: "https://example.com/profile2.jpg",
      studentName: "Bob Smith",
      submissionStatus: "Missing",
      currentGrade: "N/A",
      submissionTime: "N/A",
    },
  ],
  "2": [
    {
      id: "3",
      studentProfilePicture: "https://example.com/profile3.jpg",
      studentName: "Charlie Rose",
      submissionStatus: "Error",
      currentGrade: "2",
      submissionTime: "Yesterday",
    },
  ],
  "3": [
    {
      id: "4",
      studentProfilePicture: "https://example.com/profile4.jpg",
      studentName: "Dana Miller",
      submissionStatus: "Analyzed",
      currentGrade: "5",
      submissionTime: "Today",
    },
    {
      id: "5",
      studentProfilePicture: "https://example.com/profile5.jpg",
      studentName: "Eli Brown",
      submissionStatus: "Analyzed",
      currentGrade: "3",
      submissionTime: "Yesterday",
    },
  ],
};

export default function SpecificRepositoryPage() {
  const { id } = useParams<{ id: string }>(); 
  const [repoName, setRepoName] = useState<string>("");
  const [submissions, setSubmissions] = useState<StudentSubmissionInfo[]>([]);
  const [gradedSubmissions, setGradedSubmissions] = useState(0);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [lastRunTime, setLastRunTime] = useState("");

  const handleClick = () => {
    console.log("click")
  };

  const getRepoName = () => {
    // TODO: get repository name
    const repoName = "Repository Name"
    setRepoName(repoName);
  };

  const getSubmission = () => {
    const repoSubmissions = mockStudentSubmissions[id ?? ""] || []; // TODO: add proper fetch to backend
    const graded = repoSubmissions.filter(
      (s) => s.submissionStatus.toLowerCase() === "analyzed"
    ).length;
    setSubmissions(repoSubmissions);
    setGradedSubmissions(graded);
    setTotalSubmissions(repoSubmissions.length);
  }

  const getLastRunAnalysisTime = () => {
    const now = new Date(); // TODO: set to actual time of last run analysis
    const formatted = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")} ${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;
    setLastRunTime(formatted);
  };

  useEffect(() => {
    getRepoName();
    getSubmission();
    getLastRunAnalysisTime();
  }, [id]);

  return (
    <div>
      <div className="flex flex-col space-y-20 p-4 md:p-12">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between align-top">
            <div className="space-y-2">
              <BasicHeading heading={repoName}></BasicHeading> 
              <div>
                <Subtext text={`${gradedSubmissions}/${totalSubmissions} submissions graded.`} />
                <Subtext text={`Last analysis run ${lastRunTime}.`} />
              </div>
            </div>
            <div className="ml-4 flex flex-col md:flex-row gap-2">
              <BasicButton onClick={handleClick} text="Re-run Analysis"></BasicButton>
              <BasicButton onClick={handleClick} text="Analyze Selected"></BasicButton>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <BasicButton onClick={handleClick} text="Get CSV Report"></BasicButton>
            <BasicButton onClick={handleClick} text="See Analytics Page"></BasicButton>
          </div>
        </div>
        <div className="space-y-2">
          <FilterButton buttonText="Filter" items={["Analyzed", "Error", "Missing"]}/>
          <BasicList specificRepoInfo={submissions}/> 
        </div>
      </div> 
    </div>
  )
}
