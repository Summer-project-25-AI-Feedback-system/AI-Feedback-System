import { Router } from "express";
import passport from "../utils/passport";
import dotenv from "dotenv";
import {
  githubCallback,
  getCurrentUser,
  logout,
} from "../controllers/authController";
import { upsertUser } from "../services/UserService"; 

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
  async (req, res) => {
    try {
      const user = req.user as {
        id: string;
        username: string;
        emails?: { value: string }[];
        profileUrl?: string;
      };

      const githubId = user.id;
      const username = user.username;
      const email = user.emails?.[0]?.value || ""; // fallback jos ei ole emailia
      const githubUrl = user.profileUrl || "";

      await upsertUser(githubId, username, email, githubUrl);

      res.redirect("http://localhost:5173/"); // tai frontend URL
    } catch (error) {
      console.error("Tallennus epäonnistui:", error);
      res.status(500).json({ error: "Käyttäjän tallennus epäonnistui" });
    }
  }
);
router.get("/getCurrentUser", isAuthenticated, getCurrentUser);
router.get("/logout", isAuthenticated, logout);

export default router;
