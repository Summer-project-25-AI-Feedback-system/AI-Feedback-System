import { useNavigate } from "react-router-dom";
import ListHeader from "./ListHeader";
import ListItem from "./ListItem";
import type { StudentSubmissionInfo } from "../../types/StudentSubmissionInfo";
import type {
  AssignmentInfo,
  OrgInfo,
  RepoInfo,
} from "@shared/githubInterfaces";
import type { SortOption } from "src/utils/sortingUtils";

interface BasicListProps {
  type: "org" | "assignment" | "repo" | "submission";
  items: OrgInfo[] | AssignmentInfo[] | RepoInfo[] | StudentSubmissionInfo[];
  isLoading: boolean;
  orgName?: string;
  assignmentName?: string;
  sortOrder?: SortOption;
  onSortChange?: (option: SortOption) => void;
}

export default function BasicList(props: BasicListProps) {
  const navigate = useNavigate();
  const isEmpty = Array.isArray(props.items) && props.items.length === 0;

  return (
    <div className="flex flex-col">
      <ListHeader
        type={props.type}
        sortOrder={props.sortOrder}
        onSortChange={props.onSortChange}
      />

      {props.isLoading && <div className="text-gray-500 p-4">Loading...</div>}

      {!props.isLoading && isEmpty && (
        <div className="text-gray-500 p-4">No items found.</div>
      )}
      {!props.isLoading &&
        !isEmpty &&
        props.items.map((item, index) => {
          const key = `${props.type}-${index}`;

          switch (props.type) {
            case "org":
              return (
                <ListItem
                  key={key}
                  type="org"
                  data={item as OrgInfo}
                  onClick={() =>
                    navigate(`/orgs/${(item as OrgInfo).name}/assignments`)
                  }
                />
              );

            case "assignment":
              return (
                <ListItem
                  key={key}
                  type="assignment"
                  data={item as AssignmentInfo}
                  onClick={() =>
                    navigate(
                      `/orgs/${props.orgName}/assignments/${encodeURIComponent(
                        (item as AssignmentInfo).name
                      )}/repos`
                    )
                  }
                />
              );

            case "repo":
              return (
                <ListItem
                  key={key}
                  type="repo"
                  data={item as RepoInfo}
                  onClick={() =>
                    navigate(
                      `/orgs/${props.orgName}/assignments/${encodeURIComponent(
                        props.assignmentName!
                      )}/repos/${(item as RepoInfo).id}`,
                      { state: item }
                    )
                  }
                />
              );

            case "submission":
              return (
                <ListItem
                  key={key}
                  type="submission"
                  data={item as StudentSubmissionInfo}
                />
              );
          }
        })}
    </div>
  );
}
