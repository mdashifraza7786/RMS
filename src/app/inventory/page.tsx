"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaBox } from "react-icons/fa";
import { Bars } from 'react-loader-spinner';
import LowStock from '@/app/inventory/components/LowStock';
import InventoryCard from '@/app/inventory/components/InventoryCard';
import KitchenOrdersCard from '@/app/inventory/components/KitchenOrdersCard';
import OrderCard from '@/app/inventory/components/OrderCard';
import RecentCard from '@/app/inventory/components/RecentCard';

interface InventoryItem {
    item_id: string;
    item_name: string;
    current_stock: number;
    low_limit: number;
    unit: string;
}

const Page: React.FC = () => {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [lowStock, setLowStock] = useState<InventoryItem[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<'inventory' | 'order' | 'kitchenOrders' | 'recent'>('inventory');
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Inventory";
        fetchInventory();
    }, []);

    useEffect(() => {
        const checkLowStock = () => {
            const array = inventory.filter(item => item.current_stock < item.low_limit);
            setLowStock(array);
        };

        checkLowStock();
    }, [inventory]);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/inventory');
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

    const tabs = [
        { id: 'inventory', label: 'Inventory' },
        { id: 'order', label: 'Generate Order' },
        { id: 'kitchenOrders', label: 'Kitchen Orders' },
        { id: 'recent', label: 'Recent Orders' }
    ];

    return (
        <div className="container mx-auto px-6 pt-4 pb-8">
            <div className="py-4">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-semibold text-gray-800">Inventory Management</h1>
                </div>
            </div>

            {lowStock.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex items-center mb-4">
                        <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center mr-3">
                            <FaBox className="text-amber-600" size={16} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">Urgently Needed in Kitchen</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {lowStock.map(item => (
                            <LowStock
                                key={item.item_id}
                                item_id={item.item_id}
                                item_name={item.item_name}
                                current_stock={item.current_stock}
                                low_limit={item.low_limit}
                                unit={item.unit}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="search"
                                placeholder="Search by name or ID..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary w-full md:w-80"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 border-b border-gray-200">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setSelectedFilter(tab.id as any)}
                                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${selectedFilter === tab.id
                                        ? 'text-primary border-b-2 border-primary bg-primary/5'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Bars height="50" width="50" color="primary" ariaLabel="bars-loading" />
                        </div>
                    ) : (
                        <>
                            {selectedFilter === 'inventory' && <InventoryCard />}
                            {selectedFilter === 'order' && <OrderCard />}
                            {selectedFilter === 'kitchenOrders' && <KitchenOrdersCard />}
                            {selectedFilter === 'recent' && <RecentCard />}
                        </>
                    )}
                </div>
            </div>

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default Page;


