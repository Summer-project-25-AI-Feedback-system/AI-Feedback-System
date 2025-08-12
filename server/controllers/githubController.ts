import { Request, Response } from "express";
import { extractAssignmentName } from "../utils/githubUtils";
import {
  getOrganizations,
  getOrganization,
  getListOfAssignments,
  getAssignmentClassroomInfo,
  getStudentReposForAssignment,
  getCommits,
  getRepoTree,
  getFileContents,
  compareCommits,
  getParentRepoId,
  getOrganizationIdByName,
} from "../services/github/githubService";

export async function handleGetOrganizations(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const orgs = await getOrganizations();
    res.json(orgs);
  } catch (error) {
    console.error("Failed to fetch organizations:", error);
    res.status(500).json({ error: "Failed to fetch organizations" });
  }
}

export async function handleGetOrganizationIdByName(
  req: Request,
  res: Response
): Promise<void> {
  const orgName = req.params.orgName;
  if (!orgName) {
    res.status(400).json({ error: "Organization name not provided" });
    return;
  }

  try {
    const orgId = await getOrganizationIdByName(orgName);
    res.json(orgId);
  } catch (error) {
    console.error("Failed to fetch organizations ID:", error);
    res.status(500).json({ error: "Failed to fetch organizations ID." });
  }
}

export async function handleGetAssignments(
  req: Request,
  res: Response
): Promise<void> {
  const orgName = req.params.orgName;

  if (!orgName) {
    res.status(400).json({ error: "Organization not provided" });
    return;
  }

  try {
    const assignments = await getListOfAssignments(orgName);
    res.json(assignments);
  } catch (error: any) {
    console.error("Failed to fetch assignments:", error);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
}

export async function handleGetAssignmentClassroomInfo(
  req: Request,
  res: Response
): Promise<void> {
  const orgName = req.params.orgName;

  if (!orgName) {
    res.status(400).json({ error: "Organization name not provided" });
    return;
  }

  try {
    const assignmentClassroomInfo = await getAssignmentClassroomInfo(orgName);

    res.json(assignmentClassroomInfo);
  } catch (err) {
    console.warn(`Failed to fetch assignments' classroom info`, err);
    res
      .status(500)
      .json({ error: "Failed to fetch assignments' classroom info" });
  }
}

export async function handleGetStudentReposForAssignment(
  req: Request,
  res: Response
): Promise<void> {
  const orgName = req.params.orgName;
  const assignmentName = req.params.assignmentName;

  if (!orgName) {
    res.status(400).json({ error: "Missing organization or assignment name" });
    return;
  }

  try {
    const repos = await getStudentReposForAssignment(orgName, assignmentName);
    res.json(repos);
  } catch (error) {
    console.error("Failed to fetch student repos:", error);
    res.status(500).json({ error: "Failed to fetch student repos" });
  }
}

export async function handleGetCommits(
  req: Request,
  res: Response
): Promise<void> {
  const { orgName, repoName } = req.params;

  try {
    const commits = await getCommits(orgName, repoName);
    res.json(commits);
  } catch (error) {
    console.error("Failed to fetch commits:", error);
    res.status(500).json({ error: "Failed to fetch commits" });
  }
}

export async function handleGetRepoTree(
  req: Request,
  res: Response
): Promise<void> {
  const { orgName, repoName } = req.params;

  if (!orgName || !repoName) {
    res
      .status(400)
      .json({ error: "Organization and repository names are required" });
    return;
  }

  try {
    const tree = await getRepoTree(orgName as string, repoName as string);
    res.json(tree);
  } catch (error) {
    console.error("Failed to fetch repository tree:", error);
    res.status(500).json({ error: "Failed to fetch repository tree" });
  }
}

export async function handleGetFileContents(
  req: Request,
  res: Response
): Promise<void> {
  const { orgName, repoName } = req.params;
  const path = req.query.path as string;

  if (!orgName || !repoName || !path) {
    res.status(400).json({
      error: "Organization, repository and path are required",
    });
    return;
  }

  try {
    const contents = await getFileContents(orgName, repoName, path);
    if (contents === null) {
      res.status(404).json({ error: "File not found" });
      return;
    }
    res.json(contents);
  } catch (error) {
    console.error("Failed to fetch file contents:", error);
    res.status(500).json({ error: "Failed to fetch file contents" });
  }
}

export async function handleCompareCommits(
  req: Request,
  res: Response
): Promise<void> {
  const orgName = req.params.orgName;
  const repoName = req.params.repoName;
  const base = req.params.base;
  const head = req.params.head;

  if (!orgName || !repoName || !base || !head) {
    res.status(400).json({
      error: "Organization, repository, base and head commits are required",
    });
    return;
  }

  try {
    const comparison = await compareCommits(orgName, repoName, base, head);
    res.json(comparison);
  } catch (error) {
    console.error("Failed to compare commits:", error);
    res.status(500).json({ error: "Failed to compare commits" });
  }
}

export async function handleGetAllOrganizationData(
  req: Request,
  res: Response
): Promise<void> {
  const org = req.query.org as string;

  if (!org) {
    res.status(400).json({ error: "Missing organization parameter" });
    return;
  }

  try {
    const orgInfo = await getOrganization(org);
    const repos = await getStudentReposForAssignment(org);
    const assignmentSet = new Set<string>();
    const studentMap = new Map<string, Record<string, null>>();

    for (const repo of repos) {
      const assignment = extractAssignmentName(repo.name);
      assignmentSet.add(assignment);
      const student = repo.collaborators?.[0]?.name || "Unknown Student";
      // TODO: get grade here later from the db (as given by the AI)

      if (!studentMap.has(student)) {
        studentMap.set(student, {});
      }

      studentMap.get(student)![assignment] = null;
    }

    const responseData = {
      org,
      orgId: orgInfo.id,
      assignments: Array.from(assignmentSet),
      submissions: Array.from(studentMap.entries()).map(
        ([student, grades]) => ({
          student,
          grades, // all values null for now
        })
      ),
    };

    res.json(responseData);
  } catch (error) {
    console.error("Failed to get all data:", error);
    res.status(500).json({ error: "Failed to generate all data" });
  }
}

// export async function handelGetParentRepoId(
//   req: Request,
//   res: Response
// ): Promise<void> {
//   const { orgName, repoName } = req.params;

//   if (!orgName || !repoName) {
//     res
//       .status(400)
//       .json({ error: "Missing orgName, assignmentName or account" });
//     return;
//   }

//   try {
//     const repoId = await getParentRepoId(orgName, repoName);
//     if (!repoId) {
//       res.status(404).json({ error: "Parent repository not found" });
//       return;
//     }

//     res.status(200).json({ parent_repo_id: repoId });
//   } catch (error) {
//     console.error("Error fetching parent repo ID:", error);
//     res.status(500).json({ error: "Failed to fetch parent repo ID" });
//   }
// }
