import { Router, Request, Response } from "express";
import passport from "../utils/passport";
import {
  handleCallback,
  getCurrentUser,
  logout,
} from "../controllers/authController";

import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Router();

router.get(
  "/login",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  handleCallback
);

router.get("/getCurrentUser", isAuthenticated, getCurrentUser);

router.get("/logout", isAuthenticated, logout);

export default router;
