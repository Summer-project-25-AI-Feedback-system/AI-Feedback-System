import { useNavigate } from "react-router-dom";
import ListHeader from "./ListHeader";
import ListItem from "./ListItem";
import type { RepoInfo } from "../../types/RepoInfo";
import type { StudentSubmissionInfo } from "../../types/StudentSubmissionInfo"

type BasicListProps =
  | { repoList: RepoInfo[]; specificRepoInfo?: never }
  | { specificRepoInfo: StudentSubmissionInfo[]; repoList?: never };

export default function BasicList({ repoList, specificRepoInfo }: BasicListProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
        <ListHeader type={repoList ? "repo" : "submission"} />
        {repoList && repoList.map((repo, index) => (
          <ListItem key={`repo-${index}`} repoInfo={repo} onClick={() => navigate(`/repos/${repo.id}`)}/>
        ))}
        {specificRepoInfo && specificRepoInfo.map((submission, index) => (
          <ListItem key={`submission-${index}`} specificRepoInfo={submission} onClick={() => navigate(`/repos/${submission.id}/${submission.id}`)}/>
        ))}
    </div>
  )
}
