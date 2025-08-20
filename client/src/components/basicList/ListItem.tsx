import type { StudentSubmissionInfo } from "../../types/StudentSubmissionInfo";
import type { AssignmentInfo, RepoInfo } from "@shared/githubInterfaces";
import type { OrganizationInput } from "@shared/supabaseInterfaces";
import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
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
  const [isEditing, setIsEditing] = useState(false);
  const [newLimit, setNewLimit] = useState(
    (props.type === "org" ? props.data.submission_limit : 2) ?? 2
  );

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      props.type === "org" &&
      props.data.external_github_org_id &&
      props.onUpdateSubmissionLimit
    ) {
      try {
        await props.onUpdateSubmissionLimit(
          props.data.external_github_org_id.toString(),
          newLimit
        );
        setIsEditing(false); // Switch back to display mode on success
      } catch (error) {
        console.error("Failed to update submission limit:", error);
        // Handle error, maybe show an alert to the user
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLimit(Number(e.target.value));
  };

  switch (props.type) {
    case "org": {
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

          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <input
                  type="number"
                  value={newLimit}
                  onChange={handleInputChange}
                  onClick={(e) => e.stopPropagation()}
                  className="border rounded p-1 w-16"
                  min="1"
                />
                <button
                  onClick={handleSave}
                  className="text-gray-600 hover:text-green-500"
                >
                  <FaCheck />
                </button>
              </>
            ) : (
              <>
                <p className="text-left">{org.submission_limit ?? 2}</p>
                <button
                  onClick={handleEdit}
                  className="text-gray-600 hover:text-blue-500"
                >
                  <FaPencilAlt />
                </button>
              </>
            )}
          </div>
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
