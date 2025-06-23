import { Request, Response } from 'express';
import { getOrganizations, createOrUpdateOrganizations } from '../../services/supabase/organizationService';
import type { OrgInfo } from '@shared/githubInterfaces';

export const getAllOrganizations = async (req: Request, res: Response) => {
  try {
    const orgs = await getOrganizations();
    res.json(orgs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addOrganizations = async (req: Request, res: Response) => {
  const githubId = (req as any).githubId;
  const body = req.body;

  try {
    const organizations = body.map((org: OrgInfo) => ({
      name: org.name,
      external_github_org_id: String(org.id),
    }));

    await createOrUpdateOrganizations(githubId, organizations);
    res.status(200).send('Organization(s) created or updated');
  } catch (error: any) {
    if (error.status === 404) {
      res.status(404).json({ error: error.message });
      return;
    } 
    console.error('Unexpected error storing organization(s):', error);
    res.status(500).json({ error: 'Failed to store organization(s)' });
  }
};