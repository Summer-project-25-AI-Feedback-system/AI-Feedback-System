import { useState } from 'react';
import { BiMenu, BiX } from 'react-icons/bi';
import ProgressBar from './ProgressBar';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const assignments = ["Assignment 1", "Assignment 2", "Assignment 3", "Assignment 4", "Assignment 5", "Assignment 6"]

  const totalPages = Math.ceil(assignments.length / 3);
  const startIndex = (currentPage - 1) * 3;
  const currentAssignments = assignments.slice(startIndex, startIndex + 3);

  return (
    <>
      <button
        className="md:hidden p-4"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <BiX size={24} /> : <BiMenu size={24} />}
      </button>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white p-4 md:pt-12 md:pl-12 transform transition-transform duration-300 z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}
      >
        <h2 className="text-xl font-bold mb-4">Classroom Info</h2>
        <div className="text-sm">
          {currentAssignments.map((assignmentName) => (
            <div key={assignmentName} className="border border-[#D9D9D9] rounded p-3 mb-2 space-y-2">
              <h3 className="font-semibold text-gray-700">{assignmentName}</h3>
              
              <div className="flex flex-col gap-1">
                <span>Assignments Accepted</span>
                <ProgressBar progress={90} />
              </div>

              <div className="flex flex-col gap-1">
                <span>Assignments Submitted</span>
                <ProgressBar progress={10} />
              </div>
            </div>
          ))}
        </div>
        {/* numbers for pages here to show different assignments depending on what number is pressed*/}
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded text-sm font-medium border ${
                currentPage === index + 1
                  ? 'bg-black text-white'
                  : 'bg-white text-black border-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
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