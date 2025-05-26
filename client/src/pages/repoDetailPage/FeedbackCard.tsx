import { useState } from "react";
import type { AssignmentFeedback } from "@shared/aiInterfaces";
import FileFeedbackSection from "./FileFeedbackSection";

interface FeedbackCardProps {
  isEditing: boolean;
  feedbackData: AssignmentFeedback;
  onFeedbackChange: (newText: string) => void;
  onGradeChange: (newGrade: string) => void;
}

export default function FeedbackCard({
  isEditing,
  feedbackData,
  onFeedbackChange,
  onGradeChange,
}: FeedbackCardProps) {
  const [expanded, setExpanded] = useState(true);
  const [fileExpanded, setFileExpanded] = useState<Record<string, boolean>>({});

  const toggleFile = (fileName: string) => {
    setFileExpanded((prev) => ({
      ...prev,
      [fileName]: !prev[fileName],
    }));
  };

  const totalIssues = feedbackData.feedbackByFile.reduce(
    (acc, file) => acc + file.issues.length,
    0
  );

  return (
    <div className="flex flex-col space-y-2 p-4 border rounded-md">
      <h2 className="text-lg font-semibold text-center">AI Feedback</h2>

      {/* Grade */}
      <div className="flex items-center space-x-4">
        <label className="font-semibold">Grade:</label>
        {isEditing ? (
          <select
            className="border rounded px-2 py-1"
            value={feedbackData.grade}
            onChange={(e) => onGradeChange(e.target.value)}
          >
            {["5", "4", "3", "2", "1"].map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        ) : (
          <span>{feedbackData.grade}</span>
        )}
      </div>

      {/* Overall Feedback */}
      <div>
        <label className="font-semibold">Overall Feedback:</label>
        {isEditing ? (
          <textarea
            className="w-full p-2 border rounded mt-1 resize-y min-h-[100px]"
            value={feedbackData.feedback}
            onChange={(e) => onFeedbackChange(e.target.value)}
          />
        ) : (
          <p className="text-sm whitespace-pre-wrap mt-1">
            {feedbackData.feedback}
          </p>
        )}
      </div>

      {/* Collapsible Issues Section */}
      <div className="mt-2 space-y-4">
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="flex items-center space-x-2 font-semibold focus:outline-none"
        >
          <span
            className={`transform transition-transform duration-200 ${
              expanded ? "rotate-90" : ""
            }`}
          >
            ▶
          </span>
          <span>Issues ({totalIssues})</span>
        </button>

        {expanded && (
          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
            {feedbackData.feedbackByFile.map((file) => (
              <FileFeedbackSection
                key={file.fileName}
                fileName={file.fileName}
                issues={file.issues}
                expanded={!!fileExpanded[file.fileName]}
                onToggle={() => toggleFile(file.fileName)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
