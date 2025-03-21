"use client";
import React, { useState, useEffect } from 'react';
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { FiRefreshCcw } from "react-icons/fi";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bars } from 'react-loader-spinner'

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
    const [selectedRole, setSelectedRole] = useState<string>('All');
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
            await axios.post("/api/attendance/updateAttendence", {
                userid: id,
                status: status,
                date: today
            });
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
                const response = await axios.post("/api/attendance/byDate", {
                    byDate: getdate
                });

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
            (selectedRole === 'All' || item.role === selectedRole) &&
            (item.userid.toLowerCase().includes(searchQuery.toLowerCase()) || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setFilteredData(filtered);
    }, [attendanceData, searchQuery, selectedRole]);

    useEffect(() => {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];
        setToday(formattedDate);
        setGetdate(formattedDate);

        const fetchTodayAttendance = async () => {
            setAttendanceloading(true);
            try {
                const response = await axios.get("/api/attendance");
        
                if (response.status === 500 || response.status === 209) {
                    toast.error(response.data.message);
                } else {
                    const data = response.data.data || [];
                    setAttendanceData(data);
        
                    console.warn(response.data); // Check API response
        
                    const formatDate = (date: string | null | undefined) => 
                        date ? new Date(date).toISOString().split('T')[0] : formattedDate;
        
                    const dates: AvailableDate = {
                        minDate: formatDate(response.data.minDate),
                        maxDate: formatDate(response.data.maxDate)
                    };
        
                    setAvaiableDate(dates);
                    
                    // Set available dates from API response
                    if (response.data.availableDates) {
                        setAvailableDates(response.data.availableDates);
                    }
                    
                    console.warn("Updated AvailableDate:", dates); // Debugging
                }
            } catch (error) {
                toast.error('Failed to fetch attendance.');
            } finally {
                setAttendanceloading(false);
            }
        };
        
        fetchTodayAttendance();

    }, []);

    // Function to check if a date has attendance records
    const hasAttendanceRecords = (date: string) => {
        return availableDates.includes(date);
    };

    // Custom date picker with calendar
    const renderCalendar = () => {
        // Get current month and year
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        
        // Create a date for the first day of the month
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
        const startingDay = firstDay.getDay();
        
        // Calculate the number of days in the month
        const monthLength = lastDay.getDate();
        
        // Calculate the number of rows needed
        const numRows = Math.ceil((startingDay + monthLength) / 7);
        
        // Generate days for the calendar
        const days = [];
        let day = 1;
        
        // Parse min and max dates
        const minDateObj = availableDate.minDate ? new Date(availableDate.minDate) : new Date(2000, 0, 1);
        const maxDateObj = availableDate.maxDate ? new Date(availableDate.maxDate) : new Date();
        
        // Ensure we always have 6 rows to keep height consistent
        const totalRows = 6;
        
        for (let i = 0; i < totalRows; i++) {
            const row = [];
            for (let j = 0; j < 7; j++) {
                if ((i === 0 && j < startingDay) || day > monthLength) {
                    // Empty cell
                    row.push(null);
                } else {
                    // Date cell
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const cellDate = new Date(dateStr);
                    
                    // Check if date is between min and max
                    const isInRange = cellDate >= minDateObj && cellDate <= maxDateObj;
                    
                    // Check if the date has attendance records
                    const hasRecords = hasAttendanceRecords(dateStr);
                    
                    row.push({
                        day,
                        dateStr,
                        isToday: dateStr === today,
                        isSelected: dateStr === getdate,
                        isInRange,
                        hasRecords
                    });
                    day++;
                }
            }
            days.push(row);
        }
        
        return (
            <div className="bg-white border border-gray-200 shadow-lg rounded-lg w-[320px] h-[380px] flex flex-col">
                {/* Header with month/year and navigation */}
                <div className="bg-primary text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
                    <button 
                        className="p-1 hover:bg-primary-dark rounded text-white"
                        onClick={() => {
                            const newDate = new Date(currentMonth);
                            newDate.setMonth(newDate.getMonth() - 1);
                            setCurrentMonth(newDate);
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="font-medium text-center">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                    <button 
                        className="p-1 hover:bg-primary-dark rounded text-white"
                        onClick={() => {
                            const newDate = new Date(currentMonth);
                            newDate.setMonth(newDate.getMonth() + 1);
                            setCurrentMonth(newDate);
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
                
                {/* Calendar body */}
                <div className="flex-1 p-3 flex flex-col">
                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-1 mb-1">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                            <div key={i} className="text-xs font-semibold text-gray-500 h-8 flex items-center justify-center">
                                {day}
                            </div>
                        ))}
                    </div>
                    
                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1 flex-1">
                        {days.flat().map((cell, i) => (
                            <div key={i} className="flex items-center justify-center">
                                {cell ? (
                                    <button
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition
                                            ${cell.isSelected ? 'bg-primary text-white shadow-md' : ''}
                                            ${cell.isToday && !cell.isSelected ? 'border-2 border-primary' : ''}
                                            ${!cell.isInRange ? 'text-gray-300 cursor-not-allowed' : cell.hasRecords ? 'hover:bg-gray-100 cursor-pointer' : 'text-gray-400 cursor-not-allowed'}
                                            ${cell.hasRecords && !cell.isSelected ? 'font-bold text-blue-600' : ''}
                                        `}
                                        disabled={!cell.isInRange || !cell.hasRecords}
                                        onClick={() => {
                                            if (cell.hasRecords) {
                                                setGetdate(cell.dateStr);
                                                setShowCalendar(false); // Hide calendar after selecting a date
                                            }
                                        }}
                                    >
                                        {cell.day}
                                    </button>
                                ) : (
                                    <div className="w-8 h-8"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Footer */}
                <div className="border-t border-gray-200 p-3 flex justify-between">
                    <button 
                        className="text-xs text-primary hover:underline font-medium"
                        onClick={() => {
                            setGetdate(today);
                            setCurrentMonth(new Date());
                        }}
                    >
                        Today
                    </button>
                    <button 
                        className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-3 rounded font-medium"
                        onClick={() => setShowCalendar(false)}
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    };

    // Calendar Modal
    const CalendarModal = () => {
        if (!showCalendar) return null;
        
        return (
            <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4" 
                 onClick={() => setShowCalendar(false)}>
                <div className="relative" onClick={e => e.stopPropagation()}>
                    {renderCalendar()}
                </div>
            </div>
        );
    };

    // Initialize currentMonth based on selected date during mount
    useEffect(() => {
        if (getdate) {
            setCurrentMonth(new Date(getdate));
        }
    }, []);

    return (
        <div className='bg-[#e6e6e6] py-[5vh] px-[8vw] font-raleway flex flex-col gap-[6vh]'>
            <h1 className="font-bold">Attendance</h1>
            <section className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-3 relative'>
                
                {attendanceData && attendanceData.length > 0 && (
                    <>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="text-[#222121] font-medium">
                                    Date: <span className="text-primary font-bold ml-2">{new Date(getdate).toLocaleDateString()}</span>
                                </div>
                                <button
                                    onClick={() => setShowCalendar(true)}
                                    className="flex items-center gap-2 bg-primary text-white px-3 py-2 rounded-md hover:bg-primary/90 transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Calendar
                                </button>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type='search'
                                    placeholder='Search Name, ID...'
                                    className='border border-[#807c7c] rounded-md px-4 py-1 w-[220px] h-[40px] outline-none'
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                
                                <div
                                    className={`px-4 py-1 rounded-md cursor-pointer text-center min-w-[60px] h-[40px] flex items-center justify-center ${selectedRole === 'All' ? 'font-medium bg-[#FA9F1B70] text-[#fc9802e3]' : 'hover:bg-gray-100'}`}
                                    onClick={() => setSelectedRole('All')}
                                >
                                    All
                                </div>
                                <div
                                    className={`px-4 py-1 rounded-md cursor-pointer text-center min-w-[60px] h-[40px] flex items-center justify-center ${selectedRole === 'chef' ? 'font-medium bg-[#FA9F1B70] text-[#fc9802e3]' : 'hover:bg-gray-100'}`}
                                    onClick={() => setSelectedRole('chef')}
                                >
                                    Chef
                                </div>
                                <div
                                    className={`px-4 py-1 rounded-md cursor-pointer text-center min-w-[60px] h-[40px] flex items-center justify-center ${selectedRole === 'waiter' ? 'font-medium bg-[#FA9F1B70] text-[#fc9802e3]' : 'hover:bg-gray-100'}`}
                                    onClick={() => setSelectedRole('waiter')}
                                >
                                    Waiter
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Calendar Modal */}
                <CalendarModal />

                {attendanceData && attendanceData.length > 0 ? (
                    <table className="table-auto w-full">
                        <thead>
                            <tr className='bg-primary text-white font-light'>
                                <th className="px-4 py-2 text-left w-[200px]">ID</th>
                                <th className="px-4 py-2 text-left">Full Name</th>
                                <th className="px-4 py-2 text-left">Role</th>
                                <th className="px-4 py-2 text-left w-[15rem]">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={index} className='text-[14px] font-medium font-montserrat'>
                                    <td className="border px-4 py-4 transition-colors duration-300">{item.userid}</td>
                                    <td className="border px-4 py-4 transition-colors duration-300">{item.name}</td>
                                    <td className="border px-4 py-4 transition-colors duration-300">{item.role.toUpperCase()}</td>
                                    <td className="border px-4 py-4 transition-colors duration-300">
                                        {item.status === 'present' ? (
                                            <button
                                                onClick={() => giveAttendance(item.userid, 'present', "reset")}
                                                className="bg-supporting2 text-white px-4 py-2 rounded text-[12px] w-[18rem] flex items-center justify-between">
                                                <div>PRESENT</div> <FaCheck />
                                            </button>
                                        ) : item.status === 'absent' ? (
                                            <button
                                                onClick={() => giveAttendance(item.userid, 'absent', "reset")}
                                                className="bg-bgred text-white px-4 py-2 rounded text-[12px] w-[18rem] flex items-center justify-between">
                                                <div>ABSENT</div> <RxCross2 />
                                            </button>
                                        ) : (
                                            <div className='flex gap-4 w-full'>
                                                <button
                                                    onClick={() => giveAttendance(item.userid, 'absent', "update")}
                                                    className="bg-bgred text-white px-4 py-2 rounded text-[12px] flex items-center gap-10">
                                                    <div>ABSENT</div> <RxCross2 />
                                                </button>
                                                <button
                                                    onClick={() => giveAttendance(item.userid, 'present', "update")}
                                                    className="bg-supporting2 text-white px-4 py-2 rounded mr-2 text-[12px] flex items-center gap-10">
                                                    <div>PRESENT</div> <FaCheck />
                                                </button>
                                            </div>
                                        )}
                                    </td>


                                </tr>
                            ))}
                        </tbody>
                    </table>
                 ) : attendanceloading ? (
                    <div className='flex items-center justify-center h-[30vh]'>
                        <Bars
                            height="80"
                            width="80"
                            color="#25476A"
                            ariaLabel="bars-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                        />
                    </div>
                ) : (
                    // generate div
                    <div className='flex flex-col gap-5 items-center justify-center h-[30vh]'>
                        <p className='text-[18px] font-bold font-montserrat'>Please Generate Attendance for today.</p>
                        <button
                            onClick={handleGenerateAttendance}
                            className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2"
                            disabled={loading}
                        >
                            <FiRefreshCcw className={loading ? 'animate-spin' : ''} />
                            <span>{loading ? 'Generating...' : 'Generate Attendance'}</span>
                        </button>
                    </div>
                )}

            </section>
            <ToastContainer />
        </div>
    );
};

export default Page;
