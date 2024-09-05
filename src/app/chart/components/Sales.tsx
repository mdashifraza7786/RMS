"use client";

import React, { useState, useEffect, useMemo } from 'react';
import BarChart from '../chartConfiguration/Bar';
import PieChart from '../chartConfiguration/Pie';

const Sales: React.FC = () => {
    const [chartXY, setChartXY] = useState('week day vs sales');
    const [chartType, setChartType] = useState('bar');

    useEffect(() => {
        document.title = "Sales";
    }, []);

    const getData = useMemo(() => {
        const dataMap = {
            'week day vs sales': {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                datasets: [{
                    label: 'Sales (₹)',
                    data: [500, 800, 1200, 700, 1100],
                    backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
                    borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
                    borderWidth: 1,
                    hoverOffset: 10,
                }],
            },
            'menu item vs sales': {
                labels: ['Pizza', 'Burger', 'Pasta', 'Salad'],
                datasets: [{
                    label: 'Sales (₹)',
                    data: [2200, 900, 600, 500],
                    backgroundColor: ['rgba(182, 72, 114, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(153, 102, 255, 0.6)'],
                    borderColor: ['rgba(182, 72, 114, 1)', 'rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)', 'rgba(153, 102, 255, 1)'],
                    borderWidth: 1,
                    hoverOffset: 10,
                }],
            },
            'time slot vs orders': {
                labels: ['Morning', 'Afternoon', 'Evening', 'Night'],
                datasets: [{
                    label: 'Orders',
                    data: [150, 300, 500, 250],
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1,
                    hoverOffset: 10,
                }],
            },
            'week day vs customer': {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                datasets: [{
                    label: 'Customer Visits',
                    data: [300, 400, 600, 350, 500],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    hoverOffset: 10,
                }],
            },
            'Dish category vs sales': {
                labels: ['Starters', 'Main Course', 'Desserts', 'Beverages'],
                datasets: [{
                    label: 'Sales (₹)',
                    data: [1200, 2400, 900, 700],
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1,
                    hoverOffset: 10,
                }],
            },
            'payment method vs sales': {
                labels: ['Credit Card', 'Debit Card', 'Cash', 'Digital Wallet'],
                datasets: [{
                    label: 'Sales (₹)',
                    data: [1500, 1000, 800, 1200],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    hoverOffset: 10,
                }],
            },
            'age group vs sales': {
                labels: ['<18', '18-25', '26-35', '36-50', '>50'],
                datasets: [{
                    label: 'Sales (₹)',
                    data: [600, 1300, 1500, 800, 500],
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1,
                    hoverOffset: 10,
                }],
            },
            'gender group vs sales': {
                labels: ['Male', 'Female', 'Other'],
                datasets: [{
                    label: 'Sales (₹)',
                    data: [2200, 1800, 500],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    hoverOffset: 10,
                }],
            },
        };
        return dataMap[chartXY] || { labels: [], datasets: [] };
    }, [chartXY]);

    return (
        <div className="flex flex-col gap-4">
            {/* Drop-down filters */}
            <section className="flex justify-between">
                <select
                    className="p-2 border cursor-pointer"
                    value={chartXY}
                    onChange={(e) => setChartXY(e.target.value)}
                >
                    <option value="week day vs sales">Sales by days of the week</option>
                    <option value="menu item vs sales">Sales by menu item</option>
                    <option value="time slot vs orders">Orders by time of day</option>
                    <option value="week day vs customer">Customer visits</option>
                    <option value="Dish category vs sales">Sales distribution by menu category</option>
                    <option value="payment method vs sales">Payment method</option>
                    <option value="age group vs sales">Sales distribution by customer age</option>
                    <option value="gender group vs sales">Sales distribution by customer gender</option>
                </select>

                <select
                    className="p-2 border cursor-pointer"
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                >
                    <option value="bar">Bar Chart</option>
                    <option value="pie">Pie Chart</option>
                </select>
            </section>

            {/* Chart */}
            <section className="flex justify-center items-center" style={{ width: '100%', height: '450px' }}>
                {chartType === 'bar' ? (
                    <BarChart data={getData} />
                ) : (
                    <PieChart data={getData} />
                )}
            </section>
        </div>
    );
};

export default Sales;
