"use client";
import { Quando, Quantico } from 'next/font/google';
import React, { useState, useEffect } from 'react';
import LowStock from '@/app/inventory/components/LowStock';
import InventoryCard from '@/app/inventory/components/InventoryCard';
import KitchenOrdersCard from '@/app/inventory/components/KitchenOrdersCard';
import OrderCard from '@/app/inventory/components/OrderCard';
import RecentCard from '@/app/inventory/components/RecentCard';



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
]

const Page: React.FC = () => {
    const [inventory, setInventory] = useState(sampleData);
    const [lowStock, setLowStock] = useState([{ name: '', lowlimit: 0, quantity: 0, unit: '' }]);
    const [selectedFilter, setSelectedFilter] = useState('inventory');

    useEffect(() => {
        const checkLowStock = () => {
            let array = inventory.filter(item => item.quantity <= item.lowlimit);
            setLowStock(array);
        };

        checkLowStock();
    }, [inventory]);

    return (
        <div className='bg-[#e6e6e6] py-[5vh] px-[8vw] font-raleway flex flex-col gap-[6vh]'>
            <div className='font-semibold text-[18px]'>Inventory Details</div>

            {/*Show alerts for low stock.  */}

            <div className="bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-3">
                <div className='font-extrabold text-[15px]'>Urgently Needed in kitchen</div>
                <div className='flex gap-4'>
                    {lowStock.map(item =>
                        <LowStock key={item.name} name={item.name} quantity={item.quantity} lowlimit={item.lowlimit} unit={item.unit} />
                    )}
                </div>
            </div>


            <div className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-6'>
                {/* Display current inventory levels ,List of all inventory items with details like quantity, last ordered date, and supplier.
Filters and search functionality. */}
                {/* navigate buttons */}
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

                {/* List recent orders and inventory updates. */}
                {/* Form to add new inventory orders.
Input fields for item name, quantity, supplier, etc.  */}
                {/* Display orders placed by chefs.
Options to approve or deny orders.
Detailed view of each order. */}
            </div>

        </div>
    )
}

export default Page