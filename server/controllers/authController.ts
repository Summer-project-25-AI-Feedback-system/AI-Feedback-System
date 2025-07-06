import { Request, Response } from "express";

export const githubCallback = (req: Request, res: Response) => {
  res.redirect(`${process.env.FRONTEND_ORIGIN}/orgs`);
};

export const getCurrentUser = (req: Request, res: Response) => {
  res.json({ user: req.user });
};

export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ error: "Logout failed" });
    }

    req.session.destroy((sessionErr) => {
      res.clearCookie("afs_session");
      res.clearCookie("connect.sid");

      if (sessionErr) {
        console.error("Session destruction error:", sessionErr);
        return res.status(500).json({ error: "session_cleanup_failed" });
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
};
