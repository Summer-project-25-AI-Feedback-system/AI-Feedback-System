import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGitHub } from "../../context/useGitHub";
import type { Org } from "../../types/GitHubInfo";
import BasicHeading from "../../components/BasicHeading";

export default function OrgsPage() {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const github = useGitHub();
  const navigate = useNavigate();

  useEffect(() => {
    github.getOrganizations().then(setOrgs).catch(console.error);
  }, [github]);

  const handleViewRepos = (orgLogin: string) => {
    navigate(`/orgs/${orgLogin}/assignments`);
  };

  console.log(orgs);
  return (
    <div className="flex flex-col gap-6 m-4">
      <BasicHeading heading="Your Organizations" />
      <div className="flex-1 overflow-y-auto mt-4 space-y-4">
        {orgs.map((org) => (
          <div
            key={org.login}
            className="border p-4 rounded-xl flex justify-between items-center shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              <img
                src={org.avatarUrl}
                alt={org.login}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{org.login}</p>
                {org.description && (
                  <p className="text-sm text-gray-500">{org.description}</p>
                )}
              </div>
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={() => handleViewRepos(org.login)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
