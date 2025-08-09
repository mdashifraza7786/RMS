"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RowDataPacket } from 'mysql2';
import { HiEye } from 'react-icons/hi';
import { FaSearch, FaFileInvoiceDollar, FaCheck, FaMoneyBillWave, FaUserSlash } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import { Bars } from "react-loader-spinner";
import { BsBank, BsPerson } from 'react-icons/bs';
import { MdPayment } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const [activeTab, setActiveTab] = useState('all');
    const [detailsPopupVisible, setDetailsPopupVisible] = useState(false);
    const [payoutInfo, setPayoutInfo] = useState<PayoutInfo[]>([]);
    const [userInfo, setUserInfo] = useState<User[]>([]);
    const [mergedData, setMergedData] = useState<MergedUserPayout[]>([]);
    const [selectedItem, setSelectedItem] = useState<MergedUserPayout | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
      const [generating, setGenerating] = useState(false);
    const [debugInfo, setDebugInfo] = useState<string | null>(null);

    const filteredData = mergedData.filter(item =>
        (activeTab === 'all' || item.status === activeTab.toLowerCase()) &&
        (item.userid.toLowerCase().includes(searchQuery.toLowerCase()) || 
         item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         item.role.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
            const payoutResponse = await axios.get('/api/payout');
            if (payoutResponse.data?.payout) {
                setPayoutInfo(payoutResponse.data.payout);
                setDebugInfo(null);
            } else {
                console.error("Failed to fetch payout data:", payoutResponse.data);
                setDebugInfo("Failed to fetch payout data");
            }

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

      const handleGeneratePayouts = async () => {
          if (generating) return;
          setGenerating(true);
          try {
              const res = await axios.get('/api/payout/generate');
              if (res.status === 200) {
                  toast.success('Payout generated for this month');
              } else if (res.status === 209) {
                  toast.info(res.data?.message || 'Payout already generated for this month');
              } else {
                  toast.warn(res.data?.message || 'Unexpected response from server');
              }
              await fetchData();
          } catch (error) {
              console.error('Error generating payouts:', error);
              toast.error(`Failed to generate payouts: ${error instanceof Error ? error.message : 'Unknown error'}`);
          } finally {
              setGenerating(false);
          }
      };

    const updatePayoutStatus = async (userId: string, newStatus: string) => {
        setActionLoading(true);
        try {
            const response = await axios.post('/api/payout/update', {
                userid: userId,
                status: newStatus
            });

            if (response.status === 200) {
                setPayoutInfo(prev => 
                    prev.map(payout => 
                        payout.userid === userId 
                            ? { ...payout, status: newStatus } 
                            : payout
                    )
                );

                setMergedData(prev => 
                    prev.map(item => 
                        item.userid === userId 
                            ? { ...item, status: newStatus } 
                            : item
                    )
                );

                if (selectedItem && selectedItem.userid === userId) {
                    setSelectedItem({ ...selectedItem, status: newStatus });
                }

                toast.success(`Payout for ${userId} marked as ${newStatus}`);
            } else {
                toast.error("Failed to update payout status");
            }
        } catch (error) {
            console.error("Error updating payout status:", error);
            toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setActionLoading(false);
        }
    };

    const handleMarkAsPaid = (userId: string) => {
        updatePayoutStatus(userId, 'paid');
    };

    const handleMarkAsUnpaid = (userId: string) => {
        updatePayoutStatus(userId, 'unpaid');
    };

    useEffect(() => {
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

    const formatCurrency = (amount: string | number | null | undefined) => {
        if (amount === null || amount === undefined) return '₹ 0.00';
        
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(numAmount).replace('₹', '₹ ');
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'unpaid':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const tabs = [
        { id: 'all', label: 'All Payouts' },
        { id: 'paid', label: 'Paid' },
        { id: 'unpaid', label: 'Unpaid' },
        { id: 'pending', label: 'Pending' }
    ];

    return (
        <div className="container mx-auto px-6 pt-4 pb-8">
            <ToastContainer position="top-right" autoClose={3000} />
            
            <div className="py-4">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-semibold text-gray-800">Staff Payouts</h1>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="search"
                                placeholder="Search by ID, name or role..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary w-full md:w-80"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleGeneratePayouts}
                                disabled={generating || loading}
                                className={`inline-flex items-center px-4 py-2 rounded-lg text-white transition ${
                                    generating || loading
                                        ? 'bg-primary/60 cursor-not-allowed'
                                        : 'bg-primary hover:bg-primary/80'
                                }`}
                            >
                                <FaFileInvoiceDollar className="mr-2" />
                                {generating ? 'Generating...' : 'Generate Payouts'}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 border-b border-gray-200">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${activeTab === tab.id
                                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Bars height="50" width="50" color="primary" ariaLabel="bars-loading" />
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {[
                                        { id: "userId", label: "User ID" },
                                        { id: "name", label: "Name" },
                                        { id: "role", label: "Role" },
                                        { id: "amount", label: "Amount" },
                                        { id: "accountNumber", label: "Account Number" },
                                        { id: "status", label: "Status" },
                                        { id: "action", label: "Action" }
                                    ].map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            {header.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.length > 0 ? (
                                    currentItems.map((item) => (
                                        <tr key={item.userid} className="hover:bg-gray-50 transition duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                #{item.userid}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <BsPerson className="mr-1 text-gray-400" />
                                                    {item.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.role}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatCurrency(item.amount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.account_number || "Not provided"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                                    {item.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary hover:bg-primary/80 transition"
                                                        onClick={() => handleViewDetails(item)}
                                                    >
                                                        View Details
                                                    </button>
                                                    {item.status !== 'paid' && (
                                                        <button
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition"
                                                            onClick={() => handleMarkAsPaid(item.userid)}
                                                            disabled={actionLoading}
                                                        >
                                                            <FaCheck className="mr-1.5" /> Paid
                                                        </button>
                                                    )}
                                                    {item.status !== 'unpaid' && (
                                                        <button
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition"
                                                            onClick={() => handleMarkAsUnpaid(item.userid)}
                                                            disabled={actionLoading}
                                                        >
                                                            <RxCross2 className="mr-1.5" /> Unpaid
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <FaUserSlash className="text-primary text-2xl mb-2" />
                                                <p className="text-lg font-medium">No payouts available</p>
                                                <p className="mt-1 text-sm">Try adjusting your search or selecting a different tab.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

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
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
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
                                                className={`px-4 py-2 rounded-lg transition-all ${
                                                    currentPage === page 
                                                    ? 'bg-primary text-white' 
                                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
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
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                )}
            </div>

            {detailsPopupVisible && selectedItem && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-auto animate-scaleIn">
                        <div className="bg-primary text-white p-5 rounded-t-xl sticky top-0 z-10">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <MdPayment />
                                    Payout Details
                                </h3>
                                <button
                                    onClick={() => setDetailsPopupVisible(false)}
                                    className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="text-sm text-white/80 flex items-center">
                                ID: #{selectedItem.userid}
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Name</p>
                                    <p className="font-medium text-gray-900">{selectedItem.name}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Role</p>
                                    <p className="font-medium text-gray-900">{selectedItem.role}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Mobile</p>
                                    <p className="font-medium text-gray-900">{selectedItem.mobile}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Amount</p>
                                    <p className="font-medium text-gray-900">{formatCurrency(selectedItem.amount)}</p>
                                </div>
                            </div>

                            <h2 className="font-semibold text-gray-800 mb-3">Bank Details</h2>
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <ul className="divide-y divide-gray-200">
                                    <li className="py-3 flex justify-between items-center">
                                        <p className="text-sm text-gray-500">Account Number</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {selectedItem.account_number || 'Not provided'}
                                        </p>
                                    </li>
                                    <li className="py-3 flex justify-between items-center">
                                        <p className="text-sm text-gray-500">IFSC Code</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {selectedItem.ifsc_code || 'Not provided'}
                                        </p>
                                    </li>
                                    <li className="py-3 flex justify-between items-center">
                                        <p className="text-sm text-gray-500">Branch</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {selectedItem.branch || 'Not provided'}
                                        </p>
                                    </li>
                                    {selectedItem.upi_id && (
                                        <li className="py-3 flex justify-between items-center">
                                            <p className="text-sm text-gray-500">UPI ID</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {selectedItem.upi_id}
                                            </p>
                                        </li>
                                    )}
                                </ul>
                            </div>

                                <div className="bg-primary/5 rounded-lg p-4 mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Status</span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedItem.status)}`}>
                                        {selectedItem.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-2 justify-end">
                                {selectedItem.status !== 'paid' && (
                                    <button
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg flex items-center justify-center"
                                        onClick={() => handleMarkAsPaid(selectedItem.userid)}
                                        disabled={actionLoading}
                                    >
                                        <FaCheck className="mr-2" />
                                        Mark as Paid
                                    </button>
                                )}
                                {selectedItem.status !== 'unpaid' && (
                                    <button
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg flex items-center justify-center"
                                        onClick={() => handleMarkAsUnpaid(selectedItem.userid)}
                                        disabled={actionLoading}
                                    >
                                        <RxCross2 className="mr-2" />
                                        Mark as Unpaid
                                    </button>
                                )}
                                <button
                                    onClick={() => setDetailsPopupVisible(false)}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg"
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