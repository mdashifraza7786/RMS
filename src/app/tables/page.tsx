"use client";
import { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { MdTableBar, MdTableRestaurant } from "react-icons/md";
import { BiTable } from "react-icons/bi";
import { Bars } from 'react-loader-spinner';

interface Table {
    id: number;
    tablenumber: string;
    availability: number;
}

const TableManagement = () => {
    const [tables, setTables] = useState<Table[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tableNumber, setTableNumber] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    // Delete confirmation state
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteTableId, setDeleteTableId] = useState<number | null>(null);
    const [deleteTableNumber, setDeleteTableNumber] = useState("");
    const [deleteConfirmText, setDeleteConfirmText] = useState("");

    useEffect(() => {
        fetchTables();
        document.title = "Table Management";
    }, []);

    const fetchTables = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/tables");
            const data = await response.json();
            setTables(data.tables);
        } catch (error) {
            console.error("Error fetching tables:", error);
        } finally {
            setLoading(false);
        }
    };

    const addTable = async () => {
        setError(null);
    
        const trimmedTableNumber = String(tableNumber).trim();
    
        if (!trimmedTableNumber) {
            setError("Table number cannot be empty.");
            return;
        }
    
        if (Array.isArray(tables) && tables.some(table => String(table.tablenumber).trim() === trimmedTableNumber)) {
            setError(`Table number "${trimmedTableNumber}" is already added.`);
            return;
        }
    
        try {
            setLoading(true);
            const response = await fetch("/api/tables", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tablenumber: trimmedTableNumber }),
            });
    
            if (response.ok) {
                await fetchTables();
                setTableNumber("");
                setIsModalOpen(false);
            } else {
                setError("Failed to add table.");
            }
        } catch (error) {
            console.error("Error adding table:", error);
            setError("An error occurred while adding the table.");
        } finally {
            setLoading(false);
        }
    };
    
    const openDeleteModal = (id: number, tableNumber: string) => {
        setDeleteTableId(id);
        setDeleteTableNumber(tableNumber);
        setDeleteModalVisible(true);
        setDeleteConfirmText("");
    };

    const deleteTable = async () => {
        if (!deleteTableId) return;
        
        try {
            setDeleteLoading(true);
            const response = await fetch(`/api/tables/${deleteTableId}`, { method: "DELETE" });

            if (response.ok) {
                await fetchTables();
                setDeleteModalVisible(false);
            } else {
                console.error("Failed to delete table");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setDeleteLoading(false);
            setDeleteTableId(null);
            setDeleteTableNumber("");
            setDeleteConfirmText("");
        }
    };

    return (
        <div className='bg-[#e6e6e6] py-[5vh] px-[8vw] font-raleway flex flex-col gap-[4vh]'>
            <div className='flex items-center justify-between'>
                <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                    <MdTableRestaurant className="text-primary" size={28} />
                    Table Management
                </h1>
            </div>

            <section className='bg-white rounded-xl shadow-md p-6 font-semibold flex flex-col gap-5 relative'>
                <div className='flex justify-between items-center'>
                    <div className="text-gray-500 font-medium">
                        Manage restaurant tables
                    </div>
                    <button
                        className='bg-[#9FCC2E] hover:bg-[#8bba1e] text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-200 shadow-sm flex items-center gap-2.5'
                        onClick={() => setIsModalOpen(true)}
                    >
                        <FaPlus size={14} />
                        <span>Add Table</span>
                    </button>
                </div>

                {loading ? (
                    <div className='flex justify-center items-center py-10'>
                        <Bars
                            height="50"
                            width="50"
                            color="#25476A"
                            ariaLabel="loading-tables"
                            visible={true}
                        />
                    </div>
                ) : tables && tables.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="table-fixed w-full border-collapse">
                            <thead>
                                <tr className='bg-primary text-white font-light'>
                                    <th className="px-4 py-3 text-left w-[40%]">Table Number</th>
                                    <th className="px-4 py-3 text-left w-[40%]">Status</th>
                                    <th className="px-4 py-3 text-left w-[20%]">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tables.map((item) => (
                                    <tr key={item.id} className="text-[14px] font-medium font-montserrat hover:bg-gray-50 transition-colors duration-200">
                                        <td className="border border-gray-200 px-4 py-4 transition-colors duration-300">
                                            <div className="flex items-center gap-2">
                                                <BiTable className="text-primary" size={18} />
                                                <span>Table #{item.tablenumber}</span>
                                            </div>
                                        </td>
                                        <td className="border border-gray-200 px-4 py-4 transition-colors duration-300">
                                            {item.availability === 0 ? (
                                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">Available</span>
                                            ) : (
                                                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">Occupied</span>
                                            )}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-4 transition-colors duration-300">
                                            <button
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                                                onClick={() => openDeleteModal(item.id, item.tablenumber)}
                                            >
                                                <FaTrash size={12} /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className='flex flex-col justify-center items-center py-10 text-gray-500'>
                        <MdTableBar size={48} className="mb-3 text-gray-300" />
                        <p>No tables added yet</p>
                        <p className="text-sm mt-1">Click the &quot;Add Table&quot; button to create your first table</p>
                    </div>
                )}
            </section>

            {/* Add Table Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
                    <div className="bg-white shadow-2xl rounded-xl p-6 w-full max-w-md relative animate-fadeIn">
                        {loading && (
                            <div className='absolute inset-0 flex justify-center items-center bg-white bg-opacity-90 rounded-xl z-10'>
                                <Bars
                                    height="60"
                                    width="60"
                                    color="#25476A"
                                    ariaLabel="loading"
                                    visible={true}
                                />
                            </div>
                        )}
                        
                        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-5">
                            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                                <BiTable className="text-[#9FCC2E]" size={24} />
                                Add New Table
                            </h2>
                            <button 
                                className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
                                onClick={() => setIsModalOpen(false)}
                            >
                                <FaTimes size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Table Number
                                </label>
                                <input
                                    type='text'
                                    placeholder='Enter table number (e.g. 1, 2, 3)'
                                    className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all'
                                    value={tableNumber}
                                    onChange={(e) => { 
                                        error && setError(null);
                                        setTableNumber(e.target.value);
                                    }}
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg flex items-start">
                                    <div className="mr-2 mt-0.5">⚠️</div>
                                    <div>{error}</div>
                                </div>
                            )}

                            <div className="flex justify-end pt-3 border-t border-gray-200 mt-2">
                                <div className="flex gap-3">
                                    <button 
                                        type="button" 
                                        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        className="bg-[#9FCC2E] hover:bg-[#8bba1e] text-white font-semibold px-8 py-2.5 rounded-lg transition-colors duration-200 shadow-sm"
                                        onClick={addTable}
                                        disabled={loading}
                                    >
                                        {loading ? "Adding..." : "Add Table"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModalVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
                    <div className="bg-white shadow-2xl rounded-xl p-8 max-w-md w-full animate-fadeIn">
                        {deleteLoading && (
                            <div className='absolute inset-0 flex justify-center items-center bg-white bg-opacity-90 rounded-xl z-10'>
                                <Bars
                                    height="60"
                                    width="60"
                                    color="#25476A"
                                    ariaLabel="deleting"
                                    visible={true}
                                />
                            </div>
                        )}
                        
                        <div className="text-center mb-6">
                            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <FaTrash className="text-red-500" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Delete Table</h2>
                            <p className="text-gray-600">
                                Are you sure you want to delete <span className="font-bold text-primary">Table #{deleteTableNumber}</span>? This action cannot be undone.
                            </p>
                        </div>
                        
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Type &quot;delete&quot; to confirm
                            </label>
                            <input
                                type="text"
                                placeholder="delete"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex justify-end gap-3">
                            <button 
                                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                                onClick={() => setDeleteModalVisible(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={deleteTable}
                                disabled={deleteConfirmText !== "delete" || deleteLoading}
                            >
                                Delete Table
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TableManagement;
