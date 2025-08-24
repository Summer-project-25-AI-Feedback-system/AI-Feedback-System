import type { AnalyticsResponse } from "@shared/supabaseInterfaces";
import AveragePointsProgressBar from "./AveragePointsProgressBar";

// how the analyticsResponse looks like:
/* 
  export interface AiEvaluation {
    id: string;
    roster_student_id: string;
    assignment_id: string;
    organization_id: string;
    created_at: Date;
    ai_model: string;
    md_file: string;
    total_score: number | null;
  } 

  export interface AnalyticsAssignment {
    id: string;
    name: string;
    max_points: number;
  }
  
  export interface AnalyticsGrade {
    assignmentId: string;
    evaluations: AiEvaluation[]; 
  }
  
  export interface AnalyticsSubmission {
    student: string | null; 
    grades: AnalyticsGrade[];
  }
  
  export interface AnalyticsResponse {
    assignments: AnalyticsAssignment[];
    submissions: AnalyticsSubmission[];
  */

type AveragePointsListProps = {
  analyticsData: AnalyticsResponse;
};

export default function AveragePointsList({ analyticsData }: AveragePointsListProps) {
  const { assignments, submissions } = analyticsData;

  return (
    <div>
      {assignments.map((assignment) => {
        const gradesForAssignment = submissions
          .map((submission) =>
            submission.grades.find((g) => g.assignmentId === assignment.id)
          )
          .filter((g): g is NonNullable<typeof g> => g !== undefined);

        if (gradesForAssignment.length === 0) return null;

        const allPoints = gradesForAssignment.flatMap((g) =>
          g.evaluations
            .map((e) => e.total_score)
            .filter((score): score is number => score !== null)
        );

        if (allPoints.length === 0) return null;

        const avgPoints =
          allPoints.reduce((sum, p) => sum + p, 0) / allPoints.length;

        const percentage = Math.round(
          (avgPoints / assignment.max_points) * 100
        );

        return (
          <div key={assignment.id}>
            <div className="text-[16px]">{assignment.name}</div>
            <AveragePointsProgressBar value={percentage} />
          </div>
        );
      })}
    </div>
  );
}