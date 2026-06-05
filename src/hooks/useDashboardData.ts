import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';


export interface Table {
    id: number;
    tablenumber: number;
    availability: number;
}

export interface OrderedItems {
    id: number;
    item_id: string;
    item_name: string;
    quantity: number;
    price: number;
    status?: string;
}

export interface billingAmount {
    subtotal: number;
}

export interface ActiveOrder {
    orderid: number;
    billing: billingAmount;
    tablenumber: number;
    itemsordered: OrderedItems[];
    start_time?: string;
    waiter_id?: string | null;
    waiter_name?: string | null;
    chef_id?: string | null;
    chef_name?: string | null;
}

export function useDashboardData(role: string | undefined, userid: string | undefined) {
    const [tableData, setTableData] = useState<Table[]>([]);
    const [financialData, setFinancialData] = useState({
        revenue: { value: 0, change: 0 },
        orders: { value: 0, change: 0 },
        averageOrderValue: { value: 0, change: 0 },
        period: '7days'
    });
    const [isFinancialLoading, setIsFinancialLoading] = useState(true);
    const [orderedItems, setOrderedItems] = useState<ActiveOrder[]>([]);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const tablesEverLoadedRef = useRef(false);

    const fetchActiveOrders = useCallback(async () => {
        if (!role || !userid) return;
        try {
            const response = await axios.get(`/api/order/activeOrders?role=${role}&userid=${userid}`);
            const ordersArray = response.data.data || [];
            const activeOrders = ordersArray.map((order: any) => ({
                orderid: order.orderId,
                billing: {
                    subtotal: order.billing.subtotal
                },
                tablenumber: Number(order.tableNumber),
                itemsordered: order.itemsordered.map((item: any) => ({
                    id: item.id,
                    item_id: item.item_id,
                    item_name: item.item_name,
                    quantity: item.quantity,
                    price: item.price,
                    status: item.status ?? 'pending',
                })),
                waiter_id: order.waiter_id || null,
                waiter_name: order.waiter_name || null,
                chef_id: order.chef_id || null,
                chef_name: order.chef_name || null,
                start_time: order.start_time,
            }));
            setOrderedItems(activeOrders);
        } catch (error) {
            console.error("Error fetching active orders:", error);
        }
    }, [role, userid]);

    const fetchTables = useCallback(async (silent: boolean = false) => {
        try {
            if (!silent && !tablesEverLoadedRef.current) {
                setIsTableLoading(true);
            }

            const response = await fetch("/api/tables");
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            setTableData(data.data || []);
            tablesEverLoadedRef.current = true;
        } catch (error: any) {
            console.error("Error fetching tables:", error.message);
        } finally {
            if (!silent) {
                setIsTableLoading(false);
            }
        }
    }, []);

    const fetchFinancialData = useCallback(async (period = 'today') => {
        try {
            setIsFinancialLoading(true);
            const response = await fetch(`/api/dashboard/financialOverview?period=${period}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
            const data = await response.json();
            setFinancialData(data.data || data);
        } catch (error: any) {
            console.error("Error fetching financial data:", error.message);
        } finally {
            setIsFinancialLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!role || !userid) return;

        fetchActiveOrders();
        fetchTables();
        fetchFinancialData(financialData.period);

        const ordersInterval = setInterval(() => {
            fetchActiveOrders();
            fetchTables(true);
        }, 10000);

        const financialInterval = setInterval(() => {
            fetchFinancialData(financialData.period);
        }, 60000);

        const onVisibility = () => {
            if (document.visibilityState === 'visible') {
                fetchActiveOrders();
                fetchTables(true);
            }
        };
        document.addEventListener('visibilitychange', onVisibility);

        return () => {
            clearInterval(ordersInterval);
            clearInterval(financialInterval);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, [role, userid, fetchActiveOrders, fetchTables, fetchFinancialData]);

    const resetTable = useCallback((tablenumber: number) => {
        setOrderedItems((prevItems) => prevItems.filter(order => order.tablenumber !== tablenumber));
    }, []);

    const updateTableAvailability = useCallback((tableNum: number, availability: number) => {
        setTableData(prev => prev.map(t => t.tablenumber === tableNum ? { ...t, availability } : t));
    }, []);

    const mergeItems = (existingItems: OrderedItems[], newItems: OrderedItems[]) => {
        const updatedItems = existingItems.map(item => ({ ...item }));
        newItems.forEach(newItem => {
            const existingItem = updatedItems.find(item => item.item_id === newItem.item_id);
            if (existingItem) {
                existingItem.quantity += newItem.quantity;
            } else {
                updatedItems.push({ ...newItem });
            }
        });
        return updatedItems;
    };

    const updateOrderedItems = useCallback((bookedItems: any) => {
        setOrderedItems((prevItems) => {
            return prevItems.map(order =>
                order.tablenumber === bookedItems.tablenumber
                    ? {
                        ...order,
                        billing: {
                            subtotal: bookedItems.billing.subtotal
                        },
                        itemsordered: mergeItems([...order.itemsordered], bookedItems.itemsordered)
                    }
                    : order
            ).concat(prevItems.some(order => order.tablenumber === bookedItems.tablenumber) ? [] : [bookedItems]);
        });
    }, []);

    const updateOrderItemStatus = useCallback((orderId: number, itemId: string, newStatus: string) => {
        setOrderedItems((prev) =>
            prev.map(order => {
                if (order.orderid !== orderId) return order;
                return {
                    ...order,
                    itemsordered: order.itemsordered.map(item =>
                        item.item_id === itemId ? { ...item, status: newStatus } : item
                    )
                };
            })
        );
    }, []);

    const removeOrderedItem = useCallback((voidItemId: number, tableNumber: number, orderID: number) => {
        if (!window.confirm("Are you sure you want to void this item? Stock will be restored.")) return;

        setOrderedItems((prevItems) => {
            return prevItems
                .map(order => {
                    if (order.tablenumber === tableNumber) {
                        const filteredItems = order.itemsordered.filter(item => item.id !== voidItemId);
                        return filteredItems.length > 0
                            ? { ...order, itemsordered: filteredItems }
                            : null;
                    }
                    return order;
                })
                .filter(Boolean) as ActiveOrder[];
        });

        (async () => {
            try {
                const response = await axios.post("/api/order/voidItem", { order_item_id: voidItemId });
                if (response.data.success) {
                    fetchActiveOrders();
                }
            } catch (error: any) {
                console.error("Error voiding item:", error.response?.data || error.message);
                alert("Failed to void item. Please check permissions.");
                fetchActiveOrders(); // Rollback UI state
            }
        })();
    }, [fetchActiveOrders]);

    return {
        tableData,
        setTableData,
        financialData,
        isFinancialLoading,
        orderedItems,
        setOrderedItems,
        isTableLoading,
        fetchActiveOrders,
        fetchFinancialData,
        fetchTables,
        resetTable,
        updateTableAvailability,
        updateOrderedItems,
        updateOrderItemStatus,
        removeOrderedItem
    };
}
