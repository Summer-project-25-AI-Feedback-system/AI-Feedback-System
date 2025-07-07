import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { validateOrgAccess } from '../middlewares/validateOrgAccess';
import { attachGithubId } from '../middlewares/attachGitHubId';
import { addOrganizations } from '../controllers/supabase/organizationController';
import { getAssignments, addAssignments } from '../controllers/supabase/assignmentController';
import { getRoster, addRoster } from '../controllers/supabase/rosterController';
import { addEvaluations, getEvaluations } from '../controllers/supabase/evaluationController';

const router = express.Router();

// the given org in the URL is the organization ID from github

// -- Organization routes --
// POST organization
router.post('/organizations', isAuthenticated, attachGithubId, addOrganizations);

// -- Assignment routes --
// GET assignment(s) 
router.get('/:org/assignments', isAuthenticated, attachGithubId, validateOrgAccess, getAssignments) 
// POST assignment(s)
router.post('/:org/assignments', isAuthenticated, attachGithubId, validateOrgAccess, addAssignments); 


// -- Roster routes (includes roster students) --
// GET roster
router.get('/:org/roster', isAuthenticated, attachGithubId, validateOrgAccess, getRoster); 
// POST roster
router.post('/:org/roster', isAuthenticated, attachGithubId, validateOrgAccess, addRoster); 


// -- Evaluation routes --
// GET evaluation(s)
router.get('/:org/evaluations', isAuthenticated, attachGithubId, validateOrgAccess, getEvaluations);
// POST evaluation(s)
router.post('/:org/evaluations', isAuthenticated, attachGithubId, validateOrgAccess, addEvaluations);


export default router;