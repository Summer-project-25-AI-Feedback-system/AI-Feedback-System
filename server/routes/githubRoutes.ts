import { Router } from "express";
import {
  handleGetOrganizations,
  handleGetAssignments,
  handleGetStudentReposForAssignment,
  // handleGetFileContents,
  // handleGetRepoTree,
  handleRepoFilesWithTree,
  handleGetAllOrganizationData
} from "../controllers/githubController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Router();

router.use(isAuthenticated);

router.get("/orgs", handleGetOrganizations);
router.get("/orgs/:orgName/assignments", handleGetAssignments);
router.get(
  "/orgs/:orgName/assignments/:assignmentName/repos",
  handleGetStudentReposForAssignment
);
// router.post("/repo-files", handleGetFileContents);
// router.get("/repo-tree", handleGetRepoTree);
// router.get("/repo-tree-and-files", handleRepoFilesWithTree);
router.get("/org-report", handleGetAllOrganizationData);

export default router;
