import { useNavigate } from "react-router-dom";
import ListHeader from "./ListHeader";
import ListItem from "./ListItem";
import type { StudentSubmissionInfo } from "../../types/StudentSubmissionInfo";
import type {
  AssignmentInfo,
  OrgInfo,
  RepoInfo,
} from "@shared/githubInterfaces";

type BasicListProps =
  | { type: "org"; items: OrgInfo[] }
  | { type: "assignment"; items: AssignmentInfo[]; orgName: string }
  | { type: "repo"; items: RepoInfo[]; orgName: string; assignmentName: string }
  | { type: "submission"; items: StudentSubmissionInfo[] };

export default function BasicList(props: BasicListProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <ListHeader type={props.type} />

      {props.items.map((item, index) => {
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
                    `/orgs/${props.orgName}/assignments/${
                      props.assignmentName
                    }/${(item as RepoInfo).id}`
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
