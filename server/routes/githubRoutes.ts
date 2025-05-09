import { Router } from "express";
import {
  handleGetOrganizations,
  handleGetStudentRepos,
} from "../controllers/githubController";

const router = Router();

router.get("/organizations", handleGetOrganizations);
router.get("/student-repos", handleGetStudentRepos);

export default router;
