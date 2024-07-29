"use client"
import React from 'react';

interface LowStockCardProps {
    name: string;
    lowlimit: number;
    quantity: number;
    unit: string;
}

const LowStock: React.FC<LowStockCardProps> = ({ name, quantity, lowlimit, unit }) => {

    return (
        <div className="font-raleway border border-gray-700 p-4 flex flex-col gap-3 items-center text-sm rounded-md tracking-wide">
            <div className='text-xl w-full bg-red-600 text-white text-center py-2 rounded-md'>
                {name}
            </div>
            <div className='w-full flex flex-col gap-1'>
                <div className='flex justify-between w-full'>
                    <span className='text-gray-700'>Remaining:</span>
                    <span className='text-blue-600'>{quantity} {unit}</span>
                </div>
                <div className='flex justify-between w-full'>
                    <span className='text-gray-700'>Minimum Needed:</span>
                    <span className='text-red-600'>{lowlimit} {unit}</span>
                </div>
            </div>
            <button className='shadow-sm rounded-md px-4 py-2 font-semibold text-white bg-supporting2 hover:bg-yellow-500 transition-colors'>
                Order Now
            </button>
        </div>


    );
};

export default LowStock;