"use client";

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import BarChart from '../chartConfiguration/Bar';
import PieChart from '../chartConfiguration/Pie';
import LineChart from '../chartConfiguration/Line';
import { FaChartBar, FaChartPie, FaChartLine, FaCalendarAlt, FaFilter } from 'react-icons/fa';

type ChartKey =
    'Chef vs Ratings' |
    'Chef vs Orders Served' |
    'Chef vs Speed';

const ChefChart: React.FC = () => {
    const [chartXY, setChartXY] = useState<ChartKey>('Chef vs Ratings');
    const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');
    const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<any>(null);

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

    useEffect(() => {
        const fetchChefData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/chart/chefChart');
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching chef data:', error);
                setLoading(false);
            }
        };

        fetchChefData();
    }, []);

    const generateData = (label: string) => {
        if (!data || !data.chefs || !data.ratings || !data.orders || !data.speed) {
            return { labels: [], datasets: [] };
        }

        let chartLabels = [];
        let chartData = [];

        if (chartXY === 'Chef vs Ratings') {
            chartLabels = data.chefs.map((chef: string) => chef);
            
            if (timeFrame === 'weekly') {
                chartData = data.ratings.weekly;
            } else if (timeFrame === 'monthly') {
                chartData = data.ratings.monthly;
            } else {
                chartData = data.ratings.yearly;
            }
        } 
        else if (chartXY === 'Chef vs Orders Served') {
            chartLabels = data.chefs.map((chef: string) => chef);
            
            if (timeFrame === 'weekly') {
                chartData = data.orders.weekly;
            } else if (timeFrame === 'monthly') {
                chartData = data.orders.monthly;
            } else {
                chartData = data.orders.yearly;
            }
        } 
        else if (chartXY === 'Chef vs Speed') {
            chartLabels = data.chefs.map((chef: string) => chef);
            
            if (timeFrame === 'weekly') {
                chartData = data.speed.weekly;
            } else if (timeFrame === 'monthly') {
                chartData = data.speed.monthly;
            } else {
                chartData = data.speed.yearly;
            }
        }

        return {
            labels: chartLabels,
            datasets: [{
                label,
                data: chartData,
                backgroundColor: colors,
                borderColor: chartType === 'line' ? colors[0] : colors,
                borderWidth: 1,
                fill: chartType === 'line' ? false : undefined,
                tension: 0.4
            }]
        };
    };

    const chartData = useMemo(() => {
        const labels: Record<ChartKey, string> = {
            'Chef vs Ratings': 'Average Rating',
            'Chef vs Orders Served': 'Orders Served',
            'Chef vs Speed': 'Average Preparation Time (mins)'
        };
        
        return generateData(labels[chartXY]);
    }, [chartXY, timeFrame, data, chartType]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

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
                        <option value="Chef vs Ratings">Chef Performance by Rating</option>
                        <option value="Chef vs Orders Served">Chef Performance by Orders Served</option>
                        <option value="Chef vs Speed">Chef Performance by Preparation Speed</option>
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

export default ChefChart;
