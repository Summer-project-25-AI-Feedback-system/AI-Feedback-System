import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

export const githubCallback = (req: Request, res: Response) => {
  console.log("Authenticated user:", req.user);
  res.redirect(`${process.env.FRONTEND_ORIGIN}/repos`);
};

export const getCurrentUser = (req: Request, res: Response) => {
  // console.log("Session info:", req.session);
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ user: null });
  }
};

export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
};
