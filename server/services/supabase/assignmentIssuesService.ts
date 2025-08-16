import { AssignmentCommonIssues, CommonIssuesInput } from "@shared/supabaseInterfaces";
import { supabase } from "../../utils/supabase";

export const fetchAssignmentIssues = async (
  organizationId: string
): Promise<AssignmentCommonIssues[]> => {
  const { data, error } = await supabase.rpc(
    "get_org_assignment_common_issues",
    { org_id: organizationId }
  );

  if (error) throw error;
  return data;
}

export const addOrUpdateAssignmentCommonIssues = async (
  commonIssues: CommonIssuesInput[],
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