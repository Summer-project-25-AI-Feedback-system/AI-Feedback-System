import type { SingleAssignmentFeedback } from 'src/types/AssignmentFeedback';
import { Bar } from 'react-chartjs-2';

type CommonIssuesChartProps = {
  assignment: SingleAssignmentFeedback;
};

export default function CommonIssuesChart({ assignment }: CommonIssuesChartProps) {
  const allIssues: string[] = assignment.issues;

  const issueCounts = allIssues.reduce<Record<string, number>>((acc, issue) => {
    acc[issue] = (acc[issue] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(issueCounts);
  const dataValues = Object.values(issueCounts);

  const data = {
    labels,
    datasets: [
      {
        label: 'Number of Students',
        data: dataValues,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Common Issues Across Submissions' },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Occurences',
        },
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="p-3">
      <Bar data={data} options={options}/> 
    </div>
  );
}
