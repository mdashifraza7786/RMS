"use client";
import React, { useState } from 'react';
import Sales from './components/Sales';
import ProfitLoss from './components/ProfitLoss';
import Demand from './components/Demand';
import ChefChart from './components/ChefChart';
import WaiterChart from './components/WaiterChart';
import PopularDishes from './components/PopularDishes';

const Page: React.FC = () => {
    const [selectedFilter1, setSelectedFilter1] = useState<string>('sales');
    const [selectedFilter2, setSelectedFilter2] = useState<string>('chefPerformance');

    return (
        <div className='bg-[#e6e6e6] py-[5vh] px-[8vw] font-raleway flex flex-col gap-[6vh] relative'>
            CHARTS AND BUSINESS ANALYSIS
            
            <section className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-3 relative'>
                <div className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-6'>
                    <div className='flex text-md gap-4'>
                        <div
                            className={`px-[10px] py-2 rounded-xl cursor-pointer ${selectedFilter1 === 'sales' ? 'font-bold bg-[#FA9F1B70] transition-colors duration-300 text-[#fc9802e3]' : ''}`}
                            onClick={() => setSelectedFilter1('sales')}
                        >
                            Sales
                        </div>
                        <div
                            className={`px-[10px] py-2 rounded-xl cursor-pointer ${selectedFilter1 === 'profitLoss' ? 'font-bold bg-[#FA9F1B70] transition-colors duration-300 text-[#fc9802e3]' : ''}`}
                            onClick={() => setSelectedFilter1('profitLoss')}
                        >
                            Profit/Loss
                        </div>
                        <div
                            className={`px-[10px] py-2 rounded-xl cursor-pointer ${selectedFilter1 === 'demand' ? 'font-bold bg-[#FA9F1B70] transition-colors duration-300 text-[#fc9802e3]' : ''}`}
                            onClick={() => setSelectedFilter1('demand')}
                        >
                            Demand
                        </div>
                    </div>

                    {selectedFilter1 === 'sales' && (<Sales/>)}
                    {selectedFilter1 === 'profitLoss' && (<ProfitLoss/>)}
                    {selectedFilter1 === 'demand' && (<Demand/>)}

                </div>
            </section>

            <section className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-3 relative'>
                <div className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-6'>
                    <div className='flex text-md gap-4'>
                        <div
                            className={`px-[10px] py-2 rounded-xl cursor-pointer ${selectedFilter2 === 'chefPerformance' ? 'font-bold bg-[#FA9F1B70] transition-colors duration-300 text-[#fc9802e3]' : ''}`}
                            onClick={() => setSelectedFilter2('chefPerformance')}
                        >
                            Chef Performance
                        </div>
                        <div
                            className={`px-[10px] py-2 rounded-xl cursor-pointer ${selectedFilter2 === 'waiterPerformance' ? 'font-bold bg-[#FA9F1B70] transition-colors duration-300 text-[#fc9802e3]' : ''}`}
                            onClick={() => setSelectedFilter2('waiterPerformance')}
                        >
                            Waiter Performance
                        </div>
                        <div
                            className={`px-[10px] py-2 rounded-xl cursor-pointer ${selectedFilter2 === 'popularDishes' ? 'font-bold bg-[#FA9F1B70] transition-colors duration-300 text-[#fc9802e3]' : ''}`}
                            onClick={() => setSelectedFilter2('popularDishes')}
                        >
                            Popular Dishes
                        </div>
                    </div>
                    {selectedFilter2 === 'chefPerformance' && (<ChefChart/>)}
                    {selectedFilter2 === 'waiterPerformance' && (<WaiterChart/>)}
                    {selectedFilter2 === 'popularDishes' && (<PopularDishes/>)}
                </div>
            </section>
        </div>
    );
};

export default Page;
