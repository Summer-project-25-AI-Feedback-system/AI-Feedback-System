import { Router, Request, Response } from "express";
import passport from "../utils/passport";
import dotenv from "dotenv";
import {
  githubCallback,
  getCurrentUser,
  logout,
} from "../controllers/authController";
import { upsertUser } from "../services/supabase/userService";

import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Router();

router.get(
  "/login",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req: Request, res: Response) => {
    try {
      const user = req.user as {
        id: string;
        username: string;
        emails?: { value: string }[];
        profileUrl?: string;
      };

      await upsertUser(
        user.id,
        user.username,
        user.emails?.[0]?.value || "",
        user.profileUrl || ""
      );

      githubCallback(req, res);
    } catch (error) {
      console.error("User save failed:", error);
      res.status(500).json({ error: "User save failed" });
    }
  }
);

router.get("/getCurrentUser", isAuthenticated, getCurrentUser);

router.get("/logout", isAuthenticated, logout);

export default router;
