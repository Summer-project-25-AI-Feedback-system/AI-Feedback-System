import Spinner from "../../components/Spinner";
import FileTree from "./FileTree";
import type { FileNode } from "./FileTree";
import { parseFileTree } from "../../utils/parseFileTree";

interface CodeTabProps {
  files: string[];
  selectedFile: string | null;
  content: string | null;
  loading?: boolean;
  onSelectFile: (file: string) => void;
}

export default function CodeTab({
  files,
  selectedFile,
  content,
  loading = false,
  onSelectFile,
}: CodeTabProps) {
  if (!files.length) return <Spinner />;
  const fileTree: FileNode[] = parseFileTree(files);

  return (
    <div className="flex">
      <div className="w-1/3 border-r p-4">
        <h3 className="font-semibold mb-2">Files</h3>
        <div className="bg-gray-100 rounded overflow-auto max-h-96">
          <FileTree
            nodes={fileTree}
            selectedPath={selectedFile}
            onSelect={onSelectFile}
          />
        </div>
      </div>
      <div className="w-2/3 p-4">
        <h3 className="font-semibold mb-2">Code</h3>
        {selectedFile ? (
          loading ? (
            <Spinner />
          ) : content ? (
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
              <code>{content}</code>
            </pre>
          ) : (
            <div className="text-red-500">Failed to load file content</div>
          )
        ) : (
          <div className="text-gray-500">Select a file to view</div>
        )}
      </div>
    </div>
  );
}
