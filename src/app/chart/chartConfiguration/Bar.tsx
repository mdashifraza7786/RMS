"use client";
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: any;
  options?: any;
}

const BarChart: React.FC<BarChartProps> = ({ data, options }) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 15,
          padding: 20,
          font: {
            size: 12,
            family: "'Raleway', sans-serif",
          },
          usePointStyle: true,
          pointStyle: 'rect',
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
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US').format(context.parsed.y);
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11,
            family: "'Raleway', sans-serif",
          },
          color: 'rgba(100, 100, 100, 0.8)',
          padding: 10,
        },
      },
      y: {
        grid: {
          color: 'rgba(200, 200, 200, 0.15)',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11,
            family: "'Raleway', sans-serif",
          },
          color: 'rgba(100, 100, 100, 0.8)',
          padding: 10,
          callback: function(value: any) {
            return value >= 1000 ? value / 1000 + 'k' : value;
          }
        },
        beginAtZero: true,
      },
    },
    elements: {
      bar: {
        borderWidth: 1,
        borderRadius: 4,
      }
    },
    layout: {
      padding: {
        top: 5,
        right: 20,
        bottom: 5,
        left: 10
      }
    }
  };

  // Merge default options with custom options
  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <div className="chart-container" style={{ height: '400px', width: '100%' }}>
      <Bar data={data} options={mergedOptions} />
    </div>
  );
};

export default BarChart;
