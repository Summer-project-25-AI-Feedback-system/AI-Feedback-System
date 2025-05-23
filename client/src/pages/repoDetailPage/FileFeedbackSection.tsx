interface Props {
  fileName: string;
  issues: { id: number; line?: number; text: string }[];
  expanded: boolean;
  onToggle: () => void;
}

export default function FileFeedbackSection({
  fileName,
  issues,
  expanded,
  onToggle,
}: Props) {
  return (
    <div className="border p-2 rounded">
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 font-medium w-full text-left"
      >
        <span
          className={`transform transition-transform ${
            expanded ? "rotate-90" : ""
          }`}
        >
          ▶
        </span>
        <span>
          {fileName} ({issues.length} issues)
        </span>
      </button>
      {expanded && (
        <ul className="list-disc list-inside mt-2">
          {issues.map((issue) => (
            <li key={issue.id} className="text-sm">
              {issue.line ? `Line ${issue.line}: ` : ""}
              {issue.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
