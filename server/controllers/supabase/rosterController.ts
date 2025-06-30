import { Request, Response } from 'express';
import { fetchRoster, createOrUpdateRoster } from '../../services/supabase/rosterService';

export const getRoster = async (req: Request, res: Response) => {
  const organizationId = (req as any).organizationId;

  try {
    const roster = await fetchRoster(organizationId);

    res.status(200).json(roster);
  } catch (error: any) {
    console.error('Error fetching roster:', error);
    res.status(500).json({ error: 'Unexpected server error while retrieving roster' });
  }
};

export const addRoster = async (req: Request, res: Response) => {
  const organizationId = (req as any).organizationId;
  const rosterData = req.body; // needs to include students as well

  try {
    await createOrUpdateRoster(organizationId, rosterData);
    res.status(201).send('Roster created');
  } catch (error: any) {
    console.error('Error creating roster:', error);
    res.status(500).json({ error: 'Failed to add roster' });
  }
};