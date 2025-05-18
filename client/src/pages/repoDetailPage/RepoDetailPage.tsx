import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";
import BasicHeading from "../../components/BasicHeading";
import BasicList from "../../components/basicList/BasicList";
import FilterButton from "../../components/FilterButton";
import BasicSearchBar from "../../components/BasicSearchBar";
import BasicButton from "../../components/BasicButton";
import Subtext from "./Subtext";
import { useFilteredList } from "../../hooks/useFilteredList";
import type { StudentSubmissionInfo } from "../../types/StudentSubmissionInfo";

// Mocked data until backend is connected
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
};

export default function RepoDetailPage() {
  const { orgName, assignmentName, id } = useParams<{
    orgName: string;
    assignmentName: string;
    id: string;
  }>();

  const [repoName, setRepoName] = useState("Repository Name");
  const [submissions, setSubmissions] = useState<StudentSubmissionInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [lastRunTime, setLastRunTime] = useState("");

  const filteredSubmissions = useFilteredList(
    submissions,
    searchTerm,
    (submission, term) =>
      submission.studentName.toLowerCase().includes(term.toLowerCase())
  );

  useEffect(() => {
    if (id) {
      // Mock fetch
      const fetchedSubmissions = mockStudentSubmissions[id] ?? [];
      setSubmissions(fetchedSubmissions);
      setLoading(false);

      // Mock last analysis run
      const now = new Date();
      setLastRunTime(
        `${now.getHours()}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")} ${now.getDate()}.${
          now.getMonth() + 1
        }.${now.getFullYear()}`
      );
    }
  }, [id]);

  const gradedCount = submissions.filter(
    (s) => s.submissionStatus.toLowerCase() === "analyzed"
  ).length;

  const handleClick = (action: string) => {
    console.log(`Clicked ${action}`);
  };

  return (
    <div className="flex flex-col space-y-20 p-4 md:p-12">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex space-x-4">
            <BackButton
              to={`/orgs/${orgName}/assignments/${assignmentName}/repos`}
            />
            <BasicHeading heading={repoName} />
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <BasicButton
              onClick={() => handleClick("Re-run")}
              text="Re-run Analysis"
            />
            <BasicButton
              onClick={() => handleClick("Analyze Selected")}
              text="Analyze Selected"
            />
          </div>
        </div>

        <div>
          <Subtext
            text={`${gradedCount}/${submissions.length} submissions graded.`}
          />
          <Subtext text={`Last analysis run ${lastRunTime}.`} />
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex space-x-4">
            <BasicSearchBar value={searchTerm} onChange={setSearchTerm} />
            <FilterButton
              buttonText="Filter"
              items={["Analyzed", "Error", "Missing"]}
            />
          </div>
          <div className="flex space-x-4">
            <BasicButton
              onClick={() => handleClick("CSV")}
              text="Get CSV Report"
            />
            <BasicButton
              onClick={() => handleClick("Analytics")}
              text="See Analytics Page"
            />
          </div>
        </div>
      </div>

      <BasicList
        type="submission"
        items={filteredSubmissions}
        isLoading={loading}
      />
    </div>
  );
}
