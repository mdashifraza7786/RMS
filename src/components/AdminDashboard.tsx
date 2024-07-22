"use client";

import React, { useRef, useEffect, useState } from 'react';
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import OrderQueueCard from './OrderQueueCard';
import TableStatusCard from './TableStatusCard';
import { PieChart } from '@mui/x-charts/PieChart';
import Link from 'next/link';
import RecentPaymentCard from './RecentPaymentCard';



const AdminDashboard: React.FC = () => {
    const data = [
        { id: 0, value: 1000, label: 'Revenue', color: '#03A9F4' },
        { id: 1, value: 150, label: 'Orders', color: '#FA9F1B' }
    ];
    const tableData = [
        { tablenumber: 1, status: "notavailable" },
        { tablenumber: 2, status: "available" },
        { tablenumber: 3, status: "available" },
        { tablenumber: 4, status: "notavailable" },
        { tablenumber: 5, status: "available" },
        { tablenumber: 6, status: "notavailable" },
        { tablenumber: 7, status: "available" },
        { tablenumber: 8, status: "notavailable" },
        { tablenumber: 9, status: "available" },
        { tablenumber: 10, status: "available" },
        { tablenumber: 11, status: "notavailable" },
        { tablenumber: 12, status: "available" },
        { tablenumber: 13, status: "available" },
        { tablenumber: 14, status: "notavailable" },
    ]
    const sliderRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    useEffect(() => {
        const sliderElement = sliderRef.current;
        if (sliderElement) {
            const handleScroll = () => {
                setShowLeftArrow(sliderElement.scrollLeft > 0);
                setShowRightArrow(
                    sliderElement.scrollLeft < sliderElement.scrollWidth - sliderElement.clientWidth
                );
            };
            sliderElement.addEventListener('scroll', handleScroll);
            return () => {
                sliderElement.removeEventListener('scroll', handleScroll);
            };
        }
    }, []);

    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    const handleOrder = (tablenumber: number) => {
        alert(tablenumber)
    }


    return (
        <div className={` bg-[#e6e6e6] px-[8vw] py-[5vh] flex flex-col gap-[6vh]`}>
            <div className='font-semibold text-[18px]'>Dashboard</div>

            {/* Orders in Queue Section */}
            <section className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-3 relative'>
                <div className='font-extrabold text-[15px]'>Orders in Queue</div>
                <div>
                    {/* Left Scroll Button */}
                    {showLeftArrow && (
                        <button onClick={scrollLeft} className='scrollbar-hide absolute left-[-30px] top-1/2 -translate-y-1/2  w-[50px] h-[50px] rounded-full bg-supporting3 flex justify-centeri items-center' >
                            <MdKeyboardArrowLeft className='text-5xl text-white' />
                        </button>
                    )}

                    {/* Slider Div */}
                    <div ref={sliderRef} className='flex gap-[20px] overflow-x-auto scroll-smooth py-3'>
                        <OrderQueueCard table="1" waiter="Shyal Lal" amount="989.32" orid="2" />
                        <OrderQueueCard table="1" waiter="Shyal Lal" amount="989.32" orid="2" />
                        <OrderQueueCard table="1" waiter="Shyal Lal" amount="989.32" orid="2" />
                        <OrderQueueCard table="1" waiter="Shyal Lal" amount="989.32" orid="2" />
                        <OrderQueueCard table="1" waiter="Shyal Lal" amount="989.32" orid="2" />
                        <OrderQueueCard table="1" waiter="Shyal Lal" amount="989.32" orid="2" />
                        <OrderQueueCard table="1" waiter="Shyal Lal" amount="989.32" orid="2" />
                    </div>

                    {/* Right Scroll Button */}
                    {showRightArrow && (
                        <button onClick={scrollRight} className='absolute right-[-30px] top-1/2 -translate-y-1/2  w-[50px] h-[50px] rounded-full bg-supporting3 flex justify-centeri items-center' >
                            <MdKeyboardArrowRight className='text-5xl text-white' />
                        </button>
                    )}
                </div>
            </section>

            {/* Table Booking Status Section */}
            <section className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-8 relative'>
                <div className='flex justify-between'>
                    <div className='font-extrabold text-[15px]'>Table Booking Status</div>

                    <div className='flex gap-[25px]'>
                        <div className='flex gap-[10px]'>
                            <div className='w-[20px] h-[20px] bg-supporting2'></div>
                            <h3 className='text-[15px]'>Available</h3>
                        </div>
                        <div className='flex gap-[10px]'>
                            <div className='w-[20px] h-[20px] bg-bgred'></div>
                            <h3 className='text-[15px]'>Not Available</h3>
                        </div>

                    </div>
                </div>

                <div className='flex flex-wrap gap-[10px]'>
                    {tableData.map((item, index) => (
                        <TableStatusCard tablestatus={item.status} tableno={item.tablenumber} doOrder={handleOrder} />

                    ))}

                </div>
            </section>

            {/* Sales Graph and Recent Payments Section */}
            <section className='flex gap-[20px]'>
                {/* Sales Graph Section */}
                <div className='bg-white rounded-lg p-[4vh]'>
                    <div>Sales</div>
                    <PieChart
                        series={[
                            {
                                data,
                                highlightScope: { faded: 'global', highlighted: 'item' },
                                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                            },
                        ]}
                        height={350}
                        width={700}
                    />
                </div>

                {/* Recent Payments Section */}
                <div className='bg-white rounded-lg p-[4vh] w-full flex flex-col gap-10 h-[30rem]'>
                    <div className='flex justify-between'>
                        <div className='font-extrabold text-[15px]'>Recent Payments</div>
                        <Link href={""} className='text-[15px] font-extrabold'><p>View More</p></Link>
                    </div>

                    <div className='flex flex-col gap-[15px] '>
                        <RecentPaymentCard customername='Muhammad Ashif Raza' customermobile='+91-7643088251' tablenumber='11' amount='599.76' date='02/04/2024' time='01:12PM' waiter='Rahul Roy' />
                        <RecentPaymentCard customername='Muhammad Ashif Raza' customermobile='+91-7643088251' tablenumber='11' amount='599.76' date='02/04/2024' time='01:12PM' waiter='Rahul Roy' />
                        <RecentPaymentCard customername='Muhammad Ashif Raza' customermobile='+91-7643088251' tablenumber='11' amount='599.76' date='02/04/2024' time='01:12PM' waiter='Rahul Roy' />
                    </div>

                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;