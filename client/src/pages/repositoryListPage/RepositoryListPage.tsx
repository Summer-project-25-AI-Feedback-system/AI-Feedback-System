import BasicHeading from "../../components/BasicHeading";
import BasicList from "../../components/basicList/BasicList";
import FilterButton from "../../components/FilterButton";
import BasicSearchBar from "./BasicSearchBar";
import type { RepoInfo } from "../../types/RepoInfo";
import { useEffect, useState } from "react";
import { useGitHub } from "../../context/useGitHub";
import type { Repo } from "../../types/GitHubInfo";
import { useParams } from "react-router-dom";

// // delete mock data once data from backend is retrieved
// const mockRepoList: RepoInfo[] = [
//   {
//     repoPicture: "aa",
//     name: "Algebra Repo",
//     amountOfStudents: "23",
//     timeOfLastUpdate: "2 hours ago",
//   },
//   {
//     repoPicture: "aa",
//     name: "Biology Repo",
//     amountOfStudents: "18",
//     timeOfLastUpdate: "Yesterday",
//   },
//   {
//     repoPicture: "aa",
//     name: "History Repo",
//     amountOfStudents: "30",
//     timeOfLastUpdate: "3 days ago",
//   },
// ];

const mapToRepoInfo = (repo: Repo): RepoInfo => ({
  id: "",
  name: repo.name,
  repoPicture: repo.owner.avatar_url,
  amountOfStudents: "N/A", // You can fill this in once backend adds it
  timeOfLastUpdate: new Date(repo.updated_at).toLocaleString(),
});

export default function RepositoryListPage() {
  const { orgLogin } = useParams<{ orgLogin: string }>();
  const github = useGitHub();
  const [repos, setRepos] = useState<RepoInfo[]>([]);

  useEffect(() => {
    if (orgLogin) {
      github
        .getStudentRepos(orgLogin)
        .then((data) => {
          const mapped = data.map(mapToRepoInfo);
          setRepos(mapped);
        })
        .catch(console.error);
    }
  }, [orgLogin, github]);

  return (
    <div className="flex flex-col space-y-20 p-4 md:p-12">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <BasicHeading heading="Your Classroom Repositories"></BasicHeading>
          <div className="flex space-x-4">
            <FilterButton buttonText="Sort By" items={["Recent", "Old"]} />
          </div>
        </div>
        <BasicSearchBar />
      </div>
      <BasicList repoList={repos} />
    </div>
  );
}
