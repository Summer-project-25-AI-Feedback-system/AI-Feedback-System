import type { RosterStudentInput, RosterWithStudents, RosterWithStudentsInput } from "@shared/supabaseInterfaces";

export const mapToRosterWithStudentInputType = (fetched: RosterWithStudents): RosterWithStudentsInput => ({
    amount_of_students: fetched.amount_of_students,
    roster_students: fetched.roster_students.map((student): RosterStudentInput => ({
        github_roster_identifier: student.github_roster_identifier,
        github_username: student.github_username,
        github_user_id: student.github_user_id,
        github_display_name: student.github_display_name,
      })
    )
});