"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPenToSquare, FaTrash } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
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

    const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

    const formatExpenseType = (type: string) => {
        switch (type) {
            case 'electric_bill':
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

    const filteredExpenses = expenses.filter(expense =>
        expense.expenses_for.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.frequency.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-[#e6e6e6] py-[5vh] px-[8vw] font-raleway flex flex-col gap-[6vh] relative">
            <h1 className="font-bold">Expenses</h1>
            <section className="bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-3 relative">
                <section className="flex justify-between items-center py-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input
                            type="search"
                            placeholder="Search by name or frequency..."
                            className="pl-10 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all w-[280px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex">
                        <button 
                            onClick={() => setAddPopupVisible(true)}
                            className="bg-[#9FCC2E] hover:bg-[#8bba1e] text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-200 shadow-sm flex items-center gap-2.5"
                        >
                            <RiBillLine size={20} />
                            <span>Add Expense</span>
                        </button>
                    </div>
                </section>

                {isLoading ? (
                    <div className="flex justify-center items-center py-4">
                        <Bars
                            height="50"
                            width="50"
                            color="#25476A"
                            ariaLabel="bars-loading"
                            visible={true}
                        />
                    </div>
                ) : (
                    <table className="table-fixed w-full border-collapse">
                        <thead>
                            <tr className="bg-primary text-white font-light">
                                <th className="px-4 py-3 text-left w-[20%]">Date</th>
                                <th className="px-4 py-3 text-left w-[25%]">Expense For</th>
                                <th className="px-4 py-3 text-left w-[15%]">Frequency</th>
                                <th className="px-4 py-3 text-left w-[15%]">Cost</th>
                                <th className="px-4 py-3 text-left w-[25%]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExpenses.length > 0 ? (
                                filteredExpenses.map((expense) => (
                                    <tr key={expense.id} className="text-[14px] font-medium font-montserrat hover:bg-gray-50 transition-colors duration-200">
                                        <td className="border border-gray-200 px-4 py-4 transition-colors duration-300">
                                            {formatDate(expense.date)}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-4 transition-colors duration-300">
                                            {formatExpenseType(expense.expenses_for)}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-4 transition-colors duration-300">
                                            {expense.frequency}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-4 transition-colors duration-300">
                                            ₹ {expense.cost}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-4 transition-colors duration-300">
                                            <div className="flex flex-col gap-3">
                                                <button 
                                                    className="bg-primary hover:bg-[#416f9d] text-white px-4 py-2 rounded-lg text-[12px] flex items-center justify-between transition-colors duration-200"
                                                    onClick={() => handleEditClick(expense)}
                                                >
                                                    <div>Edit</div> <FaPenToSquare className="ml-3" />
                                                </button>
                                                <button 
                                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-[12px] flex items-center justify-between transition-colors duration-200"
                                                    onClick={() => handleDeleteClick(expense.id, expense.expenses_for)}
                                                >
                                                    <div>Delete</div> <FaTrash className="ml-3" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-6 text-gray-500 font-medium">
                                        No expenses found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </section>

            {/* Add Expense Popup */}
            {addPopupVisible && (
                <AddExpense 
                    popupHandle={() => setAddPopupVisible(false)} 
                    onExpenseAdded={fetchExpenses}
                />
            )}

            {/* Edit Expense Popup */}
            {editPopupVisible && selectedExpense && (
                <EditExpense 
                    popupHandle={() => setEditPopupVisible(false)} 
                    onExpenseUpdated={fetchExpenses}
                    expense={selectedExpense}
                />
            )}

            {/* Delete Confirmation Popup */}
            {deletePopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
                    <div className="bg-white shadow-2xl rounded-xl p-8 max-w-md w-full animate-fadeIn">
                        <div className="text-center mb-6">
                            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <FaTrash className="text-red-500" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Delete Expense</h2>
                            <p className="text-gray-600">
                                Are you sure you want to delete <span className="font-bold text-primary">{deleteExpenseName}</span>? This action cannot be undone.
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
                                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                                onClick={() => setDeletePopupVisible(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleDeleteExpense}
                                disabled={deleteConfirmation !== "delete"}
                            >
                                Delete Expense
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpensePage;
