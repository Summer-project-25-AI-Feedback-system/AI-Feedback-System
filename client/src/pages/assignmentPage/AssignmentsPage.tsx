import BasicHeading from "../../components/BasicHeading";
import BasicList from "../../components/basicList/BasicList";
import BasicSearchBar from "../../components/BasicSearchBar";
import { useEffect, useState } from "react";
import { useGitHub } from "../../context/useGitHub";
import { useSupabase } from "../../context/supabase/useSupabase";
import { useParams, useNavigate } from "react-router-dom";
import type { AssignmentInfo } from "@shared/githubInterfaces";
import { useFilteredList } from "../../hooks/useFilteredList";
import BackButton from "../../components/BackButton";
import BasicButton from "../../components/BasicButton";
import { sortData } from "../../utils/sortingUtils";
import type { SortOption } from "../../utils/sortingUtils";
import Sidebar from "./sidebar/Sidebar";
import Spinner from "../../components/Spinner";
import GetCSVFileButton from "../../components/GetCSVFileButton";
import { mapToSupabaseAssignments } from '../../utils/mappings/mapToSupabaseAssignments';
import type { RosterWithStudents } from "@shared/supabaseInterfaces";
import type { EnrichedAssignmentInfo } from "src/types/Assignment";

export default function AssignmentsPage() {
  const { orgName } = useParams<{ orgName: string }>();
  const [assignments, setAssignments] = useState<AssignmentInfo[]>([]);
  const [detailedAssignments, setDetailedAssignments] = useState<EnrichedAssignmentInfo[]>([]);
  const [roster, setRoster] = useState<RosterWithStudents | null>(null);
  const github = useGitHub();
  const supabase = useSupabase();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [rosterLoaded, setRosterLoaded] = useState(false);
  const [assignmentsLoaded, setAssignmentsLoaded] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOption>("Newest");

  const filteredAssignments = useFilteredList(
    assignments,
    searchTerm,
    (a, term) => a.name.toLowerCase().includes(term.toLowerCase())
  );

  const handleAnalyticsClick = () => {
    if (orgName) {
      navigate(`/orgs/${orgName}/analytics`);
    }
  };

  const sortedAssignments = sortData(filteredAssignments, sortOrder);

  useEffect(() => {   
    if (orgName) {
      github
        .getAssignments(orgName)
        .then((fetchedAssignments) => { 
          setAssignments(fetchedAssignments)
          github.getAllOrganizationData(orgName).then((fetchedOrgData) => {
            const assignments = mapToSupabaseAssignments(fetchedAssignments, fetchedOrgData.orgId)
            supabase.addAssignments(fetchedOrgData.orgId, assignments)
            supabase.getRoster(fetchedOrgData.orgId).then((fetchedRoster) => {
              setRoster(fetchedRoster)
              setRosterLoaded(true);
              const students = fetchedRoster?.amount_of_students ?? 0

              /*github.getDetailedAssignments(orgName).then((fetchedDetailedAssignments) => {
                const enrichedAssignments: EnrichedAssignmentInfo[] = fetchedDetailedAssignments.map((assignment) => ({
                  id: assignment.id,
                  name: assignment.name,
                  accepted: assignment.accepted,
                  submitted: assignment.submitted,
                  passing: assignment.passing,
                  totalStudents: students,
                  deadline: assignment.deadline ? assignment.deadline : null,
                }));*/

              // temporarily hardcoded until the assignment details issue is fixed
              const enrichedAssignments: EnrichedAssignmentInfo[] = [
                {
                  id: 1234,
                  name: "assignment name",
                  accepted: 2,
                  submitted: 1,
                  passing: 1,
                  totalStudents: students,
                  deadline: null,
                }
              ];
              setDetailedAssignments(enrichedAssignments)
              setAssignmentsLoaded(true);
            })
          })
        })
        .catch(console.error);
    }
  }, [orgName, github, supabase]);

  useEffect(() => {
    if (rosterLoaded && assignmentsLoaded) {
      setLoading(false);
    }
  }, [rosterLoaded, assignmentsLoaded]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar assignments={detailedAssignments}/>
      <div className="flex-1 flex justify-center"> 
      <div className="flex flex-col space-y-10 pr-4 pt-4 pl-4 md:pr-12 md:pt-12">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex space-x-4">
              <BackButton to="/orgs" />
              <BasicHeading heading={`Assignments in ${orgName}`} />
            </div>
            <div className="flex space-x-4">
              <BasicSearchBar value={searchTerm} onChange={setSearchTerm} />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4">
            <BasicButton text="Go To Analytics Page" onClick={handleAnalyticsClick}/>
            <GetCSVFileButton text={"Export CSV Report"} orgName={orgName} roster={roster}/>
          </div>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div>
            <BasicList
              type="assignment"
              items={sortedAssignments}
              orgName={orgName!}
              isLoading={loading}
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
            />
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
