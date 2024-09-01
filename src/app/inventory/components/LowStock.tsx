"use client";

import React from 'react';

interface LowStockCardProps {
    item_id: string;
    item_name: string;
    current_stock: number;
    low_limit: number;
    unit: string;
}

const LowStock: React.FC<LowStockCardProps> = ({ item_name, current_stock, low_limit, unit }) => {
    return (
        <div className='min-w-[22rem] border border-gray-700 rounded-md relative p-3 flex flex-col gap-3 items-center text-sm tracking-wide'>
            <div className='w-[20px] h-[20px] bg-[#FF0000] rounded-full absolute -right-[7px] -top-[7px] z-10'></div>
            <div className='grid grid-cols-2 gap-4 px-3 py-3'>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-[14px]'>
                        Current Stock: <span className='text-secondary'>{current_stock} {unit}</span>
                    </h1>
                    <p className='text-[14px]'>
                        Lower Limit: <span className='text-secondary'>{low_limit} {unit}</span>
                    </p>
                </div>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-[14px]'>
                        Item: <span className='text-secondary'>{item_name}</span>
                    </h1>
                    <button className='bg-supporting2 rounded-[10px] py-[3px] text-white text-[14px]'>
                        ORDER
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LowStock;
