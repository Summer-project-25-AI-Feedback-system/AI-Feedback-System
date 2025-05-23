import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import type { RepoInfo } from "@shared/githubInterfaces";
import BackButton from "../../components/BackButton";
import BasicHeading from "../../components/BasicHeading";
import RepoInfoCard from "./RepoInfoCard";
import { Spinner } from "./Spinner";
import { useGitHub } from "../../context/useGitHub";
import FeedbackCard from "./FeedbackCard";
import { generateSummaryFeedback } from "../../utils/feedbackUtils";
import FeedbackActions from "./FeedbackActions";

import type { AssignmentFeedback } from "@shared/aiInterfaces";

export default function RepoDetailPage() {
  const location = useLocation();
  const repoFromState = location.state as RepoInfo | undefined;
  const { orgName, assignmentName, repoName } = useParams();
  const github = useGitHub();

  const [repo, setRepo] = useState<RepoInfo | null>(repoFromState ?? null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [feedbackData, setFeedbackData] = useState<AssignmentFeedback>(() => {
    const initial = {
      repoName: "week-2-assignment-tangerinekey380",
      assignmentTitle: "React Todo App",
      grade: "4",
      date: "2025-05-20T15:23:00Z",
      feedbackByFile: [
        {
          fileName: "App.tsx",
          issues: [
            { id: 1, line: 5, text: "It would be better to use justify-end." },
            { id: 2, line: 34, text: "I couldn't find the import component." },
          ],
        },
        {
          fileName: "Home.tsx",
          issues: [
            {
              id: 1,
              line: 5,
              text: "I couldn't find any useContent component in the App.tsx - compulsory requirement.",
            },
          ],
        },
      ],
    };
    return {
      ...initial,
      feedback: generateSummaryFeedback(initial.feedbackByFile),
    };
  });

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

  if (loading) return <Spinner />;
  if (!repo)
    return <div className="p-4 text-red-600">Repository not found.</div>;

  console.log("repo:", repo);

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
          <RepoInfoCard title="Repository Information" repo={repo} />
          <div className="flex-col space-y-4">
            <FeedbackActions
              isEditing={isEditing}
              onEditToggle={() => setIsEditing((prev) => !prev)}
              onDownload={() => handleClick("Download Feedback PDF")}
            />
          </div>
        </div>
        <FeedbackCard
          isEditing={isEditing}
          feedbackData={feedbackData}
          onFeedbackChange={handleFeedbackTextChange}
          onGradeChange={(newGrade) =>
            setFeedbackData((prev) => ({ ...prev, grade: newGrade }))
          }
        />
      </div>
    </div>
  );
}
