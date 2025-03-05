"use client";
import React, { useState, useEffect } from 'react';
import { FaPenToSquare } from "react-icons/fa6";
import axios from 'axios';
import { Bars } from 'react-loader-spinner';

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
    const [addInventoryPopupVisible, setAddInventoryPopupVisible] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [loading, setLoading] = useState(true);

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
            setLoading(true);
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
        finally {
            setLoading(false);
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
            {loading ? (
                <div className='flex justify-center items-center py-4'>
                    <Bars
                        height="50"
                        width="50"
                        color="#25476A"
                        ariaLabel="bars-loading"
                        visible={true}
                    />
                </div>
            ) : (
                <>
                    {/* Search Input */}
                    <section className='flex gap-4 items-center justify-between'>
                        <input
                            type='search'
                            placeholder='Search Name, ID...'
                            className='border w-1/4 border-[#807c7c] rounded-xl px-4 py-1'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button onClick={() => setAddInventoryPopupVisible(true)}
                            className='bg-supporting2 w-1/5 text-white font-bold rounded-md px-4 py-2 flex items-center justify-center gap-2 hover:bg-supporting2-dark transition-colors mt-4'>
                            Add New Item
                        </button>
                    </section>

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
                                    <td className="border px-4 py-2">{item.item_id}</td>
                                    <td className="border px-4 py-2">{item.item_name}</td>
                                    <td className="border px-4 py-2">{item.current_stock} {item.unit}</td>
                                    <td className="border px-4 py-2">{item.low_limit} {item.unit}</td>
                                    <td className="border px-4 py-4">
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
                </>
            )}

            {editPopupVisible && (
                <div></div>
            )}

            {addInventoryPopupVisible && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
              <div className="bg-white p-8 rounded-2xl shadow-lg w-96 max-w-full">
                {/* Modal Header */}
                <h2 className="text-xl font-bold text-primary mb-4 text-center">Add New Item</h2>
            
                {/* Edit Form */}
                <div className="flex flex-col gap-4">
                  {/* Item Name */}
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Item Name</label>
                    <input 
                      type="text" 
                      className="border border-gray-300 w-full rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none" 
                    />
                  </div>
            
                  {/* Current Quantity */}
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Current Quantity</label>
                    <input 
                      type="number" 
                      className="border border-gray-300 w-full rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none" 
                    />
                  </div>
            
                  {/* Low Limit */}
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Low Limit</label>
                    <input 
                      type="number" 
                      className="border border-gray-300 w-full rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none" 
                    />
                  </div>
            
                  {/* Unit Dropdown */}
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Unit</label>
                    <select 
                      className="border border-gray-300 w-full rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    >
                      {["kg", "g", "ml", "l", "pcs", "pack", "box", "bottle", "jar", "can", "bag", "sachet", "roll", "bundle", "set", "pair", "dozen", "piece"].map((unit) => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>
            
                {/* Buttons */}
                <div className="flex justify-end mt-6 space-x-3">
                  <button 
                    onClick={() => setAddInventoryPopupVisible(false)}
                    className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    Add Now
                  </button>
                </div>
              </div>
            </div>
            
            )}

        </div>
    );
};

export default InventoryCard;
