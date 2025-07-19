import { Request, Response, NextFunction } from "express";
import { supabase } from "../utils/supabase";

export const validateOrgAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { org } = req.params;
  const githubId = req.githubId;

  console.log("org:", org);
  console.log("githubId:", githubId);
  if (!githubId) {
    res.status(401).json({ error: "Missing GitHub ID in request." });
    return;
  }

  // find the user
  const { data: userRecord, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("github_id", githubId)
    .single();

  if (userError || !userRecord) {
    res.status(401).json({ error: "User not found in database." });
    return;
  }

  const userId = userRecord.id;

  console.log("userId:", userId);
  // validating access to organization
  const { data: orgData, error: orgError } = await supabase
    .from("organizations")
    .select("id")
    .eq("name", org)
    .eq("owner_id", userId)
    .single();

  if (orgError || !orgData) {
    res
      .status(403)
      .json({ error: "Access denied or organization not found in database." });
    return;
  }

  // send orgId in request
  (req as any).organizationId = orgData.id;

  next();
};
