import { Request, Response } from "express";

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
      console.error("Logout error:", err);
      return res.status(500).json({ error: "Logout failed" });
    }
    req.session.destroy((err) => {
      res.clearCookie("afs_session");
      res.clearCookie("connect.sid");

      if (err) {
        console.error("Session destruction error:", err);
        return res.redirect(
          `${process.env.FRONTEND_ORIGIN}/error?message=session_cleanup_failed`
        );
      }
      res.redirect(`${process.env.FRONTEND_ORIGIN}`);
    });
  });
};
