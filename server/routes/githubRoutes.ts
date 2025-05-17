import { Router } from "express";
import {
  handleGetOrganizations,
  handleGetAssignments,
  handleGetRepos,
  // handleGetFileContents,
  // handleGetRepoTree,
  handleRepoFilesWithTree,
} from "../controllers/githubController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Router();

router.use(isAuthenticated);

router.get("/orgs", handleGetOrganizations);
router.get("/orgs/:orgName/assignments", handleGetAssignments);
router.get("/orgs/:orgName/assignments/:assignmentName", handleGetRepos);
// router.post("/repo-files", handleGetFileContents);
// router.get("/repo-tree", handleGetRepoTree);
// router.get("/repo-tree-and-files", handleRepoFilesWithTree);

export default router;
