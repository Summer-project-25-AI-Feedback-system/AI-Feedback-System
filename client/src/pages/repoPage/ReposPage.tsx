import BasicHeading from "../../components/BasicHeading";
import BasicList from "../../components/basicList/BasicList";
import BasicSearchBar from "../../components/BasicSearchBar";
import type { RepoInfo } from "@shared/githubInterfaces";
import { useEffect, useState } from "react";
import { useGitHub } from "../../context/useGitHub";
import { useParams, useNavigate } from "react-router-dom";
import { useFilteredList } from "../../hooks/useFilteredList";
import BackButton from "../../components/BackButton";
import BasicButton from "../../components/BasicButton";
import { sortData } from "../../utils/sortingUtils";
import type { SortOption } from "../../utils/sortingUtils";
import Spinner from "../../components/Spinner";

export default function ReposPage() {
  const { orgName, assignmentName } = useParams<{
    orgName: string;
    assignmentName: string;
  }>();
  const github = useGitHub();
  const navigate = useNavigate();
  const [repos, setRepos] = useState<RepoInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOption>("Newest");

  const filteredRepos = useFilteredList(repos ?? [], searchTerm, (repo, term) =>
    repo.name.toLowerCase().includes(term.toLowerCase())
  );

  const sortedRepos = sortData(filteredRepos, sortOrder);

  useEffect(() => {
    if (orgName) {
      github
        .getRepos(orgName, assignmentName)
        .then(setRepos)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [orgName, assignmentName, github]);

  const handleClick = (name: string) => {
    switch (name) {
      case "Force Evaluation":
        navigate("/force-evaluation");
        break;
      case "Prompt Editor":
        navigate("/prompt");
        break;
    }
  };

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
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4">
          <BasicButton
            onClick={() => handleClick("Prompt Editor")}
            text="Edit Evaluation Prompt"
          />
          <BasicButton
            onClick={() => handleClick("Force Evaluation")}
            text="Go to Evaluation"
          />
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <BasicList
          type="repo"
          items={sortedRepos}
          orgName={orgName!}
          assignmentName={assignmentName!}
          isLoading={loading}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
      )}
    </div>
  );
}
