import { useNavigate } from "react-router-dom";
import ListHeader from "./ListHeader";
import ListItem from "./ListItem";
import type { RepoInfo } from "../../types/RepoInfo";
import type { StudentSubmissionInfo } from "../../types/StudentSubmissionInfo";
import type { AssignmentInfo } from "../../../../server/shared/AssignmentInfo";
import type { OrgInfo } from "../../types/GitHubInfo";

type BasicListProps =
  | {
      orgList: OrgInfo[];
      assignmentList?: never;
      repoList?: never;
      specificRepoInfo?: never;
      orgName?: never;
      assignmentName?: never;
    }
  | {
      assignmentList: AssignmentInfo[];
      orgName: string;
      repoList?: never;
      specificRepoInfo?: never;
      assignmentName?: never;
    }
  | {
      repoList: RepoInfo[];
      orgName: string;
      assignmentName?: string;
      specificRepoInfo?: never;
    }
  | {
      specificRepoInfo: StudentSubmissionInfo[];
      orgName?: never;
      repoList?: never;
      assignmentName?: never;
    };

export default function BasicList(props: BasicListProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <ListHeader
        type={
          "orgList" in props
            ? "org"
            : "assignmentList" in props
            ? "assignment"
            : "repoList" in props
            ? "repo"
            : "submission"
        }
      />
      {"orgList" in props &&
        props.orgList.map((org, index) => (
          <ListItem
            key={`org-${index}`}
            orgInfo={org}
            onClick={() => navigate(`/orgs/${org.name}/assignments`)}
          />
        ))}

      {"assignmentList" in props &&
        props.assignmentList?.map((assignment, index) => (
          <ListItem
            key={`assignment-${index}`}
            assignmentInfo={assignment}
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
            onClick={() =>
              navigate(
                `/orgs/${props.orgName}/assignments/${props.assignmentName}/${repo.id}`
              )
            }
          />
        ))}

      {"specificRepoInfo" in props &&
        props.specificRepoInfo?.map((submission, index) => (
          <ListItem key={`submission-${index}`} specificRepoInfo={submission} />
        ))}
    </div>
  );
}
