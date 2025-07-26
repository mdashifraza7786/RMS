"use client";

import React, { useState, useEffect } from 'react';
import { FaTrash, FaFileAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { FaPenToSquare } from 'react-icons/fa6';
import { Bars } from 'react-loader-spinner';

// Define the type for kitchen orders
interface InventoryItem {
    order_id: string;
    item_name: string;
    quantity: number;
    date?: string;
    status?: string;
    time?: string;
    remarks?: string;
    unit: string;
}

interface InventoryData {
    item_id: string;
    item_name: string;
    quantity: number;
    date?: string;
    time?: string;
    unit: string;
    remarks?: string;
}

const KitchenOrdersCard: React.FC = () => {
    const [kitchenOrders, setKitchenOrders] = useState<InventoryItem[]>([]);
    const [inventoryOrder, setInventoryOrder] = useState<InventoryData[]>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [editPopupVisible, setEditPopupVisible] = useState(false);
    const [editData, setEditData] = useState<InventoryItem>({ order_id: '', item_name: '', quantity: 0, unit: '', status: '', date: '', time: '', remarks: '' });
    const [loading, setLoading] = useState(true);
    const [deletePopupVisible, setDeletePopupVisible] = useState(false);
    const [deleteItemName, setDeleteItemName] = useState("");
    const [deleteItemId, setDeleteItemId] = useState("");
    const [deleteItemBoxValue, setDeleteItemBoxValue] = useState("");

    useEffect(() => {
        fetchKitchenOrders();
    }, []);

    const fetchKitchenOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/kitchenOrder');
            const data = await response.json();

            if (data && Array.isArray(data.users)) {
                setKitchenOrders(data.users);
            } else {
                console.error("Fetched data does not contain an array of users:", data);
            }
        } catch (error) {
            console.error("Error fetching kitchen orders:", error);
        }
        finally {
            setLoading(false);
        }
    };

    const handleEditClick = (data: InventoryItem) => {
        setEditData(data);
        setEditPopupVisible(true);
    };

    const handleEditSave = async () => {
        try {
            const response = await fetch('/api/kitchenOrder/updateKitchenOrder', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editData),
            });

            if (response.ok) {
                fetchKitchenOrders();
                setEditPopupVisible(false);
            } else {
                console.error('Failed to update the kitchen order');
            }
        } catch (error) {
            console.error("Error updating kitchen order:", error);
        }
    };

    const handleCheckboxChange = (order_id: string) => {
        setSelectedItems(prevSelected =>
            prevSelected.includes(order_id)
                ? prevSelected.filter(id => id !== order_id)
                : [...prevSelected, order_id]
        );
    };

    const handleSelectAllChange = () => {
        if (selectedItems.length === kitchenOrders.length) {
            setSelectedItems([]);
        } else {
            const allIds = kitchenOrders.map(item => item.order_id);
            setSelectedItems(allIds);
        }
    };

    const handleGenerateOrder = async () => {
        setLoading(true);
        try {
            const selectedData = kitchenOrders.filter(item => selectedItems.includes(item.order_id));
    
            if (selectedData.length > 0) {
                for (const order of selectedData) {
                    const orderData = {
                        item_id: order.order_id, 
                        item_name: order.item_name,
                        quantity: order.quantity,
                        unit: order.unit,
                        date: new Date().toISOString().split('T')[0], 
                        time: new Date().toLocaleTimeString(),
                        remarks: order.remarks,
                    };
    
                    await fetch("/api/inventory/InventoryOrder", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(orderData),
                    });

                    await fetch("/api/kitchenOrder/updateKitchenOrder", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ order_id: order.order_id, status: "accepted" ,item_name: order.item_name, quantity: order.quantity, unit: order.unit}),
                    });
              
                    setSelectedItems([]); // Clear selections after order generation
                }
            }
            fetchKitchenOrders();
        } catch (e) {
            console.error("Order submission error:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = async (order_id: string) => {
        try {
            const response = await fetch('/api/kitchenOrder/updateKitchenOrder', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editData),
            });

            if (response.ok) {
                fetchKitchenOrders();
            } else {
                console.error('Failed to cancel the kitchen order');
            }
        } catch (error) {
            console.error("Error canceling kitchen order:", error);
        }
        finally {
            setDeletePopupVisible(false);
            setDeleteItemBoxValue("");
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
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
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={handleGenerateOrder}
                            disabled={selectedItems.length === 0}
                            className="bg-[#1e4569] hover:bg-[#2c5983] text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-200 shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaFileAlt size={16} />
                            <span>Generate Order</span>
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.length === kitchenOrders.length && kitchenOrders.length > 0}
                                            onChange={handleSelectAllChange}
                                            className="h-4 w-4 text-[#1e4569] border-gray-300 rounded focus:ring-[#1e4569]"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {kitchenOrders.length > 0 ? (
                                    kitchenOrders.map((item) => (
                                        <tr key={item.order_id} className="hover:bg-gray-50 transition duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.includes(item.order_id)}
                                                    onChange={() => handleCheckboxChange(item.order_id)}
                                                    className="h-4 w-4 text-[#1e4569] border-gray-300 rounded focus:ring-[#1e4569]"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.order_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.item_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.quantity} {item.unit}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(item.date)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.time}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {item.remarks ? item.remarks : <span className="text-gray-400">No remarks</span>}
                                            </td>
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
                                                            setDeletePopupVisible(true);
                                                            setDeleteItemName(item.item_name);
                                                            setDeleteItemId(item.order_id);
                                                            setEditData({ ...item, status: 'cancelled' });
                                                        }}
                                                    >
                                                        <FaTrash className="mr-1.5" size={12} />
                                                        Cancel
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center">
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
                                                <p className="text-lg font-medium">No kitchen orders found</p>
                                                <p className="mt-1 text-sm">There are currently no pending orders from the kitchen.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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
                                Edit Kitchen Order
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
                                    value={editData.item_name}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Quantity ({editData.unit})
                                </label>
                                <input
                                    type="number"
                                    value={editData.quantity}
                                    onChange={(e) => setEditData({ ...editData, quantity: parseInt(e.target.value, 10) || 0 })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1e4569] focus:border-[#1e4569] outline-none transition-all"
                                    min="1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                                <textarea
                                    value={editData.remarks || ""}
                                    onChange={(e) => setEditData({ ...editData, remarks: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1e4569] focus:border-[#1e4569] outline-none transition-all h-24 resize-none"
                                    placeholder="Add any additional notes..."
                                ></textarea>
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
                        <div className="text-center mb-6">
                            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <FaTrash className="text-red-500" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Cancel Kitchen Order</h2>
                            <p className="text-gray-600">
                                Are you sure you want to cancel the order for <span className="font-bold text-[#1e4569]">{deleteItemName}</span>? This action cannot be undone.
                            </p>
                        </div>
                        
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Type <span className="font-bold">{deleteItemName}</span> to confirm
                            </label>
                            <input
                                type="text"
                                placeholder={`Type ${deleteItemName}`}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                value={deleteItemBoxValue}
                                onChange={(e) => setDeleteItemBoxValue(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex justify-end gap-3">
                            <button 
                                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                                onClick={() => {
                                    setDeletePopupVisible(false);
                                    setDeleteItemBoxValue("");
                                    setEditData({ order_id: '', item_name: '', quantity: 0, unit: '', status: '', date: '', time: '', remarks: '' });
                                }}
                            >
                                Cancel
                            </button>
                            <button 
                                className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2.5 rounded-lg transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleCancelClick(deleteItemId)}
                                disabled={deleteItemBoxValue !== deleteItemName}
                            >
                                Confirm Cancellation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KitchenOrdersCard;
