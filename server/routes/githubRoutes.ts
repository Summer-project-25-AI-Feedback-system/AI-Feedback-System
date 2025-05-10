import { Router } from "express";
import {
  handleGetOrganizations,
  handleGetStudentRepos,
  // handleGetFileContents,
  // handleGetRepoTree,
  handleRepoFilesWithTree,
} from "../controllers/githubController";

const router = Router();

router.get("/organizations", handleGetOrganizations);
router.get("/student-repos", handleGetStudentRepos);
// router.post("/repo-files", handleGetFileContents);
// router.get("/repo-tree", handleGetRepoTree);
router.get("/repo-tree-and-files", handleRepoFilesWithTree);

export default router;
