"use client";

import React, { useState, useEffect, useMemo } from 'react';
import BarChart from '../chartConfiguration/Bar';
import PieChart from '../chartConfiguration/Pie';
import LineChart from '../chartConfiguration/Line';
import { ChartOptions } from 'chart.js';

type ChartKey =
    'Chef vs Ratings' |
    'Chef vs Orders Served';

const ChefChart: React.FC = () => {
    const [chartXY, setChartXY] = useState<ChartKey>('Chef vs Ratings');
    const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');
    const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
    const [comparisonMode, setComparisonMode] = useState(false);

    useEffect(() => {
        document.title = "ChefChart";
    }, []);

    const colors = useMemo(() => [
        '#00589C', '#016FC4', '#1891C3', '#3AC0DA', '#3DC6C3', '#50E3C2',
        '#F3BA4D', '#F94144', '#F3722C', '#F8961E', '#F9844A', '#F9C74F',
        '#90BE6D', '#43AA8B', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
    ], []);

    const generateData = (label: string) => {
        return {
            labels: ['Chef A', 'Chef B', 'Chef C', 'Chef D', 'Chef E', 'Chef F', 'Chef G'],
            datasets: [{
                label,
                data: timeFrame === 'weekly' ? [0.5, 0.8, 1.2, 0.7, 1.1, 0.9, 1.0] :
                    timeFrame === 'monthly' ? [0.5, 0.8, 1.2, 0.7, 3.1, 0.8, 1.0] : [4.5, 2.8, 1.2, 0.7, 1.1, 0.9, 1.0],
                backgroundColor: colors.slice(0, 7),
                borderColor: colors.slice(0, 7),
                borderWidth: 1,
                hoverOffset: 10,
            }]
        };
    };

    const chartData = useMemo(() => {
        if (comparisonMode) {
            return {
                labels: generateData('Current Data').labels,
                datasets: [
                    ...generateData('Current Period').datasets,
                    ...generateData('Previous Period').datasets,
                ]
            };
        }
        const label = chartXY === 'Chef vs Orders Served' ? 'Orders Served' : 'Ratings';
        return generateData(label);
    }, [chartXY, colors, timeFrame, comparisonMode]);

    const chartOptions: ChartOptions<'bar'> | ChartOptions<'line'> = useMemo(() => {
        const xAxisLabels: Record<ChartKey, string> = {
            'Chef vs Ratings': 'Chef',
            'Chef vs Orders Served': 'Chef',
        };

        const yAxisLabels: Record<ChartKey, string> = {
            'Chef vs Ratings': 'Ratings',
            'Chef vs Orders Served': 'Orders Served',
        };

        const tooltipLabels: Record<ChartKey, string> = {
            'Chef vs Ratings': 'Rating',
            'Chef vs Orders Served': 'Order',
        };

        return {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: xAxisLabels[chartXY],
                        color: '#000',
                        font: {
                            size: 14,
                        },
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: yAxisLabels[chartXY],
                        color: '#000',
                        font: {
                            size: 14,
                        },
                    },
                },
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context: any) {
                            const value = context.raw;
                            const label = tooltipLabels[chartXY];  // Fetch the correct label
                            return `${value} ${label}`;  // Return value and correct label
                        }
                    }
                },
            },
        };
    }, [chartXY]);

    return (
        <div className="flex flex-col gap-4">
            {/* Drop-down filters */}
            <section className="flex justify-between">
                <select
                    className="p-2 border cursor-pointer font-raleway font-bold text-[14px]"
                    value={chartXY}
                    onChange={(e) => setChartXY(e.target.value as ChartKey)}
                >
                    <option value="Chef vs Ratings">Chef vs Ratings</option>
                    <option value="Chef vs Orders Served">Chef vs Orders Served</option>
                </select>

                <select
                    className="p-2 border cursor-pointer font-raleway font-bold text-[14px]"
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value as 'bar' | 'pie' | 'line')}
                >
                    <option value="bar">Bar Chart</option>
                    <option value="pie">Pie Chart</option>
                    <option value="line">Line Chart</option>
                </select>

                <select
                    className="p-2 border cursor-pointer font-raleway font-bold text-[14px]"
                    value={timeFrame}
                    onChange={(e) => setTimeFrame(e.target.value as 'weekly' | 'monthly' | 'yearly')}
                >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>

                <div className="flex items-center">
                    <label className="mr-2">Comparison Mode</label>
                    <input
                        type="checkbox"
                        checked={comparisonMode}
                        onChange={() => setComparisonMode(!comparisonMode)}
                    />
                </div>
            </section>

            {/* Chart */}
            <section className="flex justify-center items-center" style={{ width: '100%', height: '450px' }}>
                {chartType === 'bar' && <BarChart data={chartData} options={chartOptions as ChartOptions<'bar'>} />}
                {chartType === 'pie' && <PieChart data={chartData} />}
                {chartType === 'line' && <LineChart data={chartData} options={chartOptions as ChartOptions<'line'>} />}
            </section>
        </div>
    );
};

export default ChefChart;
