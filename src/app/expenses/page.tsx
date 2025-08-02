"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPenToSquare, FaTrash } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { Bars } from "react-loader-spinner";
import { RiBillLine } from "react-icons/ri";
import AddExpense from './popup';
import EditExpense from './editPopup';

interface Expense {
    id: string;
    expenses_for: string;
    frequency: string;
    cost: number;
    date: string;
}

const ExpensePage: React.FC = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [deletePopupVisible, setDeletePopupVisible] = useState<boolean>(false);
    const [deleteExpenseId, setDeleteExpenseId] = useState<string>("");
    const [deleteExpenseName, setDeleteExpenseName] = useState<string>("");
    const [deleteConfirmation, setDeleteConfirmation] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [addPopupVisible, setAddPopupVisible] = useState<boolean>(false);
    const [editPopupVisible, setEditPopupVisible] = useState<boolean>(false);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
    const [activeTab, setActiveTab] = useState<string>("all");

    useEffect(() => {
        document.title = "Expenses";
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("/api/expenses");
            if (response.data && response.data.expenses && Array.isArray(response.data.expenses)) {
                setExpenses(response.data.expenses);
            } else {
                console.error("Invalid response format:", response.data);
                setExpenses([]);
            }
        } catch (error) {
            console.error("Error fetching expenses:", error);
            setExpenses([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClick = (expense: Expense) => {
        setSelectedExpense(expense);
        setEditPopupVisible(true);
    };

    const handleDeleteClick = (id: string, name: string) => {
        setDeletePopupVisible(true);
        setDeleteExpenseId(id);
        setDeleteExpenseName(name);
    };

    const handleDeleteExpense = async () => {
        try {
            await axios.delete("/api/expenses/delete", { data: { id: deleteExpenseId } });
            setExpenses((prev) => prev.filter((expense) => expense.id !== deleteExpenseId));
            alert("Expense deleted successfully!");
        } catch (error) {
            console.error("Error deleting expense:", error);
        } finally {
            setDeletePopupVisible(false);
            setDeleteConfirmation("");
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatExpenseType = (type: string) => {
        switch (type) {
            case 'electric_bill':
            case 'electricity_bill':
                return 'Electricity Bill';
            case 'water_bill':
                return 'Water Bill';
            case 'rent':
                return 'Rent';
            case 'taxes':
                return 'Taxes';
            case 'raw_material':
                return 'Raw Material';
            case 'utensils':
                return 'Utensils';
            case 'others':
                return 'Others';
            case 'marketing':
                return 'Marketing';
                
            default:
                return type;
        }
    };

    const formatCurrency = (amount: number | null | undefined) => {
        if (amount === null || amount === undefined) return '₹ 0.00';

        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount).replace('₹', '₹ ');
    };

    const filteredExpenses = expenses.filter(expense => {
        const matchesSearch = 
            expense.expenses_for.toLowerCase().includes(searchTerm.toLowerCase()) ||
            expense.frequency.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (activeTab === "all") return matchesSearch;
        
        return matchesSearch && expense.frequency.toLowerCase() === activeTab.toLowerCase();
    });

    const tabs = [
        { id: 'all', label: 'All Expenses' },
        { id: 'daily', label: 'Daily' },
        { id: 'weekly', label: 'Weekly' },
        { id: 'monthly', label: 'Monthly' },
        { id: 'yearly', label: 'Yearly' }
    ];

    return (
        <div className="container mx-auto px-6 pt-4 pb-8">
            <div className="py-4">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-semibold text-gray-800">Expenses</h1>
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
                                placeholder="Search by expense type or frequency..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary w-full md:w-80"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={() => setAddPopupVisible(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition"
                        >
                            <RiBillLine className="mr-2" />
                            Add Expense
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
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <Bars height="50" width="50" color="primary" ariaLabel="bars-loading" />
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {[
                                        { id: "date", label: "Date" },
                                        { id: "expenseType", label: "Expense Type" },
                                        { id: "frequency", label: "Frequency" },
                                        { id: "cost", label: "Amount" },
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
                                {filteredExpenses.length > 0 ? (
                                    filteredExpenses.map((expense) => (
                                        <tr key={expense.id} className="hover:bg-gray-50 transition duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(expense.date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatExpenseType(expense.expenses_for)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className="capitalize">{expense.frequency}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatCurrency(expense.cost)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex gap-2">
                                                    <button
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition"
                                                        onClick={() => handleEditClick(expense)}
                                                    >
                                                        <FaPenToSquare className="mr-1.5" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition"
                                                        onClick={() => handleDeleteClick(expense.id, expense.expenses_for)}
                                                    >
                                                        <FaTrash className="mr-1.5" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center">
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
                                                <p className="text-lg font-medium">No expenses found</p>
                                                <p className="mt-1 text-sm">Try adjusting your search or adding a new expense.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {addPopupVisible && (
                <AddExpense 
                    popupHandle={() => setAddPopupVisible(false)} 
                    onExpenseAdded={fetchExpenses}
                />
            )}

            {editPopupVisible && selectedExpense && (
                <EditExpense 
                    popupHandle={() => setEditPopupVisible(false)} 
                    onExpenseUpdated={fetchExpenses}
                    expense={selectedExpense}
                />
            )}

            {deletePopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-scaleIn p-6">
                        <div className="text-center mb-6">
                            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <FaTrash className="text-red-500" size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Delete Expense</h2>
                            <p className="text-gray-600">
                                Are you sure you want to delete <span className="font-bold text-primary">{formatExpenseType(deleteExpenseName)}</span>? This action cannot be undone.
                            </p>
                        </div>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Type "delete" to confirm
                            </label>
                            <input
                                type="text"
                                placeholder="delete"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                value={deleteConfirmation}
                                onChange={(e) => setDeleteConfirmation(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button 
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg"
                                onClick={() => setDeletePopupVisible(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg flex items-center"
                                onClick={handleDeleteExpense}
                                disabled={deleteConfirmation !== "delete"}
                            >
                                <FaTrash className="mr-1.5" />
                                Delete Expense
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

export default ExpensePage;