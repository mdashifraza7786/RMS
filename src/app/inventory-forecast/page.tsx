"use client";

import React, { useState } from 'react';
import { FaBox, FaChartLine, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import { Bars } from 'react-loader-spinner';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, CartesianGrid, Legend
} from 'recharts';

const ITEMS = ["Chicken", "Rice", "Spices", "Sugar", "Potatoes", "Milk"];

const InventoryForecastPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState(ITEMS[0]);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    setForecast([]);
    try {
      const res = await axios.get(
        `https://rms-16w6.onrender.com/forecast?item=${encodeURIComponent(selectedItem)}&days=${days}`
      );
      setForecast(res.data);
    } catch (err: any) {
      setError("Failed to fetch forecast. Please try again.");
    } finally {
      setLoading(false);
    }
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
      <div className="bg-white p-4 rounded shadow mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Item</label>
          <select
            className="border rounded px-3 py-2"
            value={selectedItem}
            onChange={e => setSelectedItem(e.target.value)}
          >
            {ITEMS.map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Days</label>
          <input
            type="number"
            min={1}
            max={60}
            className="border rounded px-3 py-2 w-24"
            value={days}
            onChange={e => setDays(Number(e.target.value))}
          />
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4 md:mt-6"
          onClick={handleFetch}
          disabled={loading}
        >
          {loading ? "Loading..." : "Get Forecast"}
        </button>
      </div>
      {loading && (
        <div className="flex justify-center my-8">
          <Bars height={40} width={40} color="#2563eb" />
        </div>
      )}
      {error && (
        <div className="text-red-600 mb-4">{error}</div>
      )}
      {forecast.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Forecasted Date</th>
                  <th className="px-4 py-2 border-b">Predicted Value</th>
                  <th className="px-4 py-2 border-b">Lower Bound</th>
                  <th className="px-4 py-2 border-b">Upper Bound</th>
                </tr>
              </thead>
              <tbody>
                {forecast.map((row, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 border-b">{row["forecasted date"]?.slice(0, 10)}</td>
                    <td className="px-4 py-2 border-b">{row["predicted value"].toFixed(2)}</td>
                    <td className="px-4 py-2 border-b">{row["yhat_lower"].toFixed(2)}</td>
                    <td className="px-4 py-2 border-b">{row["yhat_upper"].toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="my-8">
            <h2 className="text-lg font-semibold mb-2">Forecast Chart</h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={forecast} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="forecasted date" tickFormatter={(d: any) => d.slice(5, 10)} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="yhat_upper"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.15}
                  name="Upper Bound"
                />
                <Area
                  type="monotone"
                  dataKey="yhat_lower"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.15}
                  name="Lower Bound"
                />
                <Line
                  type="monotone"
                  dataKey="predicted value"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                  name="Predicted"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default InventoryForecastPage;
