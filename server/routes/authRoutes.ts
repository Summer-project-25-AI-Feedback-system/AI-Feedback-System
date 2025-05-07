import { Router } from "express";
import passport from "../utils/passport";
import dotenv from "dotenv";
import { githubCallback } from "../controllers/authController";

dotenv.config();
const router = Router();

// GitHub login route (start GitHub OAuth flow)
router.get(
  "/login",
  passport.authenticate("github", { scope: ["user:email"] })
);

// GitHub callback route (handle GitHub OAuth response)
router.get(
  "/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  githubCallback
);

export default router;
