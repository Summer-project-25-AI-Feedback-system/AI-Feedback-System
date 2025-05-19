import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Title, Legend);

type OrgReport = {
  org: string;
  assignments: string[];
  submissions: {
    student: string;
    grades: Record<string, number | string | null>; 
  }[];
};

type AverageGradeChartProps = {
  orgData: OrgReport;
};

export default function AverageGradeChart({ orgData }: AverageGradeChartProps) {
  const labels = orgData.assignments;

  const averages = orgData.assignments.map((assignment) => {
    const grades = orgData.submissions.map((s) => {
      const grade = s.grades[assignment];
      return typeof grade === 'number' ? grade : null;
    }).filter((g): g is number => g !== null);

    const average = grades.length
      ? grades.reduce((a, b) => a + b, 0) / grades.length
      : 0;

    return average.toFixed(2);
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Average Grade',
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
        text: 'Average Grade per Assignment',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100, 
      },
    },
  };

  return (<Bar data={data} options={options} />)
}
