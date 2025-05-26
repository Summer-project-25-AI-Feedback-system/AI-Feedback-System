import type { RepoInfo } from "@shared/githubInterfaces";
import Spinner from "../../components/Spinner";

interface MetadataTabProps {
  repo: RepoInfo;
}

export default function MetadataTab({ repo }: MetadataTabProps) {
  if (!repo) return <Spinner />;
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div>
        <h3 className="font-semibold mb-2">Repository Info</h3>
        <dl className="space-y-2">
          <div>
            <dt className="text-gray-600">Created</dt>
            <dd>{new Date(repo.createdAt).toLocaleDateString()}</dd>
          </div>
          <div>
            <dt className="text-gray-600">Last Updated</dt>
            <dd>{new Date(repo.updatedAt).toLocaleDateString()}</dd>
          </div>
        </dl>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Collaborators</h3>
        <div className="space-y-2">
          {repo.collaborators.map((collaborator) => (
            <div key={collaborator.id} className="flex items-center space-x-2">
              <img
                src={collaborator.avatarUrl}
                className="w-6 h-6 rounded-full"
                alt={collaborator.name}
              />
              <span>{collaborator.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
