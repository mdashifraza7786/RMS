"use client";
import React, { useState, useEffect } from 'react';
import { FaCheck, FaCalendarAlt, FaSearch } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { FiRefreshCcw } from "react-icons/fi";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bars } from 'react-loader-spinner';
import { useSession } from 'next-auth/react';
import AttendanceHistory from '@/components/Attendance';

interface AttendanceItem {
    userid: string;
    name: string;
    role: string;
    status: string;
    date: string;
    time: string | null;
}
interface AvailableDate {
    minDate: string;
    maxDate: string;
}

const Page: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string>('All');
    const [loading, setLoading] = useState<boolean>(false);
    const [attendanceloading, setAttendanceloading] = useState<boolean>(false);
    const [attendanceData, setAttendanceData] = useState<AttendanceItem[]>([]);
    const [filteredData, setFilteredData] = useState<AttendanceItem[]>([]);
    const [today, setToday] = useState<string>('');
    const [getdate, setGetdate] = useState<string>('');
    const [availableDate, setAvaiableDate] = useState<AvailableDate>({
        minDate: '',
        maxDate: ''
    });
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [showCalendar, setShowCalendar] = useState<boolean>(false);
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const { data: session } = useSession();
    const role = session?.user?.role;
    const userid = session?.user?.userid;

    const giveAttendance = async (id: string, status: string, type: string) => {
        setAttendanceData(prevData => {
            return prevData.map(item => {
                if (item.userid === id) {
                    if (item.status === status) {
                        return { ...item, status: '' };
                    }
                    return { ...item, status: status };
                }
                return item;
            });
        });
        if (type === "update") {
            try {
            await axios.post("/api/attendance/updateAttendence", {
                userid: id,
                status: status,
                date: today
            });
                toast.success(`Attendance ${status === 'present' ? 'marked as present' : 'marked as absent'}`);
            } catch (error) {
                toast.error('Failed to update attendance');
            }
        }
    };

    const handleGenerateAttendance = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/attendance/generate");

            if (response.status === 500 || response.status === 209) {
                toast.error(response.data.message);
            } else {
                const data = response.data.data || [];
                setAttendanceData(data);
                toast.success("Attendance generated successfully.");
            }
        } catch (error) {
            toast.error('Failed to generate attendance.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const getAttendanceByDate = async () => {
            setAttendanceloading(true);

            try {
                let response;
                if(role === 'waiter' || role === 'chef'){
                    response = await axios.post("/api/attendance/byDate", {
                        byDate: getdate,
                        userid: userid,
                        role: role
                    });
                }else{
                    response = await axios.post("/api/attendance/byDate", {
                        byDate: getdate
                    });
                }

                if (response.status === 500 || response.status === 209) {
                    toast.error(response.data.message);
                } else {
                    const data = response.data.data || [];
                    setAttendanceData(data);
                }
            } catch (error) {
                toast.error('Failed to fetch attendance.');
            } finally {
                setAttendanceloading(false);
            }
        };

        if (getdate) {
            getAttendanceByDate();
        }
    }, [getdate]);

    useEffect(() => {
        const filtered = attendanceData.filter(item =>
            (activeTab === 'All' || item.role === activeTab || 
             (activeTab === 'Present' && item.status === 'present') || 
             (activeTab === 'Absent' && item.status === 'absent') || 
             (activeTab === 'Chef' && item.role === 'chef') ||
             (activeTab === 'Waiter' && item.role === 'waiter') ||
             (activeTab === 'Not Marked' && item.status === null)) &&
            (item.userid.toLowerCase().includes(searchQuery.toLowerCase()) || 
             item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setFilteredData(filtered);
    }, [attendanceData, searchQuery, activeTab]);

    useEffect(() => {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];
        setToday(formattedDate);
        setGetdate(formattedDate);

        const fetchTodayAttendance = async () => {
            setAttendanceloading(true);
            try {
                let response;
                if(role === 'waiter' || role === 'chef'){
                    response = await axios.get("/api/attendance", {
                        params: {
                            userid: userid,
                            role: role
                        }
                    });
                }else{
                    response = await axios.get("/api/attendance");
                }
                
                if (response.status === 500 || response.status === 209) {
                    toast.error(response.data.message);
                } else {
                    const data = response.data.data || [];
                    setAttendanceData(data);
        
                    const formatDate = (date: string | null | undefined) => 
                        date ? new Date(date).toISOString().split('T')[0] : formattedDate;
        
                    const dates: AvailableDate = {
                        minDate: formatDate(response.data.minDate),
                        maxDate: formatDate(response.data.maxDate)
                    };
        
                    setAvaiableDate(dates);
                    
                    if (response.data.availableDates && Array.isArray(response.data.availableDates)) {
                        const formattedDates = response.data.availableDates.map((date: string) => {
                            if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                                return date;
                            }
                            return new Date(date).toISOString().split('T')[0];
                        });
                        
                        setAvailableDates(formattedDates);
                    } else {
                    }
                }
            } catch (error) {
                toast.error('Failed to fetch attendance.');
            } finally {
                setAttendanceloading(false);
            }
        };
        
        fetchTodayAttendance();
        document.title = "Staff Attendance";
    }, []);

    const hasAttendanceRecords = (date: string) => {
        return Array.isArray(availableDates) && availableDates.some(d => d === date);
    };

    const formatDisplayDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    };

    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        const startingDay = firstDay.getDay();
        
        const monthLength = lastDay.getDate();
        
        
        const days = [];
        let day = 1;
        
        const maxDateObj = availableDate.maxDate ? new Date(availableDate.maxDate) : new Date();
        
        const totalRows = 6;
        
        for (let i = 0; i < totalRows; i++) {
            const row = [];
            for (let j = 0; j < 7; j++) {
                if ((i === 0 && j < startingDay) || day > monthLength) {
                    row.push(null);
                } else {
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    
                    const hasRecords = hasAttendanceRecords(dateStr);
                    
                    row.push({
                        day,
                        dateStr,
                        isToday: dateStr === today,
                        isSelected: dateStr === getdate,
                        isInRange: true,
                        hasRecords
                    });
                    day++;
                }
            }
            days.push(row);
        }
        
        return (
            <div className="bg-white border border-gray-200 shadow-lg rounded-lg w-[320px] h-[380px] flex flex-col">
                <div className="bg-[#1e4569] text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
                    <button 
                        className="p-1 hover:bg-[#2c5983] rounded text-white transition-colors"
                        onClick={() => {
                            const newDate = new Date(currentMonth);
                            newDate.setMonth(newDate.getMonth() - 1);
                            setCurrentMonth(newDate);
                        }}
                    >
                        <HiOutlineChevronLeft className="h-5 w-5" />
                    </button>
                    <div className="font-medium text-center">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                    <button 
                        className="p-1 hover:bg-[#2c5983] rounded text-white transition-colors"
                        onClick={() => {
                            const newDate = new Date(currentMonth);
                            newDate.setMonth(newDate.getMonth() + 1);
                            setCurrentMonth(newDate);
                        }}
                    >
                        <HiOutlineChevronRight className="h-5 w-5" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-hidden">
                    <div className="grid grid-cols-7 border-b">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((dayName, i) => (
                            <div key={i} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
                                {dayName}
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex-1">
                        {days.map((row, rowIndex) => (
                            <div key={rowIndex} className="grid grid-cols-7 h-[52px]">
                                {row.map((cell, cellIndex) => {
                                    if (!cell) {
                                        return <div key={cellIndex} className="border-r border-b last:border-r-0 bg-gray-50"></div>;
                                    }
                                    
                                    let cellClasses = "border-r border-b last:border-r-0 p-1 flex flex-col items-center justify-start relative";
                                    
                                    const isClickable = cell.hasRecords || (new Date(cell.dateStr) <= maxDateObj && cell.dateStr === today) || cell.hasRecords;
                                    
                                    if (cell.isSelected) {
                                        cellClasses += " bg-[#1e4569] text-white";
                                    } else if (cell.isToday) {
                                        cellClasses += " bg-blue-50";
                                    } else if (isClickable) {
                                        cellClasses += " hover:bg-blue-50 cursor-pointer";
                                    } else {
                                        cellClasses += " text-gray-400 cursor-not-allowed";
                                    }
                                    
                                    return (
                                        <div 
                                            key={cellIndex}
                                            className={cellClasses}
                                        onClick={() => {
                                                if (isClickable) {
                                                    setGetdate(cell.dateStr);
                                                    setShowCalendar(false);
                                                }
                                            }}
                                        >
                                            <span className="text-sm">{cell.day}</span>
                                            {cell.hasRecords && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1"></div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="p-3 border-t flex justify-between items-center">
                    <button 
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded transition-colors"
                        onClick={() => {
                            setGetdate(today);
                            setCurrentMonth(new Date());
                        }}
                    >
                        Today
                    </button>
                    <button 
                        className="px-3 py-1.5 bg-[#1e4569] hover:bg-[#2c5983] text-white text-xs font-medium rounded transition-colors"
                        onClick={() => setShowCalendar(false)}
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    };

    const CalendarModal = () => {
        if (!showCalendar) return null;
        
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fadeIn">
                <div className="relative animate-scaleIn">
                    {renderCalendar()}
                </div>
            </div>
        );
    };

    const tabs = [
        { id: 'All', label: 'All Staff' },
        { id: 'Present', label: 'Present' },
        { id: 'Absent', label: 'Absent' },
        { id: 'Not Marked', label: 'Not Marked' },
        { id: 'Chef', label: 'Chefs' },
        { id: 'Waiter', label: 'Waiters' }
    ];

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="container mx-auto px-6 pt-4 pb-8">
                <div className="py-4">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-semibold text-gray-800">Staff Attendance</h1>
                    </div>
                </div>
                {(role === 'waiter' || role === 'chef') ? (
                  <AttendanceHistory userid={userid as string} />
                ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                            <div className="flex flex-wrap gap-4 items-center">
                                <button
                                    className="inline-flex items-center px-4 py-2 bg-[#1e4569]/10 hover:bg-[#1e4569]/15 text-[#1e4569] rounded-lg transition-colors"
                                    onClick={() => setShowCalendar(true)}
                                >
                                    <FaCalendarAlt className="mr-2" />
                                    <span className="font-medium">{formatDisplayDate(getdate)}</span>
                                </button>

                                <button 
                                    className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                                        getdate === today 
                                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                    onClick={handleGenerateAttendance}
                                    disabled={getdate !== today || loading}
                                >
                                    <FiRefreshCcw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                                    {loading ? 'Generating...' : 'Generate Attendance'}
                                </button>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="text-gray-400" />
                                </div>
                                <input
                                    type="search"
                                    placeholder="Search by ID or name..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#1e4569] focus:border-[#1e4569] w-full md:w-80"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 border-b border-gray-200 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${activeTab === tab.id
                                        ? 'text-[#1e4569] border-b-2 border-[#1e4569] bg-[#1e4569]/5'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {attendanceloading ? (
                            <div className="flex justify-center items-center py-12">
                                <Bars height="50" width="50" color="#1e4569" ariaLabel="bars-loading" />
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200 table-fixed">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="w-24 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="w-48 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="w-48 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="w-36 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                            </tr>
                        </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredData.length > 0 ? (
                                        filteredData.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {item.userid}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.role}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {item.status === 'present' ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            PRESENT
                                                        </span>
                                        ) : item.status === 'absent' ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            ABSENT
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                            NOT MARKED
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                    <div className="flex justify-center space-x-2">
                                                        <button
                                                            disabled={getdate !== today || item.status === 'present'}
                                                            onClick={() => giveAttendance(item.userid, 'present', 'update')}
                                                            className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium ${
                                                                item.status === 'present'
                                                                    ? 'bg-green-500 text-white cursor-not-allowed'
                                                                    : getdate !== today
                                                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                                                            } transition-colors`}
                                                        >
                                                            <FaCheck className="mr-1" />
                                                            Present
                                                        </button>
                                                        
                                                        <button
                                                            disabled={getdate !== today || item.status === 'absent'}
                                                            onClick={() => giveAttendance(item.userid, 'absent', 'update')}
                                                            className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium ${
                                                                item.status === 'absent'
                                                                    ? 'bg-red-500 text-white cursor-not-allowed'
                                                                    : getdate !== today
                                                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                            } transition-colors`}
                                                        >
                                                            <RxCross2 className="mr-1" />
                                                            Absent
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-500">
                                                    <svg 
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none" 
                                                        viewBox="0 0 24 24" 
                                                        stroke="currentColor" 
                                                        className="w-16 h-16 mb-4 text-gray-300"
                                                    >
                                                        <path 
                                                            strokeLinecap="round" 
                                                            strokeLinejoin="round" 
                                                            strokeWidth="1" 
                                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                        />
                                                    </svg>
                                                    <p className="text-lg font-medium">No attendance records found</p>
                                                    <p className="mt-1 text-sm">Try adjusting your search criteria or generate attendance for today.</p>
                                                </div>
                                    </td>
                                </tr>
                                    )}
                        </tbody>
                    </table>
                        )}
                    </div>
                    </div>
                )}
        </div>

            <CalendarModal />

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out;
                }
            `}</style>
        </>
    );
};

export default Page;