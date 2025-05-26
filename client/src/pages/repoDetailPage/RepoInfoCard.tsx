import type { RepoInfo } from "@shared/githubInterfaces";

interface RepoInfoCardProps {
  title?: string;
  repo: RepoInfo;
}

export default function RepoInfoCard({ title, repo }: RepoInfoCardProps) {
  return (
    <div className={`rounded shadow p-4 bg-white border`}>
      {title && (
        <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>
      )}
      <div className="text-gray-700 text-sm">
        <ul className="space-y-1 text-sm">
          <li>
            <div className="flex items-center space-x-3">
              <img
                src={repo.collaborators[0].avatarUrl}
                alt={repo.avatarUrl}
                className="w-6 h-6 rounded-full"
              />
              <strong>{repo.collaborators[0].name}</strong>
            </div>
          </li>
          <li>
            <strong>Created:</strong>{" "}
            {new Date(repo.createdAt).toLocaleString()}
          </li>
          <li>
            <strong>Updated:</strong>{" "}
            {new Date(repo.updatedAt).toLocaleString()}
          </li>
          <li>
            <strong>URL:</strong>{" "}
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {repo?.url}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
