"use client";
import React, { useState, useEffect } from 'react';
import { FaCheck, FaSearch } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { FiRefreshCcw } from "react-icons/fi";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import { MdOutlineCalendarMonth } from "react-icons/md";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Skeleton from '@/components/ui/Skeleton';
import { useSession } from 'next-auth/react';
import AttendanceHistory from '@/components/Attendance';
import PageHeader from '@/components/PageHeader';

interface AttendanceItem {
    userid: string;
    name: string;
    role: string;
    status: string;
    date: string;
    time: string | null;
}

const ROLE_COLOR: Record<string, string> = {
    admin:  'bg-purple-100 text-purple-700',
    chef:   'bg-amber-100  text-amber-700',
    waiter: 'bg-blue-100   text-blue-700',
    washer: 'bg-gray-100   text-gray-700',
};

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const Page: React.FC = () => {
    const [searchQuery, setSearchQuery]     = useState('');
    const [activeTab, setActiveTab]         = useState('All');
    const [loading, setLoading]             = useState(false);
    const [attendanceLoading, setAttendanceLoading] = useState(false);
    const [attendanceData, setAttendanceData] = useState<AttendanceItem[]>([]);
    const [today, setToday]                 = useState('');
    const [selectedDate, setSelectedDate]   = useState('');
    const [currentMonth, setCurrentMonth]   = useState(new Date());
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [updatingId, setUpdatingId]       = useState<string | null>(null);

    const { data: session } = useSession();
    const role   = session?.user?.role;
    const userid = session?.user?.userid;

    // ── Fetch helpers ──────────────────────────────────────────────
    const fetchByDate = async (date: string) => {
        setAttendanceLoading(true);
        try {
            const body = (role === 'waiter' || role === 'chef')
                ? { byDate: date, userid, role }
                : { byDate: date };
            const res = await axios.post('/api/attendance/byDate', body);
            setAttendanceData(res.data.data || []);
        } catch {
            toast.error('Failed to fetch attendance.');
        } finally {
            setAttendanceLoading(false);
        }
    };

    const handleGenerateAttendance = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/attendance/generate');
            setAttendanceData(res.data.data || []);
            toast.success('Attendance generated successfully.');
        } catch {
            toast.error('Failed to generate attendance.');
        } finally {
            setLoading(false);
        }
    };

    const giveAttendance = async (id: string, status: string) => {
        setUpdatingId(id);
        const prev = attendanceData;
        setAttendanceData(list =>
            list.map(item =>
                item.userid === id
                    ? { ...item, status: item.status === status ? '' : status }
                    : item
            )
        );
        try {
            await axios.post('/api/attendance/updateAttendence', { userid: id, status, date: today });
            toast.success(`Marked as ${status}`);
        } catch {
            setAttendanceData(prev);
            toast.error('Failed to update attendance');
        } finally {
            setUpdatingId(null);
        }
    };

    // ── Init ───────────────────────────────────────────────────────
    useEffect(() => {
        const n = new Date();
        const todayStr = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
        setToday(todayStr);
        setSelectedDate(todayStr);
        document.title = 'Staff Attendance';

        const init = async () => {
            setAttendanceLoading(true);
            try {
                const params = (role === 'waiter' || role === 'chef') ? { userid, role } : {};
                const res = await axios.get('/api/attendance', { params });
                setAttendanceData(res.data.data?.records || []);
                if (Array.isArray(res.data.availableDates)) {
                    // Dates from the API are already YYYY-MM-DD strings (DATE_FORMAT in SQL)
                    setAvailableDates(res.data.availableDates.filter(Boolean));
                }
            } catch {
                toast.error('Failed to fetch attendance.');
            } finally {
                setAttendanceLoading(false);
            }
        };
        init();
    }, [role, userid]);

    // Re-fetch whenever selected date changes (skip on first render — init handles it)
    const [firstRender, setFirstRender] = useState(true);
    useEffect(() => {
        if (firstRender) { setFirstRender(false); return; }
        if (selectedDate) fetchByDate(selectedDate);
    }, [selectedDate]);

    // ── Calendar helpers ───────────────────────────────────────────
    const buildCalendarDays = () => {
        const year  = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstWeekday = new Date(year, month, 1).getDay();
        const daysInMonth  = new Date(year, month + 1, 0).getDate();
        const rows: ({ day: number; dateStr: string } | null)[][] = [];
        let day = 1;
        for (let r = 0; r < 6; r++) {
            const row: ({ day: number; dateStr: string } | null)[] = [];
            for (let c = 0; c < 7; c++) {
                if ((r === 0 && c < firstWeekday) || day > daysInMonth) {
                    row.push(null);
                } else {
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    row.push({ day, dateStr });
                    day++;
                }
            }
            rows.push(row);
            if (day > daysInMonth) break;
        }
        return rows;
    };

    // ── Filter ─────────────────────────────────────────────────────
    const filtered = (Array.isArray(attendanceData) ? attendanceData : []).filter(item => {
        const matchSearch =
            item.userid.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchTab =
            activeTab === 'All'         ? true :
            activeTab === 'Present'     ? item.status === 'present' :
            activeTab === 'Absent'      ? item.status === 'absent' :
            activeTab === 'Not Marked'  ? !item.status :
            activeTab === 'Chef'        ? item.role === 'chef' :
            activeTab === 'Waiter'      ? item.role === 'waiter' : true;
        return matchSearch && matchTab;
    });

    const tabs = [
        { id: 'All',        label: 'All Staff' },
        { id: 'Present',    label: 'Present' },
        { id: 'Absent',     label: 'Absent' },
        { id: 'Not Marked', label: 'Not Marked' },
        { id: 'Chef',       label: 'Chefs' },
        { id: 'Waiter',     label: 'Waiters' },
    ];

    const calendarRows = buildCalendarDays();
    const monthLabel = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const selectedLabel = selectedDate
        ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        : '';

    const presentCount  = filtered.filter(i => i.status === 'present').length;
    const absentCount   = filtered.filter(i => i.status === 'absent').length;
    const unmarkedCount = filtered.filter(i => !i.status).length;

    // ── Waiter / Chef personal view ────────────────────────────────
    if (role === 'waiter' || role === 'chef') {
        return (
            <>
                <ToastContainer position="top-right" autoClose={3000} />
                <div className="px-6 lg:px-10 pb-8">
                    <PageHeader title="My Attendance" subtitle="Daily attendance tracking" accent="accent" />
                    <AttendanceHistory userid={userid as string} />
                </div>
            </>
        );
    }

    // ── Admin view ─────────────────────────────────────────────────
    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="px-6 lg:px-10 pb-8">
                <PageHeader
                    title="Attendance"
                    subtitle="Daily staff attendance tracking"
                    accent="accent"
                    action={
                        <button
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                selectedDate === today
                                    ? 'bg-primary text-white hover:bg-primaryhover'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                            onClick={handleGenerateAttendance}
                            disabled={selectedDate !== today || loading}
                        >
                            <FiRefreshCcw className={loading ? 'animate-spin' : ''} />
                            {loading ? 'Generating…' : 'Generate Attendance'}
                        </button>
                    }
                />
                <div>

                {/* Main two-column layout */}
                <div className="flex flex-col lg:flex-row gap-5">

                    {/* ── Left: Calendar ──────────────────────────── */}
                    <div className="w-full lg:w-72 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Month navigation */}
                            <div className="bg-primary text-white px-4 py-3 flex items-center justify-between">
                                <button
                                    onClick={() => setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() - 1))}
                                    className="p-1 rounded hover:bg-white/20 transition-colors"
                                >
                                    <HiOutlineChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="font-semibold text-sm">{monthLabel}</span>
                                <button
                                    onClick={() => setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() + 1))}
                                    className="p-1 rounded hover:bg-white/20 transition-colors"
                                >
                                    <HiOutlineChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Day headers */}
                            <div className="grid grid-cols-7 border-b border-gray-100">
                                {DAYS.map(d => (
                                    <div key={d} className="h-8 flex items-center justify-center text-xs font-semibold text-gray-400">
                                        {d}
                                    </div>
                                ))}
                            </div>

                            {/* Date cells */}
                            <div className="p-1">
                                {calendarRows.map((row, ri) => (
                                    <div key={ri} className="grid grid-cols-7">
                                        {row.map((cell, ci) => {
                                            if (!cell) return <div key={ci} className="h-9" />;
                                            const isSelected = cell.dateStr === selectedDate;
                                            const isToday    = cell.dateStr === today;
                                            const hasData    = availableDates.includes(cell.dateStr);
                                            return (
                                                <button
                                                    key={ci}
                                                    onClick={() => setSelectedDate(cell.dateStr)}
                                                    className={`h-9 w-full flex flex-col items-center justify-center rounded-lg text-sm font-medium transition-all relative
                                                        ${isSelected ? 'bg-primary text-white shadow-sm' :
                                                          isToday    ? 'bg-primary/10 text-primary' :
                                                                       'text-gray-700 hover:bg-gray-50'}`}
                                                >
                                                    {cell.day}
                                                    {hasData && (
                                                        <span className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-primary'}`} />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>

                            {/* Legend */}
                            <div className="px-3 py-2 border-t border-gray-100 flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-primary inline-block" /> Has records
                                </span>
                                <button
                                    className="ml-auto text-primary font-medium hover:underline"
                                    onClick={() => { setSelectedDate(today); setCurrentMonth(new Date()); }}
                                >
                                    Today
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Attendance grid ───────────────────── */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                            {/* Date heading + stats */}
                            <div className="px-5 pt-5 pb-4 border-b border-gray-100">
                                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-0.5">Selected Date</p>
                                        <h2 className="text-lg font-semibold text-gray-800">{selectedLabel}</h2>
                                    </div>
                                    {!attendanceLoading && filtered.length > 0 && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium">
                                                <FaCheck size={10} /> {presentCount} Present
                                            </span>
                                            <span className="flex items-center gap-1.5 bg-red-50 text-red-700 px-2.5 py-1 rounded-full font-medium">
                                                <RxCross2 size={10} /> {absentCount} Absent
                                            </span>
                                            {unmarkedCount > 0 && (
                                                <span className="flex items-center gap-1.5 bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">
                                                    {unmarkedCount} Unmarked
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Search + filter tabs */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                    <div className="relative flex-shrink-0">
                                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                        <input
                                            type="search"
                                            placeholder="Search name or ID…"
                                            className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {tabs.map(tab => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                                                    activeTab === tab.id
                                                        ? 'bg-accent text-white shadow-sm'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Cards */}
                            <div className="p-5">
                                {attendanceLoading ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                                        {[...Array(10)].map((_, i) => (
                                            <Skeleton key={i} variant="rect" height="140px" className="rounded-xl" />
                                        ))}
                                    </div>
                                ) : filtered.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                        <MdOutlineCalendarMonth size={48} className="mb-3 opacity-30" />
                                        <p className="font-medium text-gray-500">No attendance records</p>
                                        <p className="text-sm mt-1">
                                            {selectedDate === today
                                                ? 'Click "Generate Attendance" to create today\'s records.'
                                                : 'No data found for this date.'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                                        {filtered.map((item, idx) => {
                                            const isPresent  = item.status === 'present';
                                            const isAbsent   = item.status === 'absent';
                                            const initial    = item.name?.charAt(0)?.toUpperCase() || '?';
                                            const isToday    = selectedDate === today;
                                            const isUpdating = updatingId === item.userid;

                                            return (
                                                <div
                                                    key={idx}
                                                    className={`relative rounded-xl border p-3 flex flex-col items-center gap-2 transition-all ${
                                                        isUpdating ? 'opacity-60 pointer-events-none border-gray-200 bg-gray-50' :
                                                        isPresent  ? 'border-green-200 bg-green-50/40' :
                                                        isAbsent   ? 'border-red-200   bg-red-50/40'   :
                                                                     'border-gray-100  bg-white'
                                                    }`}
                                                >
                                                    {/* Avatar */}
                                                    <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-sm ${
                                                        isPresent ? 'bg-green-500' :
                                                        isAbsent  ? 'bg-red-400'   :
                                                                    'bg-gray-300'
                                                    }`}>
                                                        {initial}
                                                    </div>

                                                    {/* Name */}
                                                    <div className="text-center w-full">
                                                        <p className="text-xs font-semibold text-gray-800 leading-tight truncate" title={item.name}>
                                                            {item.name}
                                                        </p>
                                                        <span className={`inline-block mt-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full capitalize ${ROLE_COLOR[item.role] || ROLE_COLOR.washer}`}>
                                                            {item.role}
                                                        </span>
                                                    </div>

                                                    {/* Status badge */}
                                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full w-full text-center ${
                                                        isPresent ? 'bg-green-100 text-green-700' :
                                                        isAbsent  ? 'bg-red-100   text-red-700'   :
                                                                    'bg-gray-100  text-gray-500'
                                                    }`}>
                                                        {isPresent ? '✓ PRESENT' : isAbsent ? '✗ ABSENT' : '— N/A'}
                                                    </span>

                                                    {/* Action buttons — only for today */}
                                                    {isToday && (
                                                        <div className="flex gap-1.5 w-full">
                                                            {isUpdating ? (
                                                                <div className="w-full flex items-center justify-center py-1">
                                                                    <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                                                    </svg>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <button
                                                                        disabled={isPresent}
                                                                        onClick={() => giveAttendance(item.userid, 'present')}
                                                                        className={`flex-1 py-1 rounded-md text-[11px] font-semibold transition-all ${
                                                                            isPresent
                                                                                ? 'bg-green-500 text-white cursor-not-allowed'
                                                                                : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                                                                        }`}
                                                                    >
                                                                        <FaCheck className="inline mr-0.5" size={8} />P
                                                                    </button>
                                                                    <button
                                                                        disabled={isAbsent}
                                                                        onClick={() => giveAttendance(item.userid, 'absent')}
                                                                        className={`flex-1 py-1 rounded-md text-[11px] font-semibold transition-all ${
                                                                            isAbsent
                                                                                ? 'bg-red-500 text-white cursor-not-allowed'
                                                                                : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                                                                        }`}
                                                                    >
                                                                        <RxCross2 className="inline mr-0.5" size={8} />A
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </>
    );
};

export default Page;
