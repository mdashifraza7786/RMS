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
    const [selectedItem, setSelectedItem] = useState({id: '', name: '', role: '',amount: '', status: ''}); // State to store selected item data
    const [editData, setEditData] = useState({ amount: '', status: 'paid',id: '' });

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
                                <td className="border px-4 py-2 flex gap-[10px] text-[20px]">
                                    <div className='flex gap-4 justify-center'>
                                        <button  className="bg-primary text-white px-4 py-2 rounded text-[12px] flex items-center gap-10" onClick={() => handleEyeClick(item)}><div>View</div> <HiEye /></button>
                                        <button  className="bg-primary text-white px-4 py-2 rounded text-[12px] flex items-center gap-10" onClick={() => handleEditClick(item)}><div>Edit</div> <HiPencilAlt /></button>
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

            {/* Edit Popup */}
            {editPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Edit Data</h2>
                        <div className="mb-4">
                            <label htmlFor="amount" className="block text-gray-700">Amount:</label>
                            <input
                                type="text"
                                id="amount"
                                value={editData.amount}
                                onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                                className="border border-gray-300 rounded-md px-3 py-1 w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="status" className="block text-gray-700">Status:</label>
                            <select
                                id="status"
                                value={editData.status}
                                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                className="border border-gray-300 rounded-md px-3 py-1 w-full"
                            >
                                <option value="paid">Paid</option>
                                <option value="unpaid">Unpaid</option>
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setEditPopupVisible(false)}
                                className="bg-gray-200 text-gray-700 rounded-md px-4 py-2 mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEdit}
                                className="bg-blue-500 text-white rounded-md px-4 py-2"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Details Popup */}
            {detailsPopupVisible && selectedItem && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Details</h2>
                        <div className="mb-4">
                            <p><strong>ID:</strong> {selectedItem.id}</p>
                            <p><strong>Name:</strong> {selectedItem.name}</p>
                            <p><strong>Role:</strong> {selectedItem.role}</p>
                            <p><strong>Amount:</strong> {selectedItem.amount}</p>
                            <p><strong>Status:</strong> {selectedItem.status}</p>
                            {/* Add more details if necessary */}
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
        </div>
    );
};

export default Page;
