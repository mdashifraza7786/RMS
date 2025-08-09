"use client";

import React, { useMemo } from "react";
import { MdOutlinePayments } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
import { FaCalendarDay } from "react-icons/fa6";

export interface WaiterOrderItem {
  item_id: string;
  item_name: string;
  quantity: number;
  price: number;
}

export interface WaiterActiveOrder {
  orderid: number;
  tablenumber: number;
  billing: { subtotal: number };
  itemsordered: WaiterOrderItem[];
  start_time?: string;
}

interface WaiterStatsProps {
  orderedItems: WaiterActiveOrder[];
}

const WaiterStats: React.FC<WaiterStatsProps> = ({ orderedItems }) => {
  const toDateOnly = (input?: string): string | null => {
    if (!input) return null;
    const match = input.match(/^(\d{4}-\d{2}-\d{2})/);
    if (match) return match[1];
    const d = new Date(input);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    return null;
  };

  const { activeCount, todayCount, runningSubtotal } = useMemo(() => {
    const activeOrders = orderedItems.filter(
      (o) => Number(o.tablenumber) > 0 && (o.itemsordered?.length || 0) > 0
    );

    const activeCountLocal = activeOrders.length;
    let subtotalSum = 0;
    let todayCountLocal = 0;

    const todayStr = new Date().toISOString().slice(0, 10);

    for (const order of activeOrders) {
      subtotalSum += Number(order.billing?.subtotal || 0);

      const dateOnly = toDateOnly(order.start_time);
      if (dateOnly && dateOnly === todayStr) {
        todayCountLocal += 1;
      }
    }

    return {
      activeCount: activeCountLocal,
      todayCount: todayCountLocal,
      runningSubtotal: subtotalSum,
    };
  }, [orderedItems]);

  const formatINR = (amount: number) =>
    amount.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Active Orders</span>
          <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
            <FaClipboardList />
          </span>
        </div>
        <div className="text-2xl font-bold text-gray-800">{activeCount}</div>
        <div className="text-xs text-gray-500 mt-1">Orders in progress</div>
      </div>

      <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Today's Orders</span>
          <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <FaCalendarDay />
          </span>
        </div>
        <div className="text-2xl font-bold text-gray-800">{todayCount}</div>
        <div className="text-xs text-gray-500 mt-1">Started today</div>
      </div>

      <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Running Subtotal</span>
          <span className="p-2 rounded-lg bg-green-50 text-green-600">
            <MdOutlinePayments />
          </span>
        </div>
        <div className="text-2xl font-bold text-gray-800">₹ {formatINR(runningSubtotal)}</div>
        <div className="text-xs text-gray-500 mt-1">Across active orders</div>
      </div>
    </div>
  );
};

export default WaiterStats;


