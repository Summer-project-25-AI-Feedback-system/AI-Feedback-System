import BasicHeading from "../../components/BasicHeading";
import BasicList from "../../components/basicList/BasicList";
import FilterButton from "../../components/FilterButton";
import BasicSearchBar from "../../components/BasicSearchBar";
import type { RepoInfo } from "@shared/githubInterfaces";
import { useEffect, useState } from "react";
import { useGitHub } from "../../context/useGitHub";
import { useParams } from "react-router-dom";
import { useFilteredList } from "../../hooks/useFilteredList";

export default function ReposPage() {
  const { orgName } = useParams<{ orgName: string }>();
  const { assignmentName } = useParams<{ assignmentName: string }>();
  const github = useGitHub();
  const [repos, setRepos] = useState<RepoInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const filteredRepos = useFilteredList(repos, searchTerm, (repo, term) =>
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

  console.log("repos", repos);
  return (
    <div className="flex flex-col space-y-20 p-4 md:p-12">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <BasicHeading heading={`Repositories in ${assignmentName}`} />
          <div className="flex space-x-4">
            <BasicSearchBar value={searchTerm} onChange={setSearchTerm} />
            <FilterButton buttonText="Sort By" items={["Recent", "Old"]} />
          </div>
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
