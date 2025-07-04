import type { OrgReport } from "src/types/OrgReport";
import AveragePointsChart from "./AveragePointsChart";
import Spinner from "../../../components/Spinner";

type AveragePointsTabProps = {
  orgData: OrgReport;
  maxPointsPerAssignment: { [assignmentName: string]: number };
};

export default function AveragePointsTab({ orgData, maxPointsPerAssignment }: AveragePointsTabProps) {
  const loading =
    !orgData ||
    !maxPointsPerAssignment ||
    Object.keys(maxPointsPerAssignment).length === 0;

  return (
    <div>
       {loading ? (
            <Spinner />
        ) : (
            <AveragePointsChart 
                orgData={orgData}
                maxPointsPerAssignment={maxPointsPerAssignment}
            />
        )}
    </div>
  )
}
