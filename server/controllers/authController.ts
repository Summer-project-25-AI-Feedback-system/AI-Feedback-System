import { promises } from "dns";
import { Request, Response } from "express";

export const githubCallback = (req: Request, res: Response) => {
  // console.log("Authenticated user:", req.user);
  res.redirect(`${process.env.FRONTEND_ORIGIN}/orgs`);
};

export const getCurrentUser = (req: Request, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const user = req.user as {
    id: string;
    username: string;
    emails?: { value: string }[];
    profileUrl?: string;
  };

  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.emails?.[0]?.value || "",
      profileUrl: user.profileUrl || "",
    },
  });
};

export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie("afs_session");
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
};
