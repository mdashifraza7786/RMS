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
  Filler,
  PointElement,
  ChartOptions,
  ChartData,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, Filler, PointElement);

interface AreaChartProps {
  data: ChartData<'line'>;
  options?: ChartOptions<'line'>;
}

const AreaChart: FC<AreaChartProps> = ({ data, options }) => {
  // Default options for the area chart
  const defaultOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Trend (Area Chart)',
      },
    },
    elements: {
      line: {
        tension: 0.4, // Smooth curves for the line
        fill: true,   // Fill the area under the line
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

  // Return the Line chart component with data and options
  return <Line data={data} options={options || defaultOptions} />;
};

export default AreaChart;
