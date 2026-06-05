"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import Skeleton from "@/components/ui/Skeleton";

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

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Attendance: React.FC<AttendanceProps> = ({ userid }) => {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (!userid) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/attendance/staff`, { params: { userid } });
        setRecords(res.data?.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [userid]);

  // Convert any date value to a local YYYY-MM-DD string (avoids UTC shift)
  const toLocalDate = (d: string | Date | null | undefined): string => {
    if (!d) return "";
    const dt = d instanceof Date ? d : new Date(d);
    if (isNaN(dt.getTime())) return String(d).slice(0, 10);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
  };

  // Build a lookup: "YYYY-MM-DD" → status
  const statusByDate = useMemo(() => {
    const map: Record<string, string> = {};
    for (const r of records) {
      const key = toLocalDate(r.date);
      if (key) map[key] = (r.status ?? "").toLowerCase();
    }
    return map;
  }, [records]);

  // Stats for the viewed month
  const monthStats = useMemo(() => {
    const y = currentMonth.getFullYear();
    const m = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const prefix = `${y}-${m}`;
    let present = 0, absent = 0, total = 0;
    for (const [date, status] of Object.entries(statusByDate)) {
      if (!date.startsWith(prefix)) continue;
      total++;
      if (status === "present") present++;
      else if (status === "absent") absent++;
    }
    return { present, absent, unmarked: total - present - absent, total };
  }, [statusByDate, currentMonth]);

  // Build calendar grid rows
  const calendarRows = useMemo(() => {
    const y = currentMonth.getFullYear();
    const mo = currentMonth.getMonth();
    const firstWeekday = new Date(y, mo, 1).getDay();
    const daysInMonth = new Date(y, mo + 1, 0).getDate();
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    const rows: { day: number; dateStr: string; isToday: boolean; status: string }[][] = [];
    let day = 1;
    for (let r = 0; r < 6; r++) {
      const row: { day: number; dateStr: string; isToday: boolean; status: string }[] = [];
      for (let c = 0; c < 7; c++) {
        if ((r === 0 && c < firstWeekday) || day > daysInMonth) {
          row.push({ day: 0, dateStr: "", isToday: false, status: "" });
        } else {
          const dateStr = `${y}-${String(mo + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          row.push({ day, dateStr, isToday: dateStr === today, status: statusByDate[dateStr] ?? "" });
          day++;
        }
      }
      rows.push(row);
      if (day > daysInMonth) break;
    }
    return rows;
  }, [currentMonth, statusByDate]);

  const monthLabel = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const name = records[0]?.name ?? "";
  const role = records[0]?.role ?? "";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">My Attendance</h2>
          {name && (
            <p className="text-sm text-gray-500 mt-0.5 capitalize">
              {name} · <span className="font-medium">{role}</span>
            </p>
          )}
        </div>

        {/* Month stats */}
        {!loading && (
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-semibold">
              <FaCheck size={9} /> {monthStats.present} Present
            </span>
            <span className="flex items-center gap-1 bg-red-50 text-red-700 px-2.5 py-1 rounded-full font-semibold">
              <RxCross2 size={9} /> {monthStats.absent} Absent
            </span>
            {monthStats.unmarked > 0 && (
              <span className="flex items-center gap-1 bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-semibold">
                {monthStats.unmarked} Unmarked
              </span>
            )}
          </div>
        )}
      </div>

      {/* Calendar */}
      <div className="p-4 sm:p-6">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() - 1))}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <HiOutlineChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-base font-semibold text-gray-800">{monthLabel}</h3>
          <button
            onClick={() => setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() + 1))}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <HiOutlineChevronRight className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-7 gap-1.5">
            {[...Array(35)].map((_, i) => (
              <Skeleton key={i} variant="rect" height="56px" className="rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 mb-1">
              {DAYS.map(d => (
                <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Date cells */}
            <div className="grid grid-cols-7 gap-1.5">
              {calendarRows.flatMap((row, ri) =>
                row.map((cell, ci) => {
                  if (!cell.day) {
                    return <div key={`${ri}-${ci}`} className="h-14 rounded-lg" />;
                  }

                  const isPresent = cell.status === "present";
                  const isAbsent  = cell.status === "absent";
                  const hasRecord = isPresent || isAbsent;

                  return (
                    <div
                      key={cell.dateStr}
                      className={`h-14 rounded-lg flex flex-col items-center justify-center gap-1 select-none transition-all
                        ${isPresent  ? "bg-green-100 border border-green-200"  :
                          isAbsent   ? "bg-red-100   border border-red-200"    :
                          cell.isToday ? "bg-primary/8 border border-primary/20" :
                                         "bg-gray-50   border border-gray-100"}`}
                    >
                      <span className={`text-sm font-semibold leading-none
                        ${isPresent  ? "text-green-700" :
                          isAbsent   ? "text-red-600"   :
                          cell.isToday ? "text-primary"  :
                                         "text-gray-600"}`}>
                        {cell.day}
                      </span>

                      {hasRecord ? (
                        <span className={`text-[9px] font-bold uppercase tracking-wide
                          ${isPresent ? "text-green-600" : "text-red-500"}`}>
                          {isPresent ? "Present" : "Absent"}
                        </span>
                      ) : cell.isToday ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      ) : (
                        <span className="w-1 h-1 rounded-full bg-gray-200" />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center gap-5 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-green-100 border border-green-200 inline-block" />
                Present
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-red-100 border border-red-200 inline-block" />
                Absent
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-gray-50 border border-gray-100 inline-block" />
                No record
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Attendance;
