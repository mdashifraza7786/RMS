"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaTimes, FaFileAlt } from "react-icons/fa";
import GeneratedOrderPage from "./GeneratedOrderPage";
import Skeleton from "@/components/ui/Skeleton";

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

    const handleItemChange = (index: number, compositeValue: string) => {
        const [itemID, unit] = compositeValue.split('-');
        const selectedItem = inventory.find((item) => item.item_id === itemID && item.unit === unit);
        if (selectedItem) {
            setInventoryOrder((prev) =>
                prev.map((order, i) =>
                    i === index ? { ...order, item_id: selectedItem.item_id, item_name: selectedItem.item_name, unit: selectedItem.unit } : order
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
                await axios.post("/api/inventory/bulkOrder", { orders: inventoryOrder });
                setIsPopupOpen(true);
            }
        } catch (e) {
            console.error("Order submission error:", e);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="w-full">
            {loading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-lg p-6 space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <Skeleton variant="rect" width="100%" height="40px" className="rounded-lg" />
                                <Skeleton variant="rect" width="100%" height="40px" className="rounded-lg" />
                                <Skeleton variant="rect" width="100%" height="40px" className="rounded-lg" />
                            </div>
                            <Skeleton variant="rect" width="100%" height="80px" className="rounded-lg" />
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="flex justify-end mb-4">
                        <button 
                            onClick={handleAddOrder} 
                            className="bg-[#1e4569] hover:bg-[#2c5983] text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-200 shadow-sm flex items-center gap-2"
                        >
                            <FaPlus size={16} />
                            <span>Add Item</span>
                        </button>
                    </div>
                    
                    {inventoryOrder.length === 0 ? (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-500">
                                <FaFileAlt className="w-16 h-16 mb-4 text-gray-300" />
                                <p className="text-lg font-medium">No items added yet</p>
                                <p className="mt-1 text-sm">Click &quot;Add Item&quot; to create a new order</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {inventoryOrder.map((order, index) => (
                                <div key={index} className="bg-white border border-gray-200 rounded-lg p-5 relative shadow-sm">
                                    <button 
                                        onClick={() => handleRemoveOrder(index)} 
                                        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors p-1.5 hover:bg-gray-100 rounded-full"
                                    >
                                        <FaTimes size={16} />
                                    </button>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                                            <select
                                                value={`${order.item_id}-${order.unit}`}
                                                onChange={(e) => handleItemChange(index, e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1e4569] focus:border-[#1e4569] outline-none transition-all bg-white"
                                            >
                                                {inventory.map((item) => (
                                                    <option key={`${item.item_id}-${item.unit}`} value={`${item.item_id}-${item.unit}`}>{item.item_name} ({item.unit})</option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                            <input
                                                type="number"
                                                value={order.quantity}
                                                onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1e4569] focus:border-[#1e4569] outline-none transition-all"
                                                min="1"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                                            <input 
                                                type="text" 
                                                value={order.unit} 
                                                readOnly 
                                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-500"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                                        <textarea
                                            value={order.remarks || ""}
                                            onChange={(e) => setInventoryOrder((prev) => prev.map((o, i) => (i === index ? { ...o, remarks: e.target.value } : o)))}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#1e4569] focus:border-[#1e4569] outline-none transition-all h-20 resize-none"
                                            placeholder="Add any additional notes..."
                                        />
                                    </div>
                                </div>
                            ))}
                            
                            <div className="flex justify-end mt-6">
                                <button 
                                    onClick={handleGenerateOrder}
                                    disabled={inventoryOrder.length === 0}
                                    className="bg-[#1e4569] hover:bg-[#2c5983] text-white font-medium px-6 py-2.5 rounded-lg transition-colors duration-200 shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FaFileAlt size={16} />
                                    <span>Generate Order</span>
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
            
            {isPopupOpen && <GeneratedOrderPage inventoryOrder={inventoryOrder} onClose={() => setIsPopupOpen(false)} />}
        </div>
    );
};

export default OrderCard;
