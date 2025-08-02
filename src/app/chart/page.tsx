"use client";
import React, { useState } from 'react';
import Sales from './components/Sales';
import ProfitLoss from './components/ProfitLoss';
import Demand from './components/Demand';
import ChefChart from './components/ChefChart';
import WaiterChart from './components/WaiterChart';
import PopularDishes from './components/PopularDishes';
import { FaChartBar, FaChartLine, FaChartPie, FaUserTie, FaUtensils, FaConciergeBell } from 'react-icons/fa';

const Page: React.FC = () => {
    const [selectedFilter1, setSelectedFilter1] = useState<string>('sales');
    const [selectedFilter2, setSelectedFilter2] = useState<string>('chefPerformance');

    return (
        <div className="container mx-auto px-6 pt-4 pb-8">
            <div className="py-4">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-semibold text-gray-800">Analytics Dashboard</h1>
                </div>
            </div>

            <section className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Revenue Analytics</h2>

                    <div className='flex flex-wrap md:flex-nowrap text-sm md:text-md gap-2 overflow-x-auto pb-2'>
                        <button
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${selectedFilter1 === 'sales'
                                    ? 'bg-supporting3 text-white font-medium shadow-sm'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }`}
                            onClick={() => setSelectedFilter1('sales')}
                        >
                            <FaChartBar size={14} />
                            <span>Sales</span>
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${selectedFilter1 === 'profitLoss'
                                    ? 'bg-supporting3 text-white font-medium shadow-sm'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }`}
                            onClick={() => setSelectedFilter1('profitLoss')}
                        >
                            <FaChartLine size={14} />
                            <span>Profit/Loss</span>
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${selectedFilter1 === 'demand'
                                    ? 'bg-supporting3 text-white font-medium shadow-sm'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }`}
                            onClick={() => setSelectedFilter1('demand')}
                        >
                            <FaChartPie size={14} />
                            <span>Demand</span>
                        </button>
                    </div>

                    <div className="p-2 bg-gray-50 rounded-lg">
                        {selectedFilter1 === 'sales' && (<Sales />)}
                        {selectedFilter1 === 'profitLoss' && (<ProfitLoss />)}
                        {selectedFilter1 === 'demand' && (<Demand />)}
                    </div>
                </div>
            </section>

            <section className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-4'>
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Performance Analytics</h2>

                <div className='flex flex-wrap md:flex-nowrap text-sm md:text-md gap-2 overflow-x-auto pb-2'>
                    <button
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${selectedFilter2 === 'chefPerformance'
                                ? 'bg-supporting3 text-white font-medium shadow-sm'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                        onClick={() => setSelectedFilter2('chefPerformance')}
                    >
                        <FaUtensils size={14} />
                        <span>Chef Performance</span>
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${selectedFilter2 === 'waiterPerformance'
                                ? 'bg-supporting3 text-white font-medium shadow-sm'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                        onClick={() => setSelectedFilter2('waiterPerformance')}
                    >
                        <FaConciergeBell size={14} />
                        <span>Waiter Performance</span>
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${selectedFilter2 === 'popularDishes'
                                ? 'bg-supporting3 text-white font-medium shadow-sm'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                        onClick={() => setSelectedFilter2('popularDishes')}
                    >
                        <FaUserTie size={14} />
                        <span>Popular Dishes</span>
                    </button>
                </div>

                <div className="p-2 bg-gray-50 rounded-lg">
                    {selectedFilter2 === 'chefPerformance' && (<ChefChart />)}
                    {selectedFilter2 === 'waiterPerformance' && (<WaiterChart />)}
                    {selectedFilter2 === 'popularDishes' && (<PopularDishes />)}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Page;
