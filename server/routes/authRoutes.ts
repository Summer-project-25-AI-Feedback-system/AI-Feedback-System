import { Router, Request, Response } from "express";
import passport from "../utils/passport";
import {
  handleCallback,
  getCurrentUser,
  logout,
} from "../controllers/authController";

import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Router();

// Authentication routes
router.get(
  "/login",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  handleCallback
);
// Session routes
router.get("/current", isAuthenticated, getCurrentUser);

router.get("/logout", isAuthenticated, logout);

export default router;
