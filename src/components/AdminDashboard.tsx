"use client";

import React, { useRef, useEffect, useState, Suspense, lazy } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { PieChart } from '@mui/x-charts/PieChart';
import Link from 'next/link';
import OrderScreen from './OrderScreen';
import axios from 'axios';
export interface Table {
    id: number;
    tablenumber: number;
    availability: number;
}
export interface OrderedItems {
    item_id: string;
    item_name: string;
    quantity: number;
    price: number;
}
export interface billingAmount {
    subtotal: number;
}
const OrderQueueCard = lazy(() => import('./OrderQueueCard'));
const TableStatusCard = lazy(() => import('./TableStatusCard'));
const RecentPaymentCard = lazy(() => import('./RecentPaymentCard'));

const AdminDashboard: React.FC = () => {
    const [tableData, setTableData] = useState<Table[]>([]);

    const data = [
        { id: 0, value: 1000, label: 'Revenue', color: '#03A9F4' },
        { id: 1, value: 150, label: 'Orders', color: '#FA9F1B' }
    ];

    const sliderRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [selectedTable, setSelectedTable] = useState<number | null>(null);
    const [orderedItems, setOrderedItems] = useState<{ orderid: number, billing: billingAmount; tablenumber: number; itemsordered: OrderedItems[] }[]>([]);



    const fetchActiveOrders = async () => {
        try {
            const response = await axios.get("/api/order/activeOrders");
            const activeOrders = response.data.map((order: any) => ({
                orderid: order.orderId,
                billing: {
                    subtotal: order.billing.subtotal
                },
                tablenumber: Number(order.tableNumber),
                itemsordered: order.orderItems.map((item: any) => ({
                    item_id: item.item_id,
                    item_name: item.item_name,
                    quantity: item.quantity,
                    price: item.price,
                })),
            }));
            setOrderedItems(activeOrders);
        } catch (error) {
            console.error("Error fetching active orders:", error);
        }
    };

    useEffect(() => {
        fetchActiveOrders();
        fetchTables();
    }, []);
    const fetchTables = async () => {
        const response = await fetch("/api/tables");
        const data = await response.json();
        setTableData(data.tables);
    };

    function updateOrderedItems(bookedItems: any) {
        setOrderedItems((prevItems) => {
            return prevItems.map(order =>
                order.tablenumber === bookedItems.tablenumber
                    ? {
                        ...order,
                        billing: {
                            subtotal:bookedItems.billing.subtotal
                        },
                        itemsordered: [...order.itemsordered, ...bookedItems.itemsordered] // Merge items
                    }
                    : order
            ).concat(prevItems.some(order => order.tablenumber === bookedItems.tablenumber) ? [] : [bookedItems]);
        });
    }
    
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
        setSelectedTable(tablenumber);
    };
    const closeOrderScreen = () => {
        setSelectedTable(null);
    };

    return (
        <div className={`bg-[#e6e6e6] px-[8vw] py-[5vh] flex flex-col gap-[6vh]`}>
            <div className='font-semibold text-[18px]'>Dashboard</div>

            <section className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-3 relative'>
                <div className='flex justify-between'>
                    <div className='font-extrabold text-[15px]'>Orders in Queue</div>
                    <Link href={""} className='text-[15px] font-extrabold'>
                        <p>View All</p>
                    </Link>
                </div>
                <div>
                    {showLeftArrow && (
                        <button
                            onClick={scrollLeft}
                            className='scrollbar-hide absolute left-[-30px] top-1/2 -translate-y-1/2 w-[50px] h-[50px] rounded-full bg-supporting3 flex justify-center items-center'
                        >
                            <MdKeyboardArrowLeft className='text-5xl text-white' />
                        </button>
                    )}

                    <div ref={sliderRef} className='flex gap-[20px] overflow-x-auto scroll-smooth py-3'>
                        <Suspense fallback={<div>Loading orders...</div>}>
                            <OrderQueueCard table="1" waiter="Shyal Lal" amount="989.32" orid="2" />
                            <OrderQueueCard table="1" waiter="Shyal Lal" amount="989.32" orid="2" />
                            <OrderQueueCard table="1" waiter="Shyal Lal" amount="989.32" orid="2" />
                            <OrderQueueCard table="1" waiter="Shyal Lal" amount="989.32" orid="2" />
                            <OrderQueueCard table="1" waiter="Shyal Lal" amount="989.32" orid="2" />
                            <OrderQueueCard table="1" waiter="Shyal Lal" amount="989.32" orid="2" />
                            <OrderQueueCard table="1" waiter="Shyal Lal" amount="989.32" orid="2" />
                        </Suspense>
                    </div>

                    {/* Right Scroll Button */}
                    {showRightArrow && (
                        <button
                            onClick={scrollRight}
                            className='absolute right-[-30px] top-1/2 -translate-y-1/2 w-[50px] h-[50px] rounded-full bg-supporting3 flex justify-center items-center'
                        >
                            <MdKeyboardArrowRight className='text-5xl text-white' />
                        </button>
                    )}
                </div>
            </section>
            {selectedTable !== null && (
                <OrderScreen tableNumber={selectedTable} orderedItem={orderedItems} setorderitemsfun={updateOrderedItems} tabledata={tableData} closeOrderScreen={closeOrderScreen} />
            )}
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
                    <Suspense fallback={<div>Loading tables...</div>}>
                        {tableData && tableData.length > 0 ? (
                            tableData.map((item, index) => (
                                <TableStatusCard
                                    key={index}
                                    tablestatus={item.availability === 0 ? 'available' : 'notavailable'}
                                    tableno={Number(item.tablenumber)}
                                    doOrder={handleOrder}
                                />
                            ))
                        ) : (
                            <div className='flex justify-center items-center h-20 w-full'>No tables available, Please add a table</div>
                        )}


                    </Suspense>
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
                <div className='bg-white rounded-lg p-[4vh] w-full flex flex-col gap-10'>
                    <div className='flex justify-between'>
                        <div className='font-extrabold text-[15px]'>Recent Payments</div>
                        <Link href={""} className='text-[15px] font-extrabold'>
                            <p>View More</p>
                        </Link>
                    </div>

                    <div className='flex flex-col gap-[15px] '>
                        <RecentPaymentCard customername='Muhammad Ashif Raza' customermobile='+91-7643088251' tablenumber='11' amount='599.76' date='02/04/2024' time='01:12PM' waiter='Rahul Roy' />
                        <RecentPaymentCard customername='Muhammad Ashif Raza' customermobile='+91-7643088251' tablenumber='11' amount='599.76' date='02/04/2024' time='01:12PM' waiter='Rahul Roy' />
                        <RecentPaymentCard customername='Zeeshan Sayeed' customermobile='+91-7643088251' tablenumber='11' amount='599.76' date='02/04/2024' time='01:12PM' waiter='Rahul Roy' />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
