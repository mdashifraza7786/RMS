"use client";

import React, { useState } from "react";
import axios from "axios";
import { Bars } from 'react-loader-spinner';
import { FaExclamationTriangle, FaBoxOpen, FaWarehouse, FaTimes } from "react-icons/fa";
import GeneratedOrderPage from "./GeneratedOrderPage";

interface LowStockCardProps {
    item_id: string;
    item_name: string;
    current_stock: number;
    date?: string;
    time?: string;
    low_limit: number;
    unit: string;
}

const LowStock: React.FC<LowStockCardProps> = ({ item_id, item_name, current_stock, low_limit, unit }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pdfModalOpen, setPdfModalOpen] = useState(false);
    const [data, setData] = useState({
        item_id: item_id,
        item_name: item_name,
        quantity: 0,
        date:"",
        time:"",
        remarks: "",
        unit: unit,
    });

    const handleOrderClick = () => {
        setModalOpen(true);
    };

    const handleGenerateOrder = async () => {
        setLoading(true);
        try {
            const orderData = {
                ...data,
                date: new Date().toISOString().split("T")[0], // Converts to YYYY-MM-DD
                time: new Date().toLocaleTimeString("en-GB", { hour12: false }) // Converts to HH:MM:SS
            };

            await axios.post("/api/inventory/InventoryOrder", orderData);
            setModalOpen(false); // Close modal on successful order
            setPdfModalOpen(true); // Open pdf modal
        } catch (e) {
            console.error("Order submission error:", e);
        } finally {
            setLoading(false);
        }
    };

    // Calculate percentage of stock remaining
    const stockPercentage = Math.min(100, Math.round((current_stock / low_limit) * 100));

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        <FaExclamationTriangle className="text-red-600" size={16} />
                    </div>
                    <h3 className="font-medium text-gray-800">{item_name}</h3>
                </div>
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Low Stock</span>
            </div>
            
            <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Current Stock</span>
                    <span className="font-medium text-gray-800">{current_stock} {unit}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${stockPercentage}%` }}
                    ></div>
                </div>
            </div>
            
            <div className="flex justify-between text-sm mb-4">
                <span className="text-gray-500">Low Limit</span>
                <span className="font-medium text-gray-800">{low_limit} {unit}</span>
            </div>
            
            <button 
                onClick={handleOrderClick}
                className="w-full bg-[#1e4569] hover:bg-[#2c5983] text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
            >
                Place Order
            </button>

            {/* Order Modal */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
                    <div className="bg-white shadow-2xl rounded-xl p-6 w-[90%] max-w-[500px] relative animate-fadeIn">
                        {loading && (
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
                        
                        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-5">
                            <h2 className="text-xl font-bold text-[#1e4569] flex items-center gap-2">
                                <FaBoxOpen className="text-[#1e4569]" />
                                Create Order
                            </h2>
                            <button 
                                onClick={() => setModalOpen(false)}
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
                                    value={data.item_name}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Quantity ({unit})
                                </label>
                                <input
                                    type="number"
                                    value={data.quantity}
                                    onChange={(e) => setData({ ...data, quantity: parseInt(e.target.value, 10) || 0 })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e4569] focus:border-[#1e4569] outline-none transition-all"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                                <textarea
                                    value={data.remarks}
                                    onChange={(e) => setData({ ...data, remarks: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg h-24 resize-none focus:ring-2 focus:ring-[#1e4569] focus:border-[#1e4569] outline-none transition-all"
                                    placeholder="Add any additional notes..."
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGenerateOrder}
                                className="bg-[#1e4569] hover:bg-[#2c5983] text-white font-medium px-6 py-2.5 rounded-lg transition-colors duration-200 shadow-sm disabled:opacity-50"
                                disabled={loading || data.quantity <= 0}
                            >
                                Confirm Order
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* PDF Modal */}
            {pdfModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
                    <div className="animate-fadeIn">
                        <GeneratedOrderPage inventoryOrder={[data]} onClose={() => setPdfModalOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default LowStock;
