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
        <div className='bg-[#e6e6e6] py-[5vh] px-[5vw] md:px-[8vw] font-raleway flex flex-col gap-[4vh] relative'>
            <div className="flex items-center mb-4">
                <FaChartBar className="text-primary mr-3" size={24} />
                <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
            </div>
            
            {/* Revenue Section */}
            <section className='bg-white rounded-xl shadow-md p-6 flex flex-col gap-4 relative'>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Revenue Analytics</h2>
                
                <div className='flex flex-wrap md:flex-nowrap text-sm md:text-md gap-2 overflow-x-auto pb-2'>
                    <button
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                            selectedFilter1 === 'sales' 
                            ? 'bg-supporting3 text-white font-medium shadow-sm' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => setSelectedFilter1('sales')}
                    >
                        <FaChartBar size={14} />
                        <span>Sales</span>
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                            selectedFilter1 === 'profitLoss' 
                            ? 'bg-supporting3 text-white font-medium shadow-sm' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => setSelectedFilter1('profitLoss')}
                    >
                        <FaChartLine size={14} />
                        <span>Profit/Loss</span>
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                            selectedFilter1 === 'demand' 
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
                    {selectedFilter1 === 'sales' && (<Sales/>)}
                    {selectedFilter1 === 'profitLoss' && (<ProfitLoss/>)}
                    {selectedFilter1 === 'demand' && (<Demand/>)}
                </div>
            </section>

            {/* Performance Section */}
            <section className='bg-white rounded-xl shadow-md p-6 flex flex-col gap-4 relative'>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Performance Analytics</h2>
                
                <div className='flex flex-wrap md:flex-nowrap text-sm md:text-md gap-2 overflow-x-auto pb-2'>
                    <button
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                            selectedFilter2 === 'chefPerformance' 
                            ? 'bg-supporting3 text-white font-medium shadow-sm' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => setSelectedFilter2('chefPerformance')}
                    >
                        <FaUtensils size={14} />
                        <span>Chef Performance</span>
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                            selectedFilter2 === 'waiterPerformance' 
                            ? 'bg-supporting3 text-white font-medium shadow-sm' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => setSelectedFilter2('waiterPerformance')}
                    >
                        <FaConciergeBell size={14} />
                        <span>Waiter Performance</span>
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                            selectedFilter2 === 'popularDishes' 
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
                    {selectedFilter2 === 'chefPerformance' && (<ChefChart/>)}
                    {selectedFilter2 === 'waiterPerformance' && (<WaiterChart/>)}
                    {selectedFilter2 === 'popularDishes' && (<PopularDishes/>)}
                </div>
            </section>
        </div>
    );
};

export default Page;
