import axios from 'axios';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { MdOutlineAttachMoney } from 'react-icons/md';
import { Bars } from 'react-loader-spinner';

interface EditExpenseProps {
    popupHandle: () => void;
    onExpenseUpdated: () => void;
    expense: {
        id: string;
        expenses_for: string;
        frequency: string;
        cost: number;
    };
}

interface ExpenseFormValues {
    id: string;
    expenses_for: string;
    frequency: string;
    cost: number;
}

const EditExpense: React.FC<EditExpenseProps> = ({ popupHandle, onExpenseUpdated, expense }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formValues, setFormValues] = useState<ExpenseFormValues>({
        id: expense.id,
        expenses_for: expense.expenses_for,
        frequency: expense.frequency,
        cost: expense.cost,
    });

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormValues(prevValues => ({
            ...prevValues,
            [name]: name === "cost" ? Number(value) : value
        }));
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.put("/api/expenses/update", formValues);
            
            if (response.data) {
                alert("Expense updated successfully!");
                onExpenseUpdated();
                popupHandle();
            }
        } catch (error) {
            console.error("Error updating expense:", error);
            alert("Failed to update expense. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
            <div className="bg-white shadow-2xl rounded-xl p-8 w-[90%] max-w-[600px] relative animate-fadeIn">
                {isLoading && (
                    <div className='absolute inset-0 flex justify-center items-center bg-white bg-opacity-90 rounded-xl z-10'>
                        <Bars
                            height="80"
                            width="80"
                            color="#25476A"
                            ariaLabel="bars-loading"
                            visible={true}
                        />
                    </div>
                )}
                
                <div className="flex justify-between items-center border-b border-gray-200 pb-5 mb-6">
                    <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                        <MdOutlineAttachMoney className="text-[#9FCC2E]" size={28} />
                        Edit Expense
                    </h1>
                    <button 
                        className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
                        onClick={popupHandle}
                    >
                        <FaTimes size={20} />
                    </button>
                </div>
                
                <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Expense For
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
                                name="expenses_for"
                                value={formValues.expenses_for}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Expense Type</option>
                                <option value="electricity_bill">Electricity Bill</option>
                                <option value="water_bill">Water Bill</option>
                                <option value="rent">Rent</option>
                                <option value="taxes">Taxes</option>
                                <option value="raw_material">Raw Material</option>
                                <option value="utensils">Utensils</option>
                                <option value="others">Others</option>
                            </select>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Frequency
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
                                name="frequency"
                                value={formValues.frequency}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Frequency</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Cost
                            </label>
                            <input
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                type="number"
                                name="cost"
                                value={formValues.cost}
                                onChange={handleInputChange}
                                required
                                min="0"
                                step="0.01"
                                placeholder="Enter cost amount"
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end pt-3 border-t border-gray-200 mt-6">
                        <div className="flex gap-3">
                            <button 
                                type="button" 
                                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                                onClick={popupHandle}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="bg-[#9FCC2E] hover:bg-[#8bba1e] text-white font-semibold px-8 py-2.5 rounded-lg transition-colors duration-200 shadow-sm"
                            >
                                Update Expense
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditExpense; 