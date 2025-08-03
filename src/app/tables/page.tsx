"use client";
import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaSearch } from "react-icons/fa";
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
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");

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

    const filteredTables = tables.filter(table => {
        const tableNumberStr = String(table.tablenumber);
        const matchesSearch = tableNumberStr.toLowerCase().includes(searchTerm.toLowerCase());

        if (activeTab === "all") return matchesSearch;
        if (activeTab === "available") return matchesSearch && table.availability === 0;
        if (activeTab === "occupied") return matchesSearch && table.availability === 1;

        return matchesSearch;
    });

    const tabs = [
        { id: 'all', label: 'All Tables' },
        { id: 'available', label: 'Available' },
        { id: 'occupied', label: 'Occupied' }
    ];

    return (
        <div className="container mx-auto px-6 pt-4 pb-8">
            <div className="py-4">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-semibold text-gray-800">Table Management</h1>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="search"
                                placeholder="Search by table number..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary w-full md:w-80"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/80 transition"
                        >
                            <FaPlus className="mr-2" />
                            Add Table
                        </button>
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
                    ) : filteredTables && filteredTables.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {[
                                        { id: "tableNumber", label: "Table Number" },
                                        { id: "status", label: "Status" },
                                        { id: "actions", label: "Actions" }
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
                                {filteredTables.map((table) => (
                                    <tr key={table.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            <div className="flex items-center">
                                                <BiTable className="mr-2 text-gray-400" />
                                                Table #{table.tablenumber}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {table.availability === 0 ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    AVAILABLE
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    OCCUPIED
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition"
                                                onClick={() => openDeleteModal(table.id, table.tablenumber)}
                                            >
                                                <FaTrash className="mr-1.5" />
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                            <MdTableBar className="w-16 h-16 mb-4 text-gray-300" />
                            <p className="text-lg font-medium">No tables found</p>
                            <p className="mt-1 text-sm">
                                {searchTerm
                                    ? "Try adjusting your search criteria."
                                    : "Click the \"Add Table\" button to create your first table."}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-scaleIn">
                        <div className="bg-primary text-white p-5 rounded-t-xl sticky top-0 z-10">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <BiTable />
                                    Add New Table
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {loading && (
                                <div className='absolute inset-0 flex justify-center items-center bg-white bg-opacity-90 rounded-xl z-10'>
                                    <Bars
                                        height="50"
                                        width="50"
                                        color="primary"
                                        ariaLabel="loading"
                                        visible={true}
                                    />
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Table Number
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter table number (e.g. 1, 2, 3)"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-primary focus:border-primary outline-none transition-all"
                                        value={tableNumber}
                                        onChange={(e) => {
                                            error && setError(null);
                                            setTableNumber(e.target.value);
                                        }}
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg flex items-start">
                                        <div className="mr-2 mt-0.5">⚠️</div>
                                        <div>{error}</div>
                                    </div>
                                )}

                                <div className="mt-6 flex flex-wrap gap-2 justify-end pt-3 border-t border-gray-200">
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-primary hover:bg-primary/80 text-white font-medium rounded-lg"
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

            {deleteModalVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-scaleIn p-6">
                        <div className="text-center mb-6">
                            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <FaTrash className="text-red-500" size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Delete Table</h2>
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
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg"
                                onClick={() => setDeleteModalVisible(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg flex items-center"
                                onClick={deleteTable}
                                disabled={deleteConfirmText !== "delete" || deleteLoading}
                            >
                                {deleteLoading ? (
                                    <Bars height="18" width="18" color="white" ariaLabel="deleting" />
                                ) : (
                                    <>
                                        <FaTrash className="mr-1.5" />
                                        Delete Table
                                    </>
                                )}
                            </button>
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

export default TableManagement;