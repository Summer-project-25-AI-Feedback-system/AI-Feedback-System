import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import type { RepoInfo } from "@shared/githubInterfaces";
import BackButton from "../../components/BackButton";
import BasicHeading from "../../components/BasicHeading";
import { BasicInfoCard } from "./BasicInfoCard";
import { Spinner } from "./Spinner";
import { useGitHub } from "../../context/useGitHub";
import BasicButton from "../../components/BasicButton";

export default function RepoDetailPage() {
  const location = useLocation();
  const repoFromState = location.state as RepoInfo | undefined;
  const { orgName, assignmentName, repoName } = useParams();
  const github = useGitHub();

  const [repo, setRepo] = useState<RepoInfo | null>(repoFromState ?? null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!repoFromState && github && orgName && assignmentName && repoName) {
      setLoading(true);
      github
        .getRepos(orgName, assignmentName)
        .then((repos) => {
          const found = repos.find((r) => r.name === repoName);
          setRepo(found || null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orgName, assignmentName, repoName, github, repoFromState]);

  if (loading) return <Spinner />;
  if (!repo)
    return <div className="p-4 text-red-600">Repository not found.</div>;
  const handleClick = (action: string) => {
    console.log(`Clicked ${action}`);
  };

  console.log("repo", repo);
  return (
    <div className="flex flex-col space-y-10 p-4 md:p-12">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex space-x-4">
            <BackButton
              to={`/orgs/${orgName}/assignments/${assignmentName}/repos`}
            />
            <BasicHeading heading={repo.name} />
          </div>
        </div>
        <div className="flex space-x-4 md:justify-between">
          <BasicInfoCard title="Repository Information">
            <ul className="space-y-1 text-sm">
              <li>
                <strong>ID:</strong> {repo.collaborators[0].name}
              </li>
              <li>
                <strong>Created:</strong>{" "}
                {new Date(repo.createdAt).toLocaleString()}
              </li>
              <li>
                <strong>Updated:</strong>{" "}
                {new Date(repo.updatedAt).toLocaleString()}
              </li>
              <li>
                <strong>URL:</strong>{" "}
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {repo?.url}
                </a>
              </li>
            </ul>
          </BasicInfoCard>
          <div className="flex-col space-y-4">
            <BasicButton
              onClick={() => handleClick("Download Feedback PDF")}
              text="Download Feedback PDF"
            />
            <BasicButton
              onClick={() => handleClick("Edit Grade")}
              text="Edit Grade"
            />
            <BasicButton
              onClick={() => handleClick("Edit Feedback")}
              text="Edit Feedback"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
