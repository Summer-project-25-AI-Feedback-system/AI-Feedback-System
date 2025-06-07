import type { StudentInStudentRoster } from "./StudentInStudentRoster";

// a lenghtier version of the studentInStudentRoster
export type StudentInfo = StudentInStudentRoster & {
  grades: (number | string)[];
  totalPoints: number | string;
  submissionCount: number;
};