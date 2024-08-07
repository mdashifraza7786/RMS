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
        <div className='min-w-[22rem] border border-gray-700 rounded-md relative p-3 flex flex-col gap-3 items-center text-sm tracking-wide'>
            <div className='w-[20px] h-[20px] bg-[#FF0000] rounded-full absolute -right-[7px] -top-[7px] z-1'></div>
            <div className='grid grid-cols-2 gap-4 px-3 py-3'>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-[14px]'>
                        Current Stock: <span className='text-secondary'>{quantity} {unit}</span>
                    </h1>
                    <p className='text-[14px]'>
                        Lower Limit: <span className='text-secondary'>{lowlimit} {unit}</span>
                    </p>
                </div>
                <div className='flex flex-col gap-2'>
                    <h1 className='text-[14px]'>
                        Item: <span className='text-secondary'>{name}</span>
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