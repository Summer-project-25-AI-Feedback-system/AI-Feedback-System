import { Router } from "express";
import {
  handleGetOrganizations,
  handleGetAssignments,
  handleGetStudentRepos,
  // handleGetFileContents,
  // handleGetRepoTree,
  handleRepoFilesWithTree,
} from "../controllers/githubController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Router();

router.use(isAuthenticated);

router.get("/orgs", handleGetOrganizations);
router.get("/orgs/:orgLogin/assignments", handleGetAssignments);
router.get("/student-repos", handleGetStudentRepos);
// router.post("/repo-files", handleGetFileContents);
// router.get("/repo-tree", handleGetRepoTree);
router.get("/repo-tree-and-files", handleRepoFilesWithTree);

export default router;
