import { Request, Response } from 'express';
import { createOrUpdateOrganizations } from '../../services/supabase/organizationService';

export const addOrganizations = async (req: Request, res: Response) => {
  const githubId = (req as any).githubId;
  const organizations = req.body;

  try {
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