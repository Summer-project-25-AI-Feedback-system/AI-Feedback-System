import type { StudentSubmissionInfo } from "../../types/StudentSubmissionInfo";
import type {
  AssignmentInfo,
  OrgInfo,
  RepoInfo,
} from "@shared/githubInterfaces";
import type { JSX } from "react";

type ListItemProps =
  | {
      orgInfo: OrgInfo;
      onClick?: () => void;
      assignmentInfo?: never;
      repoInfo?: never;
      specificRepoInfo?: never;
    }
  | {
      assignmentInfo: AssignmentInfo;
      onClick?: () => void;
      orgInfo?: never;
      repoInfo?: never;
      specificRepoInfo?: never;
    }
  | {
      repoInfo: RepoInfo;
      onClick?: () => void;
      orgInfo?: never;
      assignmentName?: never;
      specificRepoInfo?: never;
    }
  | {
      specificRepoInfo: StudentSubmissionInfo;
      onClick?: () => void;
      orgInfo?: never;
      assignmentName?: never;
      repoInfo?: never;
    };

export default function ListItem(props: ListItemProps) {
  let content: JSX.Element[] = [];
  let className = "";

  if ("orgInfo" in props) {
    className =
      "grid grid-cols-[40px_1fr_1fr] h-[56px] px-4 gap-2 items-center text-sm hover:bg-gray-100 cursor-pointer overflow-y-auto max-h-[calc(100vh-240px)] border rounded border-b border-l border-r border-[#D9D9D9]";
    content = [
      <img
        key="img"
        src={props.orgInfo?.avatarUrl}
        alt={props.orgInfo?.name}
        className="w-6 h-6 rounded-full"
      />,
      <p key="name" className="text-left">
        {props.orgInfo?.name}
      </p>,
      <p key="desc" className="text-left">
        {props.orgInfo?.description || "No description"}
      </p>,
    ];
  } else if ("assignmentInfo" in props) {
    className =
      "grid grid-cols-[40px_1fr_1fr_1fr] h-[56px] px-4 gap-2 items-center text-sm border-b border-l border-r border-[#D9D9D9] hover:bg-gray-100 cursor-pointer";
    content = [
      <div key="icon" className="w-6 h-6" />,
      <p key="name" className="text-center">
        {props.assignmentInfo.name}
      </p>,
      <p key="count" className="text-center">
        {props.assignmentInfo.submissionCount}
      </p>,
      <p key="date" className="text-center">
        {props.assignmentInfo.lastUpdated}
      </p>,
    ];
  } else if ("repoInfo" in props && props.repoInfo) {
    const { name, collaborators, updatedAt } = props.repoInfo;
    const studentAvatar = collaborators[0]?.avatarUrl ?? "";
    const amountOfStudents = collaborators.length;
    const timeOfLastUpdate = new Date(updatedAt).toLocaleString();
    className =
      "grid grid-cols-[40px_1fr_1fr_1fr] h-[56px] px-4 gap-2 items-center text-sm border-b border-l border-r border-[#D9D9D9] hover:bg-gray-100 cursor-pointer";
    content = [
      <img
        key="img"
        src={studentAvatar}
        alt="repo"
        className="w-6 h-6 rounded-full"
      />,
      <p key="name" className="text-left">
        {name}
      </p>,
      <p key="students" className="text-center">
        {amountOfStudents}
      </p>,
      <p key="update" className="text-left">
        {timeOfLastUpdate}
      </p>,
    ];
  } else if ("specificRepoInfo" in props) {
    className =
      "grid grid-cols-[40px_1fr_1fr_1fr_auto] h-[56px] px-4 gap-4 items-center text-xs sm:text-sm border-b border-l border-r border-[#D9D9D9] hover:bg-gray-100 cursor-pointer";
    content = [
      <img
        key="img"
        src={props.specificRepoInfo.studentProfilePicture}
        alt="student"
        className="w-6 h-6 rounded-full"
      />,
      <p key="name" className="text-center">
        {props.specificRepoInfo.studentName}
      </p>,
      <p key="status" className="text-center">
        {props.specificRepoInfo.submissionStatus}
      </p>,
      <p key="grade" className="text-center">
        {props.specificRepoInfo.currentGrade}
      </p>,
    ];
  }

  return (
    <div
      onClick={"onClick" in props ? props.onClick : undefined}
      className={className}
    >
      {content}
    </div>
  );
}
