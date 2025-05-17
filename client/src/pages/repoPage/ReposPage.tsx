import BasicHeading from "../../components/BasicHeading";
import BasicList from "../../components/basicList/BasicList";
import FilterButton from "../../components/FilterButton";
import BasicSearchBar from "../../components/BasicSearchBar";
import type { RepoInfo } from "@shared/githubInterfaces";
import { useEffect, useState } from "react";
import { useGitHub } from "../../context/useGitHub";
import { useParams } from "react-router-dom";

export default function ReposPage() {
  const { orgName } = useParams<{ orgName: string }>();
  const { assignmentName } = useParams<{ assignmentName: string }>();
  const github = useGitHub();
  const [repos, setRepos] = useState<RepoInfo[]>([]);

  useEffect(() => {
    if (orgName) {
      github
        .getStudentRepos(orgName, assignmentName)
        .then((data) => {
          console.log("repos data from backend:", data);
          setRepos(data);
        })
        .catch(console.error);
    }
  }, [orgName, assignmentName, github]);

  console.log("repos", repos);
  return (
    <div className="flex flex-col space-y-20 p-4 md:p-12">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <BasicHeading heading={`Assignments in ${assignmentName}`} />
          <div className="flex space-x-4">
            <BasicSearchBar />
            <FilterButton buttonText="Sort By" items={["Recent", "Old"]} />
          </div>
        </div>
      </div>
      <BasicList
        repoList={repos}
        orgName={orgName!}
        assignmentName={assignmentName}
      />
    </div>
  );
}
