import Spinner from "../../../components/Spinner";
import type { AnalyticsResponse } from "@shared/supabaseInterfaces";
import AveragePointsList from "./AveragePointsList";

type AveragePointsTabProps = {
  analyticsData: AnalyticsResponse;
};

export default function AveragePointsTab({ analyticsData }: AveragePointsTabProps) {
  const loading = !analyticsData;

  if (analyticsData.assignments.length === 0 || analyticsData.submissions.length === 0) { 
    return ( <p className="text-gray-500 italic"> There are no average assignment points yet. </p> ); 
  }

  return (
    <div>
       {loading ? (
            <Spinner />
        ) : (
          <div>
            <h2 className="text-[16px] mb-6">
              The average amount of points students have gained for each respective assignment.
            </h2>
            <AveragePointsList
                analyticsData={analyticsData}
            />
          </div>
        )}
    </div>
  )
}
