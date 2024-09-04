"use client";
import React, { useState } from 'react';
import axios from 'axios';

const Page: React.FC = () => {
    const [selectedFilter, setSelectedFilter] = useState<string>('inventory');

    return (
        <div className='bg-[#e6e6e6] py-[5vh] px-[8vw] font-raleway flex flex-col gap-[6vh] relative'>
            CHARTS AND BUSINESS ANALYSIS
            <section className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-3 relative'>
                <div className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-6'>
                    <div className='flex text-md gap-4'>
                        <div
                            className={`px-[10px] py-2 rounded-xl cursor-pointer ${selectedFilter === 'inventory' ? 'font-bold bg-[#FA9F1B70] transition-colors duration-300 text-[#fc9802e3]' : ''}`}
                            onClick={() => setSelectedFilter('inventory')}
                        >
                            Sales
                        </div>
                        <div
                            className={`px-[10px] py-2 rounded-xl cursor-pointer ${selectedFilter === 'order' ? 'font-bold bg-[#FA9F1B70] transition-colors duration-300 text-[#fc9802e3]' : ''}`}
                            onClick={() => setSelectedFilter('order')}
                        >
                            Profit/Loss
                        </div>
                        <div
                            className={`px-[10px] py-2 rounded-xl cursor-pointer ${selectedFilter === 'kitchenOrders' ? 'font-bold bg-[#FA9F1B70] transition-colors duration-300 text-[#fc9802e3]' : ''}`}
                            onClick={() => setSelectedFilter('kitchenOrders')}
                        >
                            Demand
                        </div>
                    </div>
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
