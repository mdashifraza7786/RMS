"use client";

import React, { useState, useEffect, useMemo } from 'react';
import BarChart from '../chartConfiguration/Bar';
import PieChart from '../chartConfiguration/Pie';
import LineChart from '../chartConfiguration/Line';
import { FaChartBar, FaChartPie, FaChartLine, FaCalendarAlt, FaFilter, FaPizzaSlice } from 'react-icons/fa';

type ChartKey =
    'week day vs Dishes' |
    'age group vs Dishes' |
    'gender group vs Dishes' |
    'dish type vs time of day';

const PopularDishes: React.FC = () => {
    const [chartXY, setChartXY] = useState<ChartKey>('week day vs Dishes');
    const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');
    const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
    const [dishType, setDishType] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    
        const colors = [
        '#00589C', '#016FC4', '#1891C3', '#3AC0DA', '#3DC6C3', '#50E3C2',
        '#F3BA4D', '#F94144', '#F3722C', '#F8961E', '#F9844A', '#F9C74F',
        '#90BE6D', '#43AA8B', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
    ];

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

            case 'dish type vs time of day':
                labels = ['Breakfast', 'Lunch', 'Evening', 'Dinner'];
                data = timeFrame === 'weekly' ? [200, 300, 400, 150] :
                    timeFrame === 'monthly' ? [800, 1200, 1000, 700] :
                        [3000, 4500, 4000, 2000];
                break;
        }

        return {
            labels,
            datasets: [{
                label,
                data,
                backgroundColor: colors,
                borderColor: chartType === 'line' ? colors[0] : colors,
                borderWidth: 1,
                hoverOffset: 10,
                fill: chartType === 'line' ? false : undefined,
                tension: 0.4
            }]
        };
    };

    const chartData = useMemo(() => {
        const label = dishType ? `${dishType} Orders` : 'Orders';
        return generateData(label);
    }, [chartXY, timeFrame, dishType, chartType, generateData]);

    return (
        <div className="flex flex-col gap-4">
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
                        <option value="week day vs Dishes">Dishes popularity over time</option>
                        <option value="age group vs Dishes">Dishes by age group</option>
                        <option value="gender group vs Dishes">Dishes by customer gender</option>
                        <option value="dish type vs time of day">Dishes by time of day</option>
                    </select>
                </div>
                
                <div className="flex flex-col flex-1">
                    <label className="text-xs text-gray-500 mb-1">
                        <FaPizzaSlice className="inline mr-1" /> Dish Type
                    </label>
                    <select
                        className="p-2 border border-gray-200 rounded-md cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={dishType}
                        onChange={(e) => setDishType(e.target.value)}
                    >
                        <option value="">All Dishes</option>
                        <option value="Biryani">Biryani</option>
                        <option value="Burger">Burger</option>
                        <option value="Egg Roll">Egg Roll</option>
                        <option value="Paneer Bhurji">Paneer Bhurji</option>
                        <option value="Beverages">Beverages</option>
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
                
                <div className="flex-1">
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

export default PopularDishes;
