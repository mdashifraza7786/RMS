"use client";
import React, { useState } from 'react';
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

const sampleData = [
    { id: '#CHEF119', name: 'John Doe', role: 'Chef' },
    { id: '#CHEF118', name: 'Zeeshan Sayeed', role: 'Waiter' },
    { id: '#CHEF117', name: 'Muhammad Ashif Raza', role: 'Chef' },
    { id: '#CHEF116', name: 'John Doe', role: 'Chef' },
    { id: '#CHEF115', name: 'Zeeshan Sayeed', role: 'Waiter' },
    { id: '#CHEF114', name: 'Zeeshan Sayeed', role: 'Waiter' },
    { id: '#CHEF113', name: 'John Doe', role: 'Chef' },
];

const Page: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState('12/07/2024');
    const [attendance, setAttendance] = useState<{ [key: string]: string }>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('All');

    const dates = Array.from({ length: 31 }, (_, i) => {
        const day = (i + 1).toString().padStart(2, '0');
        const month = '12';
        const year = '2024';
        return `${month}/${day}/${year}`;
    });

    const giveAttendance = (id: string, status: string) => {
        setAttendance(prevState => ({ ...prevState, [id]: status }));
        console.log(attendance);
    }

    // Filtered data based on search query and selected role
    const filteredData = sampleData.filter(item =>
        (selectedRole === 'All' || item.role === selectedRole) &&
        (item.id.toLowerCase().includes(searchQuery.toLowerCase()) || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className='bg-[#e6e6e6] py-[5vh] px-[8vw] font-raleway flex flex-col gap-[6vh]'>
            <h1 className="font-bold">Attendance</h1>

            {/* attendance box */}
            <section className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-3 relative'>

                {/* upper section */}
                <section className='flex justify-between items-center py-4'>
                    {/* date */}
                    <div className="flex">
                        <div>Date:</div>
                        <div className="flex gap-2 underline">
                            <select className='text-[14px] font-normal' value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
                                {dates.map(date =>
                                    <option key={date} value={date}>
                                        {date}
                                    </option>)}
                            </select>
                        </div>
                    </div>

                    {/* search */}
                    <input
                        type='search'
                        placeholder='Search Name, ID...'
                        className='border border-[#807c7c] rounded-xl px-4 py-1'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </section>

                {/* filter for roles */}
                <section className='flex gap-4'>
                    <div
                        className={`px-4 py-2 rounded-xl cursor-pointer ${selectedRole === 'All' ? 'font-bold bg-[#FA9F1B70] text-[#fc9802e3]' : ''}`}
                        onClick={() => setSelectedRole('All')}
                    >
                        All
                    </div>
                    <div
                        className={`px-4 py-2 rounded-xl cursor-pointer ${selectedRole === 'Chef' ? 'font-bold bg-[#FA9F1B70] text-[#fc9802e3]' : ''}`}
                        onClick={() => setSelectedRole('Chef')}
                    >
                        Chef
                    </div>
                    <div
                        className={`px-4 py-2 rounded-xl cursor-pointer ${selectedRole === 'Waiter' ? 'font-bold bg-[#FA9F1B70] text-[#fc9802e3]' : ''}`}
                        onClick={() => setSelectedRole('Waiter')}
                    >
                        Waiter
                    </div>
                </section>

                {/* table */}
                <table className="table-auto w-full">
                    <thead>
                        <tr className='bg-primary text-white font-light'>
                            <th className="px-4 py-2 text-left w-[200px]">ID</th>
                            <th className="px-4 py-2 text-left">Full Name</th>
                            <th className="px-4 py-2 text-left">Role</th>
                            <th className="px-4 py-2 text-left w-[100px]">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr key={index} className='text-[14px] font-medium font-montserrat'>
                                <td className="border px-4 py-4 transition-colors duration-300">{item.id}</td>
                                <td className="border px-4 py-4 transition-colors duration-300">{item.name}</td>
                                <td className="border px-4 py-4 transition-colors duration-300">{item.role}</td>
                                <td className="border px-4 py-4 transition-colors duration-300">
                                    {attendance[item.id] === 'Present' ? (
                                        <button className="bg-supporting2 text-white px-4 py-2 rounded text-[12px] w-[21vw] flex items-center justify-between">
                                            <div>PRESENT</div> <FaCheck />
                                        </button>
                                    ) : attendance[item.id] === 'Absent' ? (
                                        <button className="bg-bgred text-white px-4 py-2 rounded text-[12px] w-[21vw] flex items-center justify-between">
                                            <div>ABSENT</div> <RxCross2 />
                                        </button>
                                    ) : (
                                        <div className='flex gap-4'>
                                            <button onClick={() => giveAttendance(item.id, 'Absent')} className="bg-bgred text-white px-4 py-2 rounded text-[12px] flex items-center gap-10">
                                                <div>ABSENT</div> <RxCross2 />
                                            </button>
                                            <button onClick={() => giveAttendance(item.id, 'Present')} className="bg-supporting2 text-white px-4 py-2 rounded mr-2 text-[12px] flex items-center gap-10">
                                                <div>PRESENT</div> <FaCheck />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

        </div>
    );
}

export default Page;
