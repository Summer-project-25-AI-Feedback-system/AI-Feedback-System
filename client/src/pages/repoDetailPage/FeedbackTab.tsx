import Spinner from "../../components/Spinner";
import FeedbackCard from "./FeedbackCard";
import FeedbackActions from "./FeedbackActions";
import type { AssignmentFeedback } from "@shared/aiInterfaces";

interface FeedbackTabProps {
  isEditing: boolean;
  feedbackData: AssignmentFeedback;
  onFeedbackChange: (newText: string) => void;
  onGradeChange: (newGrade: string) => void;
  onToggleEdit: () => void;
  onDownload: () => void;
}

export default function FeedbackTab({
  isEditing,
  feedbackData,
  onFeedbackChange,
  onGradeChange,
  onToggleEdit,
  onDownload,
}: FeedbackTabProps) {
  if (!feedbackData) return <Spinner />;

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex-col space-y-4">
        <FeedbackActions
          isEditing={isEditing}
          onEditToggle={onToggleEdit}
          onDownload={onDownload}
        />
      </div>
      <FeedbackCard
        isEditing={isEditing}
        feedbackData={feedbackData}
        onFeedbackChange={onFeedbackChange}
        onGradeChange={onGradeChange}
      />
    </div>
  );
}
