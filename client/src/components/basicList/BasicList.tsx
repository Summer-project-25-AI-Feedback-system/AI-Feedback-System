import { useNavigate } from "react-router-dom";
import ListHeader from "./ListHeader";
import ListItem from "./ListItem";
import type { RepoInfo } from "../../types/RepoInfo";
import type { StudentSubmissionInfo } from "../../types/StudentSubmissionInfo";
import type { AssignmentInfo } from "../../../../server/shared/AssignmentInfo";

type BasicListProps =
  | {
      assignmentList: AssignmentInfo[];
      orgName: string;
      repoList?: never;
      specificRepoInfo?: never;
    }
  | { repoList: RepoInfo[]; orgName: string; specificRepoInfo?: never }
  | {
      specificRepoInfo: StudentSubmissionInfo[];
      orgName?: never;
      repoList?: never;
    };

export default function BasicList(props: BasicListProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <ListHeader
        type={
          "assignmentList" in props
            ? "assignment"
            : "repoList" in props
            ? "repo"
            : "submission"
        }
      />
      {"assignmentList" in props &&
        props.assignmentList?.map((assignment, index) => (
          <ListItem
            key={`assignment-${index}`}
            assignmentName={assignment.name}
            onClick={() =>
              navigate(
                `/orgs/${props.orgName}/assignments/${encodeURIComponent(
                  assignment.name
                )}`
              )
            }
          />
        ))}

      {"repoList" in props &&
        props.repoList?.map((repo, index) => (
          <ListItem
            key={`repo-${index}`}
            repoInfo={repo}
            onClick={() => navigate(`/orgs/${props.orgName}/repos/${repo.id}`)}
          />
        ))}

      {"specificRepoInfo" in props &&
        props.specificRepoInfo?.map((submission, index) => (
          <ListItem key={`submission-${index}`} specificRepoInfo={submission} />
        ))}
    </div>
  );
}
