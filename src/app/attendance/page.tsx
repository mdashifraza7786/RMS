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

    // useEffect(() => {
    //     console.warn("Updated AvailableDate after state change:", availableDate);
    // }, [availableDate]); // This runs only when availableDate changes
    


    return (
        <div className='bg-[#e6e6e6] py-[5vh] px-[8vw] font-raleway flex flex-col gap-[6vh]'>
            <h1 className="font-bold">Attendance</h1>
            <section className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-3 relative'>
                {attendanceData && attendanceData.length > 0 && (
                    <>
                        <section className='flex justify-between items-center py-4'>
                            <div className="flex gap-2">
                                <div>Date: </div>
                                <div className="flex gap-2 text-[#222121] underline">
                                    <input
                                        type="date"
                                        name="attend_date"
                                        value={getdate}
                                        min={availableDate.minDate}
                                        max={availableDate.maxDate}
                                        onChange={(e) => setGetdate(e.target.value)}
                                    />

                                </div>
                            </div>

                            <input
                                type='search'
                                placeholder='Search Name, ID...'
                                className='border border-[#807c7c] rounded-xl px-4 py-1'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </section>
                        <section className='flex gap-4'>
                            <div
                                className={`px-4 py-2 rounded-xl cursor-pointer ${selectedRole === 'All' ? 'font-bold bg-[#FA9F1B70] text-[#fc9802e3]' : ''}`}
                                onClick={() => setSelectedRole('All')}
                            >
                                All
                            </div>
                            <div
                                className={`px-4 py-2 rounded-xl cursor-pointer ${selectedRole === 'chef' ? 'font-bold bg-[#FA9F1B70] text-[#fc9802e3]' : ''}`}
                                onClick={() => setSelectedRole('chef')}
                            >
                                Chef
                            </div>
                            <div
                                className={`px-4 py-2 rounded-xl cursor-pointer ${selectedRole === 'waiter' ? 'font-bold bg-[#FA9F1B70] text-[#fc9802e3]' : ''}`}
                                onClick={() => setSelectedRole('waiter')}
                            >
                                Waiter
                            </div>
                        </section>

                    </>
                )}


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
                                        {new Date(item.date).getTime() < new Date().setHours(0, 0, 0, 0) ? (
                                            // If date is in the past, show the result
                                            <span className={`text-[12px] font-bold ${item.status === 'present' ? 'text-green-600' : item.status === 'absent' ? 'text-red-600' : 'text-gray-500'}`}>
                                                {item.status === 'present' ? 'PRESENT' : item.status === 'absent' ? 'ABSENT' : 'NA'}
                                            </span>
                                        ) : item.status === 'present' ? (
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
