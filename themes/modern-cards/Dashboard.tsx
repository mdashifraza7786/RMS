"use client";
import React, { useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useDashboardData } from '@/hooks/useDashboardData';
import FinancialOverview from '@/components/Admin/FinancialOverview';
import QuickStats from '@/components/Admin/QuickStats';
import ActiveOrders from '@/components/Admin/ActiveOrders';
import TableManagement from '@/components/Admin/TableManagement';
import RecentTableOrders from '@/components/RecentTableOrders';
import WaiterStats from '@/components/Waiter/WaiterStats';
import ChefStats from '@/components/Chef/ChefStats';
import OrderQueueCard from '@/components/OrderQueueCard';

// A completely unique Dashboard Design exclusively for the "modern-cards" theme
export default function ModernCardsDashboard() {
    const { data: session } = useSession();
    const role = session?.user?.role as string;
    const userid = session?.user?.userid as string;

    const {
        tableData,
        financialData,
        isFinancialLoading,
        orderedItems,
        isTableLoading,
        fetchFinancialData,
        resetTable,
        updateTableAvailability,
        updateOrderedItems,
        updateOrderItemStatus,
        removeOrderedItem
    } = useDashboardData(role, userid);

    const sliderRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [selectedTable, setSelectedTable] = useState<number | null>(null);

    const scrollLeft = () => sliderRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
    const scrollRight = () => sliderRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
    const handleOrder = (tablenumber: number) => setSelectedTable(tablenumber);

    const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        fetchFinancialData(e.target.value);
    };

    return (
        <div className="w-full animate-in fade-in duration-500">
            {/* Custom Theme Header */}
            <div className="mb-8 bg-gradient-to-r from-primary/10 to-transparent p-6 rounded-3xl border border-primary/20 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                        Welcome, {session?.user?.name || 'Staff'}!
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Here is what's happening at your restaurant today.</p>
                </div>
                <div className="mt-4 md:mt-0 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-bold text-gray-700 capitalize">{role} Portal Active</span>
                </div>
            </div>

            {/* Admin Specific Layout - Radically different grid structure */}
            {role === 'admin' && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* Left Column - 8/12 width */}
                    <div className="xl:col-span-8 space-y-6">
                        {/* Quick Stats horizontal scroll */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-4">Performance Metrics</h2>
                            <QuickStats
                                tablesAvailable={tableData.filter(table => table.availability === 0).length}
                                totalTables={tableData.length}
                                activeOrdersCount={orderedItems.length}
                                periodLabel={
                                    financialData.period === '7days' ? 'Last 7 days' :
                                    financialData.period === '30days' ? 'Last 30 days' :
                                    financialData.period === 'month' ? 'This month' :
                                    financialData.period === 'all' ? 'All Time' :
                                    financialData.period === 'today' ? 'Today' :
                                    financialData.period === 'yesterday' ? 'Yesterday' : 'N/A'
                                }
                                revenuePerOrder={
                                    financialData.orders.value > 0
                                        ? (financialData.revenue.value / financialData.orders.value).toLocaleString(undefined, { maximumFractionDigits: 0 })
                                        : '0'
                                }
                                dailyAverage={(financialData.revenue.value / (
                                    financialData.period === '7days' ? 7 :
                                    financialData.period === '30days' ? 30 :
                                    financialData.period === 'today' ? 1 :
                                    financialData.period === 'yesterday' ? 1 :
                                    financialData.period === 'all' ? 365 :
                                    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
                                )).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                isLoading={isFinancialLoading}
                            />
                        </div>

                        {/* Financials embedded inside a massive card */}
                        <div className="bg-gray-900 text-white p-1 rounded-3xl shadow-lg">
                            <div className="bg-gray-800 rounded-[22px] p-6">
                                <h2 className="text-xl font-bold mb-4 text-white">Revenue Analytics</h2>
                                <FinancialOverview
                                    financialData={financialData}
                                    isLoading={isFinancialLoading}
                                    onPeriodChange={handlePeriodChange}
                                />
                            </div>
                        </div>

                        {/* Recent Orders List */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <RecentTableOrders />
                        </div>
                    </div>

                    {/* Right Column - 4/12 width */}
                    <div className="xl:col-span-4 space-y-6">
                        {/* Active Orders Stacked vertically */}
                        <div className="bg-primary/5 p-6 rounded-3xl shadow-sm border border-primary/10 h-full max-h-[800px] overflow-y-auto custom-scrollbar">
                            <h2 className="text-xl font-bold text-primary mb-4">Live Kitchen Feed</h2>
                            <ActiveOrders
                                showLeftArrow={showLeftArrow}
                                showRightArrow={showRightArrow}
                                onScrollLeft={scrollLeft}
                                onScrollRight={scrollRight}
                                sliderRef={sliderRef}
                                isTableLoading={isTableLoading}
                                orderedItems={orderedItems}
                                OrderQueueCard={OrderQueueCard as any}
                                onViewOrder={handleOrder}
                                canAssignChef={role === 'admin' || role === 'waiter'}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Waiter Layout */}
            {role === 'waiter' && (
                <div className="space-y-6">
                    <WaiterStats orderedItems={orderedItems as any} />
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <TableManagement
                            isTableLoading={isTableLoading}
                            tableData={tableData}
                            TableStatusCard={() => null}
                            handleOrder={handleOrder}
                        />
                    </div>
                </div>
            )}

            {/* Chef Layout */}
            {role === 'chef' && (
                <div className="space-y-6">
                    <ChefStats orderedItems={orderedItems as any} />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
                            <h2 className="text-2xl font-bold text-orange-800 mb-4">Pending Orders</h2>
                            <ActiveOrders
                                showLeftArrow={showLeftArrow}
                                showRightArrow={showRightArrow}
                                onScrollLeft={scrollLeft}
                                onScrollRight={scrollRight}
                                sliderRef={sliderRef}
                                isTableLoading={isTableLoading}
                                orderedItems={orderedItems}
                                OrderQueueCard={OrderQueueCard as any}
                                onViewOrder={handleOrder}
                                canAssignChef={false}
                            />
                        </div>
                        <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
                            <h2 className="text-2xl font-bold text-green-800 mb-4">Recently Completed</h2>
                            <RecentTableOrders />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
