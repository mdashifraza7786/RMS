"use client";

import React, { useRef, useEffect, useState, Suspense, lazy } from 'react';

import OrderScreen from './OrderScreen';
import axios from 'axios';
import RecentTableOrders from '@/components/RecentTableOrders';
import FinancialOverview from '@/components/Admin/FinancialOverview';
import QuickStats from '@/components/Admin/QuickStats';
import ActiveOrders from '@/components/Admin/ActiveOrders';
import TableManagement from '@/components/Admin/TableManagement';
import Title from '@/components/Admin/Title';
import { useSession } from 'next-auth/react';
import WaiterStats from '@/components/Waiter/WaiterStats';
import ChefStats from '@/components/Chef/ChefStats';

export interface Table {
    id: number;
    tablenumber: number;
    availability: number;
}
export interface OrderedItems {
    item_id: string;
    item_name: string;
    quantity: number;
    price: number;
    status?: string;
}
export interface billingAmount {
    subtotal: number;
}
const OrderQueueCard = lazy(() => import('./OrderQueueCard'));
const TableStatusCard = lazy(() => import('./TableStatusCard'));
const RecentPaymentCard = lazy(() => import('./RecentPaymentCard'));

const Dashboard: React.FC = () => {
    const [tableData, setTableData] = useState<Table[]>([]);
    const [financialData, setFinancialData] = useState({
        revenue: { value: 0, change: 0 },
        orders: { value: 0, change: 0 },
        averageOrderValue: { value: 0, change: 0 },
        period: '7days'
    });
    const [isFinancialLoading, setIsFinancialLoading] = useState(true);

    const sliderRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [selectedTable, setSelectedTable] = useState<number | null>(null);
    const [orderedItems, setOrderedItems] = useState<{ orderid: number, billing: billingAmount; tablenumber: number; itemsordered: OrderedItems[]; start_time?: string; chef_id?: string }[]>([]);
    const [tableLoaded, setTableLoaded] = useState(false);
    const [tablesEverLoaded, setTablesEverLoaded] = useState(false);
    const [allowedTables, setAllowedTables] = useState<Set<number>>(new Set());

    const { data: session } = useSession();
    const role = session?.user?.role as string;

    const fetchActiveOrders = async () => {
        try {
            let response;
            if(role === 'admin'){   
                response = await axios.get("/api/order/activeOrders");
            }else{
                response = await axios.get("/api/order/activeOrders?role="+role+"&userid="+session?.user?.userid);
            }
            const activeOrders = response.data.map((order: any) => ({
                orderid: order.orderId,
                billing: {
                    subtotal: order.billing.subtotal
                },
                tablenumber: Number(order.tableNumber),
                itemsordered: order.orderItems.map((item: any) => ({
                    item_id: item.item_id,
                    item_name: item.item_name,
                    quantity: item.quantity,
                    price: item.price,
                    status: item.status ?? 'pending',
                })),
                chef_id: order.chef_id || undefined,
                waiter_name: order.waiter_name || null,
                chef_name: order.chef_name || null,
                start_time: order.start_time,
            }));
            setOrderedItems(activeOrders);
        } catch (error) {
            console.error("Error fetching active orders:", error);
        }
    };

    useEffect(() => {
        fetchActiveOrders();
        fetchTables();
        fetchFinancialData();

        // Poll for active orders and tables every 10s; financials every 60s
        const ordersInterval = setInterval(() => {
            fetchActiveOrders();
            fetchTables(true);
        }, 10000);

        const financialInterval = setInterval(() => {
            fetchFinancialData(financialData.period);
        }, 60000);

        // Refresh immediately when the tab gains focus
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
    }, []);
    
    const fetchTables = async (silent: boolean = false) => {
        try {
            if (!silent && !tablesEverLoaded) {
                setTableLoaded(true);
            }

            const response = await fetch("/api/tables");

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setTableData(data.tables);
            if (!tablesEverLoaded) setTablesEverLoaded(true);
        } catch (error: any) {
            console.error("Error fetching tables:", error.message);
        } finally {
            if (!silent && !tablesEverLoaded) {
                setTableLoaded(false);
            }
        }
    };

    const fetchFinancialData = async (period = 'today') => {
        try {
            setIsFinancialLoading(true);
            const response = await fetch(`/api/dashboard/financialOverview?period=${period}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            setFinancialData(data);
        } catch (error: any) {
            console.error("Error fetching financial data:", error.message);
        } finally {
            setIsFinancialLoading(false);
        }
    };

    const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPeriod = e.target.value;
        fetchFinancialData(newPeriod);
    };

    function resetTable(tablenumber: any) {
        setOrderedItems((prevItems) => prevItems.filter(order => order.tablenumber !== tablenumber));
    }

    function updateOrderedItems(bookedItems: any) {
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
    }
    
    function mergeItems(existingItems: any[], newItems: any[]) {
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
    }

    const updateOrderItemStatus = (orderId: number, itemId: string, newStatus: string) => {
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
    };

    useEffect(() => {
        const next = new Set<number>();
        if (role === 'admin') {
            tableData.forEach(t => next.add(t.tablenumber));
        } else {
            tableData.forEach(t => { if (t.availability === 0) next.add(t.tablenumber); });
            orderedItems.forEach(o => next.add(o.tablenumber));
        }
        setAllowedTables(next);
    }, [role, tableData, orderedItems]);


    const removeOrderedItem = async (itemId: string, tableNumber: number, orderID: number) => {
        setOrderedItems((prevItems) => {
            return prevItems
                .map(order => {
                    if (order.tablenumber === tableNumber) {
                        const filteredItems = order.itemsordered.filter(item => item.item_id !== itemId);

                        return filteredItems.length > 0
                            ? { ...order, itemsordered: filteredItems }
                            : null;
                    }
                    return order;
                })
                .filter(Boolean) as typeof prevItems;
        });

        try {
            const requestBody = {
                orderid: orderID,
                itemid: itemId,
                tablenumber: tableNumber
            };

            const response = await axios.post("/api/order/modifyOrder", requestBody);
            if (response.data.deleted) {
                tableData.map((table) => {
                    if (table.tablenumber === tableNumber) {
                        table.availability = 0;
                    }
                });
            }
        } catch (error: any) {
            console.error("Error posting to tables:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        const sliderElement = sliderRef.current;
        if (!sliderElement) return;

        const handleScroll = () => {
            setShowLeftArrow(sliderElement.scrollLeft > 0);
            setShowRightArrow(
                sliderElement.scrollLeft < sliderElement.scrollWidth - sliderElement.clientWidth
            );
        };

        const checkOverflow = () => {
            const isOverflowing = sliderElement.scrollWidth > sliderElement.clientWidth;
            setShowRightArrow(isOverflowing);
            setShowLeftArrow(false);
        };

        checkOverflow();
        sliderElement.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", checkOverflow);

        return () => {
            sliderElement.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", checkOverflow);
        };
    }, [orderedItems]);

    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    const handleOrder = (tablenumber: number) => {
        if (!allowedTables.has(tablenumber)) {
            return;
        }
        setSelectedTable(tablenumber);
    };
    
    const closeOrderScreen = () => {
        setSelectedTable(null);
    };

 
    return (
        <div className="">
            <Title role={role} />

            <div className="container mx-auto px-4 sm:px-6 py-4">
                {role === 'admin' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <FinancialOverview
                        financialData={financialData}
                        isLoading={isFinancialLoading}
                        onPeriodChange={handlePeriodChange}
                    />

                    <QuickStats
                        tablesAvailable={tableData.filter(table => table.availability === 0).length}
                        totalTables={tableData.length}
                        activeOrdersCount={orderedItems.length}
                        periodLabel={
                            financialData.period === '7days' ? 'Last 7 days' :
                            financialData.period === '30days' ? 'Last 30 days' :
                            financialData.period === 'month' ? 'This month' :
                            financialData.period === 'today' ? 'Today' :
                            financialData.period === 'yesterday' ? 'Yesterday' : 'N/A'
                        }
                        revenuePerOrder={
                            financialData.orders.value > 0
                                ? (financialData.revenue.value / financialData.orders.value).toLocaleString(undefined, { maximumFractionDigits: 0 })
                                : '0'
                        }
                        dailyAverage={
                            (financialData.revenue.value / (financialData.period === '7days' ? 7 :
                                financialData.period === '30days' ? 30 :
                                new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()))
                                .toLocaleString(undefined, { maximumFractionDigits: 0 })
                        }
                    />
                </div>
                )}

                {role !== 'admin' && role === 'waiter' && (
                  <WaiterStats orderedItems={orderedItems as any} />
                )}
                {role === 'chef' && (
                  <ChefStats orderedItems={orderedItems as any} />
                )}

                <ActiveOrders
                    showLeftArrow={showLeftArrow}
                    showRightArrow={showRightArrow}
                    onScrollLeft={scrollLeft}
                    onScrollRight={scrollRight}
                    sliderRef={sliderRef}
                    tableLoaded={tableLoaded}
                    orderedItems={orderedItems}
                    OrderQueueCard={OrderQueueCard as any}
                    onViewOrder={handleOrder}
                    canAssignChef={role === 'admin' || role === 'waiter'}
                />
                {role !== 'chef' && (
                  <TableManagement
                      tableLoaded={tableLoaded}
                      tableData={tableData}
                      TableStatusCard={TableStatusCard as any}
                      handleOrder={handleOrder}
                      clickableTables={Array.from(allowedTables)}
                  />
                )}
                {role === 'admin' && (
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 w-full">
                    <div className="w-full lg:w-1/2">
                        <RecentTableOrders />
                    </div>
                    <div className="w-full lg:w-1/2">
                        <RecentPaymentCard />
                    </div>
                </div>
                )}
            </div>

            {selectedTable !== null && (
                <OrderScreen
                    role={role}
                    userid={session?.user?.userid}
                    tableNumber={selectedTable} 
                    orderedItem={orderedItems} 
                    setorderitemsfun={updateOrderedItems} 
                    resettable={resetTable} 
                    removeOrderedItems={removeOrderedItem} 
                    tabledata={tableData} 
                    closeOrderScreen={closeOrderScreen} 
                    updateItemStatus={updateOrderItemStatus}
                />
            )}
        </div>
    );
};

export default Dashboard;
