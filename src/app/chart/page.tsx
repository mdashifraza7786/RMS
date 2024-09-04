"use client";
import React, { useState } from 'react';
import axios from 'axios';
import Sales from './components/Sales';
// import ProfitLoss from './components/profitLoss';
// import Demand from './components/demand'

const Page: React.FC = () => {
    const [selectedFilter, setSelectedFilter] = useState<string>('sales');

    return (
        <div className='bg-[#e6e6e6] py-[5vh] px-[8vw] font-raleway flex flex-col gap-[6vh] relative'>
            CHARTS AND BUSINESS ANALYSIS
            
            <section className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-3 relative'>
                <div className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-6'>
                    <div className='flex text-md gap-4'>
                        <div
                            className={`px-[10px] py-2 rounded-xl cursor-pointer ${selectedFilter === 'sales' ? 'font-bold bg-[#FA9F1B70] transition-colors duration-300 text-[#fc9802e3]' : ''}`}
                            onClick={() => setSelectedFilter('sales')}
                        >
                            Sales
                        </div>
                        <div
                            className={`px-[10px] py-2 rounded-xl cursor-pointer ${selectedFilter === 'profitLoss' ? 'font-bold bg-[#FA9F1B70] transition-colors duration-300 text-[#fc9802e3]' : ''}`}
                            onClick={() => setSelectedFilter('profitLoss')}
                        >
                            Profit/Loss
                        </div>
                        <div
                            className={`px-[10px] py-2 rounded-xl cursor-pointer ${selectedFilter === 'demand' ? 'font-bold bg-[#FA9F1B70] transition-colors duration-300 text-[#fc9802e3]' : ''}`}
                            onClick={() => setSelectedFilter('demand')}
                        >
                            Demand
                        </div>
                    </div>

                    {selectedFilter === 'sales' && (<Sales/>)}
                    {/* {selectedFilter === 'profitLoss' && ()}
                    {selectedFilter === 'demand' && ()} */}

                </div>
            </section>

            <section className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-3 relative'>
                <div className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-6'>
                    <div className='flex text-md gap-4'>
                        <div
                            className={`px-[10px] py-2 rounded-xl cursor-pointer ${selectedFilter === 'chefPerformance' ? 'font-bold bg-[#FA9F1B70] transition-colors duration-300 text-[#fc9802e3]' : ''}`}
                            onClick={() => setSelectedFilter('chefPerformance')}
                        >
                            Chef Performance
                        </div>
                        <div
                            className={`px-[10px] py-2 rounded-xl cursor-pointer ${selectedFilter === 'waiterPerformance' ? 'font-bold bg-[#FA9F1B70] transition-colors duration-300 text-[#fc9802e3]' : ''}`}
                            onClick={() => setSelectedFilter('waiterPerformance')}
                        >
                            Waiter Performance
                        </div>
                        <div
                            className={`px-[10px] py-2 rounded-xl cursor-pointer ${selectedFilter === 'popularDishes' ? 'font-bold bg-[#FA9F1B70] transition-colors duration-300 text-[#fc9802e3]' : ''}`}
                            onClick={() => setSelectedFilter('popularDishes')}
                        >
                            Popular Dishes
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Page;
