"use client";

import React, { useRef, useEffect, useState, Suspense, lazy } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdDashboard, MdRestaurantMenu, MdTableBar, MdTrendingUp, MdTrendingDown } from "react-icons/md";
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import Link from 'next/link';
import OrderScreen from './OrderScreen';
import axios from 'axios';
import { Bars } from 'react-loader-spinner';
import { FaCashRegister, FaMoneyBillWave, FaChartPie, FaChartBar, FaChartLine, FaUsers, FaUserTag, FaBox, FaReceipt } from "react-icons/fa";
import RecentTableOrders from '@/components/RecentTableOrders';

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
}
export interface billingAmount {
    subtotal: number;
}
const OrderQueueCard = lazy(() => import('./OrderQueueCard'));
const TableStatusCard = lazy(() => import('./TableStatusCard'));
const RecentPaymentCard = lazy(() => import('./RecentPaymentCard'));

const AdminDashboard: React.FC = () => {
    const [tableData, setTableData] = useState<Table[]>([]);
    const [financialData, setFinancialData] = useState({
        revenue: { value: 0, change: 0 },
        orders: { value: 0, change: 0 },
        averageOrderValue: { value: 0, change: 0 },
        period: '7days'
    });
    const [isFinancialLoading, setIsFinancialLoading] = useState(true);
    const [chartType, setChartType] = useState<'pie' | 'bar' | 'line'>('pie');

    const chartData = [
        { id: 0, value: financialData.revenue.value || 1000, label: 'Revenue', color: '#4F46E5' },
        { id: 1, value: financialData.orders.value || 150, label: 'Orders', color: '#10B981' }
    ];

    const sliderRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [selectedTable, setSelectedTable] = useState<number | null>(null);
    const [orderedItems, setOrderedItems] = useState<{ orderid: number, billing: billingAmount; tablenumber: number; itemsordered: OrderedItems[]; start_time?: string }[]>([]);
    const [tableLoaded, setTableLoaded] = useState(false);


    const fetchActiveOrders = async () => {
        try {
            const response = await axios.get("/api/order/activeOrders");
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
                })),
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
    }, []);
    
    const fetchTables = async () => {
        try {
            setTableLoaded(true);

            const response = await fetch("/api/tables");

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setTableData(data.tables);
        } catch (error: any) {
            console.error("Error fetching tables:", error.message);
        } finally {
            setTableLoaded(false);
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
        setSelectedTable(tablenumber);
    };
    
    const closeOrderScreen = () => {
        setSelectedTable(null);
    };

    const renderChart = () => {
        if (isFinancialLoading) {
            return (
                <span className="text-primary">
                    <Bars height="40" width="40" color="currentColor" ariaLabel="bars-loading" visible={true} />
                </span>
            );
        }

        const chartWidth = 600;
        const chartHeight = 300;

        switch (chartType) {
            case 'pie':
                return (
                    <PieChart
                        series={[
                            {
                                data: chartData,
                                innerRadius: 80,
                                paddingAngle: 2,
                                cornerRadius: 4,
                                startAngle: -90,
                                highlightScope: { faded: 'global', highlighted: 'item' },
                                faded: { innerRadius: 75, additionalRadius: -30, color: 'gray' },
                            },
                        ]}
                        width={chartWidth}
                        height={chartHeight}
                        margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        slotProps={{
                            legend: {
                                direction: 'column',
                                position: { vertical: 'middle', horizontal: 'right' },
                                padding: 0,
                            },
                        }}
                    />
                );
            case 'bar':
                return (
                    <BarChart
                        xAxis={[{ 
                            scaleType: 'band', 
                            data: ['Revenue', 'Orders'],
                            tickLabelStyle: {
                                fontSize: 14,
                                fontWeight: 500,
                            }
                        }]}
                        series={[
                            { 
                                data: [financialData.revenue.value, 0],
                                label: 'Revenue',
                                color: '#4F46E5'
                            },
                            {
                                data: [0, financialData.orders.value],
                                label: 'Orders',
                                color: '#10B981'
                            }
                        ]}
                        width={chartWidth}
                        height={chartHeight}
                        margin={{ top: 20, bottom: 30, left: 40, right: 20 }}
                        slotProps={{
                            legend: {
                                direction: 'row',
                                position: { vertical: 'top', horizontal: 'right' },
                                padding: 0,
                            },
                        }}
                    />
                );
            case 'line':
                const generateDataPoints = () => {
                    const points = [];
                    const days = financialData.period === '7days' ? 7 : 
                                 financialData.period === '30days' ? 30 : 
                                 new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(); 
                    
                    const revPerDay = financialData.revenue.value / days;
                    const ordersPerDay = financialData.orders.value / days;
                    
                    for (let i = 0; i < days; i++) {
                        const revVariation = 0.8 + Math.random() * 0.4;
                        const orderVariation = 0.8 + Math.random() * 0.4;
                        
                        points.push({
                            day: i + 1,
                            revenue: revPerDay * revVariation,
                            orders: ordersPerDay * orderVariation
                        });
                    }
                    return points;
                };
                
                const lineData = generateDataPoints();
                
                return (
                    <LineChart
                        xAxis={[{ 
                            data: lineData.map(d => d.day),
                            scaleType: 'point',
                            label: 'Day',
                            tickLabelStyle: {
                                fontSize: 12,
                            },
                            labelStyle: {
                                fontSize: 14,
                                fontWeight: 500,
                            }
                        }]}
                        yAxis={[
                            { 
                                id: 'revenue', 
                                scaleType: 'linear',
                                label: 'Revenue (₹)',
                                labelStyle: {
                                    fontSize: 14,
                                    fontWeight: 500,
                                }
                            },
                            { 
                                id: 'orders', 
                                scaleType: 'linear',
                                label: 'Orders',
                                labelStyle: {
                                    fontSize: 14,
                                    fontWeight: 500,
                                }
                            }
                        ]}
                        series={[
                            { 
                                data: lineData.map(d => d.revenue),
                                label: 'Revenue',
                                color: '#4F46E5',
                                yAxisKey: 'revenue',
                                showMark: false,
                                curve: 'monotoneX'
                            },
                            {
                                data: lineData.map(d => d.orders),
                                label: 'Orders',
                                color: '#10B981',
                                yAxisKey: 'orders',
                                showMark: false,
                                curve: 'monotoneX'
                            }
                        ]}
                        width={chartWidth}
                        height={chartHeight}
                        margin={{ top: 20, bottom: 30, left: 60, right: 30 }}
                        slotProps={{
                            legend: {
                                direction: 'row',
                                position: { vertical: 'top', horizontal: 'right' },
                                padding: 0,
                            },
                        }}
                    />
                );
            default:
                return null;
        }
    };
 
    return (
        <div className="">
            <div className="">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-semibold text-gray-800">Restaurant Dashboard</h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <FaMoneyBillWave className="text-green-500" />
                                Financial Overview
                            </h2>
                            <select 
                                className="text-sm border rounded-lg px-3 py-1.5 text-gray-600 bg-gray-50"
                                onChange={handlePeriodChange}
                                value={financialData.period}
                            >
                                <option value="today">Today</option>
                                <option value="yesterday">Yesterday</option>
                                <option value="7days">Last 7 days</option>
                                <option value="30days">Last 30 days</option>
                                <option value="month">This month</option>
                            </select>
                        </div>

                        {isFinancialLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <span className="text-primary">
                                    <Bars height="40" width="40" color="currentColor" ariaLabel="bars-loading" visible={true} />
                                </span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 transition-all">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Revenue</h3>
                                            <p className="text-3xl font-bold text-primary/90">
                                                ₹{financialData.revenue.value.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-white rounded-full shadow-sm">
                                            <FaMoneyBillWave className="text-primary text-xl" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center">
                                        {financialData.revenue.change > 0 ? (
                                            <MdTrendingUp className="text-green-500 mr-1" />
                                        ) : (
                                            <MdTrendingDown className="text-red-500 mr-1" />
                                        )}
                                        <span className={`text-sm font-medium ${financialData.revenue.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {financialData.revenue.change > 0 ? '+' : ''}{financialData.revenue.change}%
                                        </span>
                                        <span className="text-gray-500 text-sm ml-1">vs previous period</span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-green-50/50 rounded-xl p-6 transition-all">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-gray-600 text-sm font-medium mb-1">Completed Orders</h3>
                                            <p className="text-3xl font-bold text-green-700">
                                                {financialData.orders.value}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-white rounded-full shadow-sm">
                                            <FaReceipt className="text-green-600 text-xl" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center">
                                        {financialData.orders.change > 0 ? (
                                            <MdTrendingUp className="text-green-500 mr-1" />
                                        ) : (
                                            <MdTrendingDown className="text-red-500 mr-1" />
                                        )}
                                        <span className={`text-sm font-medium ${financialData.orders.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {financialData.orders.change > 0 ? '+' : ''}{financialData.orders.change}%
                                        </span>
                                        <span className="text-gray-500 text-sm ml-1">vs previous period</span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-amber-50 to-amber-50/50 rounded-xl p-6 transition-all">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-gray-600 text-sm font-medium mb-1">Average Order Value</h3>
                                            <p className="text-3xl font-bold text-amber-700">
                                                ₹{financialData.averageOrderValue.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-white rounded-full shadow-sm">
                                            <FaChartLine className="text-amber-600 text-xl" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center">
                                        {financialData.averageOrderValue.change > 0 ? (
                                            <MdTrendingUp className="text-green-500 mr-1" />
                                        ) : (
                                            <MdTrendingDown className="text-red-500 mr-1" />
                                        )}
                                        <span className={`text-sm font-medium ${financialData.averageOrderValue.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {financialData.averageOrderValue.change > 0 ? '+' : ''}{financialData.averageOrderValue.change}%
                                        </span>
                                        <span className="text-gray-500 text-sm ml-1">vs previous period</span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 rounded-xl p-6 transition-all">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-gray-600 text-sm font-medium mb-1">Estimated Monthly Revenue</h3>
                                            <p className="text-3xl font-bold text-blue-700">
                                                ₹{(financialData.revenue.value * (30 / (financialData.period === '7days' ? 7 : 30))).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-white rounded-full shadow-sm">
                                            <FaCashRegister className="text-blue-600 text-xl" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center">
                                        <span className="text-gray-500 text-sm">
                                            Projection based on current period
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FaUsers className="text-primary" />
                            Quick Stats
                        </h2>
                        <div className="space-y-6">
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="text-sm text-gray-600">Tables Available</div>
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <FaUserTag className="text-green-600 text-sm" />
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-gray-800">
                                    {tableData.filter(table => table.availability === 0).length} / {tableData.length}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {Math.round((tableData.filter(table => table.availability === 0).length / (tableData.length || 1)) * 100)}% availability rate
                                </div>
                            </div>
                            
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="text-sm text-gray-600">Active Orders</div>
                                    <div className="p-2 bg-amber-100 rounded-lg">
                                        <FaBox className="text-amber-600 text-sm" />
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-gray-800">
                                    {orderedItems.length}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {orderedItems.length > 0 ? 'Orders currently in progress' : 'No active orders'}
                                </div>
                            </div>
                            
                            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="text-sm text-primary">Period Overview</div>
                                    <div className="text-xs text-gray-600 bg-white px-2 py-1 rounded">
                                        {financialData.period === '7days' ? 'Last 7 days' :
                                        financialData.period === '30days' ? 'Last 30 days' :
                                        financialData.period === 'month' ? 'This month' :
                                        financialData.period === 'today' ? 'Today' :
                                        financialData.period === 'yesterday' ? 'Yesterday' :
                                        'N/A'}
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                    <span className="text-gray-600">Revenue per Order:</span>
                                    <span className="font-medium">₹{
                                        financialData.orders.value > 0 
                                            ? (financialData.revenue.value / financialData.orders.value).toLocaleString(undefined, { maximumFractionDigits: 0 })
                                            : '0'
                                    }</span>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                    <span className="text-gray-600">Daily Average:</span>
                                    <span className="font-medium">₹{
                                        (financialData.revenue.value / (financialData.period === '7days' ? 7 : 
                                            financialData.period === '30days' ? 30 : 
                                            new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()))
                                            .toLocaleString(undefined, { maximumFractionDigits: 0 })
                                    }</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <MdRestaurantMenu className="text-amber-500" />
                            Active Orders
                        </h2>
                        <Link 
                            href="/orders/active" 
                            className="text-sm text-primary hover:text-primary/80 font-medium flex items-center"
                        >
                            View All
                        </Link>
                    </div>
                    
                    <div className="relative">
                        {showLeftArrow && (
                            <button
                                onClick={scrollLeft}
                                className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex justify-center items-center hover:bg-gray-50 transition-all z-10"
                            >
                                <MdKeyboardArrowLeft className="text-2xl text-gray-600" />
                            </button>
                        )}

                        <div ref={sliderRef} className="flex gap-4 overflow-x-auto scroll-smooth pb-4 hide-scrollbar">
                            <Suspense fallback={
                                <div className="flex justify-center items-center h-32 w-full">
                                    <span className="text-primary">
                                        <Bars height="40" width="40" color="currentColor" ariaLabel="bars-loading" visible={true} />
                                    </span>
                                </div>
                            }>
                                {tableLoaded ? (
                                    <div className="flex justify-center items-center h-32 w-full">
                                        <span className="text-primary">
                                            <Bars height="40" width="40" color="currentColor" ariaLabel="bars-loading" visible={true} />
                                        </span>
                                    </div>
                                ) : orderedItems.length > 0 ? (
                                    orderedItems.map((order) => (
                                        order.tablenumber > 0 &&
                                        <OrderQueueCard
                                            key={order.orderid}
                                            table={order.tablenumber.toString()}
                                            waiter="Shyal Lal"
                                            amount={(order.billing.subtotal + order.billing.subtotal * 0.18).toFixed(2)}
                                            orid={order.orderid.toString()}
                                            orderedItems={order.itemsordered}
                                            start_time={order.start_time || 'N/A'}
                                        />
                                    ))
                                ) : (
                                    <div className="flex items-center justify-center h-32 w-full bg-gray-50 rounded-lg border border-dashed border-gray-200 px-4">
                                        <p className="text-gray-500 text-sm">No active orders at the moment</p>
                                    </div>
                                )}
                            </Suspense>
                        </div>

                        {showRightArrow && (
                            <button
                                onClick={scrollRight}
                                className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex justify-center items-center hover:bg-gray-50 transition-all z-10"
                            >
                                <MdKeyboardArrowRight className="text-2xl text-gray-600" />
                            </button>
                        )}
                    </div>
                </section>

                <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <MdTableBar className="text-primary" />
                            Table Management
                        </h3>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">Available</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">Occupied</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        <Suspense fallback={
                            <div className="col-span-full flex justify-center items-center h-40">
                                <span className="text-primary">
                                    <Bars height="40" width="40" color="currentColor" ariaLabel="bars-loading" visible={true} />
                                </span>
                            </div>
                        }>
                            {tableLoaded ? (
                                <div className="col-span-full flex justify-center items-center h-40">
                                    <span className="text-primary">
                                        <Bars height="40" width="40" color="currentColor" ariaLabel="bars-loading" visible={true} />
                                    </span>
                                </div>
                            ) : tableData && tableData.length > 0 ? (
                                tableData.map((item, index) => (
                                    <TableStatusCard
                                        key={index}
                                        tablestatus={item.availability === 0 ? 'available' : 'notavailable'}
                                        tableno={Number(item.tablenumber)}
                                        doOrder={handleOrder}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full flex justify-center items-center h-40 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                    <p className="text-gray-500 text-sm">No tables available. Please add a table.</p>
                                </div>
                            )}
                        </Suspense>
                    </div>
                </section>

                <div className="flex gap-6 w-full">
                    <RecentTableOrders />
                    <RecentPaymentCard />
                </div>
            </div>

            {selectedTable !== null && (
                <OrderScreen 
                    tableNumber={selectedTable} 
                    orderedItem={orderedItems} 
                    setorderitemsfun={updateOrderedItems} 
                    resettable={resetTable} 
                    removeOrderedItems={removeOrderedItem} 
                    tabledata={tableData} 
                    closeOrderScreen={closeOrderScreen} 
                />
            )}
        </div>
    );
};

export default AdminDashboard;
