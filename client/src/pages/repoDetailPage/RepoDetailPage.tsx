import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import type { RepoInfo, CommitInfo } from "@shared/githubInterfaces";
import BackButton from "../../components/BackButton";
import BasicHeading from "../../components/BasicHeading";
import { useGitHub } from "../../context/useGitHub";
import { useSupabase } from "../../context/supabase/useSupabase";
import Tabs from "../../components/Tabs";
import CodeTab from "./CodeTab";
import CommitsTab from "./CommitsTab";
import MetadataTab from "./MetadataTab";
import DiffTab from "./DiffTab";
import FeedbackTab from "./FeedbackTab";
import Spinner from "../../components/Spinner";
import { stripMarkdown } from "../../utils/markdownUtils";

import { getInitialFeedback } from "../../utils/feedbackUtils";

import type { AssignmentFeedback } from "@shared/aiInterfaces";
import type { AiEvaluation } from "@shared/supabaseInterfaces";

export default function RepoDetailPage() {
  const location = useLocation();
  const repoFromState = location.state as RepoInfo | undefined;
  const { orgName, assignmentName, repoName } = useParams();
  const github = useGitHub();
  const supabase = useSupabase();
  const [orgId, setOrgId] = useState<string | null>(null);

  const [repo, setRepo] = useState<RepoInfo | null>(repoFromState ?? null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(true); // Add loading state for feedback

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
    if (repo && orgName) {
      // Load commits
      github?.getCommits(orgName, repo.name).then(setCommits);

      // Load file tree
      github?.getRepoTree(orgName, repo.name).then(setFiles);
    }
  }, [repo, github, orgName]);

  useEffect(() => {
    if (!selectedFile || !repo || !github || !orgName) return;

    setFileLoading(true);
    setFileContent(null);

    github
      .getFileContents(orgName, repo.name, selectedFile)
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
  }, [selectedFile, repo, github, orgName]);

  useEffect(() => {
    console.log("repo:", repo);
  }, [repo]);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!repo || !orgId || !assignmentName || !supabase) return;

      try {
        setFeedbackLoading(true);

        const evaluations: AiEvaluation[] = await supabase.getEvaluations(
          orgId
        );
        if (evaluations.length > 0) {
          const latest = evaluations[0]; // assuming most recent
          setFeedbackData((prev) => ({
            ...prev,
            feedback: stripMarkdown(latest.md_file),
            grade: latest.total_score || "",
          }));
        }
      } catch (error) {
        console.error("Failed to fetch feedback:", error);
      } finally {
        setFeedbackLoading(false);
      }
    };

    fetchFeedback();
  }, [repo, orgId, assignmentName, supabase]);

  useEffect(() => {
    const fetchOrgId = async () => {
      if (!orgName || !github) return;
      try {
        const id = await github.getOrgIdByName(orgName);
        setOrgId(id);
      } catch (error) {
        console.error("Failed to fetch org ID:", error);
      }
    };

    fetchOrgId();
  }, [orgName, github]);

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
        content: repo ? (
          <DiffTab repo={repo} orgName={orgName!} />
        ) : (
          <div>No repo found</div>
        ),
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
            feedbackLoading={feedbackLoading}
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
      feedbackLoading,
      orgName,
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
