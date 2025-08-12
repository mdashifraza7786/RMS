"use client";

import React, { useState, useEffect, useMemo } from 'react';
import BarChart from '../chartConfiguration/Bar';
import PieChart from '../chartConfiguration/Pie';
import LineChart from '../chartConfiguration/Line';
import { ChartOptions, TooltipItem } from 'chart.js';
import { FaChartBar, FaChartPie, FaChartLine, FaCalendarAlt, FaFilter } from 'react-icons/fa';

// Define types for ChartKey and other possible values
type ChartKey =
    'timeline vs profit' |
    'menu item vs profit' |
    'specific period of day vs profit of period' |
    'timeline vs profit by menu category' |
    'chef vs profit' |
    'waiter vs profit' |
    'timeline vs profit growth percentage';

// Helper function for color manipulation
function lightenColor(color: string, percent: number = 30): string {
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

interface ProfitLossData {
    row1: {
        weeklyProfitLoss: Record<string, number>;
        monthlyProfitLoss: Record<string, number>;
        yearlyProfitLoss: Record<string, number>;
    };
    row3: {
        data: Record<string, Record<string, { profit_loss: number }>>;
    };
}

// Sample static profit loss data for testing
const sampleProfitLossData: ProfitLossData = {
    row1: {
        weeklyProfitLoss: {
            sunday_pl: 4500,
            monday_pl: 6200,
            tuesday_pl: 7000,
            wednesday_pl: 6400,
            thursday_pl: 5900,
            friday_pl: 8000,
            saturday_pl: 9000
        },
        monthlyProfitLoss: {
            week1_pl: 18500,
            week2_pl: 21000,
            week3_pl: 22500,
            week4_pl: 19900
        },
        yearlyProfitLoss: {
            jan_pl: 78000,
            feb_pl: 67000,
            mar_pl: 85000,
            apr_pl: 90000,
            may_pl: 87000,
            jun_pl: 91000,
            jul_pl: 94000,
            aug_pl: 98000,
            sep_pl: 93000,
            oct_pl: 96000,
            nov_pl: 91000,
            dec_pl: 99000
        }
    },
    row3: {
        data: {
            breakfast: {
                week: { profit_loss: 5200 },
                month: { profit_loss: 23000 },
                year: { profit_loss: 260000 }
            },
            lunch: {
                week: { profit_loss: 7800 },
                month: { profit_loss: 29500 },
                year: { profit_loss: 340000 }
            },
            evening: {
                week: { profit_loss: 6200 },
                month: { profit_loss: 24500 },
                year: { profit_loss: 310000 }
            },
            dinner: {
                week: { profit_loss: 8400 },
                month: { profit_loss: 28000 },
                year: { profit_loss: 330000 }
            }
        }
    }
};

const ProfitLoss: React.FC = () => {
    const [chartXY, setChartXY] = useState<ChartKey>('timeline vs profit');
    const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');
    const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
    const [comparisonMode, setComparisonMode] = useState(false);
    const [profitLossData, setProfitLossData] = useState<ProfitLossData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Profit";
        setProfitLossData(sampleProfitLossData);
        setLoading(false);
    }, []);

    const colors = useMemo(() => [
        '#00589C', '#016FC4', '#1891C3', '#3AC0DA', '#3DC6C3', '#50E3C2',
        '#F3BA4D', '#F94144', '#F3722C', '#F8961E', '#F9844A', '#F9C74F',
        '#90BE6D', '#43AA8B', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
    ], []);

    const generateData = (label: string) => {
        if (!profitLossData) {
            return { labels: [], datasets: [] };
        }

        if (chartXY === 'timeline vs profit') {
            return {
                labels: timeFrame === 'weekly'
                    ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                    : timeFrame === 'monthly'
                        ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
                        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly'
                        ? [
                            profitLossData.row1.weeklyProfitLoss.sunday_pl,
                            profitLossData.row1.weeklyProfitLoss.monday_pl,
                            profitLossData.row1.weeklyProfitLoss.tuesday_pl,
                            profitLossData.row1.weeklyProfitLoss.wednesday_pl,
                            profitLossData.row1.weeklyProfitLoss.thursday_pl,
                            profitLossData.row1.weeklyProfitLoss.friday_pl,
                            profitLossData.row1.weeklyProfitLoss.saturday_pl
                        ]
                        : timeFrame === 'monthly'
                            ? [
                                profitLossData.row1.monthlyProfitLoss.week1_pl,
                                profitLossData.row1.monthlyProfitLoss.week2_pl,
                                profitLossData.row1.monthlyProfitLoss.week3_pl,
                                profitLossData.row1.monthlyProfitLoss.week4_pl
                            ]
                            : [
                                profitLossData.row1.yearlyProfitLoss.jan_pl,
                                profitLossData.row1.yearlyProfitLoss.feb_pl,
                                profitLossData.row1.yearlyProfitLoss.mar_pl,
                                profitLossData.row1.yearlyProfitLoss.apr_pl,
                                profitLossData.row1.yearlyProfitLoss.may_pl,
                                profitLossData.row1.yearlyProfitLoss.jun_pl,
                                profitLossData.row1.yearlyProfitLoss.jul_pl,
                                profitLossData.row1.yearlyProfitLoss.aug_pl,
                                profitLossData.row1.yearlyProfitLoss.sep_pl,
                                profitLossData.row1.yearlyProfitLoss.oct_pl,
                                profitLossData.row1.yearlyProfitLoss.nov_pl,
                                profitLossData.row1.yearlyProfitLoss.dec_pl
                            ],
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

        if (chartXY === 'specific period of day vs profit of period') {
            return {
                labels: ['Breakfast', 'Lunch', 'Evening', 'Dinner'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly' ? [
                        profitLossData.row3.data.breakfast.week.profit_loss,
                        profitLossData.row3.data.lunch.week.profit_loss,
                        profitLossData.row3.data.evening.week.profit_loss,
                        profitLossData.row3.data.dinner.week.profit_loss
                    ] :
                        timeFrame === 'monthly' ? [
                            profitLossData.row3.data.breakfast.month.profit_loss,
                            profitLossData.row3.data.lunch.month.profit_loss,
                            profitLossData.row3.data.evening.month.profit_loss,
                            profitLossData.row3.data.dinner.month.profit_loss
                        ] :
                            [
                                profitLossData.row3.data.breakfast.year.profit_loss,
                                profitLossData.row3.data.lunch.year.profit_loss,
                                profitLossData.row3.data.evening.year.profit_loss,
                                profitLossData.row3.data.dinner.year.profit_loss
                            ],

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

        // Default fallback with timeline + profit growth % dataset
        const labels = timeFrame === 'weekly' ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] :
            timeFrame === 'monthly' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] :
                ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const profitValues = timeFrame === 'weekly' ? [
            profitLossData.row1.weeklyProfitLoss.sunday_pl,
            profitLossData.row1.weeklyProfitLoss.monday_pl,
            profitLossData.row1.weeklyProfitLoss.tuesday_pl,
            profitLossData.row1.weeklyProfitLoss.wednesday_pl,
            profitLossData.row1.weeklyProfitLoss.thursday_pl,
            profitLossData.row1.weeklyProfitLoss.friday_pl,
            profitLossData.row1.weeklyProfitLoss.saturday_pl
        ] :
            timeFrame === 'monthly' ? [
                profitLossData.row1.monthlyProfitLoss.week1_pl,
                profitLossData.row1.monthlyProfitLoss.week2_pl,
                profitLossData.row1.monthlyProfitLoss.week3_pl,
                profitLossData.row1.monthlyProfitLoss.week4_pl
            ] :
                [
                    profitLossData.row1.yearlyProfitLoss.jan_pl,
                    profitLossData.row1.yearlyProfitLoss.feb_pl,
                    profitLossData.row1.yearlyProfitLoss.mar_pl,
                    profitLossData.row1.yearlyProfitLoss.apr_pl,
                    profitLossData.row1.yearlyProfitLoss.may_pl,
                    profitLossData.row1.yearlyProfitLoss.jun_pl,
                    profitLossData.row1.yearlyProfitLoss.jul_pl,
                    profitLossData.row1.yearlyProfitLoss.aug_pl,
                    profitLossData.row1.yearlyProfitLoss.sep_pl,
                    profitLossData.row1.yearlyProfitLoss.oct_pl,
                    profitLossData.row1.yearlyProfitLoss.nov_pl,
                    profitLossData.row1.yearlyProfitLoss.dec_pl
                ];

        const profitGrowth = profitValues.map((profit, index) => {
            if (index === 0) return undefined; // No growth for first index
            const previousProfit = profitValues[index - 1] ?? 0;
            if (previousProfit === 0) return null;
            return ((profit ?? 0) - previousProfit) / previousProfit * 100;
        });

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
    };

    const chartData = useMemo(() => {
        if (comparisonMode) {
            // Comparison mode not implemented with mock, so just returning current data
            return generateData('Current Period');
        }
        return generateData('Profit (₹)');
    }, [chartXY, comparisonMode, profitLossData, generateData]);

    const chartOptions: ChartOptions<'bar'> | ChartOptions<'line'> = useMemo(() => {
        const xAxisLabels: Record<ChartKey, string> = {
            'timeline vs profit': timeFrame === 'weekly' ? 'Week Days' : (timeFrame === 'monthly' ? 'Weeks' : 'Months'),
            'menu item vs profit': 'Menu Items',
            'specific period of day vs profit of period': 'Period of Day',
            'timeline vs profit by menu category': 'Menu Category',
            'chef vs profit': 'Chef',
            'waiter vs profit': 'Waiter',
            'timeline vs profit growth percentage': timeFrame === 'weekly' ? 'Week Days' : (timeFrame === 'monthly' ? 'Weeks' : 'Months'),
        };

        const yAxisLabels: Record<ChartKey, string> = {
            'timeline vs profit': 'Net Profit (₹)',
            'menu item vs profit': 'Profit (₹)',
            'specific period of day vs profit of period': 'Profit (₹)',
            'timeline vs profit by menu category': 'Profit (₹)',
            'chef vs profit': 'Profit (₹)',
            'waiter vs profit': 'Profit (₹)',
            'timeline vs profit growth percentage': 'Profit Growth (%)',
        };

        const tooltipLabels: Record<ChartKey, string> = {
            'timeline vs profit': 'Profit (₹)',
            'menu item vs profit': 'Profit (₹)',
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
    }, [chartXY, timeFrame]);

    const containsNegativeValues = chartData.datasets.some(dataset =>
        dataset.data.some((value) => value !== undefined && value !== null && value < 0)
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00589C]"></div>
            </div>
        );
    }

    if (!profitLossData) {
        return <div className="text-center p-10 text-red-600 text-lg">No Profit Data Available.</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Tabs row with comparison toggle */}
            <div className="flex justify-between items-center">
                <div>   </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md shadow-sm">
                    <span className="text-xs text-gray-500 mr-1">Compare with previous period</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={comparisonMode}
                            onChange={() => setComparisonMode(!comparisonMode)}
                        />
                        <div className={`w-9 h-5 rounded-full peer ${comparisonMode ? 'bg-[#00589C]' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00589C]/20 transition-colors`}>
                            <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-4 w-4 transition-transform ${comparisonMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                    </label>
                </div>
            </div>
            
            {/* Filter controls */}
            <div className="flex flex-col md:flex-row gap-3 p-3 bg-white rounded-lg shadow-sm">
                <div className="flex flex-col flex-1">
                    <label className="text-xs text-gray-500 mb-1">
                        <FaFilter className="inline mr-1" /> Metric
                    </label>
                    <select
                        className="p-2 border border-gray-200 rounded-md cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-[#00589C]/50"
                        value={chartXY}
                        onChange={e => setChartXY(e.target.value as ChartKey)}
                    >
                        <option value="timeline vs profit">Timeline vs Profit</option>
                        <option value="menu item vs profit">Menu Item vs Profit</option>
                        <option value="specific period of day vs profit of period">Period of Day vs Profit</option>
                        <option value="timeline vs profit by menu category">Timeline vs Profit by Menu Category</option>
                        <option value="chef vs profit">Chef vs Profit</option>
                        <option value="waiter vs profit">Waiter vs Profit</option>
                        <option value="timeline vs profit growth percentage">Timeline vs Profit Growth %</option>
                    </select>
                </div>

                <div className="flex flex-col flex-1">
                    <label className="text-xs text-gray-500 mb-1">
                        <FaCalendarAlt className="inline mr-1" /> Time Period
                    </label>
                    <select
                        className="p-2 border border-gray-200 rounded-md cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-[#00589C]/50"
                        value={timeFrame}
                        onChange={e => setTimeFrame(e.target.value as 'weekly' | 'monthly' | 'yearly')}
                    >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
                
                <div className="flex flex-col flex-1">
                    <label className="text-xs text-gray-500 mb-1">Chart Type</label>
                    <div className="flex gap-2">
                        <button 
                            className={`flex-1 flex items-center justify-center p-2 text-sm rounded-md transition-colors ${
                                chartType === 'bar' 
                                  ? 'bg-[#FF9B26] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={() => setChartType('bar')}
                        >
                            <FaChartBar className="mr-1" /> Bar
                        </button>
                        <button 
                            className={`flex-1 flex items-center justify-center p-2 text-sm rounded-md transition-colors ${
                                chartType === 'line' 
                                   ? 'bg-[#FF9B26] text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={() => setChartType('line')}
                        >
                            <FaChartLine className="mr-1" /> Line
                        </button>
                        <button 
                            className={`flex-1 flex items-center justify-center p-2 text-sm rounded-md transition-colors ${
                                chartType === 'pie' 
                                  ? 'bg-[#FF9B26] text-white'  
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={() => setChartType('pie')}
                        >
                            <FaChartPie className="mr-1" /> Pie
                        </button>
                    </div>
                </div>
            </div>

            {containsNegativeValues && (
                <div className="mb-4 rounded bg-red-200 p-3 text-center text-red-900 dark:bg-red-700 dark:text-red-100">
                    <strong>Warning:</strong> Negative values detected in the profit/loss data.
                </div>
            )}

            {/* Chart container */}
            <div className="bg-white p-4 rounded-lg shadow-sm" style={{ minHeight: '400px' }}>
                {chartType === 'bar' && <BarChart data={chartData} options={chartOptions} />}
                {chartType === 'pie' && <PieChart data={chartData} options={chartOptions} />}
                {chartType === 'line' && <LineChart data={chartData} options={chartOptions} />}
            </div>
        </div>
    );
};

export default ProfitLoss;
