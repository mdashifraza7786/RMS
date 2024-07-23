"use client"
import React, { useState } from 'react';
import { FaPenToSquare } from "react-icons/fa6";

const sampleData = [
    { name: 'Apples', quantity: 10, unit: 'kg', amount: 5 ,id:'#CFG758',price: '₹10'},
    { name: 'Bananas form banaras, mangoe', quantity: 20, unit: 'kg', amount: 10,id:'#CFG478',price: '₹10' },
    { name: 'Oranges', quantity: 15, unit: 'kg', amount: 5,id:'#CFG788',price: '₹10' },
    { name: 'Mangoes', quantity: 25, unit: 'kg', amount: 10,id:'#CFG786',price: '₹10' },
    { name: 'Grapes', quantity: 30, unit: 'kg', amount: 15 ,id:'#CFG787',price: '₹10'},
]

const KitchenOrdersCard: React.FC = () => {
    const [inventory, setInventory] = useState(sampleData);

    return (
        <div className='flex flex-col'>
            <table>
                <thead>
                    <tr className='bg-primary text-white'>
                        <th className="px-4 py-2 text-left w-[200px]">ID</th>
                        <th className="px-4 py-2 text-left">Item</th>
                        <th className="px-4 py-2 text-left">Price</th>
                        <th className="px-4 py-2 text-left">Current Quantity</th>
                        <th className="px-4 py-2 text-left">Order Quantity</th>
                        <th className="px-4 py-2 text-left w-[100px]">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map((item: any, index) => (
                        <tr key={index} className='text-[14px] font-medium font-montserrat'>
                            <td className="border px-4 py-2 transition-colors duration-300">{item.id}</td>
                            <td className="border px-4 py-2 transition-colors duration-300">{item.name}</td>
                            <td className="border px-4 py-2 transition-colors duration-300">{item.price}</td>
                            <td className="border px-4 py-2 transition-colors duration-300">{item.quantity} {item.unit}</td>
                            <td className="border px-4 py-2 transition-colors duration-300">{item.amount} {item.unit}</td>
                            <td className="border px-4 py-4 transition-colors duration-300">
                                <div className='flex gap-4 justify-center'>
                                    {/* <button  className="bg-primary text-white px-4 py-2 rounded text-[12px] flex items-center gap-10"><div>View</div> <FaEye /></button> */}
                                    <button className="bg-primary text-white px-4 py-2 rounded text-[12px] flex items-center gap-10"><div>Edit</div> <FaPenToSquare /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default KitchenOrdersCard;