import { Router } from "express";
import passport from "../utils/passport";
import dotenv from "dotenv";
import {
  githubCallback,
  getCurrentUser,
  logout,
} from "../controllers/authController";

import { isAuthenticated } from "../middlewares/isAuthenticated";

dotenv.config();
const router = Router();

router.get(
  "/login",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  githubCallback
);
router.get("/getCurrentUser", isAuthenticated, getCurrentUser);
router.get("/logout", isAuthenticated, logout);

export default router;
