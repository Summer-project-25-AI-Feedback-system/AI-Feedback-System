import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import CommonIssuesCard from "./CommonIssuesCard";
import type { SingleAssignmentFeedback } from "src/types/AssignmentFeedback";
import CommonIssuesChart from "./CommonIssuesChart";

type CommonIssuesCollapsibleProps = {
  assignment: SingleAssignmentFeedback;
};

export default function CommonIssuesCollapsible({ assignment }: CommonIssuesCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
     <div className="border-b border-[#D9D9D9]">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex justify-between items-center text-left font-semibold text-gray-700 p-3 text-lg"
      >
        <span>{assignment.assignmentName}</span>
        {isOpen ? <FaChevronUp size={15} /> : <FaChevronDown size={15} />}
      </button>

      {isOpen && (
        <div>
            <CommonIssuesCard assignment={assignment} />
            <CommonIssuesChart assignment={assignment}/>
        </div>
      )}
    </div>
  )
}
