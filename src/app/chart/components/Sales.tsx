"use client";

import React, { useState, useEffect, useMemo } from 'react';
import BarChart from '../chartConfiguration/Bar';
import PieChart from '../chartConfiguration/Pie';
import LineChart from '../chartConfiguration/Line';
import { ChartOptions } from 'chart.js';

type ChartKey =
    'week day vs sales' |
    'menu item vs sales' |
    'time slot vs orders' |
    'week day vs customer' |
    'Dish category vs sales' |
    'payment method vs sales' |
    'age group vs sales' |
    'gender group vs sales';

const Sales: React.FC = () => {
    const [chartXY, setChartXY] = useState<ChartKey>('week day vs sales');
    const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');
    const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
    const [comparisonMode, setComparisonMode] = useState(false);

    useEffect(() => {
        document.title = "Sales";
    }, []);

    const colors = useMemo(() => [
        '#00589C', '#016FC4', '#1891C3', '#3AC0DA', '#3DC6C3', '#50E3C2',
        '#F3BA4D', '#F94144', '#F3722C', '#F8961E', '#F9844A', '#F9C74F',
        '#90BE6D', '#43AA8B', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
    ], []);

    const generateData = (label: string) => {
        if (chartXY === 'week day vs sales') {
            return {
                labels: timeFrame === 'weekly' ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] :
                    timeFrame === 'monthly' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] :
                        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly' ? [500, 800, 1200, 700, 1100, 950, 1000] :
                        timeFrame === 'monthly' ? [4000, 6000, 5500, 7000] :
                            [15000, 20000, 18000, 22000],
                    backgroundColor: colors.slice(0, timeFrame === 'weekly' ? 7 : (timeFrame === 'monthly' ? 4 : 12)),
                    borderColor: colors.slice(0, timeFrame === 'weekly' ? 7 : (timeFrame === 'monthly' ? 4 : 12)),
                    borderWidth: 1,
                    hoverOffset: 10,
                }]
            };
        }

        if (chartXY === 'menu item vs sales') {
            return {
                labels: ['Pasta', 'Biryani', 'Chilli chicken', 'Mutton Biryani', 'Paneer paratha', 'Mandi', 'Burger', 'Litti chokha'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly' ? [500, 800, 1200, 700, 1100, 950, 1000, 600] :
                        timeFrame === 'monthly' ? [5000, 800, 1200, 700, 1100, 950, 1000, 600] : [500, 8000, 1200, 700, 11000, 950, 1000, 600],
                    backgroundColor: colors.slice(0, 8),
                    borderColor: colors.slice(0, 8),
                    borderWidth: 1,
                    hoverOffset: 10,
                }]
            };
        }

        if (chartXY === 'time slot vs orders') {
            return {
                labels: ['Breakfast', 'Lunch', 'Evening', 'Dinner'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly' ? [500, 800, 1200, 700] :
                        timeFrame === 'monthly' ? [5000, 800, 1200, 700] : [500, 8000, 1200, 700],
                    backgroundColor: colors.slice(0, 8),
                    borderColor: colors.slice(0, 8),
                    borderWidth: 1,
                    hoverOffset: 10,
                }]
            };
        }

        if (chartXY === 'week day vs customer') {
            return {
                labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly' ? [500, 800, 1200, 700, 452, 652, 865] :
                        timeFrame === 'monthly' ? [500, 800, 1200, 700, 452, 652, 865] : [500, 800, 1200, 700, 452, 652, 865],
                    backgroundColor: colors.slice(0, 8),
                    borderColor: colors.slice(0, 8),
                    borderWidth: 1,
                    hoverOffset: 10,
                }]
            };
        }

        if (chartXY === 'Dish category vs sales') {
            return {
                labels: ['Breakfast', 'Lunch', 'Evening', 'Dinner'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly' ? [500, 800, 1200, 700] :
                        timeFrame === 'monthly' ? [5000, 800, 1200, 700] : [500, 8000, 1200, 700],
                    backgroundColor: colors.slice(0, 8),
                    borderColor: colors.slice(0, 8),
                    borderWidth: 1,
                    hoverOffset: 10,
                }]
            };
        }

        if (chartXY === 'payment method vs sales') {
            return {
                labels: ['UPI', 'Credit Card', 'Debit Card', 'Cash'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly' ? [500, 800, 1200, 700] :
                        timeFrame === 'monthly' ? [5000, 800, 1200, 700] : [500, 8000, 1200, 700],
                    backgroundColor: colors.slice(0, 8),
                    borderColor: colors.slice(0, 8),
                    borderWidth: 1,
                    hoverOffset: 10,
                }]
            };
        }

        if (chartXY === 'age group vs sales') {
            return {
                labels: ['<10', '10-18', '18-25', '25-40', '40-60', '60+'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly' ? [500, 800, 1200, 700, 524, 652] :
                        timeFrame === 'monthly' ? [5000, 800, 1200, 700, 458, 235] : [500, 8000, 1200, 700, 897, 123],
                    backgroundColor: colors.slice(0, 8),
                    borderColor: colors.slice(0, 8),
                    borderWidth: 1,
                    hoverOffset: 10,
                }]
            };
        }

        else {
            return {
                labels: ['Female', 'Male', 'Others'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly' ? [700, 524, 652] :
                        timeFrame === 'monthly' ? [700, 458, 235] : [700, 897, 123],
                    backgroundColor: colors.slice(0, 8),
                    borderColor: colors.slice(0, 8),
                    borderWidth: 1,
                    hoverOffset: 10,
                }]
            };
        }
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
        return generateData('Sales (₹)');
    }, [chartXY, colors, timeFrame, comparisonMode]);

    const chartOptions: ChartOptions<'bar'> | ChartOptions<'line'> = useMemo(() => {
        const xAxisLabels: Record<ChartKey, string> = {
            'week day vs sales': timeFrame === 'weekly' ? 'Week Days' : (timeFrame === 'monthly' ? 'Weeks' : ''),
            'menu item vs sales': 'Menu Items',
            'time slot vs orders': 'Time Slots',
            'week day vs customer': timeFrame === 'weekly' ? 'Week Days' : (timeFrame === 'monthly' ? 'Weeks' : 'Quarters'),
            'Dish category vs sales': 'Dish Category',
            'payment method vs sales': 'Payment Method',
            'age group vs sales': 'Age Group',
            'gender group vs sales': 'Gender Group',
        };
    
        const yAxisLabels: Record<ChartKey, string> = {
            'week day vs sales': 'Sales (₹)',
            'menu item vs sales': 'Sales (₹)',
            'time slot vs orders': 'Orders',
            'week day vs customer': 'Customer Visits',
            'Dish category vs sales': 'Sales (₹)',
            'payment method vs sales': 'Sales (₹)',
            'age group vs sales': 'Sales (₹)',
            'gender group vs sales': 'Sales (₹)',
        };
    
        const tooltipLabels: Record<ChartKey, string> = {
            'week day vs sales': 'Sales (₹)',
            'menu item vs sales': 'Sales (₹)',
            'time slot vs orders': 'Orders',
            'week day vs customer': 'Customer Visits',
            'Dish category vs sales': 'Sales (₹)',
            'payment method vs sales': 'Sales (₹)',
            'age group vs sales': 'Sales (₹)',
            'gender group vs sales': 'Sales (₹)',
        };
    
        return {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: xAxisLabels[chartXY] || 'X Axis',
                        color: '#000',
                        font: {
                            size: 14,
                        },
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: yAxisLabels[chartXY] || 'Y Axis',
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
                        label: function (context) {
                            // Get the correct tooltip label based on chart type
                            const value = context.raw;
                            const label = tooltipLabels[chartXY] || '';  // Fetch the appropriate label
                            return `${value} ${label}`;  // Return only the value and correct label
                        }
                    }
                },
            },
        };
    }, [chartType, chartXY, timeFrame]);
    


    return (
        <div className="flex flex-col gap-4">
            {/* Drop-down filters */}
            <section className="flex justify-between">
                <select
                    className="p-2 border cursor-pointer font-raleway font-bold text-[14px]"
                    value={chartXY}
                    onChange={(e) => setChartXY(e.target.value as ChartKey)}
                >
                    <option value="week day vs sales">Sales by timeline</option>
                    <option value="menu item vs sales">Sales by menu item</option>
                    <option value="time slot vs orders">Orders by time of day</option>
                    <option value="week day vs customer">Customer visits by days of the week</option>
                    <option value="Dish category vs sales">Sales by dish category</option>
                    <option value="payment method vs sales">Sales by payment method</option>
                    <option value="age group vs sales">Sales by age group</option>
                    <option value="gender group vs sales">Sales distribution by customer gender</option>
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

export default Sales;
