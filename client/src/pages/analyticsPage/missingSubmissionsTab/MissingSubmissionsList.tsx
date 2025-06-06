import { useEffect, useState } from "react";
import UploadStudentRosterCSVButton from "./UploadStudentRosterCSVButton";
import Subtext from "./Subtext";
import StudentTable from "./StudentTable";
import type { StudentInStudentRoster } from "src/types/StudentInStudentRoster";
import type { OrgReport } from "src/types/OrgReport";
import { useParams } from "react-router-dom";

type MissingSubmissionsListProps = {
  orgData: OrgReport;
};

// TODO: get already existing roster from db if it exists there once we have access to the db
export default function MissingSubmissionsList({ orgData }: MissingSubmissionsListProps) {
  const [roster, setRoster] = useState<StudentInStudentRoster[]>([]);
  const { orgName } = useParams<{ orgName: string }>();
  
  useEffect(() => {
    const fetchRoster = async () => {
      if (!orgName) return;
      try {
        // TODO: get the roster from the database
        const fetchedRoster = "" // await db.getStudentRoster(orgName); 
        setRoster(fetchedRoster || []);
      } catch (error) {
        console.error("Failed to fetch student roster:", error);
      }
    };

    fetchRoster();
  }, [orgName]);

  return (
    <div>
      {roster.length === 0 ? (
        <div className="flex flex-col gap-y-6 items-center">
            <Subtext text={`Note: GitHub’s API does not currently support fetching student rosters. To view missing submissions, please upload a roster manually. This tool expects student identifiers within a roster to match the beginning of students' email addresses. You can download your class roster from GitHub Classroom under the "Students" section.`} />
            <UploadStudentRosterCSVButton text="Upload Student Roster CSV" onUpload={setRoster}/>
        </div>
      ) : (
        <div className="flex flex-col gap-y-2">
          <div className="flex justify-between items-center">
            <Subtext text="Student Submissions"/>
            <UploadStudentRosterCSVButton text="Update Student Roster CSV" onUpload={setRoster}/>
          </div>
          {roster.length > 0 && (
            <StudentTable roster={roster} orgData={orgData} />
          )}
        </div>
      )}
    </div>
  )
}
