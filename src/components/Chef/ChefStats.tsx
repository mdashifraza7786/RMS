"use client";

import React, { useMemo } from "react";
import { FaUtensils } from "react-icons/fa";
import { FaCheckDouble, FaClipboardList } from "react-icons/fa6";
import { MdOutlinePending } from "react-icons/md";

export interface ChefOrderItem {
  item_id: string;
  item_name: string;
  quantity: number;
  price: number;
  status?: string;
}

export interface ChefActiveOrder {
  orderid: number;
  tablenumber: number;
  billing: { subtotal: number };
  itemsordered: ChefOrderItem[];
  start_time?: string;
}

interface ChefStatsProps {
  orderedItems: ChefActiveOrder[];
}

const ChefStats: React.FC<ChefStatsProps> = ({ orderedItems }) => {
  const stats = useMemo(() => {
    let totalPendingItems = 0;
    let totalPreparingItems = 0;
    let totalReadyItems = 0;
    let ordersInQueue = 0;

    for (const order of orderedItems) {
      const items = order.itemsordered || [];
      let hasQueue = false;
      for (const item of items) {
        const status = (item.status || "pending").toLowerCase();
        if (status === "pending") {
          totalPendingItems += Number(item.quantity || 0);
          hasQueue = true;
        } else if (status === "preparing") {
          totalPreparingItems += Number(item.quantity || 0);
          hasQueue = true;
        } else if (status === "ready") {
          totalReadyItems += Number(item.quantity || 0);
        }
      }
      if (hasQueue) ordersInQueue += 1;
    }

    return { totalPendingItems, totalPreparingItems, totalReadyItems, ordersInQueue };
  }, [orderedItems]);

  const StatCard: React.FC<{ label: string; value: number; icon: React.ReactNode; chipClass: string }>
    = ({ label, value, icon, chipClass }) => (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">{label}</span>
        <span className={`p-2 rounded-lg ${chipClass}`}>{icon}</span>
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard label="Orders in Queue" value={stats.ordersInQueue} icon={<FaClipboardList />} chipClass="bg-amber-50 text-amber-600" />
      <StatCard label="Pending Items" value={stats.totalPendingItems} icon={<MdOutlinePending />} chipClass="bg-gray-100 text-gray-700" />
      <StatCard label="Preparing Items" value={stats.totalPreparingItems} icon={<FaUtensils />} chipClass="bg-amber-50 text-amber-600" />
      <StatCard label="Ready Items" value={stats.totalReadyItems} icon={<FaCheckDouble />} chipClass="bg-green-50 text-green-600" />
    </div>
  );
};

export default ChefStats;


