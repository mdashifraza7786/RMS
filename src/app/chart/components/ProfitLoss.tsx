"use client";

import React, { useState, useEffect, useMemo } from 'react';
import BarChart from '../chartConfiguration/Bar';
import PieChart from '../chartConfiguration/Pie';
import LineChart from '../chartConfiguration/Line';
import { ChartOptions, TooltipItem, ChartData } from 'chart.js';

// Define types for ChartKey and other possible values
type ChartKey =
    'timeline vs profit' |
    'menu item vs profit' |
    'timeline vs revenue/expenses' |
    'specific period of day vs profit of period' |
    'timeline vs profit by menu category' |
    'chef vs profit' |
    'waiter vs profit' |
    'timeline vs profit growth percentage';

const ProfitLoss: React.FC = () => {
    const [chartXY, setChartXY] = useState<ChartKey>('timeline vs profit');
    const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');
    const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
    const [comparisonMode, setComparisonMode] = useState(false);

    useEffect(() => {
        document.title = "Profit";
    }, []);

    const colors = useMemo(() => [
        '#00589C', '#016FC4', '#1891C3', '#3AC0DA', '#3DC6C3', '#50E3C2',
        '#F3BA4D', '#F94144', '#F3722C', '#F8961E', '#F9844A', '#F9C74F',
        '#90BE6D', '#43AA8B', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
    ], []);

    const generateData = (label: string) => {
        if (chartXY === 'timeline vs profit') {
            return {
                labels: timeFrame === 'weekly' ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] :
                    timeFrame === 'monthly' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] :
                        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly' ? [500, 800, 1200, 700, 1100, 950, -1000] :
                        timeFrame === 'monthly' ? [4000, 6000, 5500, 7000] :
                            [15000, 20000, 18000, 22000],
                    backgroundColor: colors.slice(0, timeFrame === 'weekly' ? 7 : (timeFrame === 'monthly' ? 4 : 12)),
                    borderColor: colors.slice(0, timeFrame === 'weekly' ? 7 : (timeFrame === 'monthly' ? 4 : 12)),
                    borderWidth: 1,
                    hoverOffset: 10,
                }]
            };
        }

        if (chartXY === 'menu item vs profit') {
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

        if (chartXY === 'timeline vs revenue/expenses') {
            return {
                labels: ['Breakfast', 'Lunch', 'Evening', 'Dinner', 'Overall'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly' ? [500, -800, 1200, 700, 256] :
                        timeFrame === 'monthly' ? [5000, -800, 1200, -700, 456] : [-500, 8000, -1200, , 487, 700],
                    backgroundColor: colors.slice(0, 8),
                    borderColor: colors.slice(0, 8),
                    borderWidth: 1,
                    hoverOffset: 10,
                }]
            };
        }

        if (chartXY === 'specific period of day vs profit of period') {
            return {
                labels: ['Breakfast', 'Lunch', 'Evening', 'Dinner'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly' ? [500, 800, 1200, 700, 452, 652, 865] :
                        timeFrame === 'monthly' ? [500, 800, 1200, 700, 452, 652, 5] : [500, 800, 1200, 700, 452, 652, 865],
                    backgroundColor: colors.slice(0, 8),
                    borderColor: colors.slice(0, 8),
                    borderWidth: 1,
                    hoverOffset: 10,
                }]
            };
        }

        if (chartXY === 'timeline vs profit by menu category') {
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

        if (chartXY === 'chef vs profit') {
            return {
                labels: ['Ashif', 'John Elia', 'Ghalib', 'Fraz', 'Zeeshan'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly' ? [500, 800, 1200, 700, 456] :
                        timeFrame === 'monthly' ? [5000, 800, 1200, 700, -549] : [500, 8000, 1200, 700, -299],
                    backgroundColor: colors.slice(0, 8),
                    borderColor: colors.slice(0, 8),
                    borderWidth: 1,
                    hoverOffset: 10,
                }]
            };
        }

        if (chartXY === 'waiter vs profit') {
            return {
                labels: ['Ashif', 'John Elia', 'Ghalib', 'Fraz', 'Zeeshan'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly' ? [500, 800, 1200, 700, 456] :
                        timeFrame === 'monthly' ? [5000, 800, 1200, 700, -549] : [500, 8000, 1200, 700, -299],
                    backgroundColor: colors.slice(0, 8),
                    borderColor: colors.slice(0, 8),
                    borderWidth: 1,
                    hoverOffset: 10,
                }]
            };
        }

        else {
            const labels = timeFrame === 'weekly' ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] :
                           timeFrame === 'monthly' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] :
                           ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
            const profitValues = timeFrame === 'weekly' ? [500, 800, 1200, 700, 1100, 950, -1000] :
                                 timeFrame === 'monthly' ? [4000, 6000, 5500, 7000] :
                                 [15000, 20000, 18000, 22000];
        
            const profitGrowth = profitValues.map((profit, index) =>
                index === 0 ? undefined : ((profit - profitValues[index - 1]) / profitValues[index - 1]) * 100
            );
        
            function lightenColor(color, percent = 30) {
                const num = parseInt(color.slice(1), 16),
                      amt = Math.round(2.55 * percent),
                      R = (num >> 16) + amt,
                      G = (num >> 8 & 0x00FF) + amt,
                      B = (num & 0x0000FF) + amt;
        
                return `#${(0x1000000 + 
                            (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + 
                            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + 
                            (B < 255 ? B < 1 ? 0 : B : 255))
                            .toString(16).slice(1).toUpperCase()}`;
            }
        
            const colorsSlice = colors.slice(0, labels.length);
        
            return {
                labels,
                datasets: [
                    {
                        label,
                        data: profitValues,
                        backgroundColor: colorsSlice,
                        borderColor: colorsSlice,
                        borderWidth: 1,
                        hoverOffset: 10,
                    },
                    {
                        label: 'Profit Growth (%)',
                        data: profitGrowth,
                        backgroundColor: colorsSlice.map(c => lightenColor(c)),
                        borderColor: colorsSlice,
                        borderWidth: 1,
                        hoverOffset: 10,
                    }
                ]
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
        return generateData('Profit (₹)');
    }, [chartXY, colors, timeFrame, comparisonMode]);

    const chartOptions: ChartOptions<'bar'> | ChartOptions<'line'> = useMemo(() => {
        const xAxisLabels: Record<ChartKey, string> = {
            'timeline vs profit': timeFrame === 'weekly' ? 'Week Days' : (timeFrame === 'monthly' ? 'Weeks' : 'Months'),
            'menu item vs profit': 'Menu Items',
            'timeline vs revenue/expenses': timeFrame === 'weekly' ? 'Week Days' : (timeFrame === 'monthly' ? 'Weeks' : 'Months'),
            'specific period of day vs profit of period': 'Period of Day',
            'timeline vs profit by menu category': 'Menu Category',
            'chef vs profit': 'Chef',
            'waiter vs profit': 'Waiter',
            'timeline vs profit growth percentage': timeFrame === 'weekly' ? 'Week Days' : (timeFrame === 'monthly' ? 'Weeks' : 'Months'),
        };

        const yAxisLabels: Record<ChartKey, string> = {
            'timeline vs profit': 'Net Profit (₹)',
            'menu item vs profit': 'Profit (₹)',
            'timeline vs revenue/expenses': 'Revenue to expenses',
            'specific period of day vs profit of period': 'Profit (₹)',
            'timeline vs profit by menu category': 'Profit (₹)',
            'chef vs profit': 'Profit (₹)',
            'waiter vs profit': 'Profit (₹)',
            'timeline vs profit growth percentage': 'Profit Growth (%)',
        };

        const tooltipLabels: Record<ChartKey, string> = {
            'timeline vs profit': 'Profit (₹)',
            'menu item vs profit': 'Profit (₹)',
            'timeline vs revenue/expenses': 'Revenue to expenses',
            'specific period of day vs profit of period': 'Profit (₹)',
            'timeline vs profit by menu category': 'Profit (₹)',
            'chef vs profit': 'Profit (₹)',
            'waiter vs profit': 'Profit (₹)',
            'timeline vs profit growth percentage': 'Growth (%)',
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
                        label: function (context: TooltipItem<'bar'>) {
                            const value = context.raw as number;
                            const label = tooltipLabels[chartXY] || '';
                            return `${value} ${label}`;
                        }
                    }
                },
            },
        };
    }, [chartType, chartXY, timeFrame]);

    const containsNegativeValues = chartData.datasets.some(dataset =>
        dataset.data.some((value) => value !== undefined && value < 0)
    );

    return (
        <div className="flex flex-col gap-4">
            {/* Drop-down filters */}
            <section className="flex justify-between">
                <select
                    className="p-2 border cursor-pointer font-raleway font-bold text-[14px]"
                    value={chartXY}
                    onChange={(e) => setChartXY(e.target.value as ChartKey)}
                >
                    <option value="timeline vs profit">Timeline vs Net Profit</option>
                    <option value="menu item vs profit">Profit by Menu Item</option>
                    <option value="timeline vs revenue/expenses">Timeline vs Revenue/Expenses</option>
                    <option value="specific period of day vs profit of period">Profit by period of day</option>
                    <option value="timeline vs profit by menu category"> Profit by menu category</option>
                    <option value="chef vs profit">Chef Performance vs Profit</option>
                    <option value="waiter vs profit">Waiter Performance vs Profit</option>
                    <option value="timeline vs profit growth percentage">Timeline vs Net Profit Growth (%)</option>
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
                <label className="font-raleway font-bold text-[14px] text-gray-600 flex items-center">
                    <input
                        type="checkbox"
                        className="mr-2 cursor-pointer"
                        checked={comparisonMode}
                        onChange={() => setComparisonMode(!comparisonMode)}
                    />
                    Comparison mode
                </label>
            </section>

            {/* Chart display */}
            <div className="flex justify-center items-center h-[400px]">
                {chartType === 'bar' ? (
                    <BarChart data={chartData} options={chartOptions as ChartOptions<'bar'>} />
                ) : chartType === 'pie' ? (
                    <PieChart data={chartData} />
                ) : (
                    <LineChart data={chartData} options={chartOptions as ChartOptions<'line'>} />
                )}
            </div>

            {/* Warning for negative values */}
            {containsNegativeValues && (
                <p className="text-red-600 font-bold text-center">
                    Warning: Chart contains negative values.
                </p>
            )}
        </div>
    );
};

export default ProfitLoss;