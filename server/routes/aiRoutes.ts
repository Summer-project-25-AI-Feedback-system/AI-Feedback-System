import express from "express";
import {
  handleRunRepomix,
  handleRunAIEvolution,
} from "../controllers/aiController";

const router = express.Router();

router.post("/run-repomix", handleRunRepomix);
router.post("/run-aievolution", handleRunAIEvolution);

export default router;
