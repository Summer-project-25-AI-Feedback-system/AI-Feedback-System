import { useEffect, useState } from "react";
import { fetchFeedback } from "../services/feedbackService";

const FeedbackViewer = ({ submissionId }: { submissionId: number }) => {
  const [feedback, setFeedback] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchFeedback(submissionId);
      setFeedback(data);
    };
    load();
  }, [submissionId]);

  return (
    <div>
      <h3>Feedback</h3>
      {feedback.map((f) => (
        <div key={f.id}>
          <strong>Score:</strong> {f.score}/100
          <p>{f.comments}</p>
        </div>
      ))}
    </div>
  );
};

export default FeedbackViewer;
