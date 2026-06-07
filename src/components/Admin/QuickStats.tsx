"use client";

import React from "react";
import Skeleton from "../ui/Skeleton";
import { FaUserTag, FaUsers, FaBox } from "react-icons/fa6";

interface QuickStatsProps {
  tablesAvailable: number;
  totalTables: number;
  activeOrdersCount: number;
  periodLabel: string;
  revenuePerOrder: string;
  dailyAverage: string;
  isLoading?: boolean;
}

const QuickStats: React.FC<QuickStatsProps> = ({
  tablesAvailable,
  totalTables,
  activeOrdersCount,
  periodLabel,
  revenuePerOrder,
  dailyAverage,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2.5">
          <Skeleton variant="rect" width="4px" height="20px" className="rounded-full" />
          <Skeleton variant="text" width="100px" height="20px" />
        </h2>
        <div className="space-y-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <Skeleton variant="text" width="40%" height="12px" />
                <Skeleton variant="rect" width="32px" height="32px" className="rounded-lg" />
              </div>
              <Skeleton variant="text" width="55%" height="32px" />
              <Skeleton variant="text" width="75%" height="10px" className="mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const tableAvailabilityPct = Math.round((tablesAvailable / (totalTables || 1)) * 100);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2.5">
        <span className="w-1 h-5 bg-accent rounded-full inline-block flex-shrink-0" />
        Quick Stats
      </h2>

      <div className="space-y-4">
        {/* Tables */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">Tables Available</p>
            <div className="p-2 bg-success/10 rounded-lg">
              <FaUserTag className="text-success text-sm" />
            </div>
          </div>
          <div className="text-3xl font-mono font-bold text-gray-800 tabular-nums">
            {tablesAvailable}
            <span className="text-lg font-normal text-gray-400 ml-1">/ {totalTables}</span>
          </div>
          <div className="mt-2">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-success rounded-full transition-all duration-700"
                style={{ width: `${tableAvailabilityPct}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">{tableAvailabilityPct}% availability</p>
          </div>
        </div>

        {/* Active Orders */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">Active Orders</p>
            <div className="p-2 bg-warning/10 rounded-lg">
              <FaBox className="text-warning text-sm" />
            </div>
          </div>
          <div className="text-3xl font-mono font-bold text-gray-800 tabular-nums">
            {activeOrdersCount}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {activeOrdersCount > 0 ? "Orders currently in progress" : "No active orders"}
          </p>
        </div>

        {/* Period Overview */}
        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs uppercase tracking-widest text-primary/70 font-medium">Period Overview</p>
            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-100">
              {periodLabel}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Revenue / Order</span>
              <span className="font-mono font-semibold text-gray-800 tabular-nums">₹{revenuePerOrder}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Daily Average</span>
              <span className="font-mono font-semibold text-gray-800 tabular-nums">₹{dailyAverage}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
