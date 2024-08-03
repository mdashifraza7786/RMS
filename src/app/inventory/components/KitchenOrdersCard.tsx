"use client"
import React, { useState } from 'react';
import { FaPenToSquare } from "react-icons/fa6";
import { MdBorderColor } from "react-icons/md";

const sampleData = [
    { name: 'Apples', quantity: 10, unit: 'kg', amount: 5 ,id:'#CFG758',price: '₹10'},
    { name: 'Bananas form banaras, mangoe', quantity: 20, unit: 'kg', amount: 10,id:'#CFG478',price: '₹10' },
    { name: 'Oranges', quantity: 15, unit: 'kg', amount: 5,id:'#CFG788',price: '₹10' },
    { name: 'Mangoes', quantity: 25, unit: 'kg', amount: 10,id:'#CFG786',price: '₹10' },
    { name: 'Grapes', quantity: 30, unit: 'kg', amount: 15 ,id:'#CFG787',price: '₹10'},
]

const KitchenOrdersCard: React.FC = () => {
    const [inventory, setInventory] = useState(sampleData);
    const [selectedItem, setSelectedItem] = useState({ name: '', quantity: 0, unit: '', lowlimit: 0, id: '', price: '' });
    const [editData, setEditData] = useState({ name: '', quantity: 0, unit: '', lowlimit: 0, id: '', price: '' });
    const [orderPopupVisible, setOrderPopupVisible] = useState(false);
    const [editPopupVisible, setEditPopupVisible] = useState(false);


    const handleEditClick = (data: any) => {
        setEditData(data);
        setEditPopupVisible(true);
    };

    const handleEyeClick = (data: any) => {
        setSelectedItem(data);
        setOrderPopupVisible(true); // Show details popup
    };

    return (
        <div className='flex flex-col'>
            <table>
                <thead>
                    <tr className='bg-primary text-white'>
                        <th className="px-4 py-2 text-left w-[200px]">ID</th>
                        <th className="px-4 py-2 text-left">Item</th>
                        <th className="px-4 py-2 text-left">Price</th>
                        {/* <th className="px-4 py-2 text-left">Current Quantity</th> */}
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
                            {/* <td className="border px-4 py-2 transition-colors duration-300">{item.quantity} {item.unit}</td> */}
                            <td className="border px-4 py-2 transition-colors duration-300">{item.amount} {item.unit}</td>
                            <td className="border px-4 py-4 transition-colors duration-300">
                                <div className='flex gap-4 justify-center'>
                                <button  className="bg-primary text-white px-4 py-2 rounded text-[12px] flex items-center gap-10" onClick={() => handleEyeClick(item)}><div>Order</div> <MdBorderColor /></button>
                                    <button className="bg-primary text-white px-4 py-2 rounded text-[12px] flex items-center gap-10" onClick={() => handleEditClick(item)}><div>Edit</div> <FaPenToSquare /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Order Popup */}
            {orderPopupVisible && selectedItem && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg w-96">
                        hi
                        <div className="flex justify-end">
                            <button
                                onClick={() => setOrderPopupVisible(false)}
                                className="bg-blue-500 text-white rounded-md px-4 py-2"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Popup */}
            {editPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg">
                        
                        <div className="flex justify-end">
                            <button
                                onClick={() => setEditPopupVisible(false)}
                                className="bg-gray-200 text-gray-700 rounded-md px-4 py-2 mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                // onClick={handleEdit}
                                className="bg-blue-500 text-white rounded-md px-4 py-2"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
};

export default KitchenOrdersCard;