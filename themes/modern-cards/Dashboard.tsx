"use client";
import React from 'react';
import { useSession } from 'next-auth/react';
import { useDashboardData } from '@/hooks/useDashboardData';
import FinancialOverview from '@/components/Admin/FinancialOverview';
import QuickStats from '@/components/Admin/QuickStats';
import ActiveOrders from '@/components/Admin/ActiveOrders';
import TableManagement from '@/components/Admin/TableManagement';
import RecentTableOrders from '@/components/RecentTableOrders';
import WaiterStats from '@/components/Waiter/WaiterStats';
import ChefStats from '@/components/Chef/ChefStats';

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
                            <QuickStats stats={financialData} isLoading={isFinancialLoading} />
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
                            <ActiveOrders orderedItems={orderedItems} />
                        </div>
                    </div>
                </div>
            )}

            {/* Waiter Layout */}
            {role === 'waiter' && (
                <div className="space-y-6">
                    <WaiterStats userid={userid} />
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <TableManagement 
                            tableData={tableData} 
                            orderedItems={orderedItems} 
                            isLoading={isTableLoading}
                        />
                    </div>
                </div>
            )}

            {/* Chef Layout */}
            {role === 'chef' && (
                <div className="space-y-6">
                    <ChefStats userid={userid} />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
                            <h2 className="text-2xl font-bold text-orange-800 mb-4">Pending Orders</h2>
                            <ActiveOrders orderedItems={orderedItems} />
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
