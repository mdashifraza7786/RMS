"use client";

import React, { useRef, useEffect, useState, Suspense, lazy } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import LowStock from '@/app/inventory/components/LowStock';
import InventoryCard from '@/app/inventory/components/InventoryCard';
import KitchenOrdersCard from '@/app/inventory/components/KitchenOrdersCard';
import OrderCard from '@/app/inventory/components/OrderCard';
import RecentCard from '@/app/inventory/components/RecentCard';

// Sample data for low stock
const sampleData = [
    { name: 'Maida', lowlimit: 5, quantity: 1.1, unit: 'kg' },
    { name: 'Rice', lowlimit: 5, quantity: 15, unit: 'kg' },
    { name: 'Sugar', lowlimit: 5.1, quantity: 4.5, unit: 'kg' },
    { name: 'Salt', lowlimit: 5, quantity: 2.3, unit: 'kg' },
    { name: 'Atta', lowlimit: 5, quantity: 8, unit: 'kg' },
    { name: 'Refined oil', lowlimit: 5, quantity: 9, unit: 'L' },
    { name: 'Jeera powder', lowlimit: 100, quantity: 120, unit: 'g' },
    { name: 'Dahi', lowlimit: 2, quantity: 1.5, unit: 'kg' },
    { name: 'Mutton', lowlimit: 5, quantity: 15, unit: 'kg' },
    { name: 'Lehsun', lowlimit: 15, quantity: 5, unit: 'kg' }
];

const Page: React.FC = () => {
    const [inventory, setInventory] = useState(sampleData);
    const [lowStock, setLowStock] = useState(sampleData);
    const [selectedFilter, setSelectedFilter] = useState('inventory');
    const sliderRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    useEffect(() => {
        const checkLowStock = () => {
            let array = inventory.filter(item => item.quantity <= item.lowlimit);
            setLowStock(array);
        };

        checkLowStock();
    }, [inventory]);

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

    return (
        <div className='bg-[#e6e6e6] py-[5vh] px-[8vw] font-raleway flex flex-col gap-[6vh]'>
            <div className='font-semibold text-[18px]'>Inventory Details</div>

            {/* Show alerts for low stock */}
            <section className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-3 relative'>
                <div className='font-extrabold text-[15px]'>Urgently Needed in Kitchen</div>
                <div>
                    {/* Left Scroll Button */}
                    {showLeftArrow && (
                        <button
                            onClick={scrollLeft}
                            className='scrollbar-hide absolute left-[-30px] top-1/2 -translate-y-1/2 w-[50px] h-[50px] rounded-full bg-supporting3 flex justify-center items-center'
                        >
                            <MdKeyboardArrowLeft className='text-5xl text-white' />
                        </button>
                    )}

                    {/* Slider Div */}
                    <div ref={sliderRef} className='flex gap-[20px] overflow-x-auto scroll-smooth py-3'>
                        <Suspense fallback={<div>Loading low stock items...</div>}>
                            {lowStock.map(item => (
                                <LowStock
                                    key={item.name}
                                    name={item.name}
                                    quantity={item.quantity}
                                    lowlimit={item.lowlimit}
                                    unit={item.unit}
                                />
                            ))}
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

            <div className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-6'>
                <div className='flex text-md gap-4'>
                    <div
                        className={`px-[10px] py-2 rounded-xl cursor-pointer ${selectedFilter === 'inventory' ? 'font-bold bg-[#FA9F1B70]  transition-colors duration-300 text-[#fc9802e3]' : ''}`}
                        onClick={() => setSelectedFilter('inventory')}
                    >
                        Inventory
                    </div>
                    <div
                        className={`px-[10px] py-2 rounded-xl cursor-pointer ${selectedFilter === 'order' ? 'font-bold bg-[#FA9F1B70]  transition-colors duration-300 text-[#fc9802e3]' : ''}`}
                        onClick={() => setSelectedFilter('order')}
                    >
                        Order
                    </div>
                    <div
                        className={`px-[10px] py-2 rounded-xl cursor-pointer ${selectedFilter === 'kitchenOrders' ? 'font-bold bg-[#FA9F1B70]  transition-colors duration-300 text-[#fc9802e3]' : ''}`}
                        onClick={() => setSelectedFilter('kitchenOrders')}
                    >
                        Kitchen Orders
                    </div>
                    <div
                        className={`px-[10px] py-2 rounded-xl cursor-pointer ${selectedFilter === 'recent' ? 'font-bold bg-[#FA9F1B70]  transition-colors duration-300 text-[#fc9802e3]' : ''}`}
                        onClick={() => setSelectedFilter('recent')}
                    >
                        Recent Orders
                    </div>
                </div>

                {selectedFilter === 'inventory' && <InventoryCard />}
                {selectedFilter === 'recent' && <RecentCard />}
                {selectedFilter === 'order' && <OrderCard />}
                {selectedFilter === 'kitchenOrders' && <KitchenOrdersCard />}
            </div>
        </div>
    );
};

export default Page;
