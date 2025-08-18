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
  const [orgs, setOrgs] = useState<OrganizationInput[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const github = useGitHub();
  const supabase = useSupabase();
  const [sortOrder, setSortOrder] = useState<SortOption>("A–Z");

  const handleUpdateLimit = async (orgId: string, newLimit: number) => {
    try {
      await supabase.updateSubmissionLimit(orgId, newLimit);
      // After updating, refetch the data to keep the UI in sync
      const updatedOrgs = await supabase.getOrganizations();
      setOrgs(updatedOrgs);
    } catch (error) {
      console.error("Failed to update submission limit:", error);
    }
  };

  useEffect(() => {
    const fetchAndSyncOrgs = async () => {
      try {
        setLoading(true);

        // 1. Fetch from GitHub API
        const fetchedOrgs: OrgInfo[] = await github.getOrganizations();

        // 2. Sync with Supabase (upsert)
        const orgInputs: OrganizationInput[] = fetchedOrgs.map((org) => ({
          name: org.name,
          external_github_org_id: org.id,
          description: org.description,
          avatar_url: org.avatarUrl,
        }));

        await supabase.addOrganizations(orgInputs);

        // 3. Fetch the ENRICHED data from Supabase
        const supabaseOrgs = await supabase.getOrganizations();

        // 4. Update state with the Supabase data
        setOrgs(supabaseOrgs);
      } catch (error) {
        console.error("Error fetching and syncing organizations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSyncOrgs();
  }, [github, supabase]);

  const filteredOrgs = useFilteredList(orgs, searchTerm, (org, term) =>
    org.name.toLowerCase().includes(term.toLowerCase())
  );
  const sortedOrgs = sortData(filteredOrgs, sortOrder);
  console.log(orgs);
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
          onUpdateSubmissionLimit={handleUpdateLimit}
        />
      )}
    </div>
  );
}
