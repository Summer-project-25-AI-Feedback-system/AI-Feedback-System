import type { RepoInfo } from "../../types/RepoInfo";
import type { StudentSubmissionInfo } from "../../types/StudentSubmissionInfo";
import type { AssignmentInfo } from "../../types/GitHubInfo";

type ListItemProps =
  | {
      assignmentInfo: AssignmentInfo;
      onClick?: () => void;
      repoInfo?: never;
      specificRepoInfo?: never;
    }
  | {
      repoInfo: RepoInfo;
      onClick?: () => void;
      assignmentName?: never;
      specificRepoInfo?: never;
    }
  | {
      specificRepoInfo: StudentSubmissionInfo;
      onClick?: () => void;
      assignmentName?: never;
      repoInfo?: never;
    };

export default function ListItem(props: ListItemProps) {
  return (
    <div
      onClick={"onClick" in props ? props.onClick : undefined}
      className="grid grid-cols-[40px_1fr_1fr_1fr_auto] h-[56px] w-full items-center border-b border-l border-r border-[#D9D9D9] text-xs sm:text-sm px-4 gap-4 hover:bg-gray-100 cursor-pointer"
    >
      {"assignmentInfo" in props && (
        <>
          <div className="w-6 h-6" />
          <p className="text-center">{props.assignmentInfo.name}</p>
          <p className="text-center">{props.assignmentInfo.submissionCount}</p>
          <p className="text-center">{props.assignmentInfo.lastUpdated}</p>
        </>
      )}

      {"repoInfo" in props && (
        <>
          <img
            src={props.repoInfo?.studentAvatar}
            alt="repo"
            className="w-6 h-6 rounded-full"
          />
          <p className="text-center">{props.repoInfo?.name}</p>
          <p className="text-center">{props.repoInfo?.amountOfStudents}</p>
          <p className="text-center">{props.repoInfo?.timeOfLastUpdate}</p>
        </>
      )}
      {"specificRepoInfo" in props && (
        <>
          <img
            src={props.specificRepoInfo?.studentProfilePicture}
            alt="student"
            className="w-6 h-6 rounded-full"
          />
          <p className="text-center">{props.specificRepoInfo?.studentName}</p>
          <p className="text-center">
            {props.specificRepoInfo?.submissionStatus}
          </p>
          <p className="text-center">{props.specificRepoInfo?.currentGrade}</p>
        </>
      )}
    </div>
  );
}
