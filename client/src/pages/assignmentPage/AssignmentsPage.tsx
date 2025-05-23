import BasicHeading from "../../components/BasicHeading";
import BasicList from "../../components/basicList/BasicList";
import FilterButton from "../../components/SortingButton";
import BasicSearchBar from "../../components/BasicSearchBar";
import { useEffect, useState } from "react";
import { useGitHub } from "../../context/useGitHub";
import { useParams } from "react-router-dom";
import type { AssignmentInfo } from "@shared/githubInterfaces";
import { useFilteredList } from "../../hooks/useFilteredList";
import BackButton from "../../components/BackButton";
import GetCSVFileButton from "./GetCSVFileButton";

export default function AssignmentsPage() {
  const { orgName } = useParams<{ orgName: string }>();
  const [assignments, setAssignments] = useState<AssignmentInfo[]>([]);
  const github = useGitHub();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"Newest" | "Oldest">("Newest");

  const filteredAssignments = useFilteredList(
    assignments,
    searchTerm,
    (a, term) => a.name.toLowerCase().includes(term.toLowerCase())
  );
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();
    return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
  });

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
    <div className="flex flex-col space-y-10 p-4 md:p-12">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex space-x-4">
            <BackButton to="/orgs" />
            <BasicHeading heading={`Assignments in ${orgName}`} />
          </div>
          <div className="flex space-x-4">
            <BasicSearchBar value={searchTerm} onChange={setSearchTerm} />

            <FilterButton
              buttonText="Sort By"
              items={["Newest", "Oldest"]}
              onSelect={(selected) =>
                setSortOrder(selected as "Newest" | "Oldest")
              }
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4">
          <GetCSVFileButton text="Get CSV Report" orgLogin={orgName} />
        </div>
      </div>
      <BasicList
        type="assignment"
        items={sortedAssignments}
        orgName={orgName!}
        isLoading={loading}
      />
    </div>
  );
}
