import { Request, Response } from "express";
import { upsertUser } from "../services/supabase/userService";

export const handleCallback = async (req: Request, res: Response) => {
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

    res.redirect(`${process.env.FRONTEND_ORIGIN}/orgs`);
  } catch (error) {
    console.error("User save failed:", error);
    res.status(500).json({ error: "User save failed" });
  }
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
