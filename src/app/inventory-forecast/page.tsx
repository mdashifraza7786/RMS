"use client";

import React, { useState, useEffect } from 'react';
import { FaBox, FaChartLine, FaCalendarAlt, FaDownload, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import { Bars } from 'react-loader-spinner';

interface InventoryOrderItem {
  order_id: string;
  order_name: string;
  price: number;
  quantity: number;
  date: string;
  total_amount: number;
  unit: string;
}

const InventoryForecastPage: React.FC = () => {
  const [inventoryData, setInventoryData] = useState<InventoryOrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/inventory/forecast');
      
      if (response.data.success) {
        setInventoryData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch inventory data');
      }
    } catch (err: any) {
      console.error('Error fetching inventory data:', err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const downloadCSV = () => {
    if (!inventoryData.length) return;
    
    const headers = ['Order ID', 'Item Name', 'Price', 'Quantity', 'Date', 'Total Amount', 'Unit'];
    const csvData = [
      headers.join(','),
      ...inventoryData.map(item => [
        item.order_id,
        `"${item.order_name}"`, // Wrap with quotes to handle commas in names
        item.price,
        item.quantity,
        formatDate(item.date),
        item.total_amount,
        item.unit
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_history_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <FaChartLine className="mr-2" /> Inventory Forecast
        </h1>
        <p className="text-gray-600 mt-1">
          Predict inventory needs based on historical usage patterns
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaBox className="mr-2 text-primary" /> Inventory Order History
          </h2>
          <button 
            onClick={downloadCSV}
            disabled={loading || !inventoryData.length}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaDownload size={14} />
            Export CSV
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Bars height="50" width="50" color="#4F46E5" ariaLabel="loading-indicator" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : inventoryData.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-500">
            No inventory order history found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventoryData.map((item) => (
                  <tr key={item.order_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.order_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.order_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">₹{item.total_amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
          <FaChartLine className="mr-2 text-primary" /> Forecast Analysis
        </h2>
        <p className="text-gray-600 mb-4">
          This section will display forecasting analysis based on historical inventory order data.
        </p>
        <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-500">
          Forecasting feature coming soon...
        </div>
      </div>
    </div>
  );
};

export default InventoryForecastPage;
