"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoIosPaper, IoMdAdd, IoMdClose } from "react-icons/io";
import GeneratedOrderPage from "./GeneratedOrderPage";
import { Bars } from "react-loader-spinner";

interface InventoryData {
    item_id: string;
    item_name: string;
    quantity: number;
    date?: string;
    time?: string;
    unit: string;
    remarks?: string;
}

const OrderCard: React.FC = () => {
    const [inventoryOrder, setInventoryOrder] = useState<InventoryData[]>([]);
    const [inventory, setInventory] = useState<InventoryData[]>([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await axios.get("/api/inventory");
                if (response.data && Array.isArray(response.data.users)) {
                    setInventory(response.data.users);
                } else {
                    console.error("Invalid inventory data:", response.data);
                }
            } catch (error) {
                console.error("Error fetching inventory:", error);
            }
        };
        fetchInventory();
    }, []);

    const handleAddOrder = () => {
        if (inventory.length > 0) {
            setInventoryOrder([...inventoryOrder, {
                item_id: inventory[0].item_id,
                item_name: inventory[0].item_name,
                quantity: 1,
                unit: inventory[0].unit,
                remarks: ""
            }]);
        }
    };

    const handleRemoveOrder = (index: number) => {
        setInventoryOrder(inventoryOrder.filter((_, i) => i !== index));
    };

    const handleItemChange = (index: number, itemName: string) => {
        const selectedItem = inventory.find((item) => item.item_name === itemName);
        if (selectedItem) {
            setInventoryOrder((prev) =>
                prev.map((order, i) =>
                    i === index ? { ...order, item_id: selectedItem.item_id, item_name: itemName, unit: selectedItem.unit } : order
                )
            );
        }
    };

    const handleQuantityChange = (index: number, value: number) => {
        setInventoryOrder((prev) =>
            prev.map((order, i) => (i === index ? { ...order, quantity: Number(value) || 0 } : order))
        );
    };

    const handleGenerateOrder = async () => {
        setLoading(true);
        try {
            if (inventoryOrder.length > 0) {
                for (const order of inventoryOrder) {
                    const orderData = {
                        ...order,
                        date: new Date().toISOString().split('T')[0], // Converts to YYYY-MM-DD
                        time: new Date().toLocaleTimeString(),
                    };
    
                    await axios.post("/api/inventory/InventoryOrder", orderData);
                }
                setIsPopupOpen(true);
            }
        } catch (e) {
            console.error("Order submission error:", e);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="w-full max-w-full px-4 py-6">
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-300 w-full">
                <h2 className="text-2xl font-semibold mb-6 text-primary">Order Details</h2>
                {loading ? (
                    <div className="flex justify-center items-center py-4">
                        <Bars height="50" width="50" color="#25476A" ariaLabel="bars-loading" visible={true} />
                    </div>
                ) : (
                    <>
                        {inventoryOrder.map((order, index) => (
                            <div key={index} className="relative mb-6 border-b border-gray-200 pb-4">
                                <button onClick={() => handleRemoveOrder(index)} className="absolute top-0 right-2 text-red-500 hover:text-red-700">
                                    <IoMdClose size={23} />
                                </button>
                                <div className="flex flex-wrap gap-4 w-full">
                                    <div className="flex-1">
                                        <label className="block font-medium text-gray-800">Name:</label>
                                        <select
                                            value={order.item_name}
                                            onChange={(e) => handleItemChange(index, e.target.value)}
                                            className="border border-gray-300 rounded-md px-3 py-2 w-full"
                                        >
                                            {inventory.map((item) => (
                                                <option key={item.item_id} value={item.item_name}>{item.item_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block font-medium text-gray-800">Quantity:</label>
                                        <input
                                            type="number"
                                            value={order.quantity}
                                            onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                                            className="border border-gray-300 rounded-md px-3 py-2 w-full"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block font-medium text-gray-800">Unit:</label>
                                        <input type="text" value={order.unit} readOnly className="border border-gray-300 rounded-md px-3 py-2 w-full bg-gray-100" />
                                    </div>
                                </div>
                                <div className="my-4">
                                    <label className="block font-medium text-gray-800">Remarks:</label>
                                    <textarea
                                        value={order.remarks || ""}
                                        onChange={(e) => setInventoryOrder((prev) => prev.map((o, i) => (i === index ? { ...o, remarks: e.target.value } : o)))}
                                        className="border border-gray-300 rounded-md px-3 py-2 w-full h-16 resize-none"
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-between items-center mb-6">
                            <button onClick={handleAddOrder} className="bg-primary text-white font-bold rounded-md px-4 py-2 flex items-center gap-2 hover:bg-[#193756]">
                                <IoMdAdd /> ADD MORE ORDER
                            </button>
                            <button onClick={handleGenerateOrder} className="bg-supporting2 text-white font-bold rounded-md px-4 py-2 flex items-center gap-2 hover:bg-[#b6d36e]">
                                <IoIosPaper /> GENERATE ORDER
                            </button>
                        </div>
                    </>
                )}
            </div>
            
            {isPopupOpen && <GeneratedOrderPage inventoryOrder={inventoryOrder} onClose={() => setIsPopupOpen(false)} />}
        </div>
    );
};

export default OrderCard;
