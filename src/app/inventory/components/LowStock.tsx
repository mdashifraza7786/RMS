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
        <div className="min-w-[22rem] border border-gray-700 rounded-md relative p-3 flex flex-col gap-3 items-center text-sm tracking-wide">
            <div className="w-[20px] h-[20px] bg-[#FF0000] rounded-full absolute -right-[7px] -top-[7px] z-10"></div>
            <div className="grid grid-cols-2 gap-4 px-3 py-3">
                <div className="flex flex-col gap-2">
                    <h1 className="text-[14px]">
                        Current Stock: <span className="text-secondary">{current_stock} {unit}</span>
                    </h1>
                    <p className="text-[14px]">
                        Lower Limit: <span className="text-secondary">{low_limit} {unit}</span>
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="text-[14px]">
                        Item: <span className="text-secondary">{item_name}</span>
                    </h1>
                    <button onClick={handleOrderClick} className="bg-supporting2 rounded-[10px] py-[3px] text-white text-[14px]">
                        ORDER
                    </button>
                </div>
            </div>

            {/* Order Modal */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg w-96 max-w-full">
                        <h1 className="text-xl font-semibold mb-4 text-primary">Order Box</h1>

                        {loading ? (
                            <div className="flex justify-center items-center py-4">
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
                                {/* Order Form */}
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <label className="block font-medium text-gray-800">Item Name:</label>
                                        <input
                                            disabled
                                            type="text"
                                            value={data.item_name}
                                            className="border border-gray-300 rounded-md px-3 py-2 w-full"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-medium text-gray-800">
                                            Quantity (in {unit}):
                                        </label>
                                        <input
                                            type="number"
                                            value={data.quantity}
                                            onChange={(e) =>
                                                setData({ ...data, quantity: parseInt(e.target.value, 10) || 0 })
                                            }
                                            className="border border-gray-300 rounded-md px-3 py-2 font-semibold w-full"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-medium text-gray-800">Remarks:</label>
                                        <textarea
                                            value={data.remarks}
                                            onChange={(e) => setData({ ...data, remarks: e.target.value })}
                                            className="border border-gray-300 rounded-md px-3 py-2 w-full h-16 resize-none"
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={() => setModalOpen(false)}
                                        className="bg-bgred text-white hover:bg-red-600 rounded-md px-4 py-2 mr-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleGenerateOrder}
                                        className="bg-supporting2 text-white hover:bg-[#8bbf3b] rounded-md px-4 py-2"
                                        disabled={loading}
                                    >
                                        Order
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* pdf Modal */}
            {pdfModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <GeneratedOrderPage inventoryOrder={[data]} onClose={() => setPdfModalOpen(false)} />
                </div>
            )}

        </div>
    );
};

export default LowStock;
