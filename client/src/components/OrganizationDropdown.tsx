import { useEffect, useState } from "react";
import { useGitHub } from "../context/useGitHub";
import type { Org } from "../types/GitHubInfo";

interface Props {
  onSelect: (org: Org) => void;
}

export default function OrganizationDropdown({ onSelect }: Props) {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>("");
  const github = useGitHub();

  useEffect(() => {
    if (!github) return;
    github
      .getOrganizations()
      .then(setOrgs)
      .catch((err) => console.error("Failed to fetch orgs:", err));
  }, [github]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = orgs.find((org) => org.login === event.target.value);
    if (selected) {
      setSelectedOrg(selected.login);
      onSelect(selected);
    }
  };

  return (
    <select
      value={selectedOrg}
      onChange={handleChange}
      className="border p-2 rounded"
    >
      <option value="">Select Organization</option>
      {orgs.map((org) => (
        <option key={org.login} value={org.login}>
          {org.login}
        </option>
      ))}
    </select>
  );
}
