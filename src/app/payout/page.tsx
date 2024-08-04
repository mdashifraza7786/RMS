"use client"
import React, { useState } from 'react';
import { HiEye, HiPencilAlt } from 'react-icons/hi';

const sampleData = [
    { id: '#CHEF119', image: 'https://placehold.co/150x150', mobile: '+91-7643088251', accountHolder: 'John Doe', accountNumber: '3928415252', ifsc: 'CBIN0248596', branch: 'Marwan', dateofpayment: '02-12-2024 12:03 PM', name: 'John Doe', role: 'Chef', amount: '₹20,000', status: 'paid' },
    { id: '#CHEF120', image: 'https://placehold.co/150x150', mobile: '+91-7643088251', accountHolder: 'John Doe', accountNumber: '3928415252', ifsc: 'CBIN0248596', branch: 'Marwan', dateofpayment: '02-12-2024 12:03 PM', name: 'Jane Smith', role: 'Chef', amount: '₹20,000', status: 'unpaid' },
    { id: '#WAITER121', image: 'https://placehold.co/150x150', mobile: '+91-7643088251', accountHolder: 'John Doe', accountNumber: '3928415252', ifsc: 'CBIN0248596', branch: 'Marwan', dateofpayment: '02-12-2024 12:03 PM', name: 'Alice Johnson', role: 'Waiter', amount: '₹10,000', status: 'paid' },
    { id: '#WAITER122', image: 'https://placehold.co/150x150', mobile: '+91-7643088251', accountHolder: 'John Doe', accountNumber: '3928415252', ifsc: 'CBIN0248596', branch: 'Marwan', dateofpayment: '02-12-2024 12:03 PM', name: 'Bob Brown', role: 'Waiter', amount: '₹10,000', status: 'paid' },
    { id: '#WAITER124', image: 'https://placehold.co/150x150', mobile: '+91-7643088251', accountHolder: 'John Doe', accountNumber: '3928415252', ifsc: 'CBIN0248596', branch: 'Marwan', dateofpayment: '02-12-2024 12:03 PM', name: 'Bob Brown', role: 'Waiter', amount: '₹10,000', status: 'paid' },
    { id: '#CHEF125', image: 'https://placehold.co/150x150', mobile: '+91-7643088251', accountHolder: 'John Doe', accountNumber: '3928415252', ifsc: 'CBIN0248596', branch: 'Marwan', dateofpayment: '02-12-2024 12:03 PM', name: 'Bob Brown', role: 'Chef', amount: '₹10,000', status: 'paid' },
    { id: '#WAITER126', image: 'https://placehold.co/150x150', mobile: '+91-7643088251', accountHolder: 'John Doe', accountNumber: '3928415252', ifsc: 'CBIN0248596', branch: 'Marwan', dateofpayment: '02-12-2024 12:03 PM', name: 'Bob Brown', role: 'Waiter', amount: '₹10,000', status: 'paid' },
];

const Page = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [editPopupVisible, setEditPopupVisible] = useState(false);
    const [detailsPopupVisible, setDetailsPopupVisible] = useState(false); // State for details popup
    const [selectedItem, setSelectedItem] = useState({ id: '', name: '', role: '', amount: '', status: '', image: null, mobile: '', accountHolder: '', accountNumber: '', ifsc: '', branch: '' }); // State to store selected item data
    const [editData, setEditData] = useState({ amount: '', status: 'paid', id: '' });

    // Logic to filter data based on search query and selected filter
    const filteredData = sampleData.filter(item =>
        (selectedFilter === 'All' || item.status === selectedFilter)
        &&
        (item.id.toLowerCase() === searchQuery.toLowerCase() || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
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

    // Function to handle edit icon click
    const handleEditClick = (data: any) => {
        setEditData(data);
        setEditPopupVisible(true);
    };

    // Function to handle eye icon click
    const handleEyeClick = (data: any) => {
        setSelectedItem(data);
        setDetailsPopupVisible(true); // Show details popup
    };


    const handleEdit = () => {

        const dataIndex = sampleData.findIndex(item => item.id === editData.id);


        if (dataIndex !== -1) {
            const updatedData = [...sampleData];
            updatedData[dataIndex] = { ...updatedData[dataIndex], amount: editData.amount, status: editData.status };

            sampleData.splice(0, sampleData.length, ...updatedData);
        }

        setEditPopupVisible(false);
    };

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
                        className={`px-[10px] rounded-xl cursor-pointer ${selectedFilter === 'All' ? 'font-bold bg-[#FA9F1B70]  transition-colors duration-300 text-[#fc9802e3]' : ''}`}
                        onClick={() => changeFilter('All')}
                    >
                        All
                    </div>
                    <div
                        className={`px-[10px] rounded-xl cursor-pointer ${selectedFilter === 'paid' ? 'font-bold bg-[#FA9F1B70]  transition-colors duration-300 text-[#fc9802e3]' : ''}`}
                        onClick={() => changeFilter('paid')}
                    >
                        Paid
                    </div>
                    <div
                        className={`px-[10px] rounded-xl cursor-pointer ${selectedFilter === 'unpaid' ? 'font-bold bg-[#FA9F1B70]  transition-colors duration-300 text-[#fc9802e3]' : ''}`}
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
                            <th className="px-4 py-2 text-left w-[100px]">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2 transition-colors duration-300">{item.id}</td>
                                <td className="border px-4 py-2 transition-colors duration-300">{item.name}</td>
                                <td className="border px-4 py-2 transition-colors duration-300">{item.role}</td>
                                <td className={`${item.status === 'paid' ? 'text-green-600' : 'text-red-600'} font-bold border px-4 py-2 transition-colors duration-300`}>{item.amount}</td>
                                <td className="border px-4 py-2 text-center">
                                    <div className='flex justify-center gap-4'>
                                        <button className="bg-primary text-white px-4 py-2 rounded text-[12px] flex items-center gap-2" onClick={() => handleEyeClick(item)}>
                                            <HiEye /> <span>View</span>
                                        </button>
                                        <button className="bg-primary text-white px-4 py-2 rounded text-[12px] flex items-center gap-2" onClick={() => handleEditClick(item)}>
                                            <HiPencilAlt /> <span>Edit</span>
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
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full border border-gray-300 overflow-hidden">
                        <h2 className="text-3xl font-bold mb-8 text-primary border-b border-gray-200 pb-2">Details</h2>
                        <div className="flex flex-col gap-6">
                            <div className="flex items-start overflow-x-auto">
                                <div className="flex-shrink-0">
                                    <img className="w-[120px] h-[120px] object-cover rounded-full" src={selectedItem.image} alt="Profile" />
                                </div>
                                <div className="flex flex-col ml-6">
                                    <div className="grid grid-cols-2 gap-x-4 text-gray-800 text-medium">
                                        <div className="font-medium"><strong>ID:</strong></div>
                                        <div className="text-secondary font-semibold">{selectedItem.id}</div>

                                        <div className="font-medium"><strong>Name:</strong></div>
                                        <div className="text-secondary font-semibold">{selectedItem.name}</div>

                                        <div className="font-medium"><strong>Role:</strong></div>
                                        <div className="text-secondary font-semibold">{selectedItem.role}</div>

                                        <div className="font-medium"><strong>Amount:</strong></div>
                                        <div className={`font-semibold ${selectedItem.status === 'paid' ? 'text-green-600' : 'text-bgred'}`}>
                                            {selectedItem.amount}
                                        </div>

                                        <div className="font-medium"><strong>Status:</strong></div>
                                        <div className={`font-semibold ${selectedItem.status === 'paid' ? 'text-green-600' : 'text-bgred'}`}>
                                            {selectedItem.status === 'paid' ? 'PAID' : 'UNPAID'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 overflow-x-auto">
                                <h3 className="text-2xl font-semibold mb-4 text-primary">Account Details</h3>
                                <table className="w-full text-gray-800 border-collapse">
                                    <tbody>
                                        <tr className="border-b border-gray-200">
                                            <td className="py-2 font-medium">Account Number:</td>
                                            <td className="py-2 font-semibold text-secondary">{selectedItem.accountNumber}</td>
                                        </tr>
                                        <tr className="border-b border-gray-200">
                                            <td className="py-2 font-medium">IFSC Code:</td>
                                            <td className="py-2 font-semibold text-secondary">{selectedItem.ifsc}</td>
                                        </tr>
                                        <tr className="border-b border-gray-200">
                                            <td className="py-2 font-medium">Branch:</td>
                                            <td className="py-2 font-semibold text-secondary">{selectedItem.branch}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setDetailsPopupVisible(false)}
                                className="bg-red-600 font-bold text-white rounded-md px-6 py-3 hover:bg-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                            >
                                CLOSE
                            </button>
                        </div>
                    </div>
                </div>



            )}


            {/* Edit Popup */}
            {editPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-300">
                        <h2 className="text-2xl font-semibold mb-6 text-primary">Edit Data</h2>
                        <div className="mb-4">
                            <label htmlFor="amount" className="block text-gray-800">Amount:</label>
                            <input
                                type="text"
                                id="amount"
                                value={editData.amount}
                                onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                                className="border border-gray-300 rounded-md px-3 py-2 font-semibold w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="status" className="block text-gray-800">Status:</label>
                            <select
                                id="status"
                                value={editData.status}
                                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                className="border font-semibold border-gray-300 rounded-md px-3 py-2 w-full"
                            >
                                <option value="paid" className="text-green-600 font-semibold">Paid</option>
                                <option value="unpaid" className="text-bgred font-semibold">Unpaid</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditPopupVisible(false)}
                                className="bg-red-500 text-white font-bold rounded-md px-4 py-2 hover:bg-red-300 transition-colors"
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={handleEdit}
                                className="bg-supporting2 text-white font-bold rounded-md px-4 py-2 hover:bg-[#a8b38d] transition-colors"
                            >
                                SAVE
                            </button>
                        </div>
                    </div>
                </div>
            )}



        </div>
    );
};

export default Page;
