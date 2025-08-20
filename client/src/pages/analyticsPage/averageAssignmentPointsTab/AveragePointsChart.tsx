import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Title, Legend } from 'chart.js';
import type { AnalyticsResponse } from '@shared/supabaseInterfaces';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Title, Legend);

type AverageGradeChartProps = {
  analyticsData: AnalyticsResponse;
};

export default function AveragePointsChart({ analyticsData }: AverageGradeChartProps) {
  const labels = analyticsData.assignments.map(a => a.name);

  const averages = analyticsData.assignments.map((assignment) => {
    const maxPoints = assignment.max_points;
    if (!maxPoints || maxPoints === 0) return 0;

    const percentages = analyticsData.submissions
      .map(sub => {
        const grade = sub.grades.find(g => g.assignmentId === assignment.id);
        if (!grade || grade.evaluations.length === 0) {
          return null; 
        }
    
        const totalPoints = grade.evaluations.reduce((sum, ev) => sum + (ev.total_score ?? 0), 0);
        const avgPoints = grade.evaluations.length > 0 ? totalPoints / grade.evaluations.length : 0;

        return (avgPoints / maxPoints) * 100;
      })
      .filter((g): g is number => g !== null);

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
