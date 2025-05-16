import { useEffect, useState } from "react";
import { useGitHub } from "../../context/useGitHub";
import type { Org } from "../../types/GitHubInfo";
import BasicHeading from "../../components/BasicHeading";
import BasicList from "../../components/basicList/BasicList";

export default function OrgsPage() {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const github = useGitHub();

  useEffect(() => {
    github.getOrganizations().then(setOrgs).catch(console.error);
  }, [github]);

  console.log(orgs);
  return (
    <div className="flex flex-col space-y-10 p-4 md:p-12">
      <BasicHeading heading="Your Organizations" />
      <BasicList orgList={orgs} />
    </div>
  );
}
