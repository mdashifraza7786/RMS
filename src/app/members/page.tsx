"use client";
import axios from 'axios';
import { RowDataPacket } from 'mysql2';
import React, { useState, useEffect } from 'react';
import { FaEye } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";

const Page = () => {
    const [memberData, setMemberData] = useState<false | RowDataPacket[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        document.title = "Members";
        fetchMemberData();
    }, [page]);

    const fetchMemberData = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await axios.get(`/api/members?page=${page}`);
            const data = await response.data;
            if (data.length < 10) {
                setHasMore(false);
            }
            setMemberData(data);
        } catch (error: any) {
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

    return (
        <div className='bg-[#e6e6e6] py-[5vh] px-[8vw] font-raleway flex flex-col gap-[6vh]'>
            <h1 className="font-bold">Members</h1>

            <section className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-3 relative'>
                <section className='flex justify-between items-center py-4'>
                    <input
                        type='search'
                        placeholder='Search Name, ID...'
                        className='border border-[#807c7c] rounded-xl px-4 py-1'
                    />
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
                        {memberData && memberData.map((item, index) => (
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
