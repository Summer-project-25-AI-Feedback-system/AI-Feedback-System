/* import { Request } from "express";

export const attachGithubId = (req: Request): string | null => {
  if (!req.user || !(req.user as any).id) {
    return null;
  }

  req.githubId = (req.user as any).id;
  return;
}; */