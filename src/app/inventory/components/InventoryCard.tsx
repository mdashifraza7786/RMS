"use client";
import React, { useState, useEffect } from 'react';
import { FaPenToSquare } from "react-icons/fa6";
import axios from 'axios';

// Define the type for inventory items
interface InventoryItem {
    item_id: string;
    item_name: string;
    current_stock: number;
    low_limit: number;
    unit: string;
}

const InventoryCard: React.FC = () => {
    const [inventory, setInventory] = useState<InventoryItem[]>([]); // Use the defined type
    const [searchQuery, setSearchQuery] = useState('');
    const [editData, setEditData] = useState<InventoryItem | null>(null); // Use InventoryItem type
    const [editPopupVisible, setEditPopupVisible] = useState(false);
    const [editLoading, setEditLoading] = useState(false);

    useEffect(() => {
        document.title = "Inventory";
        fetchInventory();
    }, []);

    // Filtered inventory based on search query
    const filteredInventory = inventory.filter(item =>
        item.item_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

    const handleEditClick = (data: InventoryItem) => {
        setEditData(data);
        setEditPopupVisible(true);
    };

    const editInventory = async (data: InventoryItem) => {
        try {
            setEditLoading(true);
            await axios.put('/api/inventory/updateInventory', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            fetchInventory(); // Refresh data
            setEditPopupVisible(false); // Close the popup after saving
        } catch (error) {
            console.error("Error updating inventory item:", error);
        } finally {
            setEditLoading(false);
        }
    };

    return (
        <div className='flex flex-col gap-4'>
            {/* Search Input */}
            <input
                type='search'
                placeholder='Search Name, ID...'
                className='border w-1/4 border-[#807c7c] rounded-xl px-4 py-1'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Inventory Table */}
            <table className="w-full">
                <thead>
                    <tr className='bg-primary text-white'>
                        <th className="px-4 py-2 text-left w-[200px]">ID</th>
                        <th className="px-4 py-2 text-left">Item</th>
                        <th className="px-4 py-2 text-left">Current Quantity</th>
                        <th className="px-4 py-2 text-left">Low Limit</th>
                        <th className="px-4 py-2 text-left w-[100px]">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredInventory.map((item, index) => (
                        <tr key={index} className='text-[14px] font-medium font-montserrat'>
                            <td className="border px-4 py-2 transition-colors duration-300">{item.item_id}</td>
                            <td className="border px-4 py-2 transition-colors duration-300">{item.item_name}</td>
                            <td className="border px-4 py-2 transition-colors duration-300">{item.current_stock} {item.unit}</td>
                            <td className="border px-4 py-2 transition-colors duration-300">{item.low_limit} {item.unit}</td>
                            <td className="border px-4 py-4 transition-colors duration-300">
                                <div className='flex gap-4 justify-center'>
                                    <button
                                        className="bg-primary text-white px-4 py-2 rounded text-[12px] flex items-center gap-10"
                                        onClick={() => handleEditClick(item)}
                                    >
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
                            <label htmlFor="item_id" className="block font-medium text-gray-800">ID:</label>
                            <input
                                type="text"
                                id="item_id"
                                value={editData.item_id}
                                className="border border-gray-300 rounded-md px-3 py-2 font-semibold w-full"
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="item_name" className="block font-medium text-gray-800">Name:</label>
                            <input
                                type="text"
                                id="item_name"
                                value={editData.item_name}
                                onChange={(e) => setEditData({ ...editData, item_name: e.target.value })}
                                className="border border-gray-300 rounded-md px-3 py-2 font-semibold w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="current_stock" className="block font-medium text-gray-800">Quantity:</label>
                            <input
                                type="number"
                                id="current_stock"
                                value={editData.current_stock}
                                onChange={(e) => setEditData({ ...editData, current_stock: parseInt(e.target.value, 10) })}
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
                            <label htmlFor="low_limit" className="block font-medium text-gray-800">Low Limit:</label>
                            <input
                                type="number"
                                id="low_limit"
                                value={editData.low_limit}
                                onChange={(e) => setEditData({ ...editData, low_limit: parseInt(e.target.value, 10) })}
                                className="border border-gray-300 rounded-md px-3 py-2 font-semibold w-full"
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditPopupVisible(false)}
                                className="bg-red-600 text-white font-bold rounded-md px-4 py-2 hover:bg-red-700 transition-colors"
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={() => editInventory(editData)}
                                className="bg-supporting2 text-white font-bold rounded-md px-4 py-2 hover:bg-[#a5bd69] transition-colors"
                                disabled={editLoading}
                            >
                                {editLoading ? 'SAVING...' : 'SAVE'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryCard;
