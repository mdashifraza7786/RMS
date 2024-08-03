"use client";
import axios from 'axios';
import { RowDataPacket } from 'mysql2';
import React, { useState, useEffect } from 'react';
import { FaEye, FaUserPlus } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";

const Page: React.FC = () => {
    const [memberData, setMemberData] = useState<RowDataPacket[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        document.title = "Members";
        fetchMemberData();
    }, [page, searchQuery]);

    const fetchMemberData = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await axios.get(`/api/members`, {
                params: { page, search: searchQuery }
            });
            const data = response.data;

            // Check if the length of the data is less than the page size
            if (data.length < 10) {
                setHasMore(false);
            }

            // Filter out duplicate data
            setMemberData(prevData => {
                const existingIds = new Set(prevData.map(item => item.id));
                const newItems = data.filter((item: RowDataPacket) => !existingIds.has(item.id));
                return [...prevData, ...newItems];
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const filteredData = memberData.filter(item =>
        String(item.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.role).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.mobile).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.email).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.aadhaar).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.pancard).toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='bg-[#e6e6e6] py-[5vh] px-[8vw] font-raleway flex flex-col gap-[6vh]'>
            <h1 className="font-bold">Members</h1>

            <section className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-3 relative'>
                <section className='flex justify-between items-center py-4'>
                    <input
                        type='search'
                        placeholder='Search Name, ID...'
                        className='border border-[#807c7c] rounded-xl px-4 py-1'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <div className='flex justify-between items-center py-4'>
                       
                        <button className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2">
                            <FaUserPlus /> <span>Add Member</span>
                        </button>
                        </div>
                </section>

                <table className="table-auto w-full">
                    <thead>
                        <tr className='bg-primary text-white font-light'>
                            <th className="px-4 py-2 text-left w-[200px]">ID</th>
                            <th className="px-4 py-2 text-left w-[400px]">Full Name</th>
                            <th className="px-4 py-2 text-left w-[200px]">Role</th>
                            <th className="px-4 py-2 text-left w-[200px]">Phone</th>
                            <th className="px-4 py-2 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr key={index} className='text-[14px] font-medium font-montserrat'>
                                <td className="border px-4 py-4 transition-colors duration-300">{item.id}</td>
                                <td className="border px-4 py-4 transition-colors duration-300">{item.name}</td>
                                <td className="border px-4 py-4 transition-colors duration-300">{item.role}</td>
                                <td className="border px-4 py-4 transition-colors duration-300">{item.mobile}</td>
                                <td className="border px-4 py-4 transition-colors duration-300">
                                    <div className='flex gap-4 justify-center'>
                                        <button className="bg-primary text-white px-4 py-2 rounded text-[12px] flex items-center gap-10">
                                            <div>View</div> <FaEye />
                                        </button>
                                        <button className="bg-primary text-white px-4 py-2 rounded text-[12px] flex items-center gap-10">
                                            <div>Edit</div> <FaPenToSquare />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {hasMore && !loading && (
                    <button
                        onClick={handleLoadMore}
                        className="mt-4 bg-primary text-white px-4 py-2 rounded"
                    >
                        Load More
                    </button>
                )}
                {loading && <div>Loading...</div>}
            </section>
        </div>
    );
}

export default Page;
