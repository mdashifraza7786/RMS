"use client"
import React, { useState } from 'react';

const sampleData = [
    { name: 'Apples', quantity: 10, unit: 'kg', amount: 5, id: '#CFG758', price: '₹10', bill: '₹100', date: '10/10/2024' },
    { name: 'Bananas form banaras, mangoe', quantity: 20, unit: 'kg', amount: 10, id: '#CFG478', price: '₹10', bill: '₹100', date: '10/10/2024' },
    { name: 'Oranges', quantity: 15, unit: 'kg', amount: 5, id: '#CFG788', price: '₹10', bill: '₹100', date: '10/10/2024' },
    { name: 'Mangoes', quantity: 25, unit: 'kg', amount: 10, id: '#CFG786', price: '₹10', bill: '₹100', date: '10/10/2024' },
    { name: 'Grapes', quantity: 30, unit: 'kg', amount: 15, id: '#CFG787', price: '₹10', bill: '₹100', date: '10/10/2024' },
]

const RecentCard: React.FC = () => {
    const [inventory, setInventory] = useState(sampleData);

    return (
        <div className='flex flex-col'>
            <table>
                <thead>
                    <tr className='bg-primary text-white'>
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Item Name</th>
                        <th className="px-4 py-2 text-left">Price</th>
                        <th className="px-4 py-2 text-left">Order Quantity</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map((item: any, index) => (
                        <tr key={index} className='text-[14px] font-medium font-montserrat'>
                            <td className="border px-6 py-4 transition-colors duration-300">{item.id}</td>
                            <td className="border px-6 py-4 transition-colors duration-300">{item.name}</td>
                            <td className="border px-6 py-4 transition-colors duration-300">{item.price}</td>
                            <td className="border px-6 py-4 transition-colors duration-300">{item.amount} {item.unit}</td>
                            <td className="border px-6 py-4 transition-colors duration-300">{item.date}</td>
                            <td className="border px-6 py-4 transition-colors duration-300">{item.bill}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RecentCard;