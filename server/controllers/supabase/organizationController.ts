import { Request, Response } from 'express';
import { getOrganizations } from '../../services/supabase/organizationService';

export const getAllOrganizations = async (req: Request, res: Response) => {
  try {
    const orgs = await getOrganizations();
    res.json(orgs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};