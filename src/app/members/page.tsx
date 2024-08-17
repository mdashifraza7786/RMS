"use client";
import axios from 'axios';
import { RowDataPacket } from 'mysql2';
import React, { useState, useEffect } from 'react';
import { FaEye, FaUserPlus } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";
import { IoFastFoodOutline } from "react-icons/io5";
import AddMemberPopup from './AddMemberPopup';

const Page: React.FC = () => {
    const [memberData, setMemberData] = useState<RowDataPacket[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const [editPopupVisible, setEditPopupVisible] = useState(false);
    const [detailsPopupVisible, setDetailsPopupVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>({});
    const [editData, setEditData] = useState({ amount: '', status: 'paid', id: '' ,name:''});
    const [addMemberPopupVisible, setAddMemberPopupVisible] = useState<boolean>(false);

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

            if (data.length < 10) {
                setHasMore(false);
            }
            if (data.length > 0) {
                setMemberData(prevData => {
                    const existingIds = new Set(prevData.map(item => item.id));
                    const newItems = data.filter((item: RowDataPacket) => !existingIds.has(item.id));
                    return [...prevData, ...newItems];
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (data: any) => {
        setEditData(data);
        setEditPopupVisible(true);
    };

    const handleEyeClick = (data: any) => {
        setSelectedItem(data);
        setDetailsPopupVisible(true);
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
        String(item.mobile).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddMemberPopup = () => {
        setAddMemberPopupVisible(!addMemberPopupVisible);
    };

    return (
        <>
            <div className='bg-[#e6e6e6] py-[5vh] px-[8vw] font-raleway flex flex-col gap-[6vh]'>
                <h1 className="font-bold">Members</h1>
                {addMemberPopupVisible && (
                    <AddMemberPopup onHandle={handleAddMemberPopup} />
                )}
                <section className='bg-white rounded-[10px] p-[3vh] font-semibold flex flex-col gap-3 relative'>
                    <section className='flex justify-between items-center py-4'>
                        <input
                            type='search'
                            placeholder='Search Name, ID...'
                            className='border border-[#807c7c] rounded-xl px-4 py-1'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className='flex justify-between items-center py-4'>
                            <button onClick={handleAddMemberPopup} className="bg-supporting2 shadow-md font-bold text-white px-4 py-2 rounded flex items-center gap-2">
                            <IoFastFoodOutline /> <span>Add Member</span>
                            </button>
                        </div>
                    </section>
                    {filteredData.length > 0 ? (
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
                                        <td className="border px-4 py-4 transition-colors duration-300">{item.userid}</td>
                                        <td className="border px-4 py-4 transition-colors duration-300">{item.name}</td>
                                        <td className="border px-4 py-4 transition-colors duration-300">{item.role}</td>
                                        <td className="border px-4 py-4 transition-colors duration-300">{item.mobile}</td>
                                        <td className="border px-4 py-4 transition-colors duration-300">
                                            <div className='flex gap-4 justify-center'>
                                                <button className="bg-primary text-white px-4 py-2 rounded text-[12px] flex items-center gap-10" onClick={() => handleEyeClick(item)}>
                                                    <div>View</div> <FaEye />
                                                </button>
                                                <button className="bg-primary text-white px-4 py-2 rounded text-[12px] flex items-center gap-10" onClick={() => handleEditClick(item)}>
                                                    <div>Edit</div> <FaPenToSquare />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className='flex justify-center items-center py-4'>
                            <p>No Data Found</p>
                        </div>
                    )}
                    {filteredData.length > 0 && hasMore && !loading && (
                        <button
                            onClick={handleLoadMore}
                            className="mt-4 bg-primary text-white px-4 py-2 rounded"
                        >
                            Load More
                        </button>
                    )}
                </section>

                {/* View Popup */}
                {detailsPopupVisible && selectedItem && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                        <div className="bg-white p-8 rounded-lg w-96">
                            <h2 className="text-xl font-semibold mb-4">Member Details</h2>
                            <div className="mb-4">
                                <p><strong>Name:</strong> {selectedItem.name}</p>
                                <p><strong>Mobile:</strong> {selectedItem.mobile}</p>
                                <p><strong>Role:</strong> {selectedItem.role}</p>
                                <div>
                                    <p><strong>Account Holder:</strong> {selectedItem.accountHolder}</p>
                                    <p><strong>Account Number:</strong> {selectedItem.accountNumber}</p>
                                    <p><strong>IFSC:</strong> {selectedItem.ifsc}</p>
                                    <p><strong>Branch:</strong> {selectedItem.branch}</p>
                                    <p><strong>Amount:</strong> {selectedItem.amount}</p>
                                    <p><strong>Status:</strong> {selectedItem.status}</p>
                                    <p><strong>Date of Payment:</strong> {selectedItem.dateofpayment}</p>
                                </div>
                                <div>
                                    <p><strong>Street/House No:</strong> {selectedItem.street_or_house_no}</p>
                                    <p><strong>Address One:</strong> {selectedItem.address_one}</p>
                                    <p><strong>City:</strong> {selectedItem.city}</p>
                                    <p><strong>State:</strong> {selectedItem.state}</p>
                                    <p><strong>PIN:</strong> {selectedItem.pin}</p>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setDetailsPopupVisible(false)}
                                    className="bg-blue-500 text-white rounded-md px-4 py-2"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Popup */}
                {editPopupVisible && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                        <div className="bg-white p-8 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4">Edit Member</h2>
                            <div className="mb-4">
                                <p><strong>Name:</strong> {editData.name}</p>
                                <p><strong>ID:</strong> {editData.id}</p>
                                <p><strong>Amount:</strong> {editData.amount}</p>
                                <p><strong>Status:</strong> {editData.status}</p>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setEditPopupVisible(false)}
                                    className="bg-blue-500 text-white rounded-md px-4 py-2"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Page;
