import BasicButton from "../../components/BasicButton";

interface Props {
  isEditing: boolean;
  onEditToggle: () => void;
  onDownload: () => void;
}

export default function FeedbackActions({
  isEditing,
  onEditToggle,
  onDownload,
}: Props) {
  return (
    <div className="flex justify-end space-x-2">
      <BasicButton onClick={onDownload} text="Download Feedback PDF" />
      <BasicButton
        onClick={onEditToggle}
        text={isEditing ? "Save Changes" : "Edit Feedback & Grade"}
      />
    </div>
  );
}
