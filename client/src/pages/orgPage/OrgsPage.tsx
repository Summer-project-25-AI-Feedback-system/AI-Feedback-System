import { useEffect, useState } from "react";
import { useGitHub } from "../../context/useGitHub";
import type { OrgInfo } from "@shared/githubInterfaces";
import BasicHeading from "../../components/BasicHeading";
import BasicList from "../../components/basicList/BasicList";
import BasicSearchBar from "../../components/BasicSearchBar";

export default function OrgsPage() {
  const [orgs, setOrgs] = useState<OrgInfo[]>([]);
  const github = useGitHub();

  useEffect(() => {
    github.getOrganizations().then(setOrgs).catch(console.error);
  }, [github]);

  console.log("orgs:", orgs);
  return (
    <div className="flex flex-col space-y-10 p-4 md:p-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <BasicHeading heading="Your Organizations" />
        <BasicSearchBar />
      </div>
      <BasicList orgList={orgs} />
    </div>
  );
}
