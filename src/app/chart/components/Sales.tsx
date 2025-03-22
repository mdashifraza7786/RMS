"use client";

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import BarChart from '../chartConfiguration/Bar';
import PieChart from '../chartConfiguration/Pie';
import LineChart from '../chartConfiguration/Line';
import { FaChartBar, FaChartPie, FaChartLine, FaCalendarAlt, FaFilter, FaExchangeAlt } from 'react-icons/fa';

type ChartKey =
    'week day vs sales' |
    'time slot vs orders' |
    'week day vs customer' |
    'Dish category vs sales' |
    'payment method vs sales' |
    'age group vs sales' |
    'gender group vs sales';

interface Data {
    sunday_sales: number;
    monday_sales: number;
    tuesday_sales: number;
    wednesday_sales: number;
    thursday_sales: number;
    friday_sales: number;
    saturday_sales: number;
    week1_sales: number;
    week2_sales: number;
    week3_sales: number;
    week4_sales: number;
    jan_sales: number;
    feb_sales: number;
    march_sales: number;
    april_sales: number;
    may_sales: number;
    june_sales: number;
    july_sales: number;
    aug_sales: number;
    sept_sales: number;
    oct_sales: number;
    nov_sales: number;
    dec_sales: number;

    orders_week_breakfast: number;
    orders_week_lunch: number;
    orders_week_evening: number;
    orders_week_dinner: number;
    orders_month_breakfast: number;
    orders_month_lunch: number;
    orders_month_evening: number;
    orders_month_dinner: number;
    orders_year_breakfast: number;
    orders_year_lunch: number;
    orders_year_evening: number;
    orders_year_dinner: number;

    sunday_visits_week: number;
    monday_visits_week: number;
    tuesday_visits_week: number;
    wednesday_visits_week: number;
    thursday_visits_week: number;
    friday_visits_week: number;
    saturday_visits_week: number;

    sunday_visits_month: number;
    monday_visits_month: number;
    tuesday_visits_month: number;
    wednesday_visits_month: number;
    thursday_visits_month: number;
    friday_visits_month: number;
    saturday_visits_month: number;

    sunday_visits_year: number;
    monday_visits_year: number;
    tuesday_visits_year: number;
    wednesday_visits_year: number;
    thursday_visits_year: number;
    friday_visits_year: number;
    saturday_visits_year: number;

    sales_week_breakfast: number;
    sales_week_lunch: number;
    sales_week_evening: number;
    sales_week_dinner: number;
    sales_month_breakfast: number;
    sales_month_lunch: number;
    sales_month_evening: number;
    sales_month_dinner: number;
    sales_year_breakfast: number;
    sales_year_lunch: number;
    sales_year_evening: number;
    sales_year_dinner: number;

    cash_week: number;
    upi_week: number;
    debitcard_week: number;
    creditcard_week: number;
    others_week: number;

    cash_month: number;
    upi_month: number;
    debitcard_month: number;
    creditcard_month: number;
    others_month: number;

    cash_year: number;
    upi_year: number;
    debitcard_year: number;
    creditcard_year: number;
    others_year: number;

    children_week: number;
    teens_week: number;
    adults_week: number;
    middle_aged_week: number;
    seniors_week: number;

    children_month: number;
    teens_month: number;
    adults_month: number;
    middle_aged_month: number;
    seniors_month: number;

    children_year: number;
    teens_year: number;
    adults_year: number;
    middle_aged_year: number;
    seniors_year: number;

    male_week: number;
    female_week: number;
    other_week: number;

    male_month: number;
    female_month: number;
    other_month: number;

    male_year: number;
    female_year: number;
    other_year: number;
}

const Sales: React.FC = () => {
    const [chartXY, setChartXY] = useState<ChartKey>('week day vs sales');
    const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');
    const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<Data | null>(null);
    const [comparisonMode, setComparisonMode] = useState<boolean>(false);

    // Color scheme for better visualization
    const colors = [
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 205, 86, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(201, 203, 207, 0.8)',
        'rgba(110, 220, 155, 0.8)',
    ];

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/chart/sales');
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching sales data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Data generation function - similar to existing but with better organization
    const generateData = (label: string) => {
        if (!data) return { labels: [], datasets: [] };

        if (chartXY === 'week day vs sales') {
            return {
                labels: timeFrame === 'weekly' ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] 
                    : timeFrame === 'monthly' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] 
                    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly' ? 
                        [data.sunday_sales, data.monday_sales, data.tuesday_sales, data.wednesday_sales, data.thursday_sales, data.friday_sales, data.saturday_sales] 
                        : timeFrame === 'monthly' ? 
                            [data.week1_sales, data.week2_sales, data.week3_sales, data.week4_sales] 
                            : [data.jan_sales, data.feb_sales, data.march_sales, data.april_sales, data.may_sales, data.june_sales, 
                                data.july_sales, data.aug_sales, data.sept_sales, data.oct_sales, data.nov_sales, data.dec_sales],
                    backgroundColor: colors,
                    borderColor: chartType === 'line' ? colors[0] : colors,
                    borderWidth: 1,
                    fill: chartType === 'line' ? false : undefined,
                    tension: 0.4
                }]
            };
        }
        
        if (chartXY === 'time slot vs orders') {
            return {
                labels: ['Breakfast', 'Lunch', 'Evening', 'Dinner'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly' ? [data.orders_week_breakfast, data.orders_week_lunch, data.orders_week_evening, data.orders_week_dinner] :
                        timeFrame === 'monthly' ? [data.orders_month_breakfast, data.orders_month_lunch, data.orders_month_evening, data.orders_month_dinner] : [data.orders_year_breakfast, data.orders_year_lunch, data.orders_year_evening, data.orders_year_dinner],
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
                    data: timeFrame === 'weekly' ? [data.sunday_visits_week, data.monday_visits_week, data.tuesday_visits_week, data.wednesday_visits_week, data.thursday_visits_week, data.friday_visits_week, data.saturday_visits_week] :
                        timeFrame === 'monthly' ? [data.sunday_visits_month, data.monday_visits_month, data.tuesday_visits_month, data.wednesday_visits_month, data.thursday_visits_month, data.friday_visits_month, data.saturday_visits_month] :
                            [data.sunday_visits_year, data.monday_visits_year, data.tuesday_visits_year, data.wednesday_visits_year, data.thursday_visits_year, data.friday_visits_year, data.saturday_visits_year],
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
                    data: timeFrame === 'weekly' ? [data.sales_week_breakfast, data.sales_week_lunch, data.sales_week_evening, data.sales_week_dinner] :
                        timeFrame === 'monthly' ? [data.sales_month_breakfast, data.sales_month_lunch, data.sales_month_evening, data.sales_month_dinner] :
                            [data.sales_year_breakfast, data.sales_year_lunch, data.sales_year_evening, data.sales_year_dinner],

                    backgroundColor: colors.slice(0, 8),
                    borderColor: colors.slice(0, 8),
                    borderWidth: 1,
                    hoverOffset: 10,
                }]
            };
        }

        if (chartXY === 'payment method vs sales') {
            return {
                labels: ['UPI', 'Credit Card', 'Debit Card', 'Cash', 'Others'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly' ? [data.upi_week, data.creditcard_week, data.debitcard_week, data.cash_week, data.others_week] :
                        timeFrame === 'monthly' ? [data.upi_month, data.creditcard_month, data.debitcard_month, data.cash_month, data.others_month] :
                            [data.upi_year, data.creditcard_year, data.debitcard_year, data.cash_year, data.others_year],
                    backgroundColor: colors.slice(0, 8),
                    borderColor: colors.slice(0, 8),
                    borderWidth: 1,
                    hoverOffset: 10,
                }]
            };
        }

        if (chartXY === 'age group vs sales') {
            return {
                labels: ['<10', '10-18', '18-40', '40-60', '60+'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly' ? [data.children_week, data.teens_week, data.adults_week, data.middle_aged_week, data.seniors_week] :
                        timeFrame === 'monthly' ? [data.children_month, data.teens_month, data.adults_month, data.middle_aged_month, data.seniors_month] :
                            [data.children_year, data.teens_year, data.adults_year, data.middle_aged_year, data.seniors_year],
                    backgroundColor: colors.slice(0, 8),
                    borderColor: colors.slice(0, 8),
                    borderWidth: 1,
                    hoverOffset: 10,
                }]
            };
        }

        else {
            return {
                labels: ['Male', 'Female', 'Others'],
                datasets: [{
                    label,
                    data: timeFrame === 'weekly' ? 
                        [data.male_week, data.female_week, data.other_week] 
                        : timeFrame === 'monthly' ? 
                            [data.male_month, data.female_month, data.other_month] 
                            : [data.male_year, data.female_year, data.other_year],
                    backgroundColor: colors.slice(0, 3),
                    borderColor: chartType === 'line' ? colors[0] : colors.slice(0, 3),
                    borderWidth: 1,
                    hoverOffset: 10,
                    tension: 0.4
                }]
            };
        }
    };

    const chartData = useMemo(() => {
        const labels: Record<ChartKey, string> = {
            'week day vs sales': 'Sales (₹)',
            'time slot vs orders': 'Orders',
            'week day vs customer': 'Customer Visits',
            'Dish category vs sales': 'Sales (₹)',
            'payment method vs sales': 'Sales (₹)',
            'age group vs sales': 'Sales (₹)',
            'gender group vs sales': 'Sales (₹)'
        };
        
        if (comparisonMode) {
            return {
                labels: generateData('Current Data').labels,
                datasets: [
                    ...generateData('Current Period').datasets,
                    ...generateData('Previous Period').datasets,
                ]
            };
        }
        
        return generateData(labels[chartXY]);
    }, [chartXY, timeFrame, data, chartType, comparisonMode]);

    const getIcon = (type: string) => {
        switch(type) {
            case 'bar': return <FaChartBar className="mr-2" />;
            case 'pie': return <FaChartPie className="mr-2" />;
            case 'line': return <FaChartLine className="mr-2" />;
            default: return <FaChartBar className="mr-2" />;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
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
                        <option value="week day vs sales">Sales by timeline</option>
                        <option value="time slot vs orders">Orders by time of day</option>
                        <option value="week day vs customer">Customer visits by days</option>
                        <option value="Dish category vs sales">Sales by dish category</option>
                        <option value="payment method vs sales">Sales by payment method</option>
                        <option value="age group vs sales">Sales by age group</option>
                        <option value="gender group vs sales">Sales by gender</option>
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

            {/* Chart container */}
            <div className="bg-white p-4 rounded-lg shadow-sm" style={{ minHeight: '400px' }}>
                {chartType === 'bar' && <BarChart data={chartData} />}
                {chartType === 'pie' && <PieChart data={chartData} />}
                {chartType === 'line' && <LineChart data={chartData} />}
            </div>
        </div>
    );
};

export default Sales;

