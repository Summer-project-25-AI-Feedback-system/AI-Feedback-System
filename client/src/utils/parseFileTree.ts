import type { FileNode } from "../pages/repoDetailPage/FileTree";

// Internal type for building tree using object map
interface InternalNode extends Omit<FileNode, "children"> {
  children?: Record<string, InternalNode>;
}

export function parseFileTree(paths: string[]): FileNode[] {
  const root: Record<string, InternalNode> = {};

  paths.forEach((path) => {
    const parts = path.split("/");
    let current = root;
    let currentPath = "";

    parts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (!current[part]) {
        current[part] = {
          name: part,
          path: currentPath,
          isDirectory: index < parts.length - 1,
          children: index < parts.length - 1 ? {} : undefined,
        };
      }

      if (index < parts.length - 1) {
        current = current[part].children!;
      }
    });
  });

  // Convert InternalNode -> FileNode (with children as array)
  const convert = (nodes: Record<string, InternalNode>): FileNode[] =>
    Object.values(nodes).map((node) => ({
      name: node.name,
      path: node.path,
      isDirectory: node.isDirectory,
      children: node.children ? convert(node.children) : undefined,
    }));

  return convert(root);
}
