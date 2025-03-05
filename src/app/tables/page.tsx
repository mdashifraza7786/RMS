"use client";
import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaTimes } from "react-icons/fa";

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

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        const response = await fetch("/api/tables");
        const data = await response.json();
        setTables(data.tables);
    };


    const addTable = async () => {
        setError(null);
    
        const trimmedTableNumber = String(tableNumber).trim();
    
        if (!trimmedTableNumber) {
            setError("Table number cannot be empty.");
            return;
        }
    
        if (Array.isArray(tables) && tables.some(table => String(table.tablenumber).trim() === trimmedTableNumber)) {
            setError(`Table number "${tableNumber}" is already added.`);
            return;
        }
    
        try {
            const response = await fetch("/api/tables", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tablenumber: trimmedTableNumber }),
            });
    
            if (response.ok) {
                fetchTables();
                setTableNumber("");
                setIsModalOpen(false);
            } else {
                setError("Failed to add table.");
            }
        } catch (error) {
            console.error("Error adding table:", error);
            setError("An error occurred while adding the table.");
        }
    };
    
    

    const deleteTable = async (id: number) => {
    try {
        const response = await fetch(`/api/tables/${id}`, { method: "DELETE" });

        if (response.ok) {
            fetchTables(); 
        } else {
            console.error("Failed to delete table");
        }
    } catch (error) {
        console.error("Error:", error);
    }
};


    return (
        <div className='bg-[#e6e6e6] py-[5vh] px-[8vw] font-raleway flex flex-col gap-[2vh]'>
            <div className='font-semibold text-[18px] flex justify-between'>
                <span>Table Management</span>
            </div>

            <section className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-3 relative'>
                <div className='font-semibold text-[15px] flex justify-between'>
                    <span></span>
                    <button
                        className='bg-supporting2 text-white px-3 py-2 rounded flex items-center gap-2'
                        onClick={() => setIsModalOpen(true)}
                    >
                        <FaPlus /> Add Table
                    </button>
                </div>

                {tables && tables.length > 0 ? (
                    <table className="table-auto w-full">
                        <thead>
                            <tr className='bg-primary text-white'>
                                <th className="px-4 py-2 text-left w-[200px]">Table Number</th>
                                <th className="px-4 py-2 text-left">Availability</th>
                                <th className="px-4 py-2 text-left w-[100px]">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tables.map((item) => (
                                <tr key={item.id}>
                                    <td className="border px-4 py-2">#{item.tablenumber}</td>
                                    <td className="border px-4 py-2">{item.availability === 0 ? "Available" : "Not Available"}</td>
                                    <td className="border px-4 py-2 text-center">
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                            onClick={() => deleteTable(item.id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className='flex justify-center items-center h-20'>No tables available</div>
                )}
            </section>

            {/* Custom Modal */}
            {isModalOpen && (
                <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-50'>
                    <div className='bg-white p-6 rounded shadow-lg w-[400px]'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-lg font-semibold'>Add Table</h2>
                            <button className='text-red-500' onClick={() => setIsModalOpen(false)}>
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <input
                            type='text'
                            placeholder='Enter Table Number'
                            className='w-full p-2 border rounded mb-4'
                            value={tableNumber}
                            onChange={(e) => { 
                                error && setError(null);
                                setTableNumber(e.target.value);
                            }}
                            
                        />

                        {/* Error Message */}
                        {error && <div className="text-red-500 text-sm mb-3">{error}</div>}

                        <button className='bg-primary text-white px-4 py-2 rounded w-full' onClick={addTable}>
                            Add Table
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TableManagement;
