import { Request, Response } from 'express';
import { fetchEvaluations, createOrUpdateEvaluations } from '../../services/supabase/evaluationService';

export const getEvaluations = async (req: Request, res: Response) => {
  const organizationId = (req as any).organizationId;
  const { github_assignment_id, roster_student_id } = req.query; // the assignment ID if from github, the roster ID is from supabase!

  try {
    const feedback = await fetchEvaluations(organizationId, github_assignment_id as string | undefined, roster_student_id as string | undefined);

    if (!feedback || feedback.length === 0) {
      res.status(204).send();
      return;
    } 

    res.status(200).json(feedback);
  } catch (error: any) {
    console.error('Error fetching evaluations:', error);
    res.status(500).json({
      error: 'Unexpected server error while retrieving assignment evaluations',
    });
  }
};

// TODO: is this still needed or working since the service function was completely changed for Ville's command prompt? is this needed in the frontend at all?
export const addEvaluations = async (req: Request, res: Response) => { 
  const organizationId = (req as any).organizationId;
  const body = req.body;

  try {
    await createOrUpdateEvaluations(organizationId, body);
    res.status(200).send('Evaluation(s) created or updated');
  } catch (error: any) {
    if (error.status === 404) {
      res.status(404).json({ error: error.message });
      return;
    } 
    console.error('Unexpected error storing evaluation(s):', error);
    res.status(500).json({ error: 'Failed to store evaluation(s)' });
  }
}