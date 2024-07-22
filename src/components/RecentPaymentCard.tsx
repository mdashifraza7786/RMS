import React from 'react';

interface RecentPaymentCardProps {
    orderid?: string;
    customername: string;
    customermobile: string;
    tablenumber: string;
    waiter: string;
    amount: string;
    date: string;
    time: string;
}

const RecentPaymentCard: React.FC<RecentPaymentCardProps> = ({ 
    orderid,
    customername,
    customermobile,
    tablenumber,
    waiter,
    amount,
    date,
    time
}) => {

    return (


        <div className='rounded-[10px] border border-primary min-w-full h-[7rem] grid grid-cols-3 gap-[10px] px-4 py-2'>
            <div className=' flex flex-col gap-[3px] col-span-2'>
                <h2 className='text-[17px] font-extrabold'>{customername}</h2>
                <p className='text-[13px] font-light'>{customermobile}</p>
                <p className='text-[13px]'>Table: #{tablenumber}</p>
                <p className='text-[13px]'>Waiter: {waiter}</p>
            </div>
            <div className='flex flex-col gap-[3px]'>
                <h2 className='text-[17px] font-extrabold'>₹{amount}</h2>
                <p className='text-[13px] font-light'>{date}</p>
                <p className='text-[13px] font-light'>{time}</p>
                <button className='bg-supporting2 rounded-[10px] py-[1px] px-[7px] min-w-full text-white text-[15px]'>Details</button>
            </div>
        </div>
    );
};

export default RecentPaymentCard;