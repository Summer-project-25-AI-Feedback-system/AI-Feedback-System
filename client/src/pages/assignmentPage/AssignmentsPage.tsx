import BasicHeading from "../../components/BasicHeading";
import BasicList from "../../components/basicList/BasicList";
import FilterButton from "../../components/FilterButton";
import BasicSearchBar from "../../components/BasicSearchBar";
import { useEffect, useState } from "react";
import { useGitHub } from "../../context/useGitHub";
import { useParams } from "react-router-dom";
import type { AssignmentInfo } from "@shared/githubInterfaces";
import { useFilteredList } from "../../hooks/useFilteredList";
import BackButton from "../../components/BackButton";

export default function AssignmentsPage() {
  const { orgName } = useParams<{ orgName: string }>();
  const [assignments, setAssignments] = useState<AssignmentInfo[]>([]);
  const github = useGitHub();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const filteredAssignments = useFilteredList(
    assignments,
    searchTerm,
    (a, term) => a.name.toLowerCase().includes(term.toLowerCase())
  );

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
    <div className="flex flex-col space-y-20 p-4 md:p-12">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex space-x-4">
            <BackButton to="/orgs" />
            <BasicHeading heading={`Assignments in ${orgName}`} />
          </div>
          <div className="flex space-x-4">
            <BasicSearchBar value={searchTerm} onChange={setSearchTerm} />
            <FilterButton buttonText="Sort By" items={["Recent", "Old"]} />
          </div>
        </div>
      </div>
      <BasicList
        type="assignment"
        items={filteredAssignments}
        orgName={orgName!}
        isLoading={loading}
      />
    </div>
  );
}
