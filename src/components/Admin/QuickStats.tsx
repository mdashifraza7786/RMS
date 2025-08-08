"use client";

import React from "react";
import { FaUserTag, FaUsers, FaBox } from "react-icons/fa6";

interface QuickStatsProps {
  tablesAvailable: number;
  totalTables: number;
  activeOrdersCount: number;
  periodLabel: string;
  revenuePerOrder: string;
  dailyAverage: string;
}

const QuickStats: React.FC<QuickStatsProps> = ({
  tablesAvailable,
  totalTables,
  activeOrdersCount,
  periodLabel,
  revenuePerOrder,
  dailyAverage,
}) => {
  return (
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
            {tablesAvailable} / {totalTables}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {Math.round(((tablesAvailable) / (totalTables || 1)) * 100)}% availability rate
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-600">Active Orders</div>
            <div className="p-2 bg-amber-100 rounded-lg">
              <FaBox className="text-amber-600 text-sm" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{activeOrdersCount}</div>
          <div className="text-xs text-gray-500 mt-1">
            {activeOrdersCount > 0 ? "Orders currently in progress" : "No active orders"}
          </div>
        </div>

        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-primary">Period Overview</div>
            <div className="text-xs text-gray-600 bg-white px-2 py-1 rounded">{periodLabel}</div>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-600">Revenue per Order:</span>
            <span className="font-medium">₹{revenuePerOrder}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-600">Daily Average:</span>
            <span className="font-medium">₹{dailyAverage}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;


