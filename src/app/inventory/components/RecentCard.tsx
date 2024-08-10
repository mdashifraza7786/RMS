"use client";
import React, { useState } from 'react';
import { FaPenToSquare } from "react-icons/fa6";

const sampleData = [
    { name: 'Apples', quantity: 10, unit: 'kg', amount: 5, id: '#CFG758', price: '₹10', bill: '₹100', date: '10/10/2024' },
    { name: 'Bananas form banaras, mangoe', quantity: 20, unit: 'kg', amount: 10, id: '#CFG478', price: '₹10', bill: '₹100', date: '10/10/2024' },
    { name: 'Oranges', quantity: 15, unit: 'kg', amount: 5, id: '#CFG788', price: '₹10', bill: '₹100', date: '10/10/2024' },
    { name: 'Mangoes', quantity: 25, unit: 'kg', amount: 10, id: '#CFG786', price: '₹10', bill: '₹100', date: '10/10/2024' },
    { name: 'Grapes', quantity: 30, unit: 'kg', amount: 15, id: '#CFG787', price: '₹10', bill: '₹100', date: '10/10/2024' },
];

const RecentCard: React.FC = () => {
    const [inventory, setInventory] = useState(sampleData);
    const [editPopupVisible, setEditPopupVisible] = useState(false);
    const [editData, setEditData] = useState({ name: '', quantity: 0, unit: '', amount: 0, id: '', price: '', bill: '', date: '' });

    const handleEditClick = (data: any) => {
        setEditData(data);
        setEditPopupVisible(true);
    };

    const handleEditSave = () => {
        setInventory(prevInventory =>
            prevInventory.map(item =>
                item.id === editData.id
                    ? { ...editData, amount: editData.quantity }  // Update the item with new data
                    : item
            )
        );
        setEditPopupVisible(false);
    };

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
                        <th className="px-4 py-2 text-left">Action</th>
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
                            <td className="border px-6 py-4 transition-colors duration-300">
                                <button
                                    onClick={() => handleEditClick(item)}
                                    className="bg-primary text-white px-4 py-2 flex gap-6 items-center justify-center rounded text-[12px] hover:bg-primary-dark transition-colors"
                                >
                                  <div>Edit</div> <FaPenToSquare />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Edit Popup */}
            {editPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg w-96 max-w-full">
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block font-medium text-gray-800">Name:</label>
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    className="border border-gray-300 rounded-md px-3 py-2 font-semibold w-full"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-800">Quantity:</label>
                                <input
                                    type="number"
                                    value={editData.quantity}
                                    onChange={(e) => setEditData({ ...editData, quantity: parseInt(e.target.value, 10) })}
                                    className="border border-gray-300 rounded-md px-3 py-2 font-semibold w-full"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-800">Unit:</label>
                                <input
                                    type="text"
                                    value={editData.unit}
                                    onChange={(e) => setEditData({ ...editData, unit: e.target.value })}
                                    className="border border-gray-300 rounded-md px-3 py-2 font-semibold w-full"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-800">Price:</label>
                                <input
                                    type="text"
                                    value={editData.price}
                                    onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                                    className="border border-gray-300 rounded-md px-3 py-2 font-semibold w-full"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-800">Bill:</label>
                                <input
                                    type="text"
                                    value={editData.bill}
                                    onChange={(e) => setEditData({ ...editData, bill: e.target.value })}
                                    className="border border-gray-300 rounded-md px-3 py-2 font-semibold w-full"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-800">Date:</label>
                                <input
                                    type="text"
                                    value={editData.date}
                                    onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                                    className="border border-gray-300 rounded-md px-3 py-2 font-semibold w-full"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setEditPopupVisible(false)}
                                className="bg-bgred text-white hover:bg-red-600 rounded-md px-4 py-2 mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSave}
                                className="bg-supporting2 text-white hover:bg-[#8bbf3b] rounded-md px-4 py-2"
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

export default RecentCard;
