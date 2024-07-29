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


        <div className='rounded-md min-w-full border border-primary grid grid-cols-3 gap-2 px-3 py-2 font-semibold font-raleway text-[#3a3636]'>
    <div className='flex flex-col gap-1 col-span-2'>
        <h2 className='text-sm font-extrabold text-[#131212]'>{customername}</h2>
        <p className='text-xs '>{customermobile}</p>
        <p className='text-xs'>Table: #{tablenumber}</p>
        <p className='text-xs'>Waiter: {waiter}</p>
    </div>
    <div className='flex flex-col gap-1'>
        <h2 className='text-sm font-extrabold text-primary'>₹{amount}</h2>
        <p className='text-xs '>{date}</p>
        <p className='text-xs '>{time}</p>
        <button className='bg-supporting2 rounded-md py-1 px-2 text-white text-xs font-semibold hover:bg-supporting1 transition-colors'>
            Details
        </button>
    </div>
</div>

    
    );
};

export default RecentPaymentCard;