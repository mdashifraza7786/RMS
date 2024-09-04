"use client";

import React, { useState, useEffect } from 'react';
import BarChart from '../chartConfiguration/Bar';
import PieChart from '../chartConfiguration/Pie';

const Sales: React.FC = () => {
    const [chartXY, setChartXY] = useState('week day vs sales');

    useEffect(() => {
        document.title = "Sales";
    }, []);

    const getBarData = () => {
        switch (chartXY) {
            case 'week day vs sales':
                return {
                    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    datasets: [
                        {
                            label: 'Sales (₹)',
                            data: [500, 800, 1200, 700, 1100],
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                        },
                    ],
                };
            case 'menu item vs sales':
                return {
                    labels: ['Pizza', 'Burger', 'Pasta', 'Salad'],
                    datasets: [
                        {
                            label: 'Sales (₹)',
                            data: [2200, 900, 600, 500],
                            backgroundColor: 'rgba(182, 72, 114, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ],
                };
            case 'time slot vs orders':
                return {
                    labels: ['Morning', 'Afternoon', 'Evening', 'Night'],
                    datasets: [
                        {
                            label: 'Orders',
                            data: [150, 300, 500, 250],
                            backgroundColor: 'rgba(255, 206, 86, 0.2)', // Light Yellow background
                            borderColor: 'rgba(255, 206, 86, 1)', // Yellow border
                            borderWidth: 1,
                        },
                    ],
                };
            case 'week day vs customer':
                return {
                    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    datasets: [
                        {
                            label: 'Customer Visits',
                            data: [300, 400, 600, 350, 500],
                            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Light Green background
                            borderColor: 'rgba(75, 192, 192, 1)', // Green border
                            borderWidth: 1,
                        },
                    ],
                };
            case 'Dish category vs sales':
                return {
                    labels: ['Starters', 'Main Course', 'Desserts', 'Beverages'],
                    datasets: [
                        {
                            label: 'Sales (₹)',
                            data: [1200, 2400, 900, 700],
                            backgroundColor: 'rgba(153, 102, 255, 0.2)', // Light Purple background
                            borderColor: 'rgba(153, 102, 255, 1)', // Purple border
                            borderWidth: 1,
                        },
                    ],
                };
            case 'payment method vs sales':
                return {
                    labels: ['Credit Card', 'Debit Card', 'Cash', 'Digital Wallet'],
                    datasets: [
                        {
                            label: 'Sales (₹)',
                            data: [1500, 1000, 800, 1200],
                            backgroundColor: 'rgba(255, 99, 132, 0.2)', // Light Red background
                            borderColor: 'rgba(255, 99, 132, 1)', // Red border
                            borderWidth: 1,
                        },
                    ],
                };
            case 'age group vs sales':
                return {
                    labels: ['<18', '18-25', '26-35', '36-50', '>50'],
                    datasets: [
                        {
                            label: 'Sales (₹)',
                            data: [600, 1300, 1500, 800, 500],
                            backgroundColor: 'rgba(255, 159, 64, 0.2)', // Light Orange background
                            borderColor: 'rgba(255, 159, 64, 1)', // Orange border
                            borderWidth: 1,
                        },
                    ],
                };
            case 'gender group vs sales':
                return {
                    labels: ['Male', 'Female', 'Other'],
                    datasets: [
                        {
                            label: 'Sales (₹)',
                            data: [2200, 1800, 500],
                            backgroundColor: 'rgba(54, 162, 235, 0.2)', // Light Blue background
                            borderColor: 'rgba(54, 162, 235, 1)', // Blue border
                            borderWidth: 1,
                        },
                    ],
                };
            default:
                return {
                    labels: [],
                    datasets: [],
                };
        }
    };

    return (
        <div className='flex flex-col gap-4'>
            {/* Drop-down filters */}
            <section>
                <select
                    className='p-2 border cursor-pointer'
                    value={chartXY}
                    onChange={(e) => setChartXY(e.target.value)}
                >
                    <option value='week day vs sales'>Sales by days of the week</option>
                    <option value='menu item vs sales'>Sales by menu item</option>
                    <option value='time slot vs orders'>Orders by time of day</option>
                    <option value='week day vs customer'>Customer visits</option>
                    <option value='Dish category vs sales'>Sales distribution by menu category</option>
                    <option value='payment method vs sales'>Payment method</option>
                    <option value='age group vs sales'>Sales distribution by customer age</option>
                    <option value='gender group vs sales'>Sales distribution by customer gender</option>
                </select>
            </section>

            {/* Chart */}
            <section style={{ width: '100%', height: '450px' }}>
                <BarChart data={getBarData()} />
            </section>
        </div>
    );
};

export default Sales;
