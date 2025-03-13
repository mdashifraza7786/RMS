"use client"
import React, { use, useEffect, useState } from 'react';
import { HiEye, HiPencilAlt } from 'react-icons/hi';
import axios from 'axios';
import { RowDataPacket } from 'mysql2';
import { FaCheck } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';

const sampleData = [
    { id: '#CHEF119', image: 'https://placehold.co/150x150', mobile: '+91-7643088251', accountHolder: 'John Doe', accountNumber: '3928415252', ifsc: 'CBIN0248596', branch: 'Marwan', dateofpayment: '02-12-2024 12:03 PM', name: 'John Doe', role: 'Chef', amount: '₹20,000', status: 'null' },
    { id: '#CHEF120', image: 'https://placehold.co/150x150', mobile: '+91-7643088251', accountHolder: 'John Doe', accountNumber: '3928415252', ifsc: 'CBIN0248596', branch: 'Marwan', dateofpayment: '02-12-2024 12:03 PM', name: 'Jane Smith', role: 'Chef', amount: '₹20,000', status: 'unpaid' },
    { id: '#WAITER121', image: 'https://placehold.co/150x150', mobile: '+91-7643088251', accountHolder: 'John Doe', accountNumber: '3928415252', ifsc: 'CBIN0248596', branch: 'Marwan', dateofpayment: '02-12-2024 12:03 PM', name: 'Alice Johnson', role: 'Waiter', amount: '₹10,000', status: 'paid' },
    { id: '#WAITER122', image: 'https://placehold.co/150x150', mobile: '+91-7643088251', accountHolder: 'John Doe', accountNumber: '3928415252', ifsc: 'CBIN0248596', branch: 'Marwan', dateofpayment: '02-12-2024 12:03 PM', name: 'Bob Brown', role: 'Waiter', amount: '₹10,000', status: 'paid' },
    { id: '#WAITER124', image: 'https://placehold.co/150x150', mobile: '+91-7643088251', accountHolder: 'John Doe', accountNumber: '3928415252', ifsc: 'CBIN0248596', branch: 'Marwan', dateofpayment: '02-12-2024 12:03 PM', name: 'Bob Brown', role: 'Waiter', amount: '₹10,000', status: 'paid' },
    { id: '#CHEF125', image: 'https://placehold.co/150x150', mobile: '+91-7643088251', accountHolder: 'John Doe', accountNumber: '3928415252', ifsc: 'CBIN0248596', branch: 'Marwan', dateofpayment: '02-12-2024 12:03 PM', name: 'Bob Brown', role: 'Chef', amount: '₹10,000', status: 'paid' },
    { id: '#WAITER126', image: 'https://placehold.co/150x150', mobile: '+91-7643088251', accountHolder: 'John Doe', accountNumber: '3928415252', ifsc: 'CBIN0248596', branch: 'Marwan', dateofpayment: '02-12-2024 12:03 PM', name: 'Bob Brown', role: 'Waiter', amount: '₹10,000', status: 'paid' },
];

interface PayoutInfo {
    userid: string,
    account_number: string,
    upi_id: string,
    amount: string,
    status: string,
}

interface User {
    userid: string,
    name: string,
    mobile: string,
    photo?: string,
    role: string,
    ifsc_code: string,
    branch_name: string,
}

interface MergedUserPayout {
    userid: string;
    name: string;
    mobile: string;
    photo?: string;
    account_number: string;
    upi_id: string;
    amount: string;
    status: string;
    role: string;
    ifsc_code: string;
    branch: string;
}


const Page = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [detailsPopupVisible, setDetailsPopupVisible] = useState(false); // State for details popup
    const [payoutInfo, setPayoutInfo] = useState([] as PayoutInfo[]);
    const [userInfo, setUserInfo] = useState([] as User[]);
    const [mergedData, setMergedData] = useState<MergedUserPayout[]>([]);
    const [selectedItem, setSelectedItem] = useState({ userid: '', name: '', role: '', amount: '', status: '', photo: '', mobile: '', account_number: '', ifsc_code: '', branch: '' }); // State to store selected item data

    // Logic to filter data based on search query and selected filter
    const filteredData = mergedData.filter(item =>
        (selectedFilter === 'All' || item.status === selectedFilter)
        &&
        (item.userid.toLowerCase() === searchQuery.toLowerCase() || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Logic to paginate data
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: any) => setCurrentPage(pageNumber);

    const changeFilter = (filter: any) => {
        setSelectedFilter(filter);
        setCurrentPage(1); // Reset current page when changing filter
    };

    const handleEyeClick = (data: any) => {
        setSelectedItem(data);
        setDetailsPopupVisible(true); // Show details popup
    };


    useEffect(() => {
        async function fetchDetails() {
            try {
                const response = await axios.get('api/payout');
                setPayoutInfo(response.data.payout);

            } catch (err) {
                console.log(err);
            }
        }

        async function fetchUserInfo() {
            try {
                const response = await axios.get('api/members');
                const { users, payouts, addresses } = await response.data;
                const combinedData = users.map((user: RowDataPacket, index: number) => ({
                    ...user,
                    ...payouts[index],
                    ...addresses[index]
                }));

                setUserInfo(prevData => {
                    const existingIds = new Set(prevData.map(item => item.userid));
                    const newItems = combinedData.filter((item: any) => !existingIds.has(item.userid));
                    return [...prevData, ...newItems];
                });

            }
            catch (err) {
                console.log(err);
            }
        }

        fetchDetails();
        fetchUserInfo();
    }
        , []);

    useEffect(() => {
        // Assuming userInfo and payoutInfo are already set
        const merged = payoutInfo.map(payout => {
            const user = userInfo.find(user => user.userid === payout.userid);
            return {
                userid: payout.userid,
                name: user?.name || '',
                mobile: user?.mobile || '',
                photo: user?.photo,
                role: user?.role || '',
                ifsc_code: user?.ifsc_code || '',
                branch: user?.branch_name || '',
                account_number: payout.account_number,
                upi_id: payout.upi_id,
                amount: payout.amount,
                status: payout.status,
            };
        });

        setMergedData(merged);
        console.log(merged);
    }, [userInfo, payoutInfo]);


    return (
        <div className='bg-[#e6e6e6] py-[5vh] px-[8vw] font-raleway flex flex-col gap-[6vh]'>
            <div className='font-semibold text-[18px]'>Payout Details</div>

            <section className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-3 relative'>
                {/* Search */}
                <div>
                    <input
                        type="text"
                        placeholder="Search by ID or Name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1"
                    />
                </div>

                {/* Filter buttons */}
                <div className='flex text-md gap-4'>
                    <div
                        className={`px-[12px] py-2 rounded-xl cursor-pointer ${selectedFilter === 'All' ? 'font-bold bg-[#FA9F1B70]  transition-colors duration-300 text-[#fc9802e3]' : ''}`}
                        onClick={() => changeFilter('All')}
                    >
                        All
                    </div>
                    <div
                        className={`px-[12px] py-2 rounded-xl cursor-pointer ${selectedFilter === 'paid' ? 'font-bold bg-[#FA9F1B70]  transition-colors duration-300 text-[#fc9802e3]' : ''}`}
                        onClick={() => changeFilter('paid')}
                    >
                        Paid
                    </div>
                    <div
                        className={`px-[12px] py-2 rounded-xl cursor-pointer ${selectedFilter === 'unpaid' ? 'font-bold bg-[#FA9F1B70]  transition-colors duration-300 text-[#fc9802e3]' : ''}`}
                        onClick={() => changeFilter('unpaid')}
                    >
                        Unpaid
                    </div>
                </div>

                {/* Table */}
                <table className="table-auto w-full">
                    <thead>
                        <tr className='bg-primary text-white'>
                            <th className="px-4 py-2 text-left w-[200px]">ID</th>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Role</th>
                            <th className="px-4 py-2 text-left">Amount</th>
                            <th className="px-4 py-2 text-left w-[100px]">Status</th>
                            <th className="px-4 py-2 text-left w-[100px]">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2 transition-colors duration-300">{item.userid}</td>
                                <td className="border px-4 py-2 transition-colors duration-300">{item.name}</td>
                                <td className="border px-4 py-2 transition-colors duration-300">{item.role}</td>
                                <td className="border px-4 py-2 transition-colors duration-300">₹ {item.amount}</td>
                                <td className={`border px-4 py-2 text-center ${item.status === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                                    {item.status === 'paid' ? (
                                        <button
                                            // onClick={() => giveAttendance(item.userid, 'present', "reset")}
                                            className="bg-supporting2 text-white px-4 py-2 rounded text-[12px] w-[18rem] flex items-center justify-between">
                                            <div>PAID</div> <FaCheck />
                                        </button>
                                    ) : item.status === 'unpaid' ? (
                                        <button
                                            // onClick={() => giveAttendance(item.userid, 'absent', "reset")}
                                            className="bg-bgred text-white px-4 py-2 rounded text-[12px] w-[18rem] flex items-center justify-between">
                                            <div>UNPAID</div> <RxCross2 />
                                        </button>
                                    ) : (
                                        <div className='flex gap-4 w-full justify-between'>
                                            <button
                                                // onClick={() => giveAttendance(item.userid, 'absent', "update")}
                                                className="bg-bgred text-white px-4 py-2 w-32 rounded text-[12px] flex items-center justify-between gap-10">
                                                <div>UNPAID</div> <RxCross2 className='font-bold'/>
                                            </button>
                                            <button
                                                // onClick={() => giveAttendance(item.userid, 'present', "update")}
                                                className="bg-supporting2 text-white px-4 py-2 w-32 rounded text-[12px]  flex justify-between items-center gap-10">
                                                <div>PAID  </div> <FaCheck />
                                            </button>
                                        </div>
                                    )}
                                </td>
                                <td className="border px-4 py-2 text-center">
                                    <div className='flex justify-center gap-4'>
                                        <button className="bg-primary text-white px-4 py-2 rounded text-[12px] flex items-center gap-2" onClick={() => handleEyeClick(item)}>
                                            <HiEye /> <span>View</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>


                {/* Pagination */}
                <div className="flex justify-end gap-2">
                    {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }).map((_, index) => (
                        <div
                            key={index}
                            className={`cursor-pointer ${currentPage === index + 1 ? 'bg-[#FA9F1B70] text-[#fc9802e3]' : ''}`}
                            onClick={() => paginate(index + 1)}
                            style={{ padding: '5px 10px', borderRadius: '5px' }}
                        >
                            {index + 1}
                        </div>
                    ))}
                </div>
            </section>


            {/* Details Popup */}
            {detailsPopupVisible && selectedItem && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 font-raleway">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-lg w-[25vw] border border-gray-300">
                        {/* Header */}
                        <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-5">
                            <h2 className="text-3xl font-semibold text-primary">Details</h2>
                            <button
                                onClick={() => setDetailsPopupVisible(false)}
                                className="text-gray-600 hover:text-red-600 font-extrabold transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* User Info Section */}
                        <div className="flex flex-col items-center gap-4">
                            <img className="w-28 h-28 object-cover rounded-full border-2 border-gray-300"
                                src={selectedItem.photo}
                                alt="Profile"
                            />
                            <div className="text-center">
                                <p className="text-xl font-semibold text-gray-800">{selectedItem.name}</p>
                                <p className="text-sm text-gray-500">{selectedItem.role}</p>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-gray-800 text-base mt-5">
                            <p className="font-medium">ID:</p> <p className="text-gray-600">{selectedItem.userid}</p>
                            <p className="font-medium">Mobile:</p> <p className="text-gray-600">{selectedItem.mobile}</p>
                            <p className="font-medium">Amount:</p>
                            <p className={`font-semibold ${selectedItem.status === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                                ₹{selectedItem.amount}
                            </p>
                            <p className="font-medium">Status:</p>
                            <p className={`font-semibold uppercase ${selectedItem.status === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                                {selectedItem.status}
                            </p>
                        </div>

                        {/* Account Details */}
                        <div className="bg-gray-100 p-5 rounded-lg mt-6 shadow-sm border">
                            <h3 className="text-lg font-semibold mb-3 text-gray-700">Account Details</h3>
                            <div className="grid grid-cols-2 gap-x-4 text-gray-700 text-sm">
                                <p className="font-medium">Account No.:</p> <p className="text-gray-600">{selectedItem.account_number}</p>
                                <p className="font-medium">IFSC Code:</p> <p className="text-gray-600">{selectedItem.ifsc_code}</p>
                                <p className="font-medium">Branch:</p> <p className="text-gray-600">{selectedItem.branch}</p>
                            </div>
                        </div>

                    </div>
                </div>
            )}


        </div>
    );
};

export default Page;
