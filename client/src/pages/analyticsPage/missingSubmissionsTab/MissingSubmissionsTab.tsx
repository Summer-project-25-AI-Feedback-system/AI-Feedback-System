import { useEffect, useState } from "react";
import UploadStudentRosterCSVButton from "./UploadStudentRosterCSVButton";
import Subtext from "./Subtext";
import { useParams, useSearchParams } from "react-router-dom";
import StudentTableWithDropdown from "./studentTable/StudentTableWithDropdown";
import { useSupabase } from "../../../context/supabase/useSupabase";
import type { AnalyticsResponse, RosterWithStudentsInput } from "@shared/supabaseInterfaces";
import Spinner from "../../../components/Spinner";
import { mapToRosterWithStudentInputType } from "../../../utils/mappings/mapToRosterWithStudentInputType";
import GetCSVFileButton from "../../../components/GetCSVFileButton";

type MissingSubmissionsTabProps = {
  analyticsData: AnalyticsResponse;
  orgId: number;
};

export default function MissingSubmissionsTab({ analyticsData, orgId }: MissingSubmissionsTabProps) {
  const [roster, setRoster] = useState<RosterWithStudentsInput | null>(null);
  const { orgName } = useParams<{ orgName: string }>();
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const selectedAssignment = searchParams.get("assignment") || "all";
  const supabase = useSupabase();
  
  useEffect(() => {
    if (orgId) {
      const stringId = String(orgId)
      supabase.getRoster(stringId)
      .then((fetchedRoster) => { 
        if (fetchedRoster) {
          setRoster(mapToRosterWithStudentInputType(fetchedRoster));
        } else {
          setRoster(null);
        }
      })
      .catch((err) => {
        console.error(err)
        setRoster(null)
      })
      .finally(() => {
        setLoading(false)
      })
    }
  }, [orgId, supabase]); 

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : !roster || roster.roster_students.length === 0 ? (
        <div className="flex flex-col gap-y-6 items-center">
            <Subtext text={`Note: GitHub’s API does not currently support fetching student rosters. To view missing submissions, please upload a roster manually. You can download your class roster from GitHub Classroom under the "Students" section.`} />
            <UploadStudentRosterCSVButton text="Upload Student Roster CSV" onUpload={setRoster} orgId={orgId}/>
        </div>
      ) : (
        <div className="flex flex-col gap-y-6">
          <Subtext text="Note: Student names and GitHub usernames are only visible once at least one assignment has been accepted by the student before the latest CSV upload."/>
          <div className="flex flex-col gap-y-2">
            <UploadStudentRosterCSVButton text="Update Student Roster CSV" onUpload={setRoster} orgId={orgId}/>
            <div className="flex gap-x-2">
                <GetCSVFileButton text="Export All Assignments CSV" orgName={orgName} roster={roster} orgId={orgId}/>
                {selectedAssignment !== "all" && (
                  <GetCSVFileButton 
                    text={`Export ${
                      analyticsData.assignments.find(a => a.id === selectedAssignment)?.name || "Assignment"
                    } CSV`}
                    orgName={orgName}
                    roster={roster}
                    assignmentFilter={[selectedAssignment]}
                    orgId={orgId}
                  />
                )}
            </div>
          </div>
          {roster?.roster_students && roster.roster_students.length > 0 && (
            <StudentTableWithDropdown roster={roster!} analyticsData={analyticsData} selectedTab={selectedAssignment}/>
          )}
        </div>
      )}
    </div>
  )
}
