import ListHeader from "./ListHeader";
import ListItem from "./ListItem";
import type { RepoInfo } from "../../types/RepoInfo";

interface BasicListProps {
  repoList: RepoInfo[];
}

export default function BasicList({ repoList }: BasicListProps) {
  return (
    <div className="flex flex-col">
      <ListHeader></ListHeader>
      {repoList.map((repo, index) => (
        <ListItem key={index} repoInfo={repo} />
      ))}
    </div>
  );
}
