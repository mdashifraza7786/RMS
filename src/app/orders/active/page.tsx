"use client";

import { useState, useEffect, useMemo } from "react";
import { Bars } from 'react-loader-spinner';
import { MdSearch, MdTableBar, MdVisibility, MdOutlineInfo } from 'react-icons/md';
import OrderScreen from "@/components/OrderScreen";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { useSession } from 'next-auth/react';

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
    status?: string;
}

interface billingAmount {
    subtotal: number;
}

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
    const [everLoaded, setEverLoaded] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedTable, setSelectedTable] = useState<number | null>(null);
    const [tableData, setTableData] = useState<Table[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(9);
    const { data: session } = useSession();
    const role = (session?.user as any)?.role as string | undefined;
    const userid = (session?.user as any)?.userid as string | undefined;
    
    const formattedOrders = orders.map(order => ({
        orderid: order.orderId,
        billing: order.billing,
        tablenumber: order.tableNumber,
        itemsordered: order.orderItems
    }));

    async function getActiveOrders(silent: boolean = false) {
        if (!silent && !everLoaded) setLoading(true);
        try {
            let response: Response;
            if (role && role !== 'admin' && userid) {
                const params = new URLSearchParams({ role, userid });
                response = await fetch(`/api/order/activeOrders?${params.toString()}`);
            } else {
                response = await fetch("/api/order/activeOrders");
            }
            const data = await response.json();

            if (data && Array.isArray(data)) {
                setOrders(data);
                if (!everLoaded) setEverLoaded(true);
            }
        } catch (error) {
            console.error("Error fetching active orders:", error);
        } finally {
            if (!silent && !everLoaded) setLoading(false);
        }
    }

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
    
    function updateOrderedItems(bookedItems: any) {
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
        setTableData(prevTables => {
            return prevTables.map(table => {
                if (table.tablenumber === tableNumber) {
                    return { ...table, availability: 0 };
                }
                return table;
            });
        });
        
        setOrders(prevOrders => 
            prevOrders.filter(order => order.tableNumber !== tableNumber)
        );
    }
    
    const removeOrderedItem = async (itemId: string, tableNumber: number, orderID: number) => {
        try {
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

        // Poll every 10s for active orders; refresh on tab focus
        const intervalId = setInterval(() => {
            getActiveOrders(true);
            fetchTables();
        }, 10000);

        const onVisibility = () => {
            if (document.visibilityState === 'visible') {
                getActiveOrders(true);
                fetchTables();
            }
        };
        document.addEventListener('visibilitychange', onVisibility);

        return () => {
            clearInterval(intervalId);
            document.removeEventListener('visibilitychange', onVisibility);
        };
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

    useEffect(() => { setCurrentPage(1); }, [searchQuery, orders]);

    const paginated = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredOrders.slice(start, start + pageSize);
    }, [filteredOrders, currentPage, pageSize]);

    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));

    const parseFlexibleDate = (input?: string) => {
        if (!input) return null;
        const direct = new Date(input);
        if (!isNaN(direct.getTime())) return direct;
        const m = input.trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
        if (m) {
            const now = new Date();
            let hours = parseInt(m[1], 10) % 12;
            if (m[3].toLowerCase() === 'pm') hours += 12;
            const minutes = parseInt(m[2], 10);
            const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);
            return d;
        }
        return null;
    };

    const formatDate = (dateString: string) => {
        const date = parseFlexibleDate(dateString);
        if (!date) return dateString;
        return date.toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getOrderStage = (items: OrderedItems[]) => {
        const statuses = items.map(i => (i.status || 'pending').toLowerCase());
        const hasPending = statuses.includes('pending');
        const hasPreparing = statuses.includes('preparing');
        const allServed = statuses.length > 0 && statuses.every(s => s === 'served');
        const allReadyOrServed = statuses.length > 0 && statuses.every(s => s === 'ready' || s === 'served');

        if (allServed) return { label: 'Served', cls: 'bg-blue-50 text-blue-600' };
        if (allReadyOrServed) return { label: 'Ready', cls: 'bg-green-50 text-green-600' };
        if (hasPreparing) return { label: 'Preparing', cls: 'bg-amber-50 text-amber-600' };
        return { label: 'Pending', cls: 'bg-gray-100 text-gray-700' };
    };

    const timeAgo = (dateString?: string) => {
        const d = parseFlexibleDate(dateString);
        if (!d) return '';
        const then = d.getTime();
        const now = Date.now();
        const diff = Math.max(0, Math.floor((now - then) / 1000));
        const mins = Math.floor(diff / 60);
        const hrs = Math.floor(mins / 60);
        if (hrs > 0) return `${hrs}h ${mins % 60}m ago`;
        if (mins > 0) return `${mins}m ago`;
        return `${diff}s ago`;
    };

    return (
        <div className="container mx-auto px-6 pt-4 pb-8">
            <div className="py-4">
                <div className="flex items-center gap-3">
                    <FaFileInvoiceDollar className="text-primary text-2xl" />
                    <h1 className="text-xl font-semibold text-gray-800">Active Orders</h1>
                </div>
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
                <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginated.map((order) => (
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
                                    {(() => { const s = getOrderStage(order.orderItems); return (
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${s.cls}`}>
                                            {s.label}
                                        </span>
                                    ); })()}
                                    {order.start_time && (
                                        <span className="text-[11px] text-gray-500 mt-1">
                                            {formatDate(order.start_time)} · {timeAgo(order.start_time)}
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
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-sm text-gray-600">
                        Showing <span className="font-medium text-gray-800">{filteredOrders.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span>-
                        <span className="font-medium text-gray-800">{Math.min(currentPage * pageSize, filteredOrders.length)}</span> of
                        <span className="font-medium text-gray-800"> {filteredOrders.length}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-600">Cards per page</label>
                        <select
                            value={pageSize}
                            onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
                            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-primary focus:border-primary"
                        >
                            {[6, 9, 12, 18].map(n => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 bg-white disabled:opacity-50" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</button>
                            <span className="text-sm text-gray-700">Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span></span>
                            <button className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 bg-white disabled:opacity-50" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
                        </div>
                    </div>
                </div>
                </>
            )}
            
            {selectedTable !== null && (
                <OrderScreen 
                    role={role}
                    userid={userid}
                    tableNumber={selectedTable} 
                    orderedItem={formattedOrders} 
                    setorderitemsfun={updateOrderedItems} 
                    resettable={resetTable} 
                    removeOrderedItems={removeOrderedItem} 
                    tabledata={tableData} 
                        closeOrderScreen={closeOrderScreen} 
                        updateItemStatus={(orderId, itemId, status) => {
                            setOrders(prev => prev.map(o => o.orderId === orderId ? {
                                ...o,
                                orderItems: o.orderItems.map(it => it.item_id === itemId ? { ...it, status } : it)
                            } : o));
                        }}
                />
            )}
        </div>
    );
}