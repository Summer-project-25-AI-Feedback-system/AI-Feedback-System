import { Router } from "express";
import { handleGetStudentRepos } from "../controllers/githubController";

const router = Router();

router.get("/student-repos", handleGetStudentRepos);

export default router;
