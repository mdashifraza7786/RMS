"use client"
import React from 'react';

interface LowStockCardProps {
    name: string;
    lowlimit: number;
    quantity: number;
    unit: string;
}

    const LowStock: React.FC<LowStockCardProps> = ({ name, quantity,lowlimit, unit }) => {

    return (
        <div className="border border-gray-700 min-w-[10.2rem] p-6 flex flex-col gap-3  justify-center items-center font-semibold text-[15px] rounded-[6.08px] tracking-wider">
            <div className='font-semibold text-[20px] text-teal-600'>{name}</div>
            <div>Remaining : {quantity} {unit}</div>
            <div>Minimum Needed : {lowlimit} {unit}</div>
            <button className='shadow-md rounded-sm px-4 py-2 font-bold text-white bg-[#d6cb32]'>Order Now</button>
        </div>
    );
};

export default LowStock;