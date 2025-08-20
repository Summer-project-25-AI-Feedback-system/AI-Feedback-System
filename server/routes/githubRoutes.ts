import { Router } from "express";
import {
  handleGetOrganizations,
  handleGetAssignments,
  handleGetAssignmentClassroomInfo,
  handleGetStudentReposForAssignment,
  handleGetFileContents,
  handleGetRepoTree,
  handleGetAllOrganizationData,
  handleGetCommits,
  handleCompareCommits,
  handleGetOrganizationIdByName,
  handleGetCommitCount,
} from "../controllers/githubController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Router();

router.get("/repos/commits/count", handleGetCommitCount);

router.use(isAuthenticated);

router.get("/orgs", handleGetOrganizations);
router.get("/orgs/:orgName/getOrgId", handleGetOrganizationIdByName);
router.get("/orgs/:orgName/assignments", handleGetAssignments);
router.get(
  "/orgs/:orgName/assignmentClassroomInfo",
  handleGetAssignmentClassroomInfo
);
router.get(
  "/orgs/:orgName/assignments/:assignmentName/repos",
  handleGetStudentReposForAssignment
);

// Repository routes
router.get("/repos/:orgName/:repoName/commits", handleGetCommits);
router.get("/repos/:orgName/:repoName/tree", handleGetRepoTree);
router.get("/repos/:orgName/:repoName/contents", handleGetFileContents);
router.get(
  "/repos/:orgName/:repoName/compare/:base/:head",
  handleCompareCommits
);

// Reporting route
router.get("/org-report", handleGetAllOrganizationData);

// router.get("/get-parent-id/:orgName/:repoName", handelGetParentRepoId);

export default router;
