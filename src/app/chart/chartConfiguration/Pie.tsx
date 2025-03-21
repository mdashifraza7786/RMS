"use client";
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: any;
  options?: any;
}

const PieChart: React.FC<PieChartProps> = ({ data, options }) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 12,
            family: "'Raleway', sans-serif",
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 13,
          family: "'Raleway', sans-serif",
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
          family: "'Raleway', sans-serif",
        },
        padding: 12,
        cornerRadius: 6,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            const total = context.dataset.data.reduce((acc: number, data: number) => acc + data, 0);
            const value = context.parsed;
            const percentage = Math.round((value / total) * 100);
            return `${context.label}: ${new Intl.NumberFormat('en-US').format(value)} (${percentage}%)`;
          }
        }
      },
    },
    layout: {
      padding: {
        top: 5,
        right: 15,
        bottom: 5,
        left: 15
      }
    },
    cutout: '0%',
    radius: '85%'
  };

  // Merge default options with custom options
  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <div className="chart-container" style={{ height: '400px', width: '100%', position: 'relative' }}>
      <Pie data={data} options={mergedOptions} />
    </div>
  );
};

export default PieChart;
