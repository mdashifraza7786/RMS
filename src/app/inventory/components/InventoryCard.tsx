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

        </div>
    );
};

export default InventoryCard;
