export type EnrichedAssignmentClassroomInfo = {
  id: number;
  name: string;
  accepted: number;
  submitted: number;
  passing: number;
  totalStudents: number;
  deadline: Date | null;
};