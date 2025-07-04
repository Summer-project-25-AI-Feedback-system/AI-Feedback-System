import { useEffect, useState } from "react";
import UploadStudentRosterCSVButton from "./UploadStudentRosterCSVButton";
import Subtext from "./Subtext";
import type { OrgReport } from "src/types/OrgReport";
import { useParams, useSearchParams } from "react-router-dom";
import StudentTableWithTabs from "./studentTable/StudentTableWithTabs";
import { useSupabase } from "../../../context/supabase/useSupabase";
import type { RosterWithStudents } from "@shared/supabaseInterfaces";
import Spinner from "../../../components/Spinner";

type MissingSubmissionsTabProps = {
  orgData: OrgReport;
};

export default function MissingSubmissionsTab({ orgData }: MissingSubmissionsTabProps) {
  const [roster, setRoster] = useState<RosterWithStudents | null>(null);
  const { orgName } = useParams<{ orgName: string }>();
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const selectedAssignment = searchParams.get("assignment") || "all";
  const supabase = useSupabase();
  
  useEffect(() => {
    if (orgData.orgId) {
      const stringId = String(orgData.orgId)
      supabase.getRoster(stringId)
      .then((fetchedRoster) => { 
        setRoster(fetchedRoster) // null if no roster, otherwise an object
      })
      .catch((err) => {
        console.error(err)
        setRoster(null)
      })
      .finally(() => {
        setLoading(false)
      })
    }
  }, [orgData, supabase]); 

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : !roster || roster.roster_students.length === 0 ? (
        <div className="flex flex-col gap-y-6 items-center">
            <Subtext text={`Note: GitHub’s API does not currently support fetching student rosters. To view missing submissions, please upload a roster manually. You can download your class roster from GitHub Classroom under the "Students" section.`} />
            <UploadStudentRosterCSVButton text="Upload Student Roster CSV" onUpload={setRoster} orgId={orgData.orgId}/>
        </div>
      ) : (
        <div className="flex flex-col gap-y-2">
          <div className="flex justify-between items-center">
            <Subtext text="Note: Student names and GitHub usernames are only visible once at least one assignment has been accepted by the student before the latest CSV upload."/>
            <UploadStudentRosterCSVButton text="Update Student Roster CSV" onUpload={setRoster} orgId={orgData.orgId}/>
          </div>
          {roster?.roster_students && roster.roster_students.length > 0 && (
            <StudentTableWithTabs roster={roster!} orgData={orgData} selectedTab={selectedAssignment} orgName={orgName}/>
          )}
        </div>
      )}
    </div>
  )
}
