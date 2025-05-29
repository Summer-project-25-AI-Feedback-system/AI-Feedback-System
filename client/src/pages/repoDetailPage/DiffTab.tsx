import { useEffect, useState } from "react";
import { useGitHub } from "../../context/useGitHub";
import type {
  RepoInfo,
  CompareCommitsInfo,
  CommitInfo,
} from "@shared/githubInterfaces";
import Spinner from "../../components/Spinner";

interface DiffTabProps {
  repo: RepoInfo;
}

interface FileDiff {
  filename: string;
  status: string;
  patch?: string;
}

export default function DiffTab({ repo }: DiffTabProps) {
  const github = useGitHub();
  const [diff, setDiff] = useState<FileDiff[] | null>(null);

  useEffect(() => {
    if (repo) {
      // Compare last two commits
      github
        ?.getCommits(repo.owner, repo.name)
        .then((commits: CommitInfo[]) => {
          if (commits.length > 1) {
            return github?.compareCommits(
              repo.owner,
              repo.name,
              commits[1].sha,
              commits[0].sha
            );
          }
          return null;
        })
        .then((comparison: CompareCommitsInfo | null) => {
          setDiff(comparison?.files || null);
        });
    }
  }, [repo, github]);

  return (
    <div className="p-4">
      {diff ? (
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
          {diff.map((file: FileDiff) => (
            <div key={file.filename} className="mb-4">
              <div className="font-mono text-sm">
                {file.filename} ({file.status})
              </div>
              {file.patch && (
                <div className="bg-white p-2 rounded">
                  <code>{file.patch}</code>
                </div>
              )}
            </div>
          ))}
        </pre>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
