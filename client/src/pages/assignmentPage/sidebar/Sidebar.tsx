import { useState } from 'react';
import { useParams } from 'react-router-dom';
import SidebarButton from './SidebarButton';
import SidebarCard from './SidebarCard';
import SidebarPagination from './SidebarPagination';
import type { EnrichedAssignmentClassroomInfo } from 'src/types/EnrichedAssignmentClassroomInfo';

interface SidebarProps {
  assignments: EnrichedAssignmentClassroomInfo[];
} 

export default function Sidebar({ assignments } : SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { orgName } = useParams<{ orgName: string }>();

  const sortedAssignments = [...assignments].sort((a, b) => {
    const now = new Date();
    const getRank = (assignment: EnrichedAssignmentClassroomInfo) => {
      if (!assignment.deadline) return 2; // Lowest priority (No deadline)
      const isOverdue = assignment.deadline <= now;
      const isComplete = assignment.submitted >= assignment.totalStudents;
      if (isOverdue && !isComplete) return 0; // Highest priority 
      if (!isOverdue && !isComplete) return 1; // Second priority
      return 2; // Lowest priority (Completed)
    };
    const rankA = getRank(a);
    const rankB = getRank(b);
    if (rankA !== rankB) return rankA - rankB; 
    if (!a.deadline && !b.deadline) return 0;
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return a.deadline.getTime() - b.deadline.getTime();
  });

  const totalPages = Math.ceil(assignments.length / 3);
  const startIndex = (currentPage - 1) * 3;
  const currentAssignments = sortedAssignments.slice(startIndex, startIndex + 3);

  return (
    <>
      <SidebarButton isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}/>
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-white p-4 md:pt-12 md:pl-12 transform transition-transform duration-300 z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}
      >
        <h2 className="text-xl font-bold mb-4">Classroom Info</h2>
        {currentAssignments.map((assignment) => (
          <SidebarCard 
            key={assignment.name}
            assignment={assignment}
            linkTo={`/orgs/${orgName}/analytics?tab=missing-submissions&assignment=${encodeURIComponent(assignment.name)}`}
          />
        ))}
        <SidebarPagination 
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}