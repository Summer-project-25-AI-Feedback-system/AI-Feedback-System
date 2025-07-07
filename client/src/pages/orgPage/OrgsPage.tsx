import { useEffect, useState } from "react";
import { useGitHub } from "../../context/useGitHub";
import { useSupabase } from "../../context/supabase/useSupabase";
import type { OrgInfo } from "@shared/githubInterfaces";
import BasicHeading from "../../components/BasicHeading";
import BasicList from "../../components/basicList/BasicList";
import BasicSearchBar from "../../components/BasicSearchBar";
import { useFilteredList } from "../../hooks/useFilteredList";
import type { SortOption } from "../../utils/sortingUtils";
import { sortData } from "../../utils/sortingUtils";
import Spinner from "../../components/Spinner";
import type { OrganizationInput } from "@shared/supabaseInterfaces";

export default function OrgsPage() {
  const [orgs, setOrgs] = useState<OrgInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const github = useGitHub();
  const supabase = useSupabase();
  const [sortOrder, setSortOrder] = useState<SortOption>("A–Z");

  useEffect(() => {
    github
      .getOrganizations()
      .then((fetchedOrgs) => {
        setOrgs(fetchedOrgs)
        const orgInputs: OrganizationInput[] = fetchedOrgs.map((org) => ({
          name: org.name,
          external_github_org_id: org.id,
        }));
        supabase.addOrganizations(orgInputs)
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [github, supabase]);

  const filteredOrgs = useFilteredList(orgs, searchTerm, (org, term) =>
    org.name.toLowerCase().includes(term.toLowerCase())
  );
  const sortedOrgs = sortData(filteredOrgs, sortOrder);

  return (
    <div className="flex flex-col space-y-10 p-4 md:p-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <BasicHeading heading="Your Organizations" />
        <BasicSearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <BasicList
          type="org"
          items={sortedOrgs}
          isLoading={false}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
      )}
    </div>
  );
}
