import BasicHeading from "../../components/BasicHeading";
import BasicList from "../../components/basicList/BasicList";
import FilterButton from "../../components/FilterButton";
import BasicSearchBar from "./BasicSearchBar";
import { useEffect, useState } from "react";
import { useGitHub } from "../../context/useGitHub";
import { useParams } from "react-router-dom";
import type { AssignmentInfo } from "../../../../server/shared/AssignmentInfo";

export default function AssignmentListPage() {
  const { orgLogin } = useParams<{ orgLogin: string }>();
  const github = useGitHub();
  const [assignments, setAssignments] = useState<AssignmentInfo[]>([]);

  useEffect(() => {
    if (orgLogin) {
      github.getAssignments(orgLogin).then(setAssignments).catch(console.error);
    }
  }, [orgLogin, github]);

  console.log("assignments", assignments);
  return (
    <div className="flex flex-col space-y-20 p-4 md:p-12">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <BasicHeading heading={`Assignments in ${orgLogin}`} />
          <div className="flex space-x-4">
            <FilterButton buttonText="Sort By" items={["Recent", "Old"]} />
          </div>
        </div>
        <BasicSearchBar />
      </div>
      <BasicList assignmentList={assignments} orgLogin={orgLogin!} />
    </div>
  );
}
