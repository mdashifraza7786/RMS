"use client";

import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { FaPenToSquare } from "react-icons/fa6";
import { MdBorderColor } from "react-icons/md";
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

const KitchenOrdersCard: React.FC = () => {
    const [kitchenOrders, setKitchenOrders] = useState<InventoryItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [orderPopupVisible, setOrderPopupVisible] = useState(false);
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
                console.log("Fetched kitchen orders:", data);
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

    const handleGenerateOrder = () => {
        setOrderPopupVisible(true);
    };

    const selectedData = kitchenOrders.filter(item => selectedItems.includes(item.order_id));

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

    return (
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
                    <div className='flex justify-end'>
                        <button
                            onClick={handleGenerateOrder}
                            disabled={selectedItems.length === 0}
                            className={`bg-supporting2 hover:bg-[#badb69] w-1/5 text-white font-bold rounded-md px-4 py-2 flex items-center justify-center gap-2 hover:bg-supporting2-dark transition-colors mt-4 ${selectedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <MdBorderColor className="text-lg" />
                            <span>Generate Order</span>
                        </button>
                    </div>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className='bg-primary text-white'>
                                <th className="px-4 py-2 text-left w-[50px]">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.length === kitchenOrders.length}
                                        onChange={handleSelectAllChange}
                                        className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-opacity-50"
                                    />
                                </th>
                                <th className="px-4 py-2 text-left w-[200px]">Order ID</th>
                                <th className="px-4 py-2 text-left">Item</th>
                                <th className="px-4 py-2 text-left">Order Quantity</th>
                                {/* <th className="px-4 py-2 text-left">Order Status</th> */}
                                <th className="px-4 py-2 text-left">Order Date</th>
                                <th className="px-4 py-2 text-left">Order Time</th>
                                <th className="px-4 py-2 text-left">Remarks</th>
                                <th className="px-4 py-2 text-left w-[100px]">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {kitchenOrders.map((item, index) => (
                                <tr key={index} className='text-[14px] font-medium font-montserrat'>
                                    <td className="border px-4 py-2 transition-colors duration-300">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(item.order_id)}
                                            onChange={() => handleCheckboxChange(item.order_id)}
                                            className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-opacity-50"
                                        />
                                    </td>
                                    <td className="border px-4 py-2 transition-colors duration-300">{item.order_id}</td>
                                    <td className="border px-4 py-2 transition-colors duration-300">{item.item_name}</td>
                                    <td className="border px-4 py-2 transition-colors duration-300">{item.quantity} {item.unit}</td>
                                    {/* <td className="border px-4 py-2 transition-colors duration-300">{item.status}</td> */}
                                    <td className="border px-4 py-2 transition-colors duration-300">
                                        {item.date ? new Date(item.date).toLocaleDateString() : "N/A"}
                                    </td>

                                    <td className="border px-4 py-2 transition-colors duration-300">{item.time}</td>
                                    <td className="border px-4 py-2 transition-colors duration-300">{item.remarks}</td>
                                    <td className="border px-4 py-4 transition-colors duration-300">
                                        <div className='flex gap-4 justify-center'>
                                            <button className="bg-primary hover:bg-[#30557b] text-white px-4 py-2 rounded text-[12px] flex items-center gap-10"
                                                onClick={() => handleEditClick(item)}
                                            >
                                                <div>Edit</div> <FaPenToSquare />
                                            </button>

                                            <button className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded text-[12px] flex items-center gap-8"
                                                onClick={() => {
                                                    setDeletePopupVisible(true); setDeleteItemName(item.item_name); setDeleteItemId(item.order_id);
                                                    setEditData({ ...item, status: 'cancelled' });
                                                }}
                                            >
                                                <>Cancel <FaTrash /></>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {/* Order Popup */}
            {orderPopupVisible && selectedData.length > 0 && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg w-96 max-w-full">
                        <h3 className="text-xl font-semibold mb-4 text-primary">Selected Orders</h3>
                        <ul>
                            {selectedData.map(item => (
                                <li key={item.order_id} className="mb-2 border-b pb-2">
                                    <div><strong>Item:</strong> {item.item_name}</div>
                                    <div><strong>Quantity:</strong> {item.quantity} {item.unit}</div>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-end mt-4 gap-2">
                            <button
                                onClick={() => setOrderPopupVisible(false)}
                                className="bg-bgred text-white hover:bg-red-600 cursor-pointer rounded-md px-4 py-2"
                            >
                                CLOSE
                            </button>
                            <button
                                onClick={() => setOrderPopupVisible(false)}
                                className="bg-supporting2 text-white hover:bg-[#8bbf3b] cursor-pointer rounded-md px-4 py-2"
                            >
                                ORDER
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Popup */}
            {editPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg w-96 max-w-full">

                        <h1 className="text-xl font-semibold mb-4 text-primary">Edit Order</h1>
                        {/* Edit Form */}
                        <div className="flex flex-col gap-4">

                            <div>
                                <label className="block font-medium text-gray-800">Item Name:</label>
                                <input
                                    disabled
                                    type="text"
                                    value={editData.item_name}
                                    onChange={(e) => setEditData({ ...editData, item_name: e.target.value })}
                                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                                />
                            </div>

                            <div>
                                <label className="block font-medium text-gray-800">Quantity (in {editData.unit}):</label>
                                <input
                                    type="number"
                                    value={editData.quantity}
                                    onChange={(e) => setEditData({ ...editData, quantity: parseInt(e.target.value, 10) })}
                                    className="border border-gray-300 rounded-md px-3 py-2 font-semibold w-full"
                                />
                            </div>

                            <div>
                                <label className="block font-medium text-gray-800">Remarks:</label>
                                <textarea
                                    value={editData.remarks}
                                    onChange={(e) => setEditData({ ...editData, remarks: e.target.value })}
                                    className="border border-gray-300 rounded-md px-3 py-2 w-full h-16 resize-none"
                                ></textarea>
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

            {/* Delete Confirmation Popup */}
            {deletePopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-96 max-w-full">
                        <h2 className="text-xl font-bold text-red-600 text-center mb-3">Delete Item</h2>
                        <p className="text-gray-700 text-center mb-4">
                            Are you sure you want to delete this item? Type the item name ({deleteItemName}) to confirm.
                        </p>

                        <input
                            required
                            type="text"
                            placeholder="Type the item name"
                            className="border border-gray-300 w-full rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-100 focus:outline-none"
                            value={deleteItemBoxValue}
                            onChange={(e) => setDeleteItemBoxValue(e.target.value)}
                        />

                        <div className="flex justify-end space-x-3 mt-4">
                            <button
                                onClick={() => {
                                    setDeletePopupVisible(false); setDeleteItemBoxValue("");
                                    setEditData({ order_id: '', item_name: '', quantity: 0, unit: '', status: '', date: '', time: '', remarks: '' });

                                }}
                                className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400 transition-all"
                            >
                                Cancel
                            </button>
                            {deleteItemName === deleteItemBoxValue ? (

                                <button
                                    onClick={() => handleCancelClick(deleteItemId)}
                                    className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-all"
                                >
                                    Delete
                                </button>
                            ) : (
                                <button
                                    disabled
                                    className="bg-red-300 text-white px-5 py-2 rounded-lg hover:bg-red-400 transition-all"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

};

export default KitchenOrdersCard;
