import { Request, Response } from 'express';
import { fetchFeedback, createOrUpdateFeedbacks } from '../../services/supabase/feedbackService';

export const getFeedback = async (req: Request, res: Response) => {
  const organizationId = (req as any).organizationId;
  const { github_assignment_id, roster_student_id } = req.query; // the assignment ID if from github, the roster ID is from supabase!

  try {
    const feedback = await fetchFeedback(organizationId, github_assignment_id as string | undefined, roster_student_id as string | undefined);

    if (!feedback || feedback.length === 0) {
      res.status(204).send();
      return;
    }

    res.status(200).json(feedback);
  } catch (error: any) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      error: 'Unexpected server error while retrieving assignment feedback',
    });
  }
};

export const addFeedback = async (req: Request, res: Response) => { 
  const organizationId = (req as any).organizationId;
  const body = req.body;

  try {
    await createOrUpdateFeedbacks(organizationId, body);
    res.status(200).send('Feedback(s) created or updated');
  } catch (error: any) {
    if (error.status === 404) {
      res.status(404).json({ error: error.message });
      return;
    } 
    console.error('Unexpected error storing feedback(s):', error);
    res.status(500).json({ error: 'Failed to store feedback(s)' });
  }
}