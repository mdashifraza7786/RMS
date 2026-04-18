"use client";
import React from 'react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface BarChartProps {
  data: any; // Supporting old Chart.js format temporarily
  options?: any;
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  // Convert Chart.js format to Recharts format if necessary
  const formattedData = data.labels?.map((label: string, index: number) => {
    const entry: any = { name: label };
    data.datasets.forEach((dataset: any) => {
      entry[dataset.label] = dataset.data[index];
    });
    return entry;
  }) || [];

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={formattedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend iconType="rect" />
          {data.datasets.map((dataset: any, index: number) => (
            <Bar 
              key={dataset.label} 
              dataKey={dataset.label} 
              fill={Array.isArray(dataset.backgroundColor) ? dataset.backgroundColor[0] : dataset.backgroundColor} 
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
