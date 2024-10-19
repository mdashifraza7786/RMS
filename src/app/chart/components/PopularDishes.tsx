"use client";

import React, { useState, useEffect, useMemo } from 'react';
import BarChart from '../chartConfiguration/Bar';
import PieChart from '../chartConfiguration/Pie';
import LineChart from '../chartConfiguration/Line';
import { ChartOptions } from 'chart.js';

type ChartKey =
    'week day vs Dishes' |
    'age group vs Dishes' |
    'gender group vs Dishes' |
    'dish type vs time of day'; // Added new chart key

const PopularDishes: React.FC = () => {
    const [chartXY, setChartXY] = useState<ChartKey>('week day vs Dishes');
    const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');
    const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
    const [comparisonMode, setComparisonMode] = useState(false);

    useEffect(() => {
        document.title = "Dishes";
    }, []);

    const colors = useMemo(() => [
        '#00589C', '#016FC4', '#1891C3', '#3AC0DA', '#3DC6C3', '#50E3C2',
        '#F3BA4D', '#F94144'
    ], []);



    const generateData = (label: string) => {
        let labels = [];
        let data = [];

        switch (chartXY) {
            case 'week day vs Dishes':
                labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                data = timeFrame === 'weekly' ? [500, 800, 1200, 700, 1100, 950, 1000] :
                    timeFrame === 'monthly' ? [4000, 6000, 5500, 7000] :
                        [15000, 20000, 18000, 22000];
                break;

            case 'age group vs Dishes':
                labels = ['<10', '10-18', '18-25', '25-40', '40-60', '60+'];
                data = timeFrame === 'weekly' ? [500, 800, 1200, 700, 524, 652] :
                    timeFrame === 'monthly' ? [5000, 800, 1200, 700, 458, 235] :
                        [500, 8000, 1200, 700, 897, 123];
                break;

            case 'gender group vs Dishes':
                labels = ['Female', 'Male', 'Others'];
                data = timeFrame === 'weekly' ? [700, 524, 652] :
                    timeFrame === 'monthly' ? [700, 458, 235] :
                        [700, 897, 123];
                break;

            case 'dish type vs time of day': // New case for dish type vs time of day
                labels = ['Biryani - Breakfast', 'Biryani - Lunch', 'Biryani - Dinner', 'Kebab - Breakfast', 'Kebab - Lunch', 'Kebab - Dinner','Biryani - Breakfast', 'Biryani - Lunch', 'Biryani - Dinner', 'Kebab - Breakfast', 'Kebab - Lunch', 'Kebab - Dinner','Biryani - Breakfast', 'Biryani - Lunch', 'Biryani - Dinner', 'Kebab - Breakfast', 'Kebab - Lunch', 'Kebab - Dinner','Biryani - Breakfast', 'Biryani - Lunch', 'Biryani - Dinner', 'Kebab - Breakfast', 'Kebab - Lunch', 'Kebab - Dinner','Biryani - Breakfast', 'Biryani - Lunch', 'Biryani - Dinner', 'Kebab - Breakfast', 'Kebab - Lunch', 'Kebab - Dinner','Biryani - Breakfast', 'Biryani - Lunch', 'Biryani - Dinner', 'Kebab - Breakfast', 'Kebab - Lunch', 'Kebab - Dinner'];
                data = timeFrame === 'weekly' ? [200, 300, 400, 150, 250, 350] :
                    timeFrame === 'monthly' ? [800, 1200, 1000, 700, 900, 1100] :
                        [3000, 4500, 4000, 2000, 3500, 3000];
                break;
        }

        return {
            labels,
            datasets: [{
                label,
                data,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1,
                hoverOffset: 10,
            }]
        };
    };

    const chartData = useMemo(() => {
        const label = 'Orders';
        if (comparisonMode) {
            return {
                labels: generateData('Current Data').labels,
                datasets: [
                    ...generateData('Current Period').datasets,
                    ...generateData('Previous Period').datasets,
                ]
            };
        }
        return generateData(label);
    }, [chartXY, colors, timeFrame, comparisonMode]);

    const chartOptions: ChartOptions<'bar'> | ChartOptions<'line'> = useMemo(() => {
        const xAxisLabels: Record<ChartKey, string> = {
            'week day vs Dishes': 'Dishes',
            'age group vs Dishes': 'Age Group',
            'gender group vs Dishes': 'Gender Group',
            'dish type vs time of day': 'Dish Type', // Added x-axis label for new chart
        };

        const yAxisLabels: Record<ChartKey, string> = {
            'week day vs Dishes': 'Orders',
            'age group vs Dishes': 'Orders',
            'gender group vs Dishes': 'Orders',
            'dish type vs time of day': 'Orders', // Added y-axis label for new chart
        };

        return {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: xAxisLabels[chartXY],
                        color: '#000',
                        font: { size: 14 },
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: yAxisLabels[chartXY],
                        color: '#000',
                        font: { size: 14 },
                    },
                },
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context: any) {
                            const value = context.raw;
                            return `${value} Orders`;
                        }
                    }
                },
            },
        };
    }, [chartType, chartXY, timeFrame]);

    return (
        <div className="flex flex-col gap-4">
            <section className="flex justify-between">
                <select
                    className="p-2 border cursor-pointer font-raleway font-bold text-[14px]"
                    value={chartXY}
                    onChange={(e) => setChartXY(e.target.value as ChartKey)}
                >
                    <option value="week day vs Dishes">Dishes popularity over time</option>
                    <option value="age group vs Dishes">Dishes by age group</option>
                    <option value="gender group vs Dishes">Dishes distribution by customer gender</option>
                    <option value="dish type vs time of day">Dish Type vs Time of Day</option> {/* Added new option */}
                </select>
                
                <select>
                    <option value="">--Select Dish--</option>
                    <option value="">Murga Bhaat</option>
                    <option value="">Biryani</option>
                    <option value="">Burger</option>
                    <option value="">Egg Roll</option>
                    <option value="">Paneer Bhurji</option>
                    <option value="">Bevereges</option>
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

            <section className="flex justify-center items-center" style={{ width: '100%', height: '450px' }}>
                {chartType === 'bar' && <BarChart data={chartData} options={chartOptions as ChartOptions<'bar'>} />}
                {chartType === 'pie' && <PieChart data={chartData} />}
                {chartType === 'line' && <LineChart data={chartData} options={chartOptions as ChartOptions<'line'>} />}
            </section>
        </div>
    );
};

export default PopularDishes;
