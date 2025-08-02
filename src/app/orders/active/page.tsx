"use client";

import { useState, useEffect } from "react";
import { Bars } from 'react-loader-spinner';
import Link from 'next/link';
import { MdSearch, MdTableBar, MdVisibility, MdOutlineInfo } from 'react-icons/md';
import OrderScreen from "@/components/OrderScreen";

// Interfaces from AdminDashboard
interface Table {
    id: number;
    tablenumber: number;
    availability: number;
}

interface OrderedItems {
    item_id: string;
    item_name: string;
    quantity: number;
    price: number;
}

interface billingAmount {
    subtotal: number;
}

// Interface for the API response
interface Order {
    orderId: number;
    tableNumber: number;
    orderItems: OrderedItems[];
    billing: billingAmount;
    status?: string;
    start_time?: string;
}

export default function ActiveOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedTable, setSelectedTable] = useState<number | null>(null);
    const [tableData, setTableData] = useState<Table[]>([]);
    
    // Format orders for OrderScreen component
    const formattedOrders = orders.map(order => ({
        orderid: order.orderId,
        billing: order.billing,
        tablenumber: order.tableNumber,
        itemsordered: order.orderItems
    }));

    async function getActiveOrders() {
        setLoading(true);
        try {
            const response = await fetch("/api/order/activeOrders");
            const data = await response.json();

            if (data && Array.isArray(data)) {
                setOrders(data);
            }
        } catch (error) {
            console.error("Error fetching active orders:", error);
        } finally {
            setLoading(false);
        }
    }

    // Fetch tables data
    async function fetchTables() {
        try {
            const response = await fetch("/api/tables");
            const data = await response.json();
            
            if (data && Array.isArray(data.tables)) {
                setTableData(data.tables);
            }
        } catch (error) {
            console.error("Error fetching tables:", error);
        }
    }
    
    // Functions for OrderScreen component
    function updateOrderedItems(bookedItems: any) {
        // Update the orders list with the new items
        setOrders(prevOrders => {
            const updatedOrders = [...prevOrders];
            const index = updatedOrders.findIndex(order => order.orderId === bookedItems.orderid);
            
            if (index !== -1) {
                updatedOrders[index] = {
                    ...updatedOrders[index],
                    orderItems: bookedItems.itemsordered,
                    billing: bookedItems.billing
                };
            }
            
            return updatedOrders;
        });
    }
    
    function resetTable(tableNumber: number) {
        // Update table availability
        setTableData(prevTables => {
            return prevTables.map(table => {
                if (table.tablenumber === tableNumber) {
                    return { ...table, availability: 0 };
                }
                return table;
            });
        });
        
        // Remove the order from the list
        setOrders(prevOrders => 
            prevOrders.filter(order => order.tableNumber !== tableNumber)
        );
    }
    
    const removeOrderedItem = async (itemId: string, tableNumber: number, orderID: number) => {
        try {
            // API call to remove item
            await fetch(`/api/order/modifyOrder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderid: orderID,
                    itemid: itemId,
                }),
            });
            
            // Update local state
            setOrders(prevOrders => {
                return prevOrders.map(order => {
                    if (order.orderId === orderID) {
                        return {
                            ...order,
                            orderItems: order.orderItems.filter(item => item.item_id !== itemId)
                        };
                    }
                    return order;
                });
            });
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };
    
    const handleViewOrder = (tableNumber: number) => {
        setSelectedTable(tableNumber);
    };
    
    const closeOrderScreen = () => {
        setSelectedTable(null);
    };

    useEffect(() => {
        getActiveOrders();
        fetchTables();
        
        // Set up polling to refresh data every 30 seconds
        const intervalId = setInterval(() => {
            getActiveOrders();
        }, 30000);

        return () => clearInterval(intervalId);
    }, []);

    const calculateTotal = (items: OrderedItems[]) => {
        return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    };

    const filteredOrders = orders.filter(order => {
        if (!searchQuery) return true;
        
        const query = searchQuery.toLowerCase();
        return (
            String(order.tableNumber).toLowerCase().includes(query) ||
            String(order.orderId).includes(query) ||
            order.orderItems.some(item => 
                item.item_name.toLowerCase().includes(query)
            )
        );
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Active Orders</h1>
                <Link 
                    href="/orders" 
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    All Orders
                </Link>
            </div>

            <div className="mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MdSearch className="text-gray-400" size={20} />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        placeholder="Search by table number, order ID, or menu item..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <span className="text-primary">
                        <Bars height="40" width="40" color="currentColor" ariaLabel="bars-loading" visible={true} />
                    </span>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <p className="text-gray-500 mb-2">No active orders found</p>
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="text-primary hover:underline text-sm"
                        >
                            Clear search
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOrders.map((order) => (
                        <div key={order.orderId} className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                        <MdTableBar size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">Order #{order.orderId}</h3>
                                        <p className="text-xs text-gray-500">Table {order.tableNumber}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-50 text-yellow-600">
                                        {order.status || 'In Progress'}
                                    </span>
                                    {order.start_time && (
                                        <span className="text-xs text-gray-500 mt-1">
                                            {formatDate(order.start_time)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center px-4 py-2 text-xs">
                                <div className="flex items-center gap-1">
                                    <MdOutlineInfo className="text-gray-400" />
                                    <span className="text-gray-500">Items: </span>
                                    <span className="text-gray-700 font-medium">{order.orderItems.length}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-gray-500">Subtotal: </span>
                                    <span className="text-gray-700 font-medium">₹{order.billing.subtotal.toFixed(2)}</span>
                                </div>
                            </div>
                            
                           
                            
                            <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center">
                                <div className="text-sm">
                                    <span className="text-gray-500">Total: </span>
                                    <span className="font-medium text-gray-900">₹{order.billing.subtotal.toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={() => handleViewOrder(order.tableNumber)}
                                    className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-1"
                                >
                                    <MdVisibility size={14} />
                                    View Order
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {/* OrderScreen component */}
            {selectedTable !== null && (
                <OrderScreen 
                    tableNumber={selectedTable} 
                    orderedItem={formattedOrders} 
                    setorderitemsfun={updateOrderedItems} 
                    resettable={resetTable} 
                    removeOrderedItems={removeOrderedItem} 
                    tabledata={tableData} 
                    closeOrderScreen={closeOrderScreen} 
                />
            )}
        </div>
    );
}