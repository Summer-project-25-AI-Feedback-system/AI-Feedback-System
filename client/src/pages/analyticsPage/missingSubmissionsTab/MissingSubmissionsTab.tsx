import { useEffect, useState } from "react";
import UploadStudentRosterCSVButton from "./UploadStudentRosterCSVButton";
import Subtext from "./Subtext";
import type { StudentInStudentRoster } from "src/types/StudentInStudentRoster";
import type { OrgReport } from "src/types/OrgReport";
import { useParams, useSearchParams } from "react-router-dom";
import StudentTableWithTabs from "./studentTable/StudentTableWithTabs";

type MissingSubmissionsTabProps = {
  orgData: OrgReport;
};

export default function MissingSubmissionsTab({ orgData }: MissingSubmissionsTabProps) {
  const [roster, setRoster] = useState<StudentInStudentRoster[]>([]);
  const { orgName } = useParams<{ orgName: string }>();
  const [searchParams] = useSearchParams();
  const selectedAssignment = searchParams.get("assignment") || "all";
  
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
            <Subtext text={`Note: GitHub’s API does not currently support fetching student rosters. To view missing submissions, please upload a roster manually. You can download your class roster from GitHub Classroom under the "Students" section.`} />
            <UploadStudentRosterCSVButton text="Upload Student Roster CSV" onUpload={setRoster}/>
        </div>
      ) : (
        <div className="flex flex-col gap-y-2">
          <div className="flex justify-between items-center">
            <Subtext text="Note: Student names and GitHub usernames are only visible once at least one assignment has been accepted."/>
            <UploadStudentRosterCSVButton text="Update Student Roster CSV" onUpload={setRoster}/>
          </div>
          {roster.length > 0 && (
            <StudentTableWithTabs roster={roster} orgData={orgData} selectedTab={selectedAssignment} orgName={orgName}/>
          )}
        </div>
      )}
    </div>
  )
}
