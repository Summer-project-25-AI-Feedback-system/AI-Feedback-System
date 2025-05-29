import type { CommitInfo } from "@shared/githubInterfaces";
import Spinner from "../../components/Spinner";

interface CommitsTabProps {
  commits: CommitInfo[];
}

export default function CommitsTab({ commits }: CommitsTabProps) {
  if (!commits.length) return <Spinner />;

  return (
    <div className="space-y-2 overflow-auto max-h-96">
      {commits.map((commit) => (
        <div key={commit.sha} className="p-4 border rounded">
          <div className="flex items-center justify-between">
            <div className="w-11/12 font-medium">{commit.commit.message}</div>
            <div className="w-1/12 text-sm text-gray-500">
              {new Date(commit.commit.author.date).toLocaleString()}
            </div>
          </div>
          <div className="text-sm text-gray-600 pt-2">
            {commit.commit.author.name}
          </div>
        </div>
      ))}
    </div>
  );
}
