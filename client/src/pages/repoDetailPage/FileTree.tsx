import { useState } from "react";
import { TbTriangleFilled } from "react-icons/tb";

export interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
}

interface FileTreeProps {
  nodes: FileNode[];
  selectedPath: string | null;
  onSelect: (path: string) => void;
}

export default function FileTree({
  nodes,
  selectedPath,
  onSelect,
}: FileTreeProps) {
  return (
    <div>
      {nodes.map((node) => (
        <TreeNode
          key={node.path}
          node={node}
          selectedPath={selectedPath}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function TreeNode({
  node,
  selectedPath,
  onSelect,
}: {
  node: FileNode;
  selectedPath: string | null;
  onSelect: (path: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const isSelected = selectedPath === node.path;

  const handleClick = () => {
    if (node.isDirectory) setOpen((prev) => !prev);
    else onSelect(node.path);
  };

  return (
    <div className="ml-2">
      <div
        className={`flex items-center cursor-pointer p-1 rounded hover:bg-gray-100 ${
          isSelected ? "bg-blue-50" : ""
        }`}
        onClick={handleClick}
      >
        {node.isDirectory ? (
          <TbTriangleFilled
            size={16}
            className={`transform transition-transform duration-200 ${
              open ? "rotate-180" : "rotate-90"
            }`}
          />
        ) : (
          <span className="w-4" />
        )}
        <span className="ml-1">{node.name}</span>
      </div>
      {open && node.children && (
        <div className="ml-4">
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              selectedPath={selectedPath}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
