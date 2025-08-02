import axios from 'axios';
import { useState, ChangeEvent, FormEvent } from 'react';
import { FaTimes } from 'react-icons/fa';
import { MdOutlineAttachMoney } from 'react-icons/md';
import { Bars } from 'react-loader-spinner';

interface AddExpenseProps {
    popupHandle: () => void;
    onExpenseAdded: () => void;
}

interface ExpenseFormValues {
    expenses_for: string;
    frequency: string;
    cost: number;
}

const AddExpense: React.FC<AddExpenseProps> = ({ popupHandle, onExpenseAdded }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formValues, setFormValues] = useState<ExpenseFormValues>({
        expenses_for: "",
        frequency: "",
        cost: 0,
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
            const response = await axios.post("/api/expenses/register", {
                ...formValues,
                cost: Number(formValues.cost),
            });
            
            if (response.data) {
                onExpenseAdded();
                popupHandle();
            }
        } catch (error) {
            console.error("Error adding expense:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-scaleIn">
                {/* Header */}
                <div className="bg-[#1e4569] text-white p-5 rounded-t-xl sticky top-0 z-10">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <MdOutlineAttachMoney />
                            Add New Expense
                        </h3>
                        <button
                            onClick={popupHandle}
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition"
                        >
                            ✕
                        </button>
                    </div>
                </div>
                
                {/* Form Content */}
                <div className="p-6">
                    {isLoading && (
                        <div className='absolute inset-0 flex justify-center items-center bg-white bg-opacity-90 rounded-xl z-10'>
                            <Bars
                                height="50"
                                width="50"
                                color="#1e4569"
                                ariaLabel="bars-loading"
                                visible={true}
                            />
                        </div>
                    )}
                    
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Expense Type
                                </label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-[#1e4569] focus:border-[#1e4569] outline-none transition-all bg-white"
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
                                    <option value="marketing">Marketing</option>
                                    <option value="others">Others</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Frequency
                                </label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-[#1e4569] focus:border-[#1e4569] outline-none transition-all bg-white"
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
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Amount
                                </label>
                                <input
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-[#1e4569] focus:border-[#1e4569] outline-none transition-all"
                                    type="number"
                                    name="cost"
                                    value={formValues.cost}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="Enter amount"
                                />
                            </div>
                        </div>
                        
                        <div className="mt-6 flex flex-wrap gap-2 justify-end pt-3 border-t border-gray-200">
                            <button 
                                type="button" 
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg"
                                onClick={popupHandle}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="px-4 py-2 bg-[#1e4569] hover:bg-[#2c5983] text-white font-medium rounded-lg"
                            >
                                Add Expense
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddExpense;