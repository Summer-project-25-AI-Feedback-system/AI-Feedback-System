import { Request, Response } from "express";
import {
  createOrUpdateOrganizations,
  getOrganizationIdByGithubOrgId,
  getOrganizations,
} from "../../services/supabase/organizationService";

export const addOrganizations = async (req: Request, res: Response) => {
  const githubId = (req as any).githubId;
  const organizations = req.body;

  try {
    await createOrUpdateOrganizations(githubId, organizations);
    res.status(200).send("Organization(s) created or updated");
  } catch (error: any) {
    if (error.status === 404) {
      res.status(404).json({ error: error.message });
      return;
    }
    console.error("Unexpected error storing organization(s):", error);
    res.status(500).json({ error: "Failed to store organization(s)" });
  }
};

export const handleGetOrganizations = async (req: Request, res: Response) => {
  const githubId = (req as any).githubId;

  try {
    const organizations = await getOrganizations(githubId);
    res.status(200).json(organizations);
  } catch (error: any) {
    console.error("Failed to retrieve organizations:", error);
    res.status(500).json({ error: "Failed to retrieve organizations" });
  }
};

export async function getOrgIdFromDB(
  req: Request,
  res: Response
): Promise<void> {
  const githubOrg = req.params.orgNum;

  try {
    const orgId = await getOrganizationIdByGithubOrgId(githubOrg);
    if (!orgId) res.status(404).json({ error: "Organization not found" });

    res.status(200).json({ organization_id: orgId });
  } catch (error) {
    console.error("Failed to fetch organization ID:", error);
    res.status(500).json({ error: "Failed to retrieve organization ID" });
  }
}
