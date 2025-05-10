import BasicHeading from "../../components/BasicHeading";
import BasicList from "../../components/basicList/BasicList";
import FilterButton from "../../components/FilterButton";
import BasicSearchBar from "./BasicSearchBar";
import type { RepoInfo } from "../../types/RepoInfo";

// delete mock data once data from backend is retrieved
const mockRepoList: RepoInfo[] = [
  {
    repoPicture: "aa",
    name: "Algebra Repo",
    amountOfStudents: "23",
    timeOfLastUpdate: "2 hours ago",
  },
  {
    repoPicture: "aa",
    name: "Biology Repo",
    amountOfStudents: "18",
    timeOfLastUpdate: "Yesterday",
  },
  {
    repoPicture: "aa",
    name: "History Repo",
    amountOfStudents: "30",
    timeOfLastUpdate: "3 days ago",
  },
];

export default function RepositoryListPage() {
  return (
    <div className="flex flex-col space-y-20 m-2">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <BasicHeading heading="Your Classroom Repositories"></BasicHeading>
          <div>
            <FilterButton buttonText="Sort By" items={["Recent", "Old"]}></FilterButton>
          </div>
        </div>
        <BasicSearchBar />
      </div>
      <BasicList repoList={mockRepoList}/> 
    </div>
  )
}