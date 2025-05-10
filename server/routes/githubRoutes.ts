import { Router } from "express";
import {
  handleGetOrganizations,
  handleGetStudentRepos,
  handleGetFileContents,
} from "../controllers/githubController";

const router = Router();

router.get("/organizations", handleGetOrganizations);
router.get("/student-repos", handleGetStudentRepos);
router.post("/repo-files", handleGetFileContents);

export default router;
