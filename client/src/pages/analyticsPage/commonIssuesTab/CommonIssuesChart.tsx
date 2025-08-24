import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Title, Legend } from 'chart.js';
import type { AssignmentWithIssues } from '@shared/supabaseInterfaces';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Title, Legend);

type CommonIssuesChartProps = {
  assignment: AssignmentWithIssues;
};

export default function CommonIssuesChart({ assignment }: CommonIssuesChartProps) {
  const labels = assignment.issues.map(issue => issue.name);
  const dataValues = assignment.issues.map(issue => issue.count);

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
