import { FC } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  PointElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement);

interface LineChartProps {
  data: ChartData<'line'>;
  options?: ChartOptions<'line'>; // Made options prop optional
}

const LineChart: FC<LineChartProps> = ({ data, options }) => {
  const defaultOptions: ChartOptions<'line'> = {
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

  return <Line data={data} options={options || defaultOptions} />;
};

export default LineChart;
