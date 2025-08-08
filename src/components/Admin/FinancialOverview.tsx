"use client";

import React from "react";
import { Bars } from "react-loader-spinner";
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

const FinancialOverview: React.FC<FinancialOverviewProps> = ({
  financialData,
  isLoading,
  onPeriodChange,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FaMoneyBillWave className="text-green-500" />
          Financial Overview
        </h2>
        <select
          className="text-sm border rounded-lg px-3 py-1.5 text-gray-600 bg-gray-50"
          onChange={onPeriodChange}
          value={financialData.period}
        >
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="7days">Last 7 days</option>
          <option value="30days">Last 30 days</option>
          <option value="month">This month</option>
        </select>
      </div>

      {isLoading ? (
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
                <p className="text-3xl font-bold text-primary/90">₹{financialData.revenue.value.toLocaleString()}</p>
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
              <span className={`text-sm font-medium ${financialData.revenue.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                {financialData.revenue.change > 0 ? "+" : ""}
                {financialData.revenue.change}%
              </span>
              <span className="text-gray-500 text-sm ml-1">vs previous period</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-50/50 rounded-xl p-6 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">Completed Orders</h3>
                <p className="text-3xl font-bold text-green-700">{financialData.orders.value}</p>
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
              <span className={`text-sm font-medium ${financialData.orders.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                {financialData.orders.change > 0 ? "+" : ""}
                {financialData.orders.change}%
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
              <span className={`text-sm font-medium ${financialData.averageOrderValue.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                {financialData.averageOrderValue.change > 0 ? "+" : ""}
                {financialData.averageOrderValue.change}%
              </span>
              <span className="text-gray-500 text-sm ml-1">vs previous period</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 rounded-xl p-6 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">Estimated Monthly Revenue</h3>
                <p className="text-3xl font-bold text-blue-700">
                  ₹{(financialData.revenue.value * (30 / (financialData.period === "7days" ? 7 : 30))).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="p-3 bg-white rounded-full shadow-sm">
                <FaCashRegister className="text-blue-600 text-xl" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-gray-500 text-sm">Projection based on current period</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialOverview;


