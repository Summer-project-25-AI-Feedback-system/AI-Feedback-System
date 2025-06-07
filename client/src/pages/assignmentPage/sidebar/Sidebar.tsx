import { useState } from 'react';
import { useParams } from 'react-router-dom';
import SidebarButton from './SidebarButton';
import SidebarCard from './SidebarCard';
import SidebarPagination from './SidebarPagination';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { orgName } = useParams<{ orgName: string }>();

  const assignments = ["Assignment 1", "Assignment 2", "Assignment 3", "Assignment 4", "Assignment 5", "Assignment 6"]

  const totalPages = Math.ceil(assignments.length / 3);
  const startIndex = (currentPage - 1) * 3;
  const currentAssignments = assignments.slice(startIndex, startIndex + 3);

  return (
    <>
      <SidebarButton isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}/>
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-white p-4 md:pt-12 md:pl-12 transform transition-transform duration-300 z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}
      >
        <h2 className="text-xl font-bold mb-4">Classroom Info</h2>
        {currentAssignments.map((assignmentName) => (
          <SidebarCard 
            key={assignmentName}
            name={assignmentName}
            progressOfAcceptedAssignments={90}
            progressOfSubmittedAssignments={10}
            assignmentDeadline={new Date('2025-04-02T23:59:59Z')}
            linkTo={`/orgs/${orgName}/analytics?tab=missing-submissions&assignment=${encodeURIComponent(assignmentName)}`}
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