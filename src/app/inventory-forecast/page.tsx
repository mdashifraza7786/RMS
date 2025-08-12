"use client";

import React, { useMemo, useState } from 'react';
import { FaChartLine, FaFilter, FaMoneyBillWave } from 'react-icons/fa';
import axios from 'axios';
import { Bars } from 'react-loader-spinner';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  CartesianGrid,
  Legend
} from 'recharts';

const ITEMS = ["Chicken", "Rice", "Spices", "Sugar", "Potatoes", "Milk"];

const InventoryForecastPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState(ITEMS[0]);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  // Revenue forecast state
  const [revDays, setRevDays] = useState(7);
  const [revLoading, setRevLoading] = useState(false);
  const [revForecast, setRevForecast] = useState<any[]>([]);
  const [revError, setRevError] = useState<string | null>(null);
  // Mode toggle
  const [mode, setMode] = useState<'inventory' | 'revenue'>('inventory');

  const handleFetchInventory = async () => {
    setLoading(true);
    setError(null);
    setForecast([]);
    try {
      const res = await axios.get(
        `https://rms-16w6.onrender.com/forecast?item=${encodeURIComponent(selectedItem)}&days=${days}`
      );
      setForecast(res.data);
    } catch (err: any) {
      setError('Failed to fetch forecast. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const hasData = forecast && Array.isArray(forecast) && forecast.length > 0;
  const summary = useMemo(() => {
    if (!hasData) return null;
    const mid = Math.round(forecast.reduce((acc, r) => acc + (Number(r['predicted value']) || 0), 0) / forecast.length);
    const min = Math.min(...forecast.map((r) => Number(r['yhat_lower']) || 0));
    const max = Math.max(...forecast.map((r) => Number(r['yhat_upper']) || 0));
    return { mid, min, max };
  }, [forecast, hasData]);

  // Revenue forecast handlers
  const handleFetchRevenue = async () => {
    setRevLoading(true);
    setRevError(null);
    setRevForecast([]);
    try {
      const res = await axios.get(`https://rms-16w6.onrender.com/revenue-forecast?days=${revDays}`);
      const data = res.data;
      const list = Array.isArray(data) ? data : Array.isArray(data?.forecast) ? data.forecast : [];
      setRevForecast(list);
    } catch (err: any) {
      setRevError('Failed to fetch revenue forecast. Please try again.');
    } finally {
      setRevLoading(false);
    }
  };

  const hasRevData = revForecast && Array.isArray(revForecast) && revForecast.length > 0;
  const revSummary = useMemo(() => {
    if (!hasRevData) return null;
    const mid = Math.round(revForecast.reduce((acc, r) => acc + (Number(r['predicted revenue']) || 0), 0) / revForecast.length);
    const min = Math.min(...revForecast.map((r) => Number(r['yhat_lower']) || 0));
    const max = Math.max(...revForecast.map((r) => Number(r['yhat_upper']) || 0));
    return { mid, min, max };
  }, [revForecast, hasRevData]);

  const title = mode === 'inventory' ? 'Inventory Forecast' : 'Revenue Forecast';
  const subtitle = mode === 'inventory'
    ? 'Predict inventory needs based on historical usage'
    : 'Forecast revenue based on paid invoices';

  return (
    <div className="container mx-auto px-6 pt-4 pb-8">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <FaChartLine /> {title}
        </h1>
        <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
      </header>

      {/* Mode toggle */}
      <div className="sticky top-[64px] z-30 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border border-gray-100 rounded-xl shadow-sm mb-4">
        <div className="p-2 flex gap-2">
          <button
            onClick={() => setMode('inventory')}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              mode === 'inventory' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-pressed={mode === 'inventory'}
          >
            Inventory
          </button>
          <button
            onClick={() => setMode('revenue')}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              mode === 'revenue' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-pressed={mode === 'revenue'}
          >
            Revenue
          </button>
        </div>
      </div>

      {/* Inventory Controls */}
      {mode === 'inventory' && (
      <section className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 flex flex-col gap-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">
                <FaFilter className="inline mr-1" /> Item
              </label>
              <select
                className="p-2 border border-gray-200 rounded-md cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full"
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
              >
                {ITEMS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">
                Days (1-60)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={60}
                  className="p-2 border border-gray-200 rounded-md w-28 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={days}
                  onChange={(e) => setDays(Math.max(1, Math.min(60, Number(e.target.value))))}
                />
                <div className="flex gap-1">
                  {[7, 14, 30].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDays(d)}
                      className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                        days === d ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleFetchInventory}
                disabled={loading}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-white transition shadow-sm ${
                  loading ? 'bg-primary/60 cursor-not-allowed' : 'bg-primary hover:bg-primary/80'
                }`}
              >
                {loading ? 'Loading…' : 'Get Inventory Forecast'}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded bg-red-50 text-red-700 text-sm p-3 border border-red-100">{error}</div>
          )}
        </div>
      </section>
      )}

      {/* Loading */}
      {mode === 'inventory' && loading && (
        <div className="flex justify-center items-center py-10">
          <Bars height={48} width={48} color="#00589C" />
        </div>
      )}

      {/* Revenue Controls */}
      {mode === 'revenue' && (
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
        <div className="p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><FaMoneyBillWave /> Revenue Forecast</h2>
              <p className="text-xs text-gray-500">Forecast revenue based on paid invoices</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Days (1-60)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={60}
                  className="p-2 border border-gray-200 rounded-md w-28 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={revDays}
                  onChange={(e) => setRevDays(Math.max(1, Math.min(60, Number(e.target.value))))}
                />
                <div className="flex gap-1">
                  {[7, 14, 30].map((d) => (
                    <button
                      key={d}
                      onClick={() => setRevDays(d)}
                      className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                        revDays === d ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={handleFetchRevenue}
              disabled={revLoading}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-white transition shadow-sm ${
                revLoading ? 'bg-primary/60 cursor-not-allowed' : 'bg-primary hover:bg-primary/80'
              }`}
            >
              {revLoading ? 'Loading…' : 'Get Revenue Forecast'}
            </button>
          </div>

          {revError && (
            <div className="rounded bg-red-50 text-red-700 text-sm p-3 border border-red-100">{revError}</div>
          )}
        </div>
      </section>
      )}

      {mode === 'revenue' && revLoading && (
        <div className="flex justify-center items-center py-10">
          <Bars height={48} width={48} color="#00589C" />
        </div>
      )}

      {/* Revenue Results */}
      {mode === 'revenue' && hasRevData && (
        <>
          {revSummary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="text-xs text-gray-500">Expected Avg Revenue</div>
                <div className="text-2xl font-semibold text-gray-800 mt-1">₹ {revSummary.mid.toLocaleString('en-IN')}</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="text-xs text-gray-500">Lower Bound</div>
                <div className="text-2xl font-semibold text-gray-800 mt-1">₹ {revSummary.min.toLocaleString('en-IN')}</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="text-xs text-gray-500">Upper Bound</div>
                <div className="text-2xl font-semibold text-gray-800 mt-1">₹ {revSummary.max.toLocaleString('en-IN')}</div>
              </div>
            </div>
          )}

          {/* Chart card (stacked) */}
          <section className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Revenue Forecast Chart</h2>
                <ResponsiveContainer width="100%" height={380}>
                  <LineChart data={revForecast} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="forecasted date" tickFormatter={(d: any) => (typeof d === 'string' ? d.slice(5, 10) : d)} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="yhat_upper" stroke="#50E3C2" fill="#50E3C2" fillOpacity={0.15} name="Upper Bound" />
                    <Area type="monotone" dataKey="yhat_lower" stroke="#3AC0DA" fill="#3AC0DA" fillOpacity={0.15} name="Lower Bound" />
                    <Line type="monotone" dataKey="predicted revenue" stroke="#1891C3" strokeWidth={2} dot={false} name="Predicted Revenue" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
          </section>

          {/* Table card (stacked) */}
          <section className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Revenue Forecast Details</h2>
                
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Predicted Revenue</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lower</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upper</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {revForecast.map((row, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2 text-sm">{row['forecasted date']?.slice(0, 10)}</td>
                          <td className="px-4 py-2 text-sm">₹ {Number(row['predicted revenue']).toFixed(2)}</td>
                          <td className="px-4 py-2 text-sm">₹ {Number(row['yhat_lower']).toFixed(2)}</td>
                          <td className="px-4 py-2 text-sm">₹ {Number(row['yhat_upper']).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Mobile Card View */}
                <div className="md:hidden">
                  <div className="space-y-4">
                    {revForecast.map((row, idx) => (
                      <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 p-3">
                          <div className="font-medium text-gray-800">{row['forecasted date']?.slice(0, 10)}</div>
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Predicted Revenue</span>
                            <span className="text-sm font-medium">₹ {Number(row['predicted revenue']).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Lower Bound</span>
                            <span className="text-sm">₹ {Number(row['yhat_lower']).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Upper Bound</span>
                            <span className="text-sm">₹ {Number(row['yhat_upper']).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
          </section>
        </>
      )}
      {/* Inventory Results (Dashboard-style layout) */}
      {mode === 'inventory' && hasData && (
        <>
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="text-xs text-gray-500">Expected Avg</div>
                <div className="text-2xl font-semibold text-gray-800 mt-1">{summary.mid}</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="text-xs text-gray-500">Lower Bound</div>
                <div className="text-2xl font-semibold text-gray-800 mt-1">{summary.min}</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="text-xs text-gray-500">Upper Bound</div>
                <div className="text-2xl font-semibold text-gray-800 mt-1">{summary.max}</div>
              </div>
            </div>
          )}

          {/* Chart card (stacked) */}
          <section className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Forecast Chart</h2>
                <ResponsiveContainer width="100%" height={380}>
                  <LineChart data={forecast} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="forecasted date" tickFormatter={(d: any) => (typeof d === 'string' ? d.slice(5, 10) : d)} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="yhat_upper" stroke="#50E3C2" fill="#50E3C2" fillOpacity={0.15} name="Upper Bound" />
                    <Area type="monotone" dataKey="yhat_lower" stroke="#3AC0DA" fill="#3AC0DA" fillOpacity={0.15} name="Lower Bound" />
                    <Line type="monotone" dataKey="predicted value" stroke="#00589C" strokeWidth={2} dot={false} name="Predicted" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
          </section>

          {/* Table card (stacked) */}
          <section className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Forecast Details</h2>
                
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Predicted</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lower</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upper</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {forecast.map((row, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2 text-sm">{row['forecasted date']?.slice(0, 10)}</td>
                          <td className="px-4 py-2 text-sm">{Number(row['predicted value']).toFixed(2)}</td>
                          <td className="px-4 py-2 text-sm">{Number(row['yhat_lower']).toFixed(2)}</td>
                          <td className="px-4 py-2 text-sm">{Number(row['yhat_upper']).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Mobile Card View */}
                <div className="md:hidden">
                  <div className="space-y-4">
                    {forecast.map((row, idx) => (
                      <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 p-3">
                          <div className="font-medium text-gray-800">{row['forecasted date']?.slice(0, 10)}</div>
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Predicted</span>
                            <span className="text-sm font-medium">{Number(row['predicted value']).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Lower Bound</span>
                            <span className="text-sm">{Number(row['yhat_lower']).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Upper Bound</span>
                            <span className="text-sm">{Number(row['yhat_upper']).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
        </>
      )}
    </div>
  );
};

export default InventoryForecastPage;
