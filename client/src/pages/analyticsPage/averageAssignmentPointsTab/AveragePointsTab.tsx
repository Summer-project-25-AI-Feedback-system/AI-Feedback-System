import AveragePointsChart from "./AveragePointsChart";
import Spinner from "../../../components/Spinner";
import type { AnalyticsResponse } from "@shared/supabaseInterfaces";

type AveragePointsTabProps = {
  analyticsData: AnalyticsResponse;
};

export default function AveragePointsTab({ analyticsData }: AveragePointsTabProps) {
  const loading =
    !analyticsData ||
    analyticsData.assignments.length === 0 ||
    analyticsData.submissions.length === 0;

  return (
    <div>
       {loading ? (
            <Spinner />
        ) : (
            <AveragePointsChart 
                analyticsData={analyticsData}
            />
        )}
    </div>
  )
}
