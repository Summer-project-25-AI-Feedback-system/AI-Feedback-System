import { Router } from "express";
import {
  handleGetOrganizations,
  handleGetStudentRepos,
  // handleGetFileContents,
  // handleGetRepoTree,
  handleRepoFilesWithTree,
  handleGetAllOrganizationData
} from "../controllers/githubController";

const router = Router();

router.get("/organizations", handleGetOrganizations);
router.get("/student-repos", handleGetStudentRepos);
// router.post("/repo-files", handleGetFileContents);
// router.get("/repo-tree", handleGetRepoTree);
router.get("/repo-tree-and-files", handleRepoFilesWithTree);
router.get("/org-report", handleGetAllOrganizationData);

export default router;
