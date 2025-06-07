import { useNavigate } from "react-router-dom";
import ProgressBar from './ProgressBar';

interface SidebarCardProps {
  name: string;
  progressOfAcceptedAssignments: number;
  progressOfSubmittedAssignments: number;
  assignmentDeadline: Date;
  linkTo: string;
}

export default function SidebarCard({name, progressOfAcceptedAssignments, progressOfSubmittedAssignments, assignmentDeadline, linkTo }: SidebarCardProps) {
  const navigate = useNavigate();
  const now = new Date();
  const hasDeadlinePassed = assignmentDeadline.getTime() < now.getTime();

  const deadlineInfo = () => {
    const diff = assignmentDeadline.getTime() - now.getTime();
    if (diff > 0) {
      return `Deadline: ${assignmentDeadline.toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'})}`;
    } else {
      const msAgo = now.getTime() - assignmentDeadline.getTime();
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

  return (
    <div onClick={() => navigate(linkTo)} className="border border-[#D9D9D9] rounded p-3 mb-2 space-y-2 cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition-colors">
      <div>
        <h3 className="font-semibold text-gray-700">{name}</h3>
        <text className={`text-sm ${hasDeadlinePassed && progressOfSubmittedAssignments < 100? 'text-red-600 font-medium' : 'text-gray-600'}`}>{deadlineInfo()}</text>
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
