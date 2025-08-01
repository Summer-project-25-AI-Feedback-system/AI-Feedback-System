import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { validateOrgAccess } from "../middlewares/validateOrgAccess";
import { attachGithubId } from "../middlewares/attachGitHubId";
import {
  addOrganizations,
  getOrgIdFromDB,
} from "../controllers/supabase/organizationController";
import {
  getAssignments,
  addAssignments,
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
const router = express.Router();

// github action self-evaluation from students
router.post("/check-evaluation", checkEvaluationExists);
router.post(
  "/self-evaluation",
  verifyGitHubOIDC(),
  isEvaluated,
  addSelfEvaluation
);

// the given org in the URL is the organization ID from github

router.use(isAuthenticated);

// -- Organization routes --

// get org id
router.get("/organization-id/:orgNum", getOrgIdFromDB);
// POST organization
router.post("/organizations", attachGithubId, addOrganizations);

// -- Assignment routes --
// GET assignment(s)
router.get(
  "/:org/assignments",
  attachGithubId,
  validateOrgAccess,
  getAssignments
);
// POST assignment(s)
router.post(
  "/:org/assignments",
  attachGithubId,
  validateOrgAccess,
  addAssignments
);

// get parent repo's uuid from supabase
// router.get(
//   "/orgs/:orgName/parent-repo-id/:assignmentName/:account",
//   handelGetParentRepoId
// );

// -- Roster routes (includes roster students) --
// GET roster
router.get("/:org/roster", attachGithubId, validateOrgAccess, getRoster);
// POST roster
router.post("/:org/roster", attachGithubId, validateOrgAccess, addRoster);

// -- Evaluation routes --
// GET evaluation(s)
router.get(
  "/:org/evaluations",
  attachGithubId,
  validateOrgAccess,
  getEvaluations
);
// POST evaluation(s)
router.post(
  "/:org/evaluations",
  attachGithubId,
  validateOrgAccess,
  addEvaluations
);

export default router;
