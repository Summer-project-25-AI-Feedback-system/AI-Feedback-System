import BasicHeading from "../../components/BasicHeading";
import BasicList from "../../components/basicList/BasicList";
import BasicSearchBar from "../../components/BasicSearchBar";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
import { mapToSupabaseAssignments } from '../../utils/mappings/mapToSupabaseAssignments'
import type { RosterWithStudents } from "@shared/supabaseInterfaces";

const allAssignments = [
  {
    name: "Assignment 1",
    submitted: 5,
    accepted: 5,
    total: 10,
    deadline: new Date('2025-04-01T23:59:59Z'),
  },
  {
    name: "Assignment 2",
    submitted: 10,
    accepted: 10,
    total: 10,
    deadline: new Date('2025-05-01T23:59:59Z'),
  },
  {
    name: "Assignment 3",
    submitted: 7,
    accepted: 8,
    total: 10,
    deadline: new Date('2025-06-01T23:59:59Z'),
  },
  {
    name: "Assignment 4",
    submitted: 3,
    accepted: 4,
    total: 10,
    deadline: new Date('2025-04-01T23:59:59Z'),
  },
  {
    name: "Assignment 5",
    submitted: 10,
    accepted: 10,
    total: 10,
    deadline: new Date('2025-04-10T23:59:59Z'),
  },
  {
    name: "Assignment 6",
    submitted: 6,
    accepted: 8,
    total: 10,
    deadline: new Date('2025-06-10T23:59:59Z'),
  },
];

export default function AssignmentsPage() {
  const { orgName } = useParams<{ orgName: string }>();
  const [assignments, setAssignments] = useState<AssignmentInfo[]>([]);
  const [roster, setRoster] = useState<RosterWithStudents | null>(null);
  const github = useGitHub();
  const supabase = useSupabase();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOption>("Newest");

  const { orgId } = location.state || {};

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
    if (orgName && orgId) {
      github
        .getAssignments(orgName)
        .then((fetchedAssignments) => { 
          setAssignments(fetchedAssignments)
          const assignments = mapToSupabaseAssignments(fetchedAssignments, orgId)
          supabase.addAssignments(orgId, assignments)
          supabase.getRoster(orgId).then((fetchedRoster) => {
            setRoster(fetchedRoster)
          })
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [orgName, github]);

  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar assignments={allAssignments}/>
      <div className="flex-1 flex justify-center"> 
      <div className="flex flex-col space-y-10 pr-4 pt-4 md:pr-12 md:pt-12 pl-0">
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
          <BasicList
            type="assignment"
            items={sortedAssignments}
            orgName={orgName!}
            isLoading={loading}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
          />
        )}
      </div>
      </div>
    </div>
  );
}
