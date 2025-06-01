import BasicHeading from "../../components/BasicHeading";
import BasicList from "../../components/basicList/BasicList";
// import SortingButton from "../../components/SortingButton";
import BasicSearchBar from "../../components/BasicSearchBar";
import { useEffect, useState } from "react";
import { useGitHub } from "../../context/useGitHub";
import { useParams, useNavigate } from "react-router-dom";
import type { AssignmentInfo } from "@shared/githubInterfaces";
import { useFilteredList } from "../../hooks/useFilteredList";
import BackButton from "../../components/BackButton";
import GetCSVFileButton from "./GetCSVFileButton";
import BasicButton from "../../components/BasicButton";
import { sortData } from "../../utils/sortingUtils";
import type { SortOption } from "../../utils/sortingUtils";
import Sidebar from "./sidebar/Sidebar";
import Spinner from "../../components/Spinner";

export default function AssignmentsPage() {
  const { orgName } = useParams<{ orgName: string }>();
  const [assignments, setAssignments] = useState<AssignmentInfo[]>([]);
  const github = useGitHub();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
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
        .then(setAssignments)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [orgName, github]);

  console.log("assignments:", assignments);
  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar />
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
            <GetCSVFileButton text="Get CSV Report" orgLogin={orgName} />
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
