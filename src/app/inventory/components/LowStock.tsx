"use client";

import React, { useState } from "react";
import axios from "axios";
import { Bars } from 'react-loader-spinner';
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

    return (
        <div className="min-w-[22rem] bg-white border border-gray-200 rounded-2xl shadow-lg relative p-6 hover:shadow-2xl transition-all duration-300 group">
            {/* Status Indicator */}
            <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full absolute -right-1.5 -top-1.5 shadow-lg animate-pulse ring-4 ring-white"></div>
            
            {/* Main Content */}
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors duration-300">{item_name}</h2>
                        <p className="text-sm text-gray-500 mt-1">Inventory Status</p>
                    </div>
                    <button 
                        onClick={handleOrderClick}
                        className="px-5 py-2.5 bg-gradient-to-r from-supporting2 to-[#9ed84b] text-white rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 font-medium"
                    >
                        Place Order
                    </button>
                </div>

                {/* Stock Information */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="transform transition-all duration-300 hover:scale-105">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                            <p className="text-sm font-medium text-gray-600 mb-2">Current Stock</p>
                            <div className="flex items-baseline">
                                <span className="text-2xl font-bold text-primary">{current_stock}</span>
                                <span className="text-sm font-medium text-gray-500 ml-1">{unit}</span>
                            </div>
                        </div>
                    </div>
                    <div className="transform transition-all duration-300 hover:scale-105">
                        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
                            <p className="text-sm font-medium text-red-600 mb-2">Lower Limit</p>
                            <div className="flex items-baseline">
                                <span className="text-2xl font-bold text-red-500">{low_limit}</span>
                                <span className="text-sm font-medium text-red-400 ml-1">{unit}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Modal */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900/70 backdrop-blur-sm z-50">
                    <div className="bg-white p-8 rounded-2xl w-[32rem] max-w-full shadow-2xl transform transition-all scale-100 animate-fadeIn">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-supporting2 bg-clip-text text-transparent">Create Order</h1>
                            <button 
                                onClick={() => setModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <Bars
                                    height="60"
                                    width="60"
                                    color="#25476A"
                                    ariaLabel="bars-loading"
                                    visible={true}
                                />
                            </div>
                        ) : (
                            <>
                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-primary transition-colors">Item Name</label>
                                        <input
                                            disabled
                                            type="text"
                                            value={data.item_name}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 font-medium"
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-primary transition-colors">
                                            Quantity ({unit})
                                        </label>
                                        <input
                                            type="number"
                                            value={data.quantity}
                                            onChange={(e) => setData({ ...data, quantity: parseInt(e.target.value, 10) || 0 })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-supporting2 focus:border-transparent transition-shadow hover:shadow-md"
                                            min="0"
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-primary transition-colors">Remarks</label>
                                        <textarea
                                            value={data.remarks}
                                            onChange={(e) => setData({ ...data, remarks: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl h-32 resize-none focus:ring-2 focus:ring-supporting2 focus:border-transparent transition-shadow hover:shadow-md"
                                            placeholder="Add any additional notes..."
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-8">
                                    <button
                                        onClick={() => setModalOpen(false)}
                                        className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 hover:shadow-md active:scale-95 transition-all duration-300 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleGenerateOrder}
                                        className="px-8 py-3 bg-gradient-to-r from-supporting2 to-[#9ed84b] text-white rounded-xl hover:shadow-lg active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:hover:shadow-none disabled:active:scale-100 font-medium"
                                        disabled={loading}
                                    >
                                        Confirm Order
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* PDF Modal */}
            {pdfModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900/70 backdrop-blur-sm z-50">
                    <div className="animate-fadeIn">
                        <GeneratedOrderPage inventoryOrder={[data]} onClose={() => setPdfModalOpen(false)} />
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default LowStock;
