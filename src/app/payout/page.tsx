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
    const [selectedItem, setSelectedItem] = useState(null); // State to store selected item data
    const [editData, setEditData] = useState({ amount: '', status: 'paid' });

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

    const paginate = (pageNumber:any) => setCurrentPage(pageNumber);

    const changeFilter = (filter:any) => {
        setSelectedFilter(filter);
        setCurrentPage(1); // Reset current page when changing filter
    };

    // Function to handle edit icon click
    const handleEditClick = (data:any) => {
        setEditData(data);
        setEditPopupVisible(true);
    };

    // Function to handle eye icon click
    const handleEyeClick = (data) => {
        setSelectedItem(data);
        setDetailsPopupVisible(true); // Show details popup
    };

    // Function to handle editing of data
    const handleEdit = () => {
        // Find the index of the item being edited in the sampleData array
        const dataIndex = sampleData.findIndex(item => item.id === editData.id);

        // If the item is found, update its properties with the edited values
        if (dataIndex !== -1) {
            const updatedData = [...sampleData];
            updatedData[dataIndex] = { ...updatedData[dataIndex], amount: editData.amount, status: editData.status };
            // Update the sampleData array directly
            sampleData.splice(0, sampleData.length, ...updatedData);
        }

        setEditPopupVisible(false); // Close the edit popup after editing
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
                                    <HiEye className="text-black cursor-pointer" onClick={() => handleEyeClick(item)} />
                                    <HiPencilAlt className="text-black cursor-pointer" onClick={() => handleEditClick(item)} />
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>

                {/* Pagination */}
                <div className='flex justify-end gap-2'>
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
                            <input type="text" id="amount" value={editData.amount} onChange={(e) => setEditData({ ...editData, amount: e.target.value })} className="border border-gray-300 rounded-md px-3 py-1 w-full" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="status" className="block text-gray-700">Status:</label>
                            <select id="status" value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })} className="border border-gray-300 rounded-md px-3 py-1 w-full">
                                <option value="paid">Paid</option>
                                <option value="unpaid">Unpaid</option>
                            </select>
                        </div>
                        <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 rounded-md">Save</button>
                    </div>
                </div>
            )}

            {/* Details Popup */}
            {detailsPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg w-[45rem] h-[30rem] relative overflow-hidden">
                        <div className='flex items-center gap-10'>
                            <div>
                                <img src={selectedItem.image} className='rounded-full' alt="" />
                            </div>
                            <div>
                                <h1><span className='font-bold'>UserID:</span> {selectedItem.id}</h1>
                                <h1><span className='font-bold'>Name:</span> {selectedItem.name}</h1>
                                <h1><span className='font-bold'>Mobile:</span> {selectedItem.mobile}</h1>
                                <h1><span className='font-bold'>Role:</span> {selectedItem.role}</h1>
                            </div>
                        </div>
                        <div className='mt-10'>
                            <h1 className='font-bold'>Payout Details</h1>
                            <table className="w-full border-collapse border border-gray-300 mt-4">
                                <thead className='bg-primary text-white py-2'>
                                    <tr>
                                        <td className='py-2 px-2'>Account Holder</td>
                                        <td className='py-2 px-2'>Account Number</td>
                                        <td className='py-2 px-2'>IFSC Code</td>
                                        <td className='py-2 px-2'>Branch</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className='py-2 px-2'>{selectedItem.accountHolder}</td>
                                        <td className='py-2 px-2'>{selectedItem.accountNumber}</td>
                                        <td className='py-2 px-2'>{selectedItem.ifsc}</td>
                                        <td className='py-2 px-2'>{selectedItem.branch}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className={`absolute bottom-0 left-0 bshadow w-full py-3 px-8 flex justify-between ${selectedItem.status === 'paid' ? 'bg-green-500' : 'bg-red-500'}`}>
                            <h1 className='text-[18px] font-bold'>{selectedItem.amount}</h1>
                            <h1 className='text-[18px] font-bold'>  {selectedItem && selectedItem.status === 'paid' ? selectedItem.dateofpayment : ''}</h1>
                            <h1 className={`text-[18px] font-bold capitalize`}>{selectedItem.status}</h1>
                        </div>
                        <button onClick={() => setDetailsPopupVisible(false)} className="absolute right-[40px] top-[10px] text-[35px] text-black px-4 py-2 rounded-md">x</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Page;