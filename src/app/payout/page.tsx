"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RowDataPacket } from 'mysql2';
import { HiEye } from 'react-icons/hi';
import { FaSearch, FaFileInvoiceDollar, FaCheck, FaMoneyBillWave } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import { Bars } from "react-loader-spinner";
import { BsCreditCard, BsBank, BsPerson } from 'react-icons/bs';
import { MdPayment } from 'react-icons/md';

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
    const [itemsPerPage] = useState(10);
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [detailsPopupVisible, setDetailsPopupVisible] = useState(false);
    const [payoutInfo, setPayoutInfo] = useState<PayoutInfo[]>([]);
    const [userInfo, setUserInfo] = useState<User[]>([]);
    const [mergedData, setMergedData] = useState<MergedUserPayout[]>([]);
    const [selectedItem, setSelectedItem] = useState<MergedUserPayout | null>(null);
    const [loading, setLoading] = useState(true);
    const [debugInfo, setDebugInfo] = useState<string | null>(null);

    // Filter data based on search query and selected filter
    const filteredData = mergedData.filter(item =>
        (selectedFilter === 'All' || item.status === selectedFilter.toLowerCase()) &&
        (item.userid.toLowerCase().includes(searchQuery.toLowerCase()) || 
         item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         item.role.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Paginate data
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const changeFilter = (filter: string) => {
        setSelectedFilter(filter);
        setCurrentPage(1); // Reset to first page when changing filter
    };

    const handleViewDetails = (item: MergedUserPayout) => {
        setSelectedItem(item);
        setDetailsPopupVisible(true);
    };

    useEffect(() => {
        document.title = "Payouts";
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch payout information
            const payoutResponse = await axios.get('/api/payout');
            if (payoutResponse.data?.payout) {
                setPayoutInfo(payoutResponse.data.payout);
                setDebugInfo(null);
            } else {
                console.error("Failed to fetch payout data:", payoutResponse.data);
                setDebugInfo("Failed to fetch payout data");
            }

            // Fetch user information
            const userResponse = await axios.get('/api/members');
            if (userResponse.data?.users) {
                const { users, payouts, addresses } = userResponse.data;
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
            } else {
                console.error("Failed to fetch user data:", userResponse.data);
                setDebugInfo(prev => prev || "Failed to fetch user data");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setDebugInfo(`Error fetching data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Merge user and payout data
        if (payoutInfo.length > 0 && userInfo.length > 0) {
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
        }
    }, [userInfo, payoutInfo]);

    // Get appropriate status color and label
    const getStatusInfo = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return {
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-800',
                    label: 'PAID'
                };
            case 'unpaid':
                return {
                    bgColor: 'bg-red-100',
                    textColor: 'text-red-800',
                    label: 'UNPAID'
                };
            default:
                return {
                    bgColor: 'bg-yellow-100',
                    textColor: 'text-yellow-800',
                    label: 'PENDING'
                };
        }
    };

    return (
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 font-sans">
            {/* Debug Information */}
            {debugInfo && (
                <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg border border-yellow-200">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <p className="font-medium">Debug Info: {debugInfo}</p>
                    </div>
                    <div className="mt-2 text-sm">
                        <p>Payouts Count: {payoutInfo.length}</p>
                        <p>Users Count: {userInfo.length}</p>
                        <button 
                            onClick={fetchData}
                            className="mt-2 px-3 py-1 bg-yellow-200 hover:bg-yellow-300 rounded-md text-yellow-800 text-xs font-medium"
                        >
                            Retry Loading Data
                        </button>
                    </div>
                </div>
            )}

            {/* Page Header */}
            <div className="flex items-center mb-8">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#1e4569] to-[#2c5983] flex items-center justify-center mr-4 shadow-lg">
                    <FaMoneyBillWave className="text-white" size={24} />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Staff Payouts</h1>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Header with search and filters */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="search"
                                placeholder="Search by ID, name or role..."
                                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e4569] focus:border-[#1e4569] w-full transition-all duration-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex space-x-3">
                            {['All', 'Paid', 'Unpaid'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => changeFilter(filter)}
                                    className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                                        selectedFilter === filter 
                                        ? 'bg-gradient-to-r from-[#1e4569] to-[#2c5983] text-white shadow-md' 
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Table content */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center py-16">
                            <Bars height="50" width="50" color="#1e4569" ariaLabel="bars-loading" />
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200 table-fixed">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="w-24 px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="w-48 px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="w-32 px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="w-32 px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="w-28 px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="w-52 px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.length > 0 ? (
                                    currentItems.map((item) => {
                                        const statusInfo = getStatusInfo(item.status);
                                        return (
                                            <tr key={item.userid} className="hover:bg-gray-50 transition duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {item.userid}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <BsPerson className="mr-2 text-gray-400" />
                                                        {item.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.role}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    ₹ {item.amount}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                                                        {statusInfo.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex flex-wrap gap-2">
                                                        <button 
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-[#1e4569] hover:bg-[#2c5983] transition-all duration-200 shadow-sm hover:shadow-md"
                                                            onClick={() => handleViewDetails(item)}
                                                        >
                                                            <HiEye className="mr-1.5" /> View
                                                        </button>
                                                        {item.status !== 'paid' && (
                                                            <button
                                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
                                                            >
                                                                <FaCheck className="mr-1.5" /> Paid
                                                            </button>
                                                        )}
                                                        {item.status !== 'unpaid' && item.status !== 'null' && (
                                                            <button
                                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                                                            >
                                                                <RxCross2 className="mr-1.5" /> Unpaid
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-16 text-center">
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
                                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                    />
                                                </svg>
                                                <p className="text-lg font-medium">No payouts available</p>
                                                <p className="mt-1 text-sm">Try adjusting your search or filter to find what you&apos;re looking for.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {filteredData.length > 0 && (
                    <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                            Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">
                                {Math.min(indexOfLastItem, filteredData.length)}
                            </span> of <span className="font-medium">{filteredData.length}</span> results
                        </div>
                        <nav className="flex items-center space-x-2">
                            <button
                                onClick={() => paginate(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                                    currentPage === 1 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                                }`}
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(page => 
                                    page === 1 || 
                                    page === totalPages || 
                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                )
                                .map((page, index, array) => {
                                    const prevPage = array[index - 1];
                                    const showEllipsis = prevPage && page - prevPage > 1;
                                    
                                    return (
                                        <React.Fragment key={page}>
                                            {showEllipsis && (
                                                <span className="px-4 py-2 text-gray-500">...</span>
                                            )}
                                            <button
                                                onClick={() => paginate(page)}
                                                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                                                    currentPage === page 
                                                    ? 'bg-gradient-to-r from-[#1e4569] to-[#2c5983] text-white shadow-md' 
                                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        </React.Fragment>
                                    );
                                })
                            }
                            <button
                                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                                    currentPage === totalPages 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                                }`}
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {detailsPopupVisible && selectedItem && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-auto animate-scaleIn">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#1e4569] to-[#2c5983] text-white p-6 rounded-t-2xl sticky top-0 z-10">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <MdPayment className="text-white" size={24} />
                                    Payout Details
                                </h3>
                                <button
                                    onClick={() => setDetailsPopupVisible(false)}
                                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition-all duration-200"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="text-sm text-white/90">
                                ID: {selectedItem.userid}
                            </div>
                        </div>

                        {/* Staff Info */}
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                                    <p className="text-xs text-gray-500 mb-1">Name</p>
                                    <p className="font-medium text-gray-900">{selectedItem.name}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                                    <p className="text-xs text-gray-500 mb-1">Role</p>
                                    <p className="font-medium text-gray-900">{selectedItem.role}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                                    <p className="text-xs text-gray-500 mb-1">Mobile</p>
                                    <p className="font-medium text-gray-900">{selectedItem.mobile}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                                    <p className="text-xs text-gray-500 mb-1">Amount</p>
                                    <p className="font-medium text-gray-900">₹ {selectedItem.amount}</p>
                                </div>
                            </div>

                            {/* Bank Details Section */}
                            <h2 className="font-semibold text-gray-800 mb-4 flex items-center">
                                <BsBank className="mr-2 text-[#1e4569]" size={20} /> 
                                Bank Details
                            </h2>
                            <div className="bg-gray-50 rounded-xl p-5 mb-6 shadow-sm">
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Account Number:</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {selectedItem.account_number || 'Not provided'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">IFSC Code:</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {selectedItem.ifsc_code || 'Not provided'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Branch:</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {selectedItem.branch || 'Not provided'}
                                        </span>
                                    </div>
                                    {selectedItem.upi_id && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">UPI ID:</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {selectedItem.upi_id}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status Section */}
                            <h2 className="font-semibold text-gray-800 mb-4 flex items-center">
                                <FaCheck className="mr-2 text-[#1e4569]" size={20} /> 
                                Payment Status
                            </h2>
                            <div className="bg-[#1e4569]/5 rounded-xl p-5 mb-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Status</span>
                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                                        selectedItem.status === 'paid' 
                                        ? 'bg-green-100 text-green-800' 
                                        : selectedItem.status === 'unpaid'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {selectedItem.status === 'paid' 
                                            ? 'PAID' 
                                            : selectedItem.status === 'unpaid'
                                            ? 'UNPAID'
                                            : 'PENDING'
                                        }
                                    </span>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="mt-6 flex flex-wrap gap-2 justify-end">
                                <button
                                    onClick={() => setDetailsPopupVisible(false)}
                                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
        </div>
    );
};

export default Page;
