import { Request, Response, NextFunction } from "express";

export const attachGithubId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || !(req.user as any).id) {
    res.status(401).json({ error: "Unauthorized: GitHub ID missing" });
    return;
  }

  req.githubId = (req.user as any).id;
  next();
};
