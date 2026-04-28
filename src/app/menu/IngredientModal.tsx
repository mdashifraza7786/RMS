"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import Skeleton from '@/components/ui/Skeleton';

interface IngredientMapping {
    id: number;
    menu_item_id: string;
    inventory_item_id: string;
    quantity_required: number;
    item_name: string;
    unit: string;
}

interface InventoryItem {
    item_id: string;
    item_name: string;
    unit: string;
}

interface IngredientModalProps {
    menuItem: { item_id: string, item_name: string } | null;
    onClose: () => void;
}

const IngredientModal: React.FC<IngredientModalProps> = ({ menuItem, onClose }) => {
    const [mappings, setMappings] = useState<IngredientMapping[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    // Form state
    const [selectedInvId, setSelectedInvId] = useState("");
    const [qty, setQty] = useState("");

    useEffect(() => {
        if (menuItem) {
            fetchMappings();
            fetchInventory();
        }
    }, [menuItem]);

    const fetchMappings = async () => {
        if (!menuItem) return;
        try {
            setLoading(true);
            const res = await axios.get(`/api/menu/ingredients?menuId=${menuItem.item_id}`);
            if (res.data.success) {
                setMappings(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching mappings:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchInventory = async () => {
        try {
            const res = await axios.get('/api/inventory?limit=1000');
            if (res.data.success) {
                // Ensure unique inventory items by item_id
                const uniqueInventory = res.data.data.inventory.reduce((acc: InventoryItem[], current: InventoryItem) => {
                    const x = acc.find(item => item.item_id === current.item_id);
                    if (!x) {
                        return acc.concat([current]);
                    } else {
                        return acc;
                    }
                }, []);
                setInventory(uniqueInventory);
            }
        } catch (error) {
            console.error("Error fetching inventory:", error);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!menuItem || !selectedInvId || !qty) return;

        try {
            setSubmitting(true);
            const res = await axios.post('/api/menu/ingredients', {
                menu_item_id: menuItem.item_id,
                inventory_item_id: selectedInvId,
                quantity_required: parseFloat(qty)
            });

            if (res.data.success) {
                setSelectedInvId("");
                setQty("");
                fetchMappings();
            } else {
                alert(res.data.message || "Failed to add ingredient");
            }
        } catch (error: any) {
            alert(error.response?.data?.message || "An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to remove this ingredient link?")) return;
        try {
            await axios.delete(`/api/menu/ingredients?id=${id}`);
            fetchMappings();
        } catch (error) {
            console.error("Error deleting mapping:", error);
        }
    };

    if (!menuItem) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Reciepe Management</h3>
                        <p className="text-sm text-gray-500">{menuItem.item_name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <FaTimes className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Add Form */}
                    <form onSubmit={handleAdd} className="mb-8 p-4 bg-primary/5 rounded-xl border border-primary/10 flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Select Ingredient</label>
                            <select 
                                value={selectedInvId}
                                onChange={(e) => setSelectedInvId(e.target.value)}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                required
                            >
                                <option value="">-- Choose from stock --</option>
                                {inventory.map(item => (
                                    <option key={item.item_id} value={item.item_id}>
                                        {item.item_name} ({item.unit})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-32">
                            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Qty Needed</label>
                            <input 
                                type="number" 
                                step="0.01"
                                value={qty}
                                onChange={(e) => setQty(e.target.value)}
                                placeholder="0.00"
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center gap-2 font-medium"
                        >
                            {submitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FaPlus />}
                            Add
                        </button>
                    </form>

                    {/* List */}
                    <div className="max-h-[300px] overflow-y-auto">
                        <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                             Current Ingredients Map
                            <span className="bg-gray-200 text-gray-700 text-[10px] px-2 py-0.5 rounded-full">{mappings.length}</span>
                        </h4>
                        
                        {loading ? (
                            <div className="space-y-3 py-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <div className="flex gap-3">
                                            <Skeleton variant="text" width="100px" height="16px" />
                                            <Skeleton variant="text" width="60px" height="12px" />
                                        </div>
                                        <Skeleton variant="text" width="50px" height="16px" />
                                    </div>
                                ))}
                            </div>
                        ) : mappings.length === 0 ? (
                            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed text-gray-400">
                                No ingredients linked to this item yet.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {mappings.map((m) => (
                                    <div key={m.id} className="flex items-center justify-between p-3 bg-white border rounded-xl hover:shadow-md transition-shadow group">
                                        <div className="flex items-baseline gap-3">
                                            <span className="font-medium text-gray-800">{m.item_name}</span>
                                            <span className="text-xs text-gray-400 italic">ID: {m.inventory_item_id}</span>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <span className="text-lg font-bold text-primary">{m.quantity_required}</span>
                                                <span className="text-xs text-gray-500 ml-1">{m.unit}</span>
                                            </div>
                                            <button 
                                                onClick={() => handleDelete(m.id)}
                                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all rounded-lg"
                                                title="Remove link"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t text-right">
                    <button onClick={onClose} className="px-6 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IngredientModal;
