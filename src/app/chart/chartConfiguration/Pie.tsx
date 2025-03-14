import { FC } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions, ChartData } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: ChartData<'pie'>;
}

const PieChart: FC<PieChartProps> = ({ data }) => {
  const defaultOptions: ChartOptions<'pie'> = {
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
  };

  return <Pie className='absolute' data={data} options={defaultOptions} />;
};

export default PieChart;
