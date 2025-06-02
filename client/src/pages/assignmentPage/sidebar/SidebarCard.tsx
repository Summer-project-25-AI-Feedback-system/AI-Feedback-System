import ProgressBar from './ProgressBar';

interface SidebarCardProps {
  name: string;
  progressOfAcceptedAssignments: number;
  progressOfSubmittedAssignments: number;
}

export default function SidebarCard({name, progressOfAcceptedAssignments, progressOfSubmittedAssignments }: SidebarCardProps) {
  return (
    <div className="border border-[#D9D9D9] rounded p-3 mb-2 space-y-2">
        <h3 className="font-semibold text-gray-700">{name}</h3>
                  
        <div className="flex flex-col gap-1">
            <span>Assignments Accepted</span>
            <ProgressBar progress={progressOfAcceptedAssignments} />
        </div>
    
        <div className="flex flex-col gap-1">
            <span>Assignments Submitted</span>
            <ProgressBar progress={progressOfSubmittedAssignments} />
        </div>
    </div>
  )
}
