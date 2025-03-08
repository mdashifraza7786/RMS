"use client";
import axios from 'axios';
import { RowDataPacket } from 'mysql2';
import React, { useState, useEffect } from 'react';
import { FaEye, FaUserPlus, FaTrash } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";
import { PiChefHatThin } from "react-icons/pi";
import AddMemberPopup from './AddMemberPopup';
import { Bars } from 'react-loader-spinner';

const Page: React.FC = () => {
    const [memberData, setMemberData] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const [editPopupVisible, setEditPopupVisible] = useState(false);
    const [detailsPopupVisible, setDetailsPopupVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>({});
    const [editData, setEditData] = useState<any>({});
    const [addMemberPopupVisible, setAddMemberPopupVisible] = useState<boolean>(false);
    const [editLoading, setEditLoading] = useState<true | false>(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteMemberName, setDeleteMemberName] = useState("");
    const [deleteMemberId, setDeleteMemberId] = useState("");
    const [deleteMemberBoxValue, setDeleteMemberBoxValue] = useState("");
    const [deletePopupVisible, setDeletePopupVisible] = useState(false);

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
            const { users, payouts, addresses } = response.data;

            if (users.length < 10) {
                setHasMore(false);
            }

            if (users.length > 0) {
                const combinedData = users.map((user: RowDataPacket, index: number) => ({
                    ...user,
                    ...payouts[index],
                    ...addresses[index]
                }));

                setMemberData(prevData => {
                    const existingIds = new Set(prevData.map(item => item.userid));
                    const newItems = combinedData.filter((item: any) => !existingIds.has(item.userid));
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

    const handleDeleteClick = (userid: string, name: string) => {
        // You can use userid here if needed
        setDeletePopupVisible(true);
        setDeleteMemberId(userid);
        setDeleteMemberName(name);
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const filteredData = memberData.filter(item =>
        String(item.userid).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.role).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.mobile).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddMemberPopup = () => {
        setAddMemberPopupVisible(!addMemberPopupVisible);
    };

    const editMember = async (editData: {
        userid: string; name: string; role: string; mobile: number;
        email: string;
        photo: string;
        aadhaar: string;
        pancard: string;
        account_name: string;
        account_number: string;
        ifsc_code: string;
        branch_name: string;
        upiid: string;
        street_or_house_no: string;
        landmark: string;
        address_one: string;
        address_two: string;
        city: string;
        state: string;
        pin: string;
    }) => {
        try {
            setEditLoading(true);
            const response = await fetch('/api/members/updateMember', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editData),
            });

            if (!response.ok) {
                setEditLoading(false);

                throw new Error('Failed to update member');
            } else {

                const result = await response.json();
                fetchMemberData();
                console.log('Member updated successfully:', result);
                setEditLoading(false);

            }
            // Optionally show a success message to the user
        } catch (error) {
            console.error('Error updating member:', error);
            // Optionally show an error message to the user
        }
    };

    const handleDeleteInventory = async (deleteMemberId: string) => {
        try {
            setDeleteLoading(true);
            await axios.delete("/api/members/delete", { data: { userid: deleteMemberId } });
            fetchMemberData();
            setDeletePopupVisible(false);
        } catch (error) {
            console.error("Error deleting member:", error);
        } finally {
            setDeleteLoading(false);
            setDeleteMemberBoxValue("");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditData({ ...editData, photo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
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
                            <button onClick={handleAddMemberPopup} className="bg-supporting2 hover:bg-[#badb69] shadow-md font-bold text-white px-4 py-2 rounded flex items-center gap-2">
                                <PiChefHatThin /> <span>Add Member</span>
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
                                                <button className="bg-supporting3 hover:bg-[#fbb64e] text-white px-4 py-2 rounded text-[12px] flex items-center gap-10" onClick={() => handleEyeClick(item)}>
                                                    <div>View</div> <FaEye />
                                                </button>
                                                <button className="bg-primary hover:bg-[#416f9d] text-white px-4 py-2 rounded text-[12px] flex items-center gap-10" onClick={() => handleEditClick(item)}>
                                                    <div>Edit</div> <FaPenToSquare />
                                                </button>
                                                <button className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded text-[12px] flex items-center gap-10" onClick={() => handleDeleteClick(item.userid,item.name)}>
                                                    <div>Delete</div> <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className='flex justify-center items-center py-4'>

                            <Bars
                                height="50"
                                width="50"
                                color="#25476A"
                                ariaLabel="bars-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                                visible={true}
                            />

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
                        <div className="bg-white p-6 rounded-lg w-auto max-w-[600px] relative">

                            <h2 className="text-xl font-semibold mb-4 text-primary">Member Details</h2>

                            <div className="space-y-4">
                                {/* Photo and Personal Information */}
                                <div className="flex flex-row items-start gap-4">
                                    {/* Photo Section */}
                                    <div className="flex-shrink-0">
                                        <img
                                            src={selectedItem.photo} // Replace with your photo URL
                                            alt="Member Photo"
                                            className="w-40 h-38 object-cover rounded border border-gray-300"
                                        />
                                    </div>

                                    {/* Personal Information */}
                                    <div className="flex-grow bg-gray-100 p-4 rounded-lg shadow-md">
                                        <h3 className="text-lg font-semibold mb-2 text-primary">Personal Information</h3>
                                        <div className="space-y-2">
                                            <p className="font-medium text-gray-800"><strong>Name:</strong> {selectedItem.name}</p>
                                            <p className="font-medium text-gray-800"><strong>Mobile:</strong> {selectedItem.mobile}</p>
                                            <p className="font-medium text-gray-800"><strong>Role:</strong> {selectedItem.role}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bank Details and Address */}
                                <div className="flex flex-row gap-4">
                                    {/* Bank Details */}
                                    <div className="flex-grow bg-gray-100 p-4 rounded-lg shadow-md">
                                        <h3 className="text-lg font-semibold mb-2 text-primary">Bank Details</h3>
                                        <div className="space-y-2">
                                            <p className="font-medium text-gray-800"><strong>Account Holder:</strong> {selectedItem.account_name}</p>
                                            <p className="font-medium text-gray-800"><strong>Account Number:</strong> {selectedItem.account_number}</p>
                                            <p className="font-medium text-gray-800"><strong>IFSC:</strong> {selectedItem.ifsc_code}</p>
                                            <p className="font-medium text-gray-800"><strong>Branch:</strong> {selectedItem.branch_name}</p>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="flex-grow bg-gray-100 p-4 rounded-lg shadow-md">
                                        <h3 className="text-lg font-semibold mb-2 text-primary">Address</h3>
                                        <div className="space-y-2">
                                            <p className="font-medium text-gray-800"><strong>Street/House No:</strong> {selectedItem.street_or_house_no}</p>
                                            <p className="font-medium text-gray-800"><strong>Address One:</strong> {selectedItem.address_one}</p>
                                            <p className="font-medium text-gray-800"><strong>City:</strong> {selectedItem.city}</p>
                                            <p className="font-medium text-gray-800"><strong>State:</strong> {selectedItem.state}</p>
                                            <p className="font-medium text-gray-800"><strong>PIN:</strong> {selectedItem.pin}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => setDetailsPopupVisible(false)}
                                    className="bg-bgred text-white hover:bg-red-600 rounded-md px-4 py-2"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Popup */}
                {editPopupVisible && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 ">
                        <div className={`bg-white p-5 px-8 w-[90%] max-w-[600px] max-h-[90vh] relative ${editLoading ? 'overflow-hidden' : 'overflow-auto'}`}>
                            {editLoading && (
                                <div className='absolute w-[88%] min-h-full z-50 flex justify-center items-center'>
                                    <div className=''>
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
                                </div>
                            )}
                            <h2 className="text-xl font-semibold mb-4">Edit Member</h2>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                {/* Personal Information */}
                                <div className="flex flex-col gap-3 col-span-2">
                                    <div className="flex flex-row gap-3">

                                        <div className="flex-grow">
                                            <label className="block text-sm font-medium text-gray-800">ID:</label>
                                            <input
                                                type="text"
                                                value={editData.userid}
                                                readOnly
                                                onChange={(e) => setEditData({ ...editData, userid: e.target.value })}
                                                className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <label className="block text-sm font-medium text-gray-800">Name:</label>
                                            <input
                                                type="text"
                                                value={editData.name}
                                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-3">
                                        <div className="flex-grow">
                                            <label className="block text-sm font-medium text-gray-800">Mobile:</label>
                                            <input
                                                type="number"
                                                value={editData.mobile}
                                                onChange={(e) => setEditData({ ...editData, mobile: parseFloat(e.target.value) })}
                                                className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <label className="block text-sm font-medium text-gray-800">Email:</label>
                                            <input
                                                type="text"
                                                value={editData.email}
                                                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                                className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-3">
                                        <div className="flex-grow">
                                            <label className="block text-sm font-medium text-gray-800">Aadhaar:</label>
                                            <input
                                                type="text"
                                                value={editData.aadhaar}
                                                onChange={(e) => setEditData({ ...editData, aadhaar: e.target.value })}
                                                className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <label className="block text-sm font-medium text-gray-800">Pan Card:</label>
                                            <input
                                                type="text"
                                                value={editData.pancard}
                                                onChange={(e) => setEditData({ ...editData, pancard: e.target.value })}
                                                className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-3">
                                        <div className="flex-grow">
                                            <label className="block text-sm font-medium text-gray-800">Role:</label>
                                            <input
                                                type="text"
                                                value={editData.role}
                                                onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                                                className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <label className="block text-sm font-medium text-gray-800">Profile Image:</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e)}
                                                className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
                                            />
                                        </div>

                                    </div>
                                </div>

                                {/* Bank Details */}
                                <div className="flex flex-col gap-3 col-span-2">
                                    <h3 className="text-lg font-semibold mb-2">Bank Details</h3>
                                    <div className="flex flex-row gap-3">
                                        <div className="flex-grow">
                                            <label className="block text-sm font-medium text-gray-800">Account Holder:</label>
                                            <input
                                                type="text"
                                                value={editData.account_name}
                                                onChange={(e) => setEditData({ ...editData, account_name: e.target.value })}
                                                className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <label className="block text-sm font-medium text-gray-800">Account Number:</label>
                                            <input
                                                type="text"
                                                value={editData.account_number}
                                                onChange={(e) => setEditData({ ...editData, account_number: e.target.value })}
                                                className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-3">
                                        <div className="flex-grow">
                                            <label className="block text-sm font-medium text-gray-800">IFSC:</label>
                                            <input
                                                type="text"
                                                value={editData.ifsc_code}
                                                onChange={(e) => setEditData({ ...editData, ifsc_code: e.target.value })}
                                                className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <label className="block text-sm font-medium text-gray-800">Branch:</label>
                                            <input
                                                type="text"
                                                value={editData.branch_name}
                                                onChange={(e) => setEditData({ ...editData, branch_name: e.target.value })}
                                                className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-3">
                                        <div className="flex-grow">
                                            <label className="block text-sm font-medium text-gray-800">UPI ID:</label>
                                            <input
                                                type="text"
                                                value={editData.upiid}
                                                onChange={(e) => setEditData({ ...editData, upiid: e.target.value })}
                                                className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Address Details */}
                                <div className="flex flex-col gap-3 col-span-2">
                                    <h3 className="text-lg font-semibold mb-2">Address Details</h3>
                                    <div className="flex flex-row gap-3">
                                        <div className="flex-grow">
                                            <label className="block text-sm font-medium text-gray-800">Street/House No:</label>
                                            <input
                                                type="text"
                                                value={editData.street_or_house_no}
                                                onChange={(e) => setEditData({ ...editData, street_or_house_no: e.target.value })}
                                                className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <label className="block text-sm font-medium text-gray-800">Address One:</label>
                                            <input
                                                type="text"
                                                value={editData.address_one}
                                                onChange={(e) => setEditData({ ...editData, address_one: e.target.value })}
                                                className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-3">
                                        <div className="flex-grow">
                                            <label className="block text-sm font-medium text-gray-800">Landmark:</label>
                                            <input
                                                type="text"
                                                value={editData.landmark}
                                                onChange={(e) => setEditData({ ...editData, landmark: e.target.value })}
                                                className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <label className="block text-sm font-medium text-gray-800">City:</label>
                                            <input
                                                type="text"
                                                value={editData.city}
                                                onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                                                className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
                                            />
                                        </div>

                                    </div>
                                    <div className="flex flex-row gap-3">
                                        <div className="flex-grow">
                                            <div className="flex-grow">
                                                <label className="block text-sm font-medium text-gray-800">State:</label>
                                                <input
                                                    type="text"
                                                    value={editData.state}
                                                    onChange={(e) => setEditData({ ...editData, state: e.target.value })}
                                                    className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
                                                />
                                            </div>
                                            <label className="block text-sm font-medium text-gray-800">PIN:</label>
                                            <input
                                                type="text"
                                                value={editData.pin}
                                                onChange={(e) => setEditData({ ...editData, pin: e.target.value })}
                                                className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-4">
                                {!editLoading ? (
                                    <>
                                        <button
                                            onClick={() => setEditPopupVisible(false)}
                                            className="bg-bgred text-white hover:bg-red-600 rounded-md px-4 py-2 mr-2"
                                        >
                                            Close
                                        </button>
                                        <button
                                            onClick={async () => {
                                                await editMember(editData);
                                                setEditPopupVisible(false);  // Close the popup after saving
                                            }}
                                            className="bg-supporting2 text-white hover:bg-[#8bbf3b] rounded-md px-4 py-2"
                                        >
                                            Save
                                        </button>
                                    </>
                                ) : (
                                    <div>
                                        {/* <Bars
                                            height="50"
                                            width="50"
                                            color="#25476A"
                                            ariaLabel="bars-loading"
                                            wrapperStyle={{}}
                                            wrapperClass=""
                                            visible={true}
                                        /> */}
                                    </div>
                                )}


                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Popup */}
                {deletePopupVisible && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-96 max-w-full">
                            <h2 className="text-xl font-bold text-red-600 text-center mb-3">Delete Item</h2>
                            <p className="text-gray-700 text-center mb-4">
                                Are you sure you want to delete this item? Type the item name ({deleteMemberName}) to confirm.
                            </p>

                            <input
                                required
                                type="text"
                                placeholder="Type the item name"
                                className="border border-gray-300 w-full rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-100 focus:outline-none"
                                value={deleteMemberBoxValue}
                                onChange={(e) => setDeleteMemberBoxValue(e.target.value)}
                            />

                            <div className="flex justify-end space-x-3 mt-4">
                                <button
                                    onClick={() => {setDeletePopupVisible(false); setDeleteMemberBoxValue("");}}
                                    className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400 transition-all"
                                >
                                    Cancel
                                </button>
                                {deleteMemberName === deleteMemberBoxValue ? (

                                    <button
                                        onClick={() => handleDeleteInventory(deleteMemberId)}
                                        className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-all"
                                    >
                                        Delete
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="bg-red-300 text-white px-5 py-2 rounded-lg hover:bg-red-400 transition-all"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
};

export default Page;
