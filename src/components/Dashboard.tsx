"use client";

import React, { useRef, useEffect, useState, Suspense, lazy } from 'react';
import OrderScreen from './OrderScreen';
import RecentTableOrders from '@/components/RecentTableOrders';
import FinancialOverview from '@/components/Admin/FinancialOverview';
import QuickStats from '@/components/Admin/QuickStats';
import ActiveOrders from '@/components/Admin/ActiveOrders';
import TableManagement from '@/components/Admin/TableManagement';
import Title from '@/components/Admin/Title';
import { useSession } from 'next-auth/react';
import WaiterStats from '@/components/Waiter/WaiterStats';
import ChefStats from '@/components/Chef/ChefStats';
import { useDashboardData } from '@/hooks/useDashboardData';

const OrderQueueCard = lazy(() => import('./OrderQueueCard'));
const TableStatusCard = lazy(() => import('./TableStatusCard'));
const RecentPaymentCard = lazy(() => import('./RecentPaymentCard'));

const Dashboard: React.FC = () => {
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
    const [allowedTables, setAllowedTables] = useState<Set<number>>(new Set());

    const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        fetchFinancialData(e.target.value);
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

    useEffect(() => {
        const sliderElement = sliderRef.current;
        if (!sliderElement) return;

        const handleScroll = () => {
            setShowLeftArrow(sliderElement.scrollLeft > 0);
            setShowRightArrow(sliderElement.scrollLeft < sliderElement.scrollWidth - sliderElement.clientWidth);
        };

        const checkOverflow = () => {
            setShowRightArrow(sliderElement.scrollWidth > sliderElement.clientWidth);
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

    const scrollLeft = () => sliderRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
    const scrollRight = () => sliderRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
    const handleOrder = (tablenumber: number) => {
        if (allowedTables.has(tablenumber)) setSelectedTable(tablenumber);
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
                            isLoading={isTableLoading || isFinancialLoading}
                        />
                    </div>
                )}

                {role === 'waiter' && <WaiterStats orderedItems={orderedItems as any} />}
                {role === 'chef' && <ChefStats orderedItems={orderedItems as any} />}

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
                    canAssignWaiter={role === 'admin'}
                />

                {role !== 'chef' && (
                    <TableManagement
                        isTableLoading={isTableLoading}
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
                    userid={userid}
                    tableNumber={selectedTable}
                    orderedItem={orderedItems}
                    setorderitemsfun={updateOrderedItems}
                    resettable={resetTable}
                    removeOrderedItems={removeOrderedItem}
                    tabledata={tableData}
                    closeOrderScreen={() => setSelectedTable(null)}
                    updateItemStatus={updateOrderItemStatus}
                    updateTableAvailability={updateTableAvailability}
                />
            )}
        </div>
    );
};

export default Dashboard;
