import { Bar } from 'react-chartjs-2';
import type { OrgReport } from 'src/types/OrgReport';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Title, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Title, Legend);

type AverageGradeChartProps = {
  orgData: OrgReport;
  maxPointsPerAssignment: { [assignmentName: string]: number };
};

export default function AveragePointsChart({ orgData, maxPointsPerAssignment }: AverageGradeChartProps) {
  const labels = orgData.assignments;

  const averages = orgData.assignments.map((assignment) => {
    const maxPoints = maxPointsPerAssignment[assignment];
    if (!maxPoints || maxPoints === 0) return 0;
    const percentages = orgData.submissions.map((s) => {
      const grade = s.grades[assignment];
      return typeof grade === 'number' ? (grade / maxPoints) * 100 : null;
    }).filter((g): g is number => g !== null);

    const average = percentages.length
      ? percentages.reduce((a, b) => a + b, 0) / percentages.length
      : 0;

    return average.toFixed(2);
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Average % of Points',
        data: averages,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Average Percentage of Points per Assignment',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100, 
        ticks: {
          callback: (value: number | string ) => `${value}%`,
        },
      },
    },
  };

  return (<Bar data={data} options={options} />)
}
