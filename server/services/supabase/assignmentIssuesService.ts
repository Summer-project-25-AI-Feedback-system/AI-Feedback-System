import { CommonIssues } from "@shared/supabaseInterfaces";
import { supabase } from "../../utils/supabase";

// we get the common issues from the common issue table
export const fetchAssignmentCommonIssues = async (

 ) => {

}

export const addOrUpdateAssignmentCommonIssues = async (
  commonIssues: CommonIssues[],
  assignmentId: string
) => {
  const names = commonIssues.map(i => i.name);

  const { data: issues, error: issuesErr } = await supabase
    .from("common_issues")
    .select("id, name")
    .in("name", names);

  if (issuesErr) throw issuesErr;

  const nameToId: Record<string, string> = {};
  issues.forEach(issue => {
    nameToId[issue.name] = issue.id;
  });

  const issueIds = commonIssues
    .filter(i => nameToId[i.name])
    .map(i => nameToId[i.name]);

  if (!issueIds.length) {
    throw new Error(`No valid issue IDs found`);
  };

  const { error: rpcErr } = await supabase.rpc("increment_assignment_issues", {
    assignment: assignmentId,
    issue_ids: issueIds
  });

  if (rpcErr) throw rpcErr;
}