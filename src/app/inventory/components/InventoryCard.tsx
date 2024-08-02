"use client";
import React, { useState } from 'react';
import { MdBorderColor } from "react-icons/md";
import { FaPenToSquare } from "react-icons/fa6";

const sampleData = [
    { name: 'Apples', quantity: 10, unit: 'kg', lowlimit: 5, id: '#CFG758', price: '₹10' },
    { name: 'Bananas form banaras, mangoe', quantity: 20, unit: 'kg', lowlimit: 10, id: '#CFG478', price: '₹10' },
    { name: 'Oranges', quantity: 15, unit: 'kg', lowlimit: 5, id: '#CFG788', price: '₹10' },
    { name: 'Mangoes', quantity: 25, unit: 'kg', lowlimit: 10, id: '#CFG786', price: '₹10' },
    { name: 'Grapes', quantity: 30, unit: 'kg', lowlimit: 15, id: '#CFG787', price: '₹10' },
];

const InventoryCard: React.FC = () => {
    const [inventory, setInventory] = useState(sampleData);
    const [searchQuery, setSearchQuery] = useState('');

    // Filtered inventory based on search query
    const filteredInventory = inventory.filter(item =>
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) || item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEditClick = (data: any) => {
        // Your edit functionality here
    };

    return (
        <div className='flex flex-col gap-4'>
            {/* search */}
            <input
                type='search'
                placeholder='Search Name, ID...'
                className='border w-1/4 border-[#807c7c] rounded-xl px-4 py-1'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* table */}
            <table className="w-full">
                <thead>
                    <tr className='bg-primary text-white'>
                        <th className="px-4 py-2 text-left w-[200px]">ID</th>
                        <th className="px-4 py-2 text-left">Item</th>
                        <th className="px-4 py-2 text-left">Price</th>
                        <th className="px-4 py-2 text-left">Current Quantity</th>
                        <th className="px-4 py-2 text-left">Low Limit</th>
                        <th className="px-4 py-2 text-left w-[100px]">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredInventory.map((item, index) => (
                        <tr key={index} className='text-[14px] font-medium font-montserrat'>
                            <td className="border px-4 py-2 transition-colors duration-300">{item.id}</td>
                            <td className="border px-4 py-2 transition-colors duration-300">{item.name}</td>
                            <td className="border px-4 py-2 transition-colors duration-300">{item.price}</td>
                            <td className="border px-4 py-2 transition-colors duration-300">{item.quantity} {item.unit}</td>
                            <td className="border px-4 py-2 transition-colors duration-300">{item.lowlimit} {item.unit}</td>
                            <td className="border px-4 py-4 transition-colors duration-300">
                                <div className='flex gap-4 justify-center'>
                                    <button className="bg-primary text-white px-4 py-2 rounded text-[12px] flex items-center gap-10">
                                        <div>Order</div> <MdBorderColor />
                                    </button>
                                    <button className="bg-primary text-white px-4 py-2 rounded text-[12px] flex items-center gap-10">
                                        <div>Edit</div> <FaPenToSquare />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryCard;
