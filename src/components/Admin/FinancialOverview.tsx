"use client";

import React, { useEffect, useRef, useState } from "react";
import Skeleton from "../ui/Skeleton";
import { FaMoneyBillWave, FaChartLine, FaCashRegister, FaReceipt } from "react-icons/fa";
import { MdTrendingDown, MdTrendingUp } from "react-icons/md";

interface FinancialOverviewProps {
  financialData: {
    revenue: { value: number; change: number };
    orders: { value: number; change: number };
    averageOrderValue: { value: number; change: number };
    period: string;
  };
  isLoading: boolean;
  onPeriodChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const useCountUp = (target: number, isLoading: boolean, duration = 900) => {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (isLoading || target === 0) {
      setDisplay(0);
      return;
    }
    cancelAnimationFrame(rafRef.current);
    const startTime = Date.now();
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(target * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, isLoading, duration]);

  return display;
};

const TrendBadge = ({ change }: { change: number }) => (
  <div className="flex items-center gap-1 mt-3">
    {change > 0
      ? <MdTrendingUp className="text-white/80 text-base" />
      : <MdTrendingDown className="text-white/60 text-base" />}
    <span className={`text-xs font-medium ${change >= 0 ? "text-white/90" : "text-white/60"}`}>
      {change > 0 ? "+" : ""}{change}%
    </span>
    <span className="text-white/50 text-xs">vs previous period</span>
  </div>
);

const FinancialOverview: React.FC<FinancialOverviewProps> = ({
  financialData,
  isLoading,
  onPeriodChange,
}) => {
  const revenue = useCountUp(financialData.revenue.value, isLoading);
  const orders = useCountUp(financialData.orders.value, isLoading);
  const aov = useCountUp(financialData.averageOrderValue.value, isLoading);

  const projectedDays =
    financialData.period === "7days" ? 7 :
    financialData.period === "today" ? 1 :
    financialData.period === "yesterday" ? 1 :
    financialData.period === "all" ? 365 : 30;
  const projected = Math.round(financialData.revenue.value * (30 / projectedDays));
  const projectedDisplay = useCountUp(projected, isLoading);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 col-span-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2.5">
          <span className="w-1 h-5 bg-accent rounded-full inline-block flex-shrink-0" />
          Financial Overview
        </h2>
        <select
          className="text-sm border rounded-lg px-3 py-1.5 text-gray-600 bg-gray-50 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-accent/30"
          onChange={onPeriodChange}
          value={financialData.period}
        >
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="7days">Last 7 days</option>
          <option value="30days">Last 30 days</option>
          <option value="month">This month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl p-5 bg-gray-100 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2 flex-1">
                  <Skeleton variant="text" width="40%" height="14px" />
                  <Skeleton variant="text" width="70%" height="36px" />
                </div>
                <Skeleton variant="rect" width="44px" height="44px" className="rounded-full" />
              </div>
              <Skeleton variant="text" width="55%" height="12px" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Revenue */}
          <div className="bg-primary rounded-xl p-5 animate-slide-up" style={{ animationDelay: '0ms' }}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-widest font-medium">Total Revenue</p>
                <p className="text-3xl font-mono font-bold text-white mt-1 tabular-nums">
                  ₹{revenue.toLocaleString()}
                </p>
              </div>
              <div className="p-2.5 bg-white/20 rounded-full">
                <FaMoneyBillWave className="text-white text-lg" />
              </div>
            </div>
            <TrendBadge change={financialData.revenue.change} />
          </div>

          {/* Orders */}
          <div className="bg-success rounded-xl p-5 animate-slide-up" style={{ animationDelay: '60ms' }}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-widest font-medium">Completed Orders</p>
                <p className="text-3xl font-mono font-bold text-white mt-1 tabular-nums">
                  {orders.toLocaleString()}
                </p>
              </div>
              <div className="p-2.5 bg-white/20 rounded-full">
                <FaReceipt className="text-white text-lg" />
              </div>
            </div>
            <TrendBadge change={financialData.orders.change} />
          </div>

          {/* AOV */}
          <div className="bg-warning rounded-xl p-5 animate-slide-up" style={{ animationDelay: '120ms' }}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-widest font-medium">Avg Order Value</p>
                <p className="text-3xl font-mono font-bold text-white mt-1 tabular-nums">
                  ₹{aov.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="p-2.5 bg-white/20 rounded-full">
                <FaChartLine className="text-white text-lg" />
              </div>
            </div>
            <TrendBadge change={financialData.averageOrderValue.change} />
          </div>

          {/* Projected */}
          <div className="bg-accent rounded-xl p-5 animate-slide-up" style={{ animationDelay: '180ms' }}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-widest font-medium">
                  {financialData.period === 'all' ? 'Avg Monthly Revenue' : 'Est. Monthly Revenue'}
                </p>
                <p className="text-3xl font-mono font-bold text-white mt-1 tabular-nums">
                  ₹{projectedDisplay.toLocaleString()}
                </p>
              </div>
              <div className="p-2.5 bg-white/20 rounded-full">
                <FaCashRegister className="text-white text-lg" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-white/50 text-xs">
                {financialData.period === 'all' ? 'Historical average' : 'Projection based on current period'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialOverview;
