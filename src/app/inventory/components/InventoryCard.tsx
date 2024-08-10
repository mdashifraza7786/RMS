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
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [editData, setEditData] = useState<any>(null);
    const [editPopupVisible, setEditPopupVisible] = useState(false);

    // Filtered inventory based on search query
    const filteredInventory = inventory.filter(item =>
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) || item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEditClick = (data: any) => {
        setEditData(data);
        setEditPopupVisible(true);
    };

    const handleSave = () => {
        if (editData) {
            setInventory(inventory.map(item => item.id === editData.id ? editData : item));
            setEditPopupVisible(false);
        }
    };

    const handleSaveOrder = () => {
        if (selectedItem) {
            // Update inventory with new quantity and remarks
            setInventory(inventory.map(item => item.id === selectedItem.id ? { ...item, quantity: selectedItem.quantity, remarks: selectedItem.remarks } : item));
        }
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
                                    <button className="bg-primary text-white px-4 py-2 rounded text-[12px] flex items-center gap-10" onClick={() => handleEditClick(item)}>
                                        <div>Edit</div> <FaPenToSquare />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>



            {/* Edit Popup */}
            {editPopupVisible && editData && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 font-raleway">
                    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-300 max-w-md w-full">
                        <h2 className="text-2xl font-semibold mb-6 text-primary">Edit Item</h2>
                        <div className="mb-4">
                            <label htmlFor="id" className="block font-medium text-gray-800">ID:</label>
                            <input
                                type="text"
                                id="id"
                                value={editData.id}
                                className="border border-gray-300 rounded-md px-3 py-2 font-semibold w-full"
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="name" className="block font-medium text-gray-800">Name:</label>
                            <input
                                type="text"
                                id="name"
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                className="border border-gray-300 rounded-md px-3 py-2 font-semibold w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="quantity" className="block font-medium text-gray-800">Quantity:</label>
                            <input
                                type="number"
                                id="quantity"
                                value={editData.quantity}
                                onChange={(e) => setEditData({ ...editData, quantity: parseInt(e.target.value, 10) })}
                                className="border border-gray-300 rounded-md px-3 py-2 font-semibold w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="unit" className="block font-medium text-gray-800">Unit:</label>
                            <input
                                type="text"
                                id="unit"
                                value={editData.unit}
                                onChange={(e) => setEditData({ ...editData, unit: e.target.value })}
                                className="border border-gray-300 rounded-md px-3 py-2 font-semibold w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="lowlimit" className="block font-medium text-gray-800">Low Limit:</label>
                            <input
                                type="number"
                                id="lowlimit"
                                value={editData.lowlimit}
                                onChange={(e) => setEditData({ ...editData, lowlimit: parseInt(e.target.value, 10) })}
                                className="border border-gray-300 rounded-md px-3 py-2 font-semibold w-full"
                            />
                        </div>
                        
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditPopupVisible(false)}
                                className="bg-red-600  text-white font-bold rounded-md px-4 py-2 hover:bg-red-300 transition-colors"
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-supporting2 text-white font-bold rounded-md px-4 py-2 hover:bg-[#a5bd69] transition-colors"
                            >
                                SAVE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryCard;
