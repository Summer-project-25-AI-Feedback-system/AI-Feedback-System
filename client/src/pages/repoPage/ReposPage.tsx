import BasicHeading from "../../components/BasicHeading";
import BasicList from "../../components/basicList/BasicList";
import FilterButton from "../../components/FilterButton";
import BasicSearchBar from "../assignmentPage/BasicSearchBar";
import type { RepoInfo } from "../../types/RepoInfo";
import { useEffect, useState } from "react";
import { useGitHub } from "../../context/useGitHub";
import type { Repo } from "../../types/GitHubInfo";
import { useParams } from "react-router-dom";
import Subtext from "./Subtext";
import BasicButton from "../../components/BasicButton";

const mapToRepoInfo = (repo: Repo): RepoInfo => ({
  id: repo.id,
  name: repo.name,
  studentAvatar: repo.collaborators?.[0]?.avatarUrl ?? "",
  amountOfStudents: String(repo.collaborators?.length ?? 0),
  timeOfLastUpdate: new Date(repo.updatedAt).toLocaleString(),
});

export default function ReposPage() {
  const { orgName } = useParams<{ orgName: string }>();
  const { assignmentName } = useParams<{ assignmentName: string }>();
  const [gradedSubmissions, setGradedSubmissions] = useState(0);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [lastRunTime, setLastRunTime] = useState("");
  const github = useGitHub();
  const [repos, setRepos] = useState<RepoInfo[]>([]);

  if (!assignmentName) {
    return <div className="p-4 text-red-500">Missing assignment name</div>;
  }

  const getLastRunAnalysisTime = () => {
    const now = new Date(); // TODO: set to actual time of last run analysis
    const formatted = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")} ${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;
    setLastRunTime(formatted);
  };

  const handleClick = () => {
    console.log("click") // change later
  };

  useEffect(() => {
    if (orgName) {
      github
        .getStudentRepos(orgName, assignmentName)
        .then((data) => {
          console.log("data", data);
          const mapped = data.map(mapToRepoInfo); 
          setRepos(mapped);

          const graded = 0; // proper functionality to get the amount of returned submissions within these repositories instead of this 
          setGradedSubmissions(graded);
          setTotalSubmissions(mapped.length);
          getLastRunAnalysisTime();
        })
        .catch(console.error);
    }
  }, [orgName, assignmentName, github]);

  console.log("repos", repos);
  return (
    <div>
      <div className="flex flex-col space-y-20 p-4 md:p-12">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between align-top">
            <div className="space-y-2">
              <BasicHeading heading={assignmentName}></BasicHeading> 
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
            <BasicSearchBar />          
          </div>
        </div>
        <div className="space-y-2">
          <FilterButton buttonText="Filter" items={["Analyzed", "Error", "Missing"]}/>
          <BasicList repoList={repos} orgName={orgName!} />
        </div>
      </div> 
    </div>
  );
}
