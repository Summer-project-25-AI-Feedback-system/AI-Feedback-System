import { useNavigate } from "react-router-dom";
import ProgressBar from './ProgressBar';
import type { EnrichedAssignmentClassroomInfo } from "src/types/EnrichedAssignmentClassroomInfo";

interface SidebarCardProps {
  assignment: EnrichedAssignmentClassroomInfo;
  linkTo: string;
}

export default function SidebarCard({assignment, linkTo }: SidebarCardProps) {
  const {
    name,
    accepted,
    submitted,
    totalStudents,
    deadline
  } = assignment;

  const navigate = useNavigate();
  const now = new Date();
  const hasDeadlinePassed = deadline !== null ? deadline.getTime() < now.getTime() : false;

  const deadlineInfo = () => {
    if (!deadline) return "No deadline";
    const diff = deadline.getTime() - now.getTime();
    if (diff > 0) {
      return `Deadline: ${deadline.toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'})}`;
    } else {
      const msAgo = now.getTime() - deadline.getTime();
      const daysAgo = Math.floor(msAgo / (1000 * 60 * 60 * 24));
      if (daysAgo < 1) {
        const hoursAgo = Math.floor(msAgo / (1000 * 60 * 60));
        if (hoursAgo < 1) {
          const minutesAgo = Math.floor(msAgo / (1000 * 60));
          return `Deadline passed ${minutesAgo} minute${minutesAgo !== 1 ? 's' : ''} ago`;
        }
        return `Deadline passed ${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`;
      }
      return `Deadline passed ${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
    }
  };

  const progressOfAcceptedAssignments = totalStudents > 0
    ? Math.round((accepted / totalStudents) * 100)
    : 0;
  
  const progressOfSubmittedAssignments = totalStudents > 0
    ? Math.round((submitted / totalStudents) * 100)
    : 0;

  return (
    <div onClick={() => navigate(linkTo)} className="border border-[#D9D9D9] rounded p-3 mb-2 space-y-2 cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition-colors">
      <div>
        <h3 className="font-semibold text-gray-700">{name}</h3>
        <p className={`text-sm ${hasDeadlinePassed && progressOfSubmittedAssignments < 100? 'text-red-600 font-medium' : 'text-gray-600'}`}>{deadlineInfo()}</p>
      </div>           
      <div className="flex flex-col gap-1">
        <span className="text-sm">Assignments Accepted</span>
        <ProgressBar progress={progressOfAcceptedAssignments} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm">Assignments Submitted</span>
        <ProgressBar progress={progressOfSubmittedAssignments} />
      </div>
    </div>
  )
}
