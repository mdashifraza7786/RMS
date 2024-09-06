"use client";

import React, { useState, useEffect, useMemo } from 'react';
import BarChart from '../chartConfiguration/Bar';
import PieChart from '../chartConfiguration/Pie';
import LineChart from '../chartConfiguration/Line';
import AreaChart from '../chartConfiguration/Area';
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

const ProfitLoss: React.FC = () => {
    const [chartXY, setChartXY] = useState<ChartKey>('week day vs sales');
    const [chartType, setChartType] = useState<'bar' | 'pie' | 'line' | 'area'>('bar');

    useEffect(() => {
        document.title = "Sales";
    }, []);

    const colors = useMemo(() => [
        '#00589C', '#016FC4', '#1891C3', '#3AC0DA', '#3DC6C3', '#50E3C2',
        '#F3BA4D', '#F94144', '#F3722C', '#F8961E', '#F9844A', '#F9C74F',
        '#90BE6D', '#43AA8B', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
    ], []);

    const chartData = useMemo(() => {
        const dataMap: Record<ChartKey, {
            labels: string[];
            datasets: {
                label: string;
                data: number[];
                backgroundColor: string[];
                borderColor: string[];
                borderWidth: number;
                hoverOffset: number;
            }[];
        }> = {
            'week day vs sales': {
                labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                datasets: [{
                    label: 'Sales (₹)',
                    data: [500, 800, 1200, 700, 1100, 950, 1000],
                    backgroundColor: colors.slice(0, 7),
                    borderColor: colors.slice(0, 7),
                    borderWidth: 1,
                    hoverOffset: 10,
                }],
            },
            'menu item vs sales': {
                labels: ['Pizza', 'Burger', 'Pasta', 'Salad', 'Sushi', 'Tacos', 'Pasta', 'Noodles'],
                datasets: [{
                    label: 'Sales (₹)',
                    data: [2200, 900, 600, 500, 700, 800, 600, 400],
                    backgroundColor: colors.slice(0, 8),
                    borderColor: colors.slice(0, 8),
                    borderWidth: 1,
                    hoverOffset: 10,
                }],
            },
            'time slot vs orders': {
                labels: ['Breakfast', 'Lunch', 'Evening', 'Dinner', 'Late Night'],
                datasets: [{
                    label: 'Orders',
                    data: [300, 1200, 800, 1000, 500],
                    backgroundColor: colors.slice(0, 5),
                    borderColor: colors.slice(0, 5),
                    borderWidth: 1,
                    hoverOffset: 10,
                }],
            },
            'week day vs customer': {
                labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                datasets: [{
                    label: 'Customer Visits',
                    data: [200, 500, 800, 600, 900, 700, 1100],
                    backgroundColor: colors.slice(0, 7),
                    borderColor: colors.slice(0, 7),
                    borderWidth: 1,
                    hoverOffset: 10,
                }],
            },
            'Dish category vs sales': {
                labels: ['Main Course', 'Appetizers', 'Desserts', 'Beverages', 'Sides'],
                datasets: [{
                    label: 'Sales (₹)',
                    data: [3000, 1500, 800, 600, 400],
                    backgroundColor: colors.slice(0, 5),
                    borderColor: colors.slice(0, 5),
                    borderWidth: 1,
                    hoverOffset: 10,
                }],
            },
            'payment method vs sales': {
                labels: ['Cash', 'Credit Card', 'UPI', 'Wallet', 'Gift Card'],
                datasets: [{
                    label: 'Sales (₹)',
                    data: [1500, 2500, 1800, 1200, 900],
                    backgroundColor: colors.slice(0, 5),
                    borderColor: colors.slice(0, 5),
                    borderWidth: 1,
                    hoverOffset: 10,
                }],
            },
            'age group vs sales': {
                labels: ['Under 18', '18-25', '26-35', '36-50', '50-65', '65+'],
                datasets: [{
                    label: 'Sales (₹)',
                    data: [400, 1200, 2000, 1500, 700, 300],
                    backgroundColor: colors.slice(0, 6),
                    borderColor: colors.slice(0, 6),
                    borderWidth: 1,
                    hoverOffset: 10,
                }],
            },
            'gender group vs sales': {
                labels: ['Male', 'Female', 'Non-binary', 'Other'],
                datasets: [{
                    label: 'Sales (₹)',
                    data: [2000, 1800, 400, 300],
                    backgroundColor: colors.slice(0, 4),
                    borderColor: colors.slice(0, 4),
                    borderWidth: 1,
                    hoverOffset: 10,
                }],
            },
        };

        return dataMap[chartXY];
    }, [chartXY, colors]);

    const chartOptions: ChartOptions<'bar'> | ChartOptions<'line'> = useMemo(() => {
        const xAxisLabels: Record<ChartKey, string> = {
            'week day vs sales': 'Week Days',
            'menu item vs sales': 'Menu Items',
            'time slot vs orders': 'Time Slots',
            'week day vs customer': 'Week Days',
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

        if (chartType === 'pie') {
            return {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top' as const, // Ensure position is a valid Chart.js option
                    },
                    title: {
                        display: true,
                        text: 'Sales Distribution by Category',
                    },
                },
            };
        }

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
        } as ChartOptions<'bar'>;
    }, [chartType, chartXY]);

    return (
        <div className="flex flex-col gap-4">
            {/* Drop-down filters */}
            <section className="flex justify-between">
                <select
                    className="p-2 border cursor-pointer"
                    value={chartXY}
                    onChange={(e) => setChartXY(e.target.value as ChartKey)}
                >
                    <option value="week day vs sales">Sales by days of the week</option>
                    <option value="menu item vs sales">Sales by menu item</option>
                    <option value="time slot vs orders">Orders by time of day</option>
                    <option value="week day vs customer">Customer visits by days of the week</option>
                    <option value="Dish category vs sales">Sales by dish category</option>
                    <option value="payment method vs sales">Sales by payment method</option>
                    <option value="age group vs sales">Sales by age group</option>
                    <option value="gender group vs sales">Sales distribution by customer gender</option>
                </select>

                <select
                    className="p-2 border cursor-pointer"
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value as 'bar' | 'pie' | 'line' | 'area')}
                >
                    <option value="bar">Bar Chart</option>
                    <option value="pie">Pie Chart</option>
                    <option value="line">Line Chart</option>
                    <option value="area">Area Chart</option>
                </select>
            </section>

            {/* Chart */}
            <section className="flex justify-center items-center" style={{ width: '100%', height: '450px' }}>
                {chartType === 'bar' && <BarChart data={chartData} options={chartOptions as ChartOptions<'bar'>} />}
                {chartType === 'pie' && <PieChart data={chartData} />}
                {chartType === 'line' && <LineChart data={chartData} options={chartOptions as ChartOptions<'line'>} />}
                {chartType === 'area' && <AreaChart data={chartData} options={chartOptions as ChartOptions<'line'>} />}
            </section>
        </div>
    );
};

export default ProfitLoss;
