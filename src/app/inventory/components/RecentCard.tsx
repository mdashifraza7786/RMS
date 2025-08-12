"use client";
import React, { useState, useEffect } from 'react';
import { FaTrash, FaTimes } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";
import axios from 'axios';
import { Bars } from "react-loader-spinner";

// Define the type for recent inventory order items
interface InventoryOrderItem {
    order_id: string;
    order_name: string;
    price: number;
    quantity: number;
    unit: string;
    date: string;
    total_amount: number;
}

const RecentCard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [inventory, setInventory] = useState<InventoryOrderItem[]>([]);
    const [editPopupVisible, setEditPopupVisible] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deletePopupVisible, setDeletePopupVisible] = useState(false);
    const [deleteItemName, setDeleteItemName] = useState("");
    const [deleteItemId, setDeleteItemId] = useState("");
    const [deleteItemBoxValue, setDeleteItemBoxValue] = useState("");

    const [editData, setEditData] = useState<InventoryOrderItem>({
        order_id: '',
        order_name: '',
        price: 0,
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
            editData.total_amount = editData.price * editData.quantity;
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

    const handleDelete = async (deleteItemId: string) => {
        try {
            setDeleteLoading(true);
            await axios.delete("/api/recentOrder/delete", { data: { order_id: deleteItemId } });
            fetchRecentOrders();
            setDeletePopupVisible(false);
        } catch (error) {
            console.error("Error deleting inventory item:", error);
        } finally {
            setDeleteLoading(false);
            setDeleteItemBoxValue("");
        }
    };

    useEffect(() => {
        fetchRecentOrders();
    }, []);

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount).replace('₹', '₹ ');
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div>
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <Bars height="50" width="50" color="#1e4569" ariaLabel="bars-loading" />
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {inventory && inventory.length > 0 ? (
                                    inventory.map((item) => (
                                        <tr key={item.order_id} className="hover:bg-gray-50 transition duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.order_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.order_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatCurrency(item.price)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.quantity} {item.unit}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(item.date)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(item.total_amount)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-[#1e4569] hover:bg-[#2c5983] transition"
                                                        onClick={() => handleEditClick(item)}
                                                    >
                                                        <FaPenToSquare className="mr-1.5" size={12} />
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition"
                                                        onClick={() => {
                                                            setDeleteItemName(item.order_name);
                                                            setDeleteItemId(item.order_id);
                                                            setDeletePopupVisible(true);
                                                        }}
                                                    >
                                                        <FaTrash className="mr-1.5" size={12} />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <svg 
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none" 
                                                    viewBox="0 0 24 24" 
                                                    stroke="currentColor" 
                                                    className="w-16 h-16 mb-4 text-gray-300"
                                                >
                                                    <path 
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round" 
                                                        strokeWidth="1" 
                                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                    />
                                                </svg>
                                                <p className="text-lg font-medium">No recent orders found</p>
                                                <p className="mt-1 text-sm">There are no recent inventory orders to display.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden px-4">
                        {inventory && inventory.length > 0 ? (
                            <div className="space-y-4">
                                {inventory.map((item) => (
                                    <div key={item.order_id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                        <div className="bg-gray-50 p-3 flex justify-between items-center">
                                            <div className="font-medium text-gray-800">{item.order_name}</div>
                                            <div className="text-sm font-medium text-primary">₹{formatCurrency(item.total_amount)}</div>
                                        </div>
                                        <div className="p-4 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500">Order ID</span>
                                                <span className="text-sm font-medium">{item.order_id}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500">Price</span>
                                                <span className="text-sm">₹{formatCurrency(item.price)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500">Quantity</span>
                                                <span className="text-sm">{item.quantity} {item.unit}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500">Date</span>
                                                <span className="text-sm">{formatDate(item.date)}</span>
                                            </div>
                                        </div>
                                        <div className="border-t border-gray-100 p-3 bg-gray-50 flex justify-end space-x-2">
                                            <button
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-[#1e4569] hover:bg-[#2c5983] transition"
                                                onClick={() => handleEditClick(item)}
                                            >
                                                <FaPenToSquare className="mr-1.5" size={12} />
                                                Edit
                                            </button>
                                            <button
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition"
                                                onClick={() => {
                                                    setDeleteItemName(item.order_name);
                                                    setDeleteItemId(item.order_id);
                                                    setDeletePopupVisible(true);
                                                }}
                                            >
                                                <FaTrash className="mr-1.5" size={12} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <div className="flex flex-col items-center justify-center text-gray-500">
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor" 
                                        className="w-16 h-16 mb-4 text-gray-300"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth="1" 
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                    <p className="text-lg font-medium">No recent orders found</p>
                                    <p className="mt-1 text-sm">There are no recent inventory orders to display.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Edit Popup */}
            {editPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
                    <div className="bg-white shadow-2xl rounded-xl p-6 w-[90%] max-w-[500px] relative animate-fadeIn">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-5">
                            <h2 className="text-xl font-bold text-[#1e4569] flex items-center gap-2">
                                <FaPenToSquare className="text-[#1e4569]" size={20} />
                                Edit Recent Order
                            </h2>
                            <button 
                                onClick={() => setEditPopupVisible(false)}
                                className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                                <input
                                    disabled
                                    type="text"
                                    value={editData.order_name}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        value={editData.quantity}
                                        onChange={(e) => setEditData({ ...editData, quantity: parseInt(e.target.value, 10) || 0 })}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1e4569] focus:border-[#1e4569] outline-none transition-all"
                                        min="1"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                                    <input
                                        disabled
                                        type="text"
                                        value={editData.unit}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price per {editData.unit}</label>
                                <input
                                    type="number"
                                    value={editData.price}
                                    onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) || 0 })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1e4569] focus:border-[#1e4569] outline-none transition-all"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount (Calculated)</label>
                                <input
                                    disabled
                                    type="text"
                                    value={formatCurrency(editData.price * editData.quantity)}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => setEditPopupVisible(false)}
                                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSave}
                                className="bg-[#1e4569] hover:bg-[#2c5983] text-white font-medium px-6 py-2.5 rounded-lg transition-colors duration-200 shadow-sm"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Popup */}
            {deletePopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
                    <div className="bg-white shadow-2xl rounded-xl p-8 max-w-md w-full animate-fadeIn">
                        {deleteLoading && (
                            <div className='absolute inset-0 flex justify-center items-center bg-white bg-opacity-90 rounded-xl z-10'>
                                <Bars
                                    height="60"
                                    width="60"
                                    color="#1e4569"
                                    ariaLabel="bars-loading"
                                    visible={true}
                                />
                            </div>
                        )}
                        
                        <div className="text-center mb-6">
                            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <FaTrash className="text-red-500" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Delete Order Record</h2>
                            <p className="text-gray-600">
                                Are you sure you want to delete the order for <span className="font-bold text-[#1e4569]">{deleteItemName}</span>? This action cannot be undone.
                            </p>
                        </div>
                        
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Type <span className="font-bold">delete</span> to confirm
                            </label>
                            <input
                                type="text"
                                placeholder="delete"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                value={deleteItemBoxValue}
                                onChange={(e) => setDeleteItemBoxValue(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex justify-end gap-3">
                            <button 
                                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                                onClick={() => { setDeletePopupVisible(false); setDeleteItemBoxValue(""); }}
                            >
                                Cancel
                            </button>
                            <button 
                                className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2.5 rounded-lg transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleDelete(deleteItemId)}
                                disabled={deleteItemBoxValue !== "delete"}
                            >
                                Delete Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecentCard;
