import { Router } from "express";
import { getStudentRepos } from "../services/githubChecker";

const router = Router();

// Example route to get student repos
router.get("/student-repos", async (req, res) => {
  try {
    const repos = await getStudentRepos(); // Add logic in github_checker
    res.json(repos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch student repos" });
  }
});

export default router;
