import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

export const githubCallback = (req: Request, res: Response) => {
  // console.log("Authenticated user:", req.user);
  res.redirect(`${process.env.FRONTEND_ORIGIN}/orgs`);
};

export const getCurrentUser = (req: Request, res: Response) => {
  res.json({ user: req.user });
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
