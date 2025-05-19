import { useEffect, useState } from "react";
import { useGitHub } from "../../context/useGitHub";
import type { OrgInfo } from "@shared/githubInterfaces";
import BasicHeading from "../../components/BasicHeading";
import BasicList from "../../components/basicList/BasicList";
import BasicSearchBar from "../../components/BasicSearchBar";
import { useFilteredList } from "../../hooks/useFilteredList";

export default function OrgsPage() {
  const [orgs, setOrgs] = useState<OrgInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const github = useGitHub();

  useEffect(() => {
    github
      .getOrganizations()
      .then(setOrgs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [github]);

  const filteredOrgs = useFilteredList(orgs, searchTerm, (org, term) =>
    org.name.toLowerCase().includes(term.toLowerCase())
  );

  console.log("orgs:", orgs);

  return (
    <div className="flex flex-col space-y-10 p-4 md:p-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <BasicHeading heading="Your Organizations" />
        <BasicSearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>
      <BasicList type="org" items={filteredOrgs} isLoading={loading} />
    </div>
  );
}
