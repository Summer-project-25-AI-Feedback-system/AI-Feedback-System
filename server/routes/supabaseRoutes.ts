import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { validateOrgAccess } from '../middlewares/validateOrgAccess';
import { getAllOrganizations } from '../controllers/supabase/organizationController';
import { getAssignments, addAssignments } from '../controllers/supabase/assignmentController';
import { getRoster, addRoster } from '../controllers/supabase/rosterController';
import { addFeedback, getFeedback } from '../controllers/supabase/feedbackController';

const router = express.Router();

// the given org in the URL is the organization ID from github

// -- Organization routes --
// GET organizations
router.get('/organizations', isAuthenticated, validateOrgAccess, getAllOrganizations);
// POST organization


// -- Assignment routes --
// GET assignment(s) 
router.get('/:org/assignments', isAuthenticated, validateOrgAccess, getAssignments) 
// POST assignment(s)
router.post('/:org/assignments', isAuthenticated, validateOrgAccess, addAssignments); 


// -- Roster routes (includes roster students) --
// GET roster
router.get('/:org/roster', isAuthenticated, validateOrgAccess, getRoster); 
// POST roster
router.post('/:org/roster', isAuthenticated, validateOrgAccess, addRoster); 


// -- Feedback routes --
// GET feedback(s)
router.get('/:org/feedback', isAuthenticated, validateOrgAccess, getFeedback);
// POST feedback(s)
router.post('/:org/feedback', isAuthenticated, validateOrgAccess, addFeedback);


export default router;