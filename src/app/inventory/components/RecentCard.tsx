"use client";
import React, { useState, useEffect } from 'react';
import { FaPenToSquare } from "react-icons/fa6";
import axios from 'axios';
import { Bars } from "react-loader-spinner"; // Ensure this is installed

// Define the type for recent inventory order items
interface InventoryOrderItem {
    order_id: string;
    order_name: string;
    price: number;  // Changed from string to number
    quantity: number;
    unit: string;
    date: string;
    total_amount: number;
}

const RecentCard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [inventory, setInventory] = useState<InventoryOrderItem[]>([]);
    const [editPopupVisible, setEditPopupVisible] = useState(false);
    const [editData, setEditData] = useState<InventoryOrderItem>({
        order_id: '',
        order_name: '',
        price: 0,  // Changed from string to number
        quantity: 0,
        unit: '',
        date: '',
        total_amount: 0,
    });

    const handleEditClick = (data: InventoryOrderItem) => {
        setEditData(data);
        setEditPopupVisible(true);
    };

    const handleEditSave = async () => {
        try {
            const response = await axios.put('/api/recentOrder/updateOrder', editData);
            if (response.status === 200) {
                fetchRecentOrders();
                setEditPopupVisible(false);
            } else {
                console.error('Failed to update the recent order:', response.data.message);
            }
        } catch (error) {
            console.error("Error updating recent order:", error);
        }
    };

    const fetchRecentOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/recentOrder');
            const data = response.data;
            if (data && Array.isArray(data.users)) {
                setInventory(data.users);
            } else {
                console.error("Fetched data does not contain an array of users:", data);
            }
        } catch (error) {
            console.error("Error fetching inventory data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecentOrders();
    }, []);

    return (
        <div className='flex flex-col'>
            <div className='flex flex-col gap-5'>
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
                                {inventory?.map((item, index) => (
                                    <tr key={index} className='text-[14px] font-medium font-montserrat'>
                                        <td className="border px-6 py-4">{item.order_id}</td>
                                        <td className="border px-6 py-4">{item.order_name}</td>
                                        <td className="border px-6 py-4">{item.price}</td>
                                        <td className="border px-6 py-4">{item.quantity} {item.unit}</td>
                                        <td className="border px-6 py-4">{item.date}</td>
                                        <td className="border px-6 py-4">{item.total_amount}</td>
                                        <td className="border px-6 py-4">
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
                                                value={editData.order_name}
                                                onChange={(e) => setEditData({ ...editData, order_name: e.target.value })}
                                                className="border border-gray-300 rounded-md px-3 py-2 font-semibold w-full"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-medium text-gray-800">Quantity:</label>
                                            <input
                                                type="number"
                                                value={editData.quantity}
                                                onChange={(e) => setEditData({ ...editData, quantity: parseInt(e.target.value, 10) || 0 })}
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
                                                type="number"
                                                value={editData.price}
                                                onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) || 0 })}
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
                                            className="bg-red-500 text-white hover:bg-red-600 rounded-md px-4 py-2 mr-2"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleEditSave}
                                            className="bg-green-500 text-white hover:bg-green-600 rounded-md px-4 py-2"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default RecentCard;
