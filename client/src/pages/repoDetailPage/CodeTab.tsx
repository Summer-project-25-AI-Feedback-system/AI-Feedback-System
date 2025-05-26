import Spinner from "../../components/Spinner";

interface CodeTabProps {
  files: string[];
  selectedFile: string | null;
  content: string | null;
  onSelectFile: (file: string) => void;
}

export default function CodeTab({
  files,
  selectedFile,
  content,
  onSelectFile,
}: CodeTabProps) {
  if (!files.length) return <Spinner />;

  return (
    <div className="flex">
      <div className="w-1/3 border-r p-4">
        <h3 className="font-semibold mb-2">Files</h3>
        <div className="space-y-1">
          {files.map((file) => (
            <div
              key={file}
              onClick={() => onSelectFile(file)}
              className={`p-2 cursor-pointer rounded hover:bg-gray-100 ${
                selectedFile === file ? "bg-blue-50" : ""
              }`}
            >
              {file}
            </div>
          ))}
        </div>
      </div>
      <div className="w-2/3 p-4">
        {selectedFile ? (
          content ? (
            <pre className="bg-gray-50 p-4 rounded overflow-auto max-h-96">
              <code>{content}</code>
            </pre>
          ) : (
            <Spinner />
          )
        ) : (
          <div className="text-gray-500">Select a file to view</div>
        )}
      </div>
    </div>
  );
}
