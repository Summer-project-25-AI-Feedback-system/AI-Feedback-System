import BasicHeading from "../../components/BasicHeading";
import BasicList from "../../components/basicList/BasicList";
import FilterButton from "../../components/FilterButton";
import BasicSearchBar from "../../components/BasicSearchBar";
import type { RepoInfo } from "@shared/githubInterfaces";
import { useEffect, useState } from "react";
import { useGitHub } from "../../context/useGitHub";
import { useParams } from "react-router-dom";
import { useFilteredList } from "../../hooks/useFilteredList";
import BackButton from "../../components/BackButton";
import BasicButton from "../../components/BasicButton";

export default function ReposPage() {
  const { orgName } = useParams<{ orgName: string }>();
  const { assignmentName } = useParams<{ assignmentName: string }>();
  const github = useGitHub();
  const [repos, setRepos] = useState<RepoInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const filteredRepos = useFilteredList(repos ?? [], searchTerm, (repo, term) =>
    repo.name.toLowerCase().includes(term.toLowerCase())
  );

  useEffect(() => {
    if (orgName) {
      github
        .getRepos(orgName, assignmentName)
        .then(setRepos)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [orgName, assignmentName, github]);

  const handleClick = (action: string) => {
    console.log(`Clicked ${action}`);
  };

  console.log("repos", repos);
  return (
    <div className="flex flex-col space-y-10 p-4 md:p-12">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex space-x-4">
            <BackButton to={`/orgs/${orgName}/assignments`} />
            <BasicHeading heading={`Repositories in ${assignmentName}`} />
          </div>
          <div className="flex space-x-4">
            <BasicSearchBar value={searchTerm} onChange={setSearchTerm} />
            <FilterButton buttonText="Sort By" items={["Recent", "Old"]} />
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4">
          <BasicButton
            onClick={() => handleClick("Run Analysis")}
            text="Run Analysis"
          />
          <BasicButton
            onClick={() => handleClick("Run Analysis")}
            text="View Summary"
          />
        </div>
      </div>

      <BasicList
        type="repo"
        items={filteredRepos}
        orgName={orgName!}
        assignmentName={assignmentName!}
        isLoading={loading}
      />
    </div>
  );
}
