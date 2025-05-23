import type { StudentSubmissionInfo } from "../../types/StudentSubmissionInfo";
import type {
  AssignmentInfo,
  OrgInfo,
  RepoInfo,
} from "@shared/githubInterfaces";

type ListItemProps =
  | { type: "org"; data: OrgInfo; onClick?: () => void }
  | { type: "assignment"; data: AssignmentInfo; onClick?: () => void }
  | { type: "repo"; data: RepoInfo; onClick?: () => void }
  | { type: "submission"; data: StudentSubmissionInfo; onClick?: () => void };

export default function ListItem(props: ListItemProps) {
  const commonClass =
    "h-[56px] px-4 gap-2 items-center text-sm hover:bg-gray-100 cursor-pointer border rounded border-[#D9D9D9] overflow-y-auto max-h-[calc(100vh-240px)]";

  let content;
  let className = "";

  switch (props.type) {
    case "org": {
      const org = props.data;
      className = `grid grid-cols-[40px_1fr_1fr] ${commonClass}`;
      content = (
        <>
          <img
            src={org.avatarUrl}
            alt={org.name}
            className="w-6 h-6 rounded-full"
          />
          <p className="text-left">{org.name}</p>
          <p className="text-left">{org.description || "No description"}</p>
        </>
      );
      break;
    }

    case "assignment": {
      const assignment = props.data;
      const assignmentName = assignment.name;
      const numberOfStudent = assignment.numberOfStudent;
      const updatedAt = new Date(assignment.updatedAt).toLocaleString();
      className = `grid grid-cols-[40px_1fr_1fr_1fr] ${commonClass}`;
      content = (
        <>
          <div className="w-6 h-6 rounded-full" />
          <p className="text-left">{assignmentName}</p>
          <p className="text-center">{numberOfStudent}</p>
          <p className="text-left">{updatedAt}</p>
        </>
      );
      break;
    }

    case "repo": {
      const repo = props.data;
      const avatar = repo.collaborators[0]?.avatarUrl || "";
      const students = repo.collaborators[0].name;
      const updatedAt = new Date(repo.updatedAt).toLocaleString();
      className = `grid grid-cols-[40px_1fr_1fr_1fr] ${commonClass}`;
      content = (
        <>
          <img src={avatar} alt="repo" className="w-6 h-6 rounded-full" />
          <p className="text-left">{repo.name}</p>
          <p className="text-center">{students}</p>
          <p className="text-left">{updatedAt}</p>
        </>
      );
      break;
    }

    case "submission": {
      const submission = props.data;
      className = `grid grid-cols-[40px_1fr_1fr_1fr_auto] ${commonClass} text-xs sm:text-sm`;
      content = (
        <>
          <img
            src={submission.studentProfilePicture}
            alt="student"
            className="w-6 h-6 rounded-full"
          />
          <p className="text-center">{submission.studentName}</p>
          <p className="text-center">{submission.submissionStatus}</p>
          <p className="text-center">{submission.currentGrade}</p>
        </>
      );
      break;
    }
  }

  return (
    <div className={className} onClick={props.onClick}>
      {content}
    </div>
  );
}
