"use client";
import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaSearch, FaTimes } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import { MdTableBar, MdTableRestaurant } from "react-icons/md";
import { BiTable } from "react-icons/bi";
import Skeleton from "@/components/ui/Skeleton";

interface Table {
    id: number;
    tablenumber: string;
    availability: number;
    assigned_waiter_id?: string | null;
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

    const [waiters, setWaiters] = useState<any[]>([]);
    const [zonesEnabled, setZonesEnabled] = useState(false);
    const [updatingTableId, setUpdatingTableId] = useState<number | null>(null);

    useEffect(() => {
        fetchTables();
        fetchConfig();
        document.title = "Table Management";
    }, []);

    const fetchConfig = async () => {
        try {
            // Fetch settings
            const settingsRes = await fetch("/api/settings?type=general");
            const settingsData = await settingsRes.json();
            if (settingsData.success && settingsData.data?.waiter_zones_enabled === 'true') {
                setZonesEnabled(true);
            }

            // Fetch waiters
            const membersRes = await fetch("/api/members?limit=100");
            const membersData = await membersRes.json();
            if (membersData.success && membersData.data?.members) {
                const waiterList = membersData.data.members.filter((m: any) => m.role === 'waiter');
                setWaiters(waiterList);
            }
        } catch (error) {
            console.error("Error fetching config:", error);
        }
    };

    const fetchTables = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/tables");
            const data = await response.json();
            if (data.success) {
                setTables(data.data || []);
            }
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

    const assignWaiter = async (tableId: number, waiterId: string) => {
        try {
            setUpdatingTableId(tableId);
            const response = await fetch(`/api/tables/${tableId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ assigned_waiter_id: waiterId || null }),
            });

            if (response.ok) {
                // Update local state directly instead of refetching everything
                setTables(prev => prev.map(t => 
                    t.id === tableId ? { ...t, assigned_waiter_id: waiterId || null } : t
                ));
            } else {
                console.error("Failed to assign waiter");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setUpdatingTableId(null);
        }
    };

    const filteredTables = (Array.isArray(tables) ? tables : [])
        .filter(table => {
            const tableNumberStr = String(table.tablenumber);
            const matchesSearch = tableNumberStr.toLowerCase().includes(searchTerm.toLowerCase());

            if (activeTab === "all") return matchesSearch;
            if (activeTab === "available") return matchesSearch && table.availability === 0;
            if (activeTab === "occupied") return matchesSearch && table.availability === 1;

            return matchesSearch;
        })
        .sort((a, b) => Number(a.tablenumber) - Number(b.tablenumber));

    const tabs = [
        { id: 'all', label: 'All Tables' },
        { id: 'available', label: 'Available' },
        { id: 'occupied', label: 'Occupied' }
    ];

    const addTableButton = (
        <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-accent hover:bg-accent/90 transition"
        >
            <FaPlus className="mr-2" />
            Add Table
        </button>
    );

    return (
        <div className="px-6 lg:px-10 py-4 pb-8">
            <PageHeader
                title="Table Management"
                subtitle="Configure restaurant tables"
                accent="primary"
                action={addTableButton}
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="search"
                                placeholder="Search by table number..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent focus:outline-none w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex overflow-x-auto pb-1 gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'text-white bg-accent'
                                    : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="flex flex-col items-center justify-center p-5 rounded-2xl border border-gray-100 space-y-3">
                                    <Skeleton variant="circle" width="56px" height="56px" />
                                    <Skeleton variant="text" width="60%" height="20px" />
                                    <Skeleton variant="text" width="40%" height="12px" />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : filteredTables && filteredTables.length > 0 ? (
                    <div className="p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {filteredTables.map((table) => (
                                <div
                                    key={table.id}
                                    className={`relative flex flex-col items-center justify-center p-5 rounded-2xl shadow-sm border transition-all duration-200 group ${table.availability === 0
                                            ? 'bg-white border-green-100 hover:border-green-300 hover:shadow-md'
                                            : 'bg-white border-red-100 hover:border-red-300 hover:shadow-md'
                                        }`}
                                >
                                    {/* Delete Button - Appears on hover */}
                                    <button
                                        onClick={() => openDeleteModal(table.id, table.tablenumber)}
                                        className="absolute top-2 right-2 p-2 rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all duration-200 z-10"
                                        title="Delete Table"
                                    >
                                        <FaTrash size={12} />
                                    </button>

                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${table.availability === 0
                                            ? 'bg-green-50 text-green-600'
                                            : 'bg-red-50 text-red-600'
                                        }`}>
                                        <MdTableRestaurant size={28} />
                                    </div>

                                    <div className="text-center">
                                        <p className={`font-bold text-lg ${table.availability === 0 ? 'text-green-700' : 'text-red-700'
                                            }`}>
                                            Table #{table.tablenumber}
                                        </p>
                                        <div className="flex items-center justify-center gap-1.5 mt-1">
                                            <div className={`w-2 h-2 rounded-full ${table.availability === 0 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                                                }`}></div>
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {table.availability === 0 ? 'Available' : 'Occupied'}
                                            </p>
                                        </div>
                                    </div>

                                    {zonesEnabled && (
                                        <div className="mt-4 w-full pt-3 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                                            <select
                                                value={table.assigned_waiter_id || ""}
                                                onChange={(e) => assignWaiter(table.id, e.target.value)}
                                                disabled={updatingTableId === table.id}
                                                className="w-full text-xs py-1.5 px-2 border border-gray-200 rounded text-gray-600 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent disabled:opacity-50"
                                            >
                                                <option value="">Unassigned (Any Waiter)</option>
                                                {waiters.map(w => (
                                                    <option key={w.userid} value={w.userid}>
                                                        {w.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
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

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 animate-fade-in z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-slide-up">
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
                                <div className='absolute inset-0 flex flex-col justify-center items-center bg-white bg-opacity-90 rounded-xl z-10 p-8 space-y-4'>
                                    <Skeleton variant="text" width="60%" height="24px" />
                                    <Skeleton variant="rect" width="100%" height="44px" className="rounded-lg" />
                                    <div className="w-full flex gap-3 justify-end">
                                        <Skeleton variant="rect" width="80px" height="36px" className="rounded-lg" />
                                        <Skeleton variant="rect" width="100px" height="36px" className="rounded-lg" />
                                    </div>
                                    <p className="text-primary font-medium animate-pulse mt-4">Creating table...</p>
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
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-accent/20 focus:border-accent focus:outline-none transition-all"
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
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 animate-fade-in z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-slide-up p-6">
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
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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