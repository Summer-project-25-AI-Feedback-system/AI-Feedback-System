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
  orgName: string;
}

interface FileDiff {
  filename: string;
  status: string;
  patch?: string;
}

export default function DiffTab({ repo, orgName }: DiffTabProps) {
  const github = useGitHub();
  const [diff, setDiff] = useState<FileDiff[] | null>(null);

  useEffect(() => {
    if (repo && orgName) {
      // Compare last two commits
      github
        ?.getCommits(orgName, repo.name)
        .then((commits: CommitInfo[]) => {
          if (commits.length > 1) {
            return github?.compareCommits(
              orgName,
              repo.name,
              commits[1].sha,
              commits[0].sha
            );
          }
          return null;
        })
        .then((comparison: CompareCommitsInfo | null) => {
          const diffFiles = comparison?.files?.map((file) => ({
            filename: file.filename,
            status: file.status,
            patch: file.patch,
          }));
          setDiff(diffFiles || null);
        })
        .catch((error) => {
          console.error("Error fetching diff:", error);
          setDiff(null);
        });
    }
  }, [repo, github, orgName]);

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
