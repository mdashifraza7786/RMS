"use client";

import React, { useState, useEffect, useMemo } from 'react';
import BarChart from '../chartConfiguration/Bar';
import PieChart from '../chartConfiguration/Pie';
import LineChart from '../chartConfiguration/Line';
import { ChartOptions } from 'chart.js';
import { FaChartBar, FaChartPie, FaChartLine, FaCalendarAlt, FaFilter, FaExchangeAlt } from 'react-icons/fa';
import axios from 'axios';

type ChartKey =
    'Menu Item vs Demand' |
    'Dish Category vs Demand' |
    'Period of Day vs Demand' |
    'Orders vs Timeline' |
    'Orders vs Age Group';

interface Data {
    orders_week_breakfast: string;
    orders_week_lunch: string;
    orders_week_evening: string;
    orders_week_dinner: string;
    orders_month_breakfast: string;
    orders_month_lunch: string;
    orders_month_evening: string;
    orders_month_dinner: string;
    orders_year_breakfast: string;
    orders_year_lunch: string;
    orders_year_evening: string;
    orders_year_dinner: string;
    sunday_orders: string;
    monday_orders: string;
    tuesday_orders: string;
    wednesday_orders: string;
    thursday_orders: string;
    friday_orders: string;
    saturday_orders: string;
    week1_orders: string;
    week2_orders: string;
    week3_orders: string;
    week4_orders: string;
    jan_orders: string;
    feb_orders: string;
    march_orders: string;
    april_orders: string;
    may_orders: string;
    june_orders: string;
    july_orders: string;
    aug_orders: string;
    sept_orders: string;
    oct_orders: string;
    nov_orders: string;
    dec_orders: string;
    children_week: string;
    teens_week: string;
    adults_week: string;
    middle_aged_week: string;
    seniors_week: string;
    children_month: string;
    teens_month: string;
    adults_month: string;
    middle_aged_month: string;
    seniors_month: string;
    children_year: string;
    teens_year: string;
    adults_year: string;
    middle_aged_year: string;
    seniors_year: string;
    menuItems: Array<{ item_name: string; orders_last_week: number; orders_last_month: number; orders_last_year: number }>;
    dishCategories: {
        orders_week_maincourse: number;
        orders_week_beverages: number;
        orders_week_starter: number;
        orders_week_dessert: number;
        orders_month_maincourse: number;
        orders_month_beverages: number;
        orders_month_starter: number;
        orders_month_dessert: number;
        orders_year_maincourse: number;
        orders_year_beverages: number;
        orders_year_starter: number;
        orders_year_dessert: number;
    };
}

const Demand: React.FC = () => {
    const [chartXY, setChartXY] = useState<ChartKey>('Menu Item vs Demand');
    const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');
    const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<Data | null>(null);
    const [comparisonMode, setComparisonMode] = useState(false);

    const colors = useMemo(() => [
        '#00589C', '#016FC4', '#1891C3', '#3AC0DA', '#3DC6C3', '#50E3C2',
        '#F3BA4D', '#F94144', '#F3722C', '#F8961E', '#F9844A', '#F9C74F',
        '#90BE6D', '#43AA8B', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
    ], []);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/chart/demandChart');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const generateData = (label: string) => {
        if (!data) {
            return {
                labels: ['No Data'],
                datasets: [{
                    label,
                    data: [0],
                    backgroundColor: ['#CCCCCC'],
                    borderColor: ['#AAAAAA'],
                    borderWidth: 1,
                    hoverOffset: 10,
                }]
            };
        }

        if (chartXY === 'Dish Category vs Demand') {
            return {
                labels: ['Main Course', 'Starter', 'Desserts', 'Beverages'],
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

        if (chartXY === 'Menu Item vs Demand') {
            return {
                labels: ['Pasta', 'Biryani', 'Murga Bhaat', 'Mutton Biryani', 'Paneer paratha', 'Mandi', 'Burger', 'Litti chokha'],
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

        if (chartXY === 'Period of Day vs Demand') {
            return {
                labels: ['Breakfast', 'Lunch', 'Evening', 'Dinner'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly'
                        ? [data.orders_week_breakfast, data.orders_week_lunch, data.orders_week_evening, data.orders_week_dinner]
                        : timeFrame === 'monthly'
                        ? [data.orders_month_breakfast, data.orders_month_lunch, data.orders_month_evening, data.orders_month_dinner]
                        : [data.orders_year_breakfast, data.orders_year_lunch, data.orders_year_evening, data.orders_year_dinner],
                    backgroundColor: colors.slice(0, 4),
                    borderColor: colors.slice(0, 4),
                    borderWidth: 1,
                    hoverOffset: 10,
                }]
            };
        }

        if (chartXY === 'Orders vs Timeline') {
            return {
                labels: timeFrame === 'weekly'
                    ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                    : timeFrame === 'monthly'
                    ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
                    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly'
                        ? [
                            data.sunday_orders, data.monday_orders, data.tuesday_orders,
                            data.wednesday_orders, data.thursday_orders, data.friday_orders, data.saturday_orders
                        ]
                        : timeFrame === 'monthly'
                        ? [data.week1_orders, data.week2_orders, data.week3_orders, data.week4_orders]
                        : [
                            data.jan_orders, data.feb_orders, data.march_orders, data.april_orders,
                            data.may_orders, data.june_orders, data.july_orders, data.aug_orders,
                            data.sept_orders, data.oct_orders, data.nov_orders, data.dec_orders
                        ],
                    backgroundColor: colors.slice(0, timeFrame === 'weekly' ? 7 : (timeFrame === 'monthly' ? 4 : 12)),
                    borderColor: colors.slice(0, timeFrame === 'weekly' ? 7 : (timeFrame === 'monthly' ? 4 : 12)),
                    borderWidth: 1,
                    hoverOffset: 10,
                }]
            };
        }

        if (chartXY === 'Orders vs Age Group') {
            return {
                labels: ['<10', '10-18', '18-40', '40-60', '60+'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly'
                        ? [data.children_week, data.teens_week, data.adults_week, data.middle_aged_week, data.seniors_week]
                        : timeFrame === 'monthly'
                        ? [data.children_month, data.teens_month, data.adults_month, data.middle_aged_month, data.seniors_month]
                        : [data.children_year, data.teens_year, data.adults_year, data.middle_aged_year, data.seniors_year],
                    backgroundColor: colors.slice(0, 5),
                    borderColor: colors.slice(0, 5),
                    borderWidth: 1,
                    hoverOffset: 10,
                }]
            };
        }

        return {
            labels: ['No Data'],
            datasets: [{
                label,
                data: [0],
                backgroundColor: ['#CCCCCC'],
                borderColor: ['#AAAAAA'],
                borderWidth: 1,
                hoverOffset: 10,
            }]
        };
    };

    const chartData = useMemo(() => {
        const label = chartXY === 'Orders vs Timeline' || chartXY.includes('Demand') ? 'Orders' : 'Orders';

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
    }, [chartXY, comparisonMode, generateData]);

    const chartOptions: ChartOptions<'bar'> | ChartOptions<'line'> = useMemo(() => {
        const xAxisLabels: Record<ChartKey, string> = {
            'Menu Item vs Demand': timeFrame === 'weekly' ? 'Week Days' : (timeFrame === 'monthly' ? 'Weeks' : 'Months'),
            'Dish Category vs Demand': 'Menu Items',
            'Period of Day vs Demand': 'Time Slots',
            'Orders vs Timeline': timeFrame === 'weekly' ? 'Week Days' : (timeFrame === 'monthly' ? 'Weeks' : 'Quarters'),
            'Orders vs Age Group': 'Age Group',

        };

        const yAxisLabels: Record<ChartKey, string> = {
            'Menu Item vs Demand': 'Orders',
            'Dish Category vs Demand': 'Orders',
            'Period of Day vs Demand': 'Orders',
            'Orders vs Timeline': 'Orders',
            'Orders vs Age Group': 'Orders',

        };

        const tooltipLabels: Record<ChartKey, string> = {
            'Menu Item vs Demand': 'Orders',
            'Dish Category vs Demand': 'Orders',
            'Period of Day vs Demand': 'Orders',
            'Orders vs Timeline': 'Orders',
            'Orders vs Age Group': 'Orders',

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
                        label: function (context: any) {
                            const value = context.raw;
                            const label = tooltipLabels[chartXY] || '';
                            return `${value} ${label}`;
                        }
                    }
                },
            },
        };
    }, [chartXY, timeFrame]);

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
                        <div className={`w-9 h-5 rounded-full peer ${comparisonMode ? 'bg-[#FF9B26]' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF9B26]/20 transition-colors`}>
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
                        className="p-2 border border-gray-200 rounded-md cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={chartXY}
                        onChange={(e) => setChartXY(e.target.value as ChartKey)}
                    >
                        <option value="Menu Item vs Demand">Menu Item vs Demand</option>
                        <option value="Dish Category vs Demand">Dish Category vs Demand</option>
                        <option value="Period of Day vs Demand">Period of Day vs Demand</option>
                        <option value="Orders vs Timeline">Orders vs Timeline</option>
                        <option value="Orders vs Age Group">Orders vs Age Group</option>
                    </select>
                </div>

                <div className="flex flex-col flex-1">
                    <label className="text-xs text-gray-500 mb-1">
                        <FaCalendarAlt className="inline mr-1" /> Time Period
                    </label>
                    <select
                        className="p-2 border border-gray-200 rounded-md cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={timeFrame}
                        onChange={(e) => setTimeFrame(e.target.value as 'weekly' | 'monthly' | 'yearly')}
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
                            className={`flex-1 flex items-center justify-center p-2 text-sm rounded-md transition-colors ${chartType === 'bar'
                                ? 'bg-[#FF9B26] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            onClick={() => setChartType('bar')}
                        >
                            <FaChartBar className="mr-1" /> Bar
                        </button>
                        <button
                            className={`flex-1 flex items-center justify-center p-2 text-sm rounded-md transition-colors ${chartType === 'line'
                                ? 'bg-[#FF9B26] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            onClick={() => setChartType('line')}
                        >
                            <FaChartLine className="mr-1" /> Line
                        </button>
                        <button
                            className={`flex-1 flex items-center justify-center p-2 text-sm rounded-md transition-colors ${chartType === 'pie'
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

            {/* Chart container */}
            <div className="bg-white p-4 rounded-lg shadow-sm" style={{ minHeight: '400px' }}>
                {chartType === 'bar' && <BarChart data={chartData} options={chartOptions as ChartOptions<'bar'>} />}
                {chartType === 'pie' && <PieChart data={chartData} />}
                {chartType === 'line' && <LineChart data={chartData} options={chartOptions as ChartOptions<'line'>} />}
            </div>
        </div>
    );
};

export default Demand;