import React from 'react';

interface OrderQueueCardProps {
    table: string;
    waiter: string;
    amount: string;
    orid: string;
}

const OrderQueueCard: React.FC<OrderQueueCardProps> = ({ table, waiter, amount, orid }) => {
    return (
        <div className='min-w-[22rem] h-[6rem] border border-[#25476A] rounded-[10px] relative'>
            <div className='w-[20px] h-[20px] bg-[#FF0000] rounded-full absolute -right-[7px] -top-[7px] z-1'></div>
            <div className='grid grid-cols-2 px-3 py-4'>
                <div className='flex flex-col gap-[5px]'>
                    <h1 className='text-[17px]'>Table: <span className='text-secondary'>#{table}</span></h1>
                    <p className='text-[14px]'>Waiter: <span className='text-secondary'>{waiter}</span></p>
                </div>
                <div className='flex flex-col gap-[5px]'>
                    <h1 className='text-[17px]'>Amount: <span className='text-secondary'>₹{amount}</span></h1>
                    <button className='bg-supporting2 rounded-[10px] py-[3px] text-white text-[14px]'>View Details</button>
                </div>
            </div>
        </div>
    );
};

export default OrderQueueCard;