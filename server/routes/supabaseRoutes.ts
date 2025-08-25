import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { validateOrgAccess } from "../middlewares/validateOrgAccess";
import { attachGithubId } from "../middlewares/attachGitHubId";
import {
  addOrganizations,
  handleGetOrganizations,
  getOrgIdFromDB,
  handleUpdateSubmissionLimit,
} from "../controllers/supabase/organizationController";
import {
  getAssignments,
  addAssignments,
  getAssignmentSubmittedValue,
} from "../controllers/supabase/assignmentController";
import { getRoster, addRoster } from "../controllers/supabase/rosterController";
import {
  addEvaluations,
  getEvaluations,
  addSelfEvaluation,
  checkEvaluationExists,
} from "../controllers/supabase/evaluationController";
import { isEvaluated } from "../middlewares/selfEvaHelper";
import { verifyGitHubOIDC } from "../middlewares/verifyGitHubOIDC";
import { getAssignmentIssuesForOrg } from "../controllers/supabase/assignmentIssuesController";
import { getAllAnalyticsData } from "../controllers/supabase/analyticsInfoController";
const router = express.Router();

// github action self-evaluation from students
router.post("/check-evaluation", checkEvaluationExists);
router.post(
  "/self-evaluation",
  verifyGitHubOIDC(),
  isEvaluated,
  addSelfEvaluation
);

// the given org in each URL is the organization ID from github

router.use(isAuthenticated);

// -- Organization routes --
// GET organization ID
router.get("/organization-id/:orgNum", getOrgIdFromDB);

router.get("/organizations", attachGithubId, handleGetOrganizations);
// POST organization
router.post("/organizations", attachGithubId, addOrganizations);

// -- Assignment routes --
// GET assignment(s)
router.get(
  "/:orgId/assignments",
  attachGithubId,
  validateOrgAccess,
  getAssignments
);
// POST assignment(s)
router.post(
  "/:orgId/assignments",
  attachGithubId,
  validateOrgAccess,
  addAssignments
);
// GET assignment submitted value
router.get("/:orgId/assignments/submitted", attachGithubId, validateOrgAccess, getAssignmentSubmittedValue)

// -- Roster routes (includes roster students) --
// GET roster
router.get("/:orgId/roster", attachGithubId, validateOrgAccess, getRoster);
// POST roster
router.post("/:orgId/roster", attachGithubId, validateOrgAccess, addRoster);

// -- Evaluation routes --
// GET evaluation(s)
router.get(
  "/:orgId/evaluations",
  attachGithubId,
  validateOrgAccess,
  getEvaluations
);
// POST evaluation(s)
router.post(
  "/:orgId/evaluations",
  attachGithubId,
  validateOrgAccess,
  addEvaluations
);

// -- Assignment issue routes --
// GET assignment issues
router.get("/:orgId/assignment-issues", attachGithubId, validateOrgAccess, getAssignmentIssuesForOrg)

// -- Analytics data route --
// GET analytics data
router.get("/:orgId/analytics-data", attachGithubId, validateOrgAccess, getAllAnalyticsData)


router.put(
  "/organizations/:orgId/submission-limit",
  attachGithubId,
  validateOrgAccess,
  handleUpdateSubmissionLimit
);

export default router;
