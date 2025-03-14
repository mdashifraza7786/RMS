// components/BarChart.tsx
import { FC } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  data: ChartData<'bar'>;
  options?: ChartOptions<'bar'>; // Made options prop optional
}

const BarChart: FC<BarChartProps> = ({ data, options }) => {
  const defaultOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        // text: '',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'X Axis Label',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Y Axis Label',
        },
      },
    },
  };

  return <Bar data={data} options={options || defaultOptions} />;
};

export default BarChart;
