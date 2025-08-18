import type { StudentSubmissionInfo } from "../../types/StudentSubmissionInfo";
import type { AssignmentInfo, RepoInfo } from "@shared/githubInterfaces";
import type { OrganizationInput } from "@shared/supabaseInterfaces";

type ListItemProps =
  | {
      type: "org";
      data: OrganizationInput;
      onClick?: () => void;
      onUpdateSubmissionLimit?: (orgId: string, limit: number) => Promise<void>;
    }
  | { type: "assignment"; data: AssignmentInfo; onClick?: () => void }
  | { type: "repo"; data: RepoInfo; onClick?: () => void }
  | { type: "submission"; data: StudentSubmissionInfo; onClick?: () => void };

export default function ListItem(props: ListItemProps) {
  const commonClass =
    "h-[56px] px-4 gap-2 items-center text-sm hover:bg-gray-100 cursor-pointer border rounded border-[#D9D9D9] overflow-y-auto max-h-[calc(100vh-240px)]";

  let content;
  let className = "";

  const handleLimitChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    // ✅ Stop the event from propagating to the parent div
    e.stopPropagation();

    // Only proceed if the item is an organization and has a valid ID
    if (
      props.type === "org" &&
      props.data.id &&
      props.onUpdateSubmissionLimit
    ) {
      const newLimit = Number(e.target.value);
      await props.onUpdateSubmissionLimit(props.data.id, newLimit);
    }
  };

  switch (props.type) {
    case "org": {
      // console.log("orgs props.data in listItems:", props.data);
      const org = props.data;
      className = `grid grid-cols-[40px_1fr_1fr_1fr] ${commonClass}`;
      content = (
        <>
          <img
            src={org.avatar_url}
            alt={org.name}
            className="w-6 h-6 rounded-full"
          />

          <p className="text-left">{org.name}</p>
          <select
            value={org.submission_limit ?? 2}
            onChange={handleLimitChange}
            className="border rounded p-1"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
          <p className="text-left">{org.description || "No description"}</p>
        </>
      );
      break;
    }

    case "assignment": {
      console.log("assignment props.data in listItems:", props.data);
      const assignment = props.data;
      const assignmentName = assignment.name;
      const amountOfStudents = assignment.amountOfStudents;
      const updatedAt = new Date(assignment.updatedAt).toLocaleString();
      className = `grid grid-cols-[40px_1fr_1fr_1fr] ${commonClass}`;
      content = (
        <>
          <div className="w-6 h-6 rounded-full" />
          <p className="text-left">{assignmentName}</p>
          <p className="text-center">{amountOfStudents}</p>
          <p className="text-left">{updatedAt}</p>
        </>
      );
      break;
    }

    case "repo": {
      const repo = props.data;
      const firstCollaborator = repo.collaborators?.[0];
      const avatar = firstCollaborator?.avatarUrl || "";
      const students = firstCollaborator?.name || "N/A";
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
