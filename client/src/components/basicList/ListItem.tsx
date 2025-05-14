import type { RepoInfo } from "../../types/RepoInfo";
import type { StudentSubmissionInfo } from "../../types/StudentSubmissionInfo";

type ListItemProps =
  | { repoInfo: RepoInfo; onClick?: () => void; specificRepoInfo?: never }
  | {
      specificRepoInfo: StudentSubmissionInfo;
      onClick?: () => void;
      repoInfo?: never;
    };

export default function ListItem({
  repoInfo,
  specificRepoInfo,
  onClick,
}: ListItemProps) {
  return (
    <div
      onClick={onClick}
      className="grid grid-cols-[40px_1fr_1fr_1fr_auto] h-[56px] w-full items-center border-b border-l border-r border-[#D9D9D9] text-xs sm:text-sm px-4 gap-4 hover:bg-gray-100 cursor-pointer"
    >
      {repoInfo && (
        <>
          <img
            src={repoInfo.studentAvatar}
            alt="repo"
            className="w-6 h-6 rounded-full"
          />
          <p className="text-center">{repoInfo.name}</p>
          <p className="text-center">{repoInfo.amountOfStudents}</p>
          <p className="text-center">{repoInfo.timeOfLastUpdate}</p>
        </>
      )}
      {specificRepoInfo && (
        <>
          <img
            src={specificRepoInfo.studentProfilePicture}
            alt="student"
            className="w-6 h-6 rounded-full"
          />
          <p className="text-center">{specificRepoInfo.studentName}</p>
          <p className="text-center">{specificRepoInfo.submissionStatus}</p>
          <p className="text-center">{specificRepoInfo.currentGrade}</p>
        </>
      )}
    </div>
  );
}
