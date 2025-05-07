import { Request, Response } from "express";

export const githubCallback = (req: Request, res: Response) => {
  // On success, redirect to dashboard or send a token
  console.log("Authenticated user:", req.user);
  res.json({ message: "Authentication successful", user: req.user });
  //   res.redirect("/dashboard");
};
