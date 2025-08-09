"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Bars } from "react-loader-spinner";

interface AttendanceRecord {
  userid: string;
  name: string;
  role: string;
  status: string | null;
  date: string;
  time: string | null;
}

interface AttendanceProps {
  userid: string;
}

const Attendance: React.FC<AttendanceProps> = ({ userid }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/attendance/staff`, {
          params: { userid },
        });
        setRecords(res.data?.data || []);
      } finally {
        setLoading(false);
      }
    };
    if (userid) fetchHistory();
  }, [userid]);

  const filtered = useMemo(() => {
    if (!search) return records;
    const s = search.toLowerCase();
    return records.filter(
      (r) =>
        r.date.includes(search) ||
        (r.status ?? "not marked").toLowerCase().includes(s) ||
        (r.time ?? "").includes(search) ||
        r.name.toLowerCase().includes(s) ||
        r.role.toLowerCase().includes(s)
    );
  }, [records, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageStart = (currentPage - 1) * pageSize;
  const pageEnd = Math.min(pageStart + pageSize, filtered.length);
  const pageData = filtered.slice(pageStart, pageEnd);

  const statusBadge = (status: string | null) => {
    const s = (status ?? "not marked").toLowerCase();
    const cls =
      s === "present"
        ? "bg-green-100 text-green-800"
        : s === "absent"
        ? "bg-red-100 text-red-800"
        : "bg-gray-100 text-gray-700";
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>{s.toUpperCase()}</span>;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-800">Attendance History</h2>
        <div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by date, status or time..."
            className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-80 focus:ring-[#1e4569] focus:border-[#1e4569]"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Bars height="50" width="50" color="#1e4569" ariaLabel="bars-loading" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pageData.length > 0 ? (
                  pageData.map((r, idx) => (
                    <tr key={`${r.userid}-${r.date}-${idx}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{r.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.time ?? "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{statusBadge(r.status)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500 text-sm">No records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium text-gray-800">{filtered.length === 0 ? 0 : pageStart + 1}</span>-
              <span className="font-medium text-gray-800">{pageEnd}</span> of
              <span className="font-medium text-gray-800"> {filtered.length}</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">Rows per page</label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-[#1e4569] focus:border-[#1e4569]"
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 bg-white disabled:opacity-50"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span></span>
                <button
                  className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 bg-white disabled:opacity-50"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Attendance;


