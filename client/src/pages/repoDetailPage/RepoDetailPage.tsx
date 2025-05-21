import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import type { RepoInfo } from "@shared/githubInterfaces";
import BackButton from "../../components/BackButton";
import BasicHeading from "../../components/BasicHeading";
import { BasicInfoCard } from "./BasicInfoCard";
import { Spinner } from "./Spinner";
import { useGitHub } from "../../context/useGitHub";
import BasicButton from "../../components/BasicButton";

import type { AssignmentFeedback } from "@shared/aiInterfaces";

export default function RepoDetailPage() {
  const location = useLocation();
  const repoFromState = location.state as RepoInfo | undefined;
  const { orgName, assignmentName, repoName } = useParams();
  const github = useGitHub();

  const [repo, setRepo] = useState<RepoInfo | null>(repoFromState ?? null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [feedbackData, setFeedbackData] = useState<AssignmentFeedback>({
    studentName: "Jane Doe",
    repoName: "jane-assignment-1",
    assignmentTitle: "React Todo App",
    feedback: "The code structure is clean and follows best practices...",
    grade: "4",
    fileName: "App.jsx",
    date: "2025-05-20T15:23:00Z",
    rubricScores: [
      {
        criterion: "Code Quality",
        score: 4,
        comment: "Well-structured with minor issues.",
      },
      {
        criterion: "Functionality",
        score: 5,
        comment: "All features are implemented.",
      },
      { criterion: "UI/UX", score: 3, comment: "UI is basic, but functional." },
    ],
  });

  const handleClick = (action: string) => {
    if (action === "Edit Feedback") {
      setIsEditing((prev) => !prev);
    } else {
      console.log(`Clicked ${action}`);
    }
  };

  const handleRubricScoreChange = (index: number, newScore: number) => {
    setFeedbackData((prev) => {
      const updatedRubric = [...(prev.rubricScores ?? [])];
      updatedRubric[index] = { ...updatedRubric[index], score: newScore };
      return { ...prev, rubricScores: updatedRubric };
    });
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
              text={isEditing ? "Save Feedback" : "Edit Feedback"}
            />
          </div>
        </div>

        {/* Feedback Section */}
        <div className="flex flex-col space-y-2 p-4 border rounded-md">
          <h2 className="text-lg font-semibold">AI Feedback</h2>
          <p>
            <strong>Student:</strong> {feedbackData.studentName}
          </p>
          <p>
            <strong>File:</strong> {feedbackData.fileName}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(feedbackData.date).toLocaleString()}
          </p>

          <div className="mt-2">
            <strong>Overall Feedback:</strong>
            {isEditing ? (
              <textarea
                className="w-full p-2 border rounded mt-1 resize-y min-h-[100px]"
                value={feedbackData.feedback}
                onChange={(e) => handleFeedbackTextChange(e.target.value)}
              />
            ) : (
              <p className="text-sm whitespace-pre-wrap mt-1">
                {feedbackData.feedback}
              </p>
            )}
          </div>

          {feedbackData.rubricScores && (
            <div className="mt-4">
              <h3 className="font-medium">Rubric Scores:</h3>
              <ul className="mt-2 space-y-2">
                {feedbackData.rubricScores.map((rubric, index) => (
                  <li key={index} className="flex flex-col">
                    <div className="flex items-center space-x-4">
                      <span className="w-40 font-medium">
                        {rubric.criterion}:
                      </span>
                      {isEditing ? (
                        <select
                          className="border rounded px-2 py-1"
                          value={rubric.score}
                          onChange={(e) =>
                            handleRubricScoreChange(
                              index,
                              Number(e.target.value)
                            )
                          }
                        >
                          {[1, 2, 3, 4, 5].map((val) => (
                            <option key={val} value={val}>
                              {val}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span>{rubric.score}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 ml-1">
                      {rubric.comment}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
