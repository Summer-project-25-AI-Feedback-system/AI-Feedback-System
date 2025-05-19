import { Request, Response } from "express";
import { extractAssignmentName } from "../utils/githubUtils";
import {
  getRepos,
  getAssignments,
  getOrganizations,
  getFileContents,
  getRepositoryFileTree,
} from "../services/github/githubService";

export async function handleGetOrganizations(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const orgs = await getOrganizations();
    res.json(orgs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch organizations" });
  }
}

export async function handleGetAssignments(
  req: Request,
  res: Response
): Promise<void> {
  const org = req.params.orgName;

  if (!org) {
    res.status(400).json({ error: "Organization login not provided" });
    return;
  }
  try {
    const assignmentInfos = await getAssignments(org);
    res.json(assignmentInfos);
  } catch (error: any) {
    console.error("Error fetching assignments:", error.message);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
}

export async function handleGetStudentReposForAssignment(
  req: Request,
  res: Response
): Promise<void> {
  const org = req.params.orgName;
  const assignmentPrefix = req.params.assignmentName;

  if (!org) {
    res.status(400).json({ error: "Missing organization or assignment name" });
    return;
  }

  try {
    const repos = await getRepos(org, assignmentPrefix);
    res.json(repos);
  } catch (error) {
    console.error("Failed to fetch student repos:", error);
    res.status(500).json({ error: "Failed to fetch student repos" });
  }
}

// export async function handleGetFileContents(
//   req: Request,
//   res: Response
// ): Promise<void> {
//   const { owner, repo, files } = req.body;

//   if (!owner || !repo || !Array.isArray(files)) {
//     res
//       .status(400)
//       .json({ error: "Missing required parameters: owner, repo, files[]" });
//     return;
//   }

//   try {
//     const contents = await getFileContents(owner, repo, files);
//     res.json(contents);
//   } catch (error) {
//     console.error("Failed to fetch file contents:", error);
//     res.status(500).json({ error: "Failed to fetch file contents" });
//   }
// }

// export async function handleGetRepoTree(
//   req: Request,
//   res: Response
// ): Promise<void> {
//   const { owner, repo } = req.query;

//   if (!owner || !repo) {
//     res.status(400).json({ error: "Missing required parameters" });
//     return;
//   }

//   try {
//     const tree = await getRepositoryFileTree(owner as string, repo as string);
//     res.json(tree);
//   } catch (error) {
//     console.error("Failed to fetch repo tree:", error);
//     res.status(500).json({ error: "Failed to fetch repository tree" });
//   }
// }

export async function handleRepoFilesWithTree(
  req: Request,
  res: Response
): Promise<void> {
  const { owner, repo } = req.query;

  if (!owner || !repo) {
    res.status(400).json({ error: "Missing required parameters: owner, repo" });
    return;
  }

  try {
    const tree = await getRepositoryFileTree(owner as string, repo as string);
    const filteredTree = tree.filter(
      (path): path is string => path !== undefined
    );
    const contents = await getFileContents(
      owner as string,
      repo as string,
      filteredTree
    );
    res.json(contents);
  } catch (error) {
    console.error("Failed to fetch tree and contents:", error);
    res.status(500).json({ error: "Failed to fetch files" });
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
    const repos = await getRepos(org); 
    const assignmentSet = new Set<string>();
    const studentMap = new Map<string, Record<string, null>>(); 
    for (const repo of repos) {
      const assignment = extractAssignmentName(repo.name); 
      assignmentSet.add(assignment);
      const student = repo.collaborators?.[0]?.login || "Unknown Student";
      // TODO: get grade here later from the db (as given by the AI)
      if (!studentMap.has(student)) {
        studentMap.set(student, {});
      }
      studentMap.get(student)![assignment] = null;
    }
    const responseData = {
      org,
      assignments: Array.from(assignmentSet),
      submissions: Array.from(studentMap.entries()).map(([student, grades]) => ({
        student,
        grades, // all values null for now
      })),
    };
    res.json(responseData);
  } catch (error) {
    console.error("Failed to get all data:", error);
    res.status(500).json({ error: "Failed to generate all data" });
  }
}