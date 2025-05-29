import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import type { RepoInfo, CommitInfo } from "@shared/githubInterfaces";
import BackButton from "../../components/BackButton";
import BasicHeading from "../../components/BasicHeading";
import { useGitHub } from "../../context/useGitHub";
import Tabs from "../../components/Tabs";
import CodeTab from "./CodeTab";
import CommitsTab from "./CommitsTab";
import MetadataTab from "./MetadataTab";
import DiffTab from "./DiffTab";
import FeedbackTab from "./FeedbackTab";
import Spinner from "../../components/Spinner";

import { getInitialFeedback } from "../../utils/feedbackUtils";

import type { AssignmentFeedback } from "@shared/aiInterfaces";

export default function RepoDetailPage() {
  const location = useLocation();
  const repoFromState = location.state as RepoInfo | undefined;
  const { orgName, assignmentName, repoName } = useParams();
  const github = useGitHub();

  const [repo, setRepo] = useState<RepoInfo | null>(repoFromState ?? null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [commits, setCommits] = useState<CommitInfo[]>([]);

  const [feedbackData, setFeedbackData] =
    useState<AssignmentFeedback>(getInitialFeedback);

  const handleClick = (action: string) => {
    if (action === "Edit Feedback") {
      setIsEditing((prev) => !prev);
    } else {
      console.log(`Clicked ${action}`);
    }
  };

  const handleFeedbackTextChange = (newText: string) => {
    setFeedbackData((prev) => ({ ...prev, feedback: newText }));
  };

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

  // Fetch initial data
  useEffect(() => {
    if (repo) {
      // Load commits
      github?.getCommits(repo.owner, repo.name).then(setCommits);

      // Load file tree
      github?.getRepoTree(repo.owner, repo.name).then(setFiles);
    }
  }, [repo, github]);

  useEffect(() => {
    if (!selectedFile || !repo || !github) return;

    setFileLoading(true);
    setFileContent(null);

    github
      .getFileContents(repo.owner, repo.name, selectedFile)
      .then((content) => {
        setFileContent(content);
      })
      .catch((error) => {
        console.error("Error fetching file content:", error);
        setFileContent("Error loading file content");
      })
      .finally(() => {
        setFileLoading(false);
      });
  }, [selectedFile, repo, github]);

  useEffect(() => {
    console.log("repo:", repo);
  }, [repo]);

  const tabs = useMemo(
    () => [
      {
        id: "code",
        label: "Code",
        content: (
          <CodeTab
            files={files}
            selectedFile={selectedFile}
            content={fileContent}
            loading={fileLoading}
            onSelectFile={setSelectedFile}
          />
        ),
      },
      {
        id: "commits",
        label: "Commits",
        content: <CommitsTab commits={commits} />,
      },
      {
        id: "diff",
        label: "Diff",
        content: repo ? <DiffTab repo={repo} /> : <div>No repo found</div>,
      },
      {
        id: "metadata",
        label: "Metadata",
        content: repo ? <MetadataTab repo={repo} /> : <div>No repo found</div>,
      },
      {
        id: "feedback",
        label: "Feedback",
        content: (
          <FeedbackTab
            isEditing={isEditing}
            feedbackData={feedbackData}
            onFeedbackChange={handleFeedbackTextChange}
            onGradeChange={(newGrade) =>
              setFeedbackData((prev) => ({ ...prev, grade: newGrade }))
            }
            onToggleEdit={() => setIsEditing((prev) => !prev)}
            onDownload={() => handleClick("Download Feedback PDF")}
          />
        ),
      },
    ],
    [
      files,
      selectedFile,
      fileContent,
      fileLoading,
      commits,
      repo,
      isEditing,
      feedbackData,
    ]
  );

  if (loading) return <Spinner />;

  if (!repo)
    return <div className="p-4 text-red-600">Repository not found.</div>;

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
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
}
