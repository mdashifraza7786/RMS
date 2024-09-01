"use client";

import React, { useRef, useEffect, useState, Suspense } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import LowStock from '@/app/inventory/components/LowStock';
import InventoryCard from '@/app/inventory/components/InventoryCard';
import KitchenOrdersCard from '@/app/inventory/components/KitchenOrdersCard';
import OrderCard from '@/app/inventory/components/OrderCard';
import RecentCard from '@/app/inventory/components/RecentCard';
import axios from 'axios';

interface InventoryItem {
    item_id: string;
    item_name: string;
    current_stock: number;
    low_limit: number;
    unit: string;
}

const Page: React.FC = () => {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [lowStock, setLowStock] = useState<InventoryItem[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<'inventory' | 'order' | 'kitchenOrders' | 'recent'>('inventory');
    const sliderRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    useEffect(() => {
        const checkLowStock = () => {
            // Filter items where current_stock is less than low_limit
            const array = inventory.filter(item => item.current_stock < item.low_limit);
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
            // Initial check
            handleScroll();
            return () => {
                sliderElement.removeEventListener('scroll', handleScroll);
            };
        }
    }, []);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await axios.get('/api/inventory');
            const data = response.data;
            if (data && Array.isArray(data.users)) {
                setInventory(data.users);
            } else {
                console.error("Fetched data does not contain an array of users:", data);
            }
        } catch (error) {
            console.error("Error fetching inventory data:", error);
        }
    };

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

            {/* Show alerts for low stock only if there are low stock items */}
            {lowStock.length > 0 && (
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
                                        key={item.item_id}
                                        item_id={item.item_id}
                                        item_name={item.item_name}
                                        current_stock={item.current_stock}
                                        low_limit={item.low_limit}
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
            )}

            {/* Optional: Display a message when there are no low stock items */}
            {lowStock.length === 0 && (
                <section className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-3 relative'>
                    <div className='font-extrabold text-[15px]'>Urgently Needed in Kitchen</div>
                    <div className='text-center text-gray-500'>All items are sufficiently stocked.</div>
                </section>
            )}

            <div className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-6'>
                <div className='flex text-md gap-4'>
                    <div
                        className={`px-[10px] py-2 rounded-xl cursor-pointer ${selectedFilter === 'inventory' ? 'font-bold bg-[#FA9F1B70] transition-colors duration-300 text-[#fc9802e3]' : ''}`}
                        onClick={() => setSelectedFilter('inventory')}
                    >
                        Inventory
                    </div>
                    <div
                        className={`px-[10px] py-2 rounded-xl cursor-pointer ${selectedFilter === 'order' ? 'font-bold bg-[#FA9F1B70] transition-colors duration-300 text-[#fc9802e3]' : ''}`}
                        onClick={() => setSelectedFilter('order')}
                    >
                        Generate Order
                    </div>
                    <div
                        className={`px-[10px] py-2 rounded-xl cursor-pointer ${selectedFilter === 'kitchenOrders' ? 'font-bold bg-[#FA9F1B70] transition-colors duration-300 text-[#fc9802e3]' : ''}`}
                        onClick={() => setSelectedFilter('kitchenOrders')}
                    >
                        Kitchen Orders
                    </div>
                    <div
                        className={`px-[10px] py-2 rounded-xl cursor-pointer ${selectedFilter === 'recent' ? 'font-bold bg-[#FA9F1B70] transition-colors duration-300 text-[#fc9802e3]' : ''}`}
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
