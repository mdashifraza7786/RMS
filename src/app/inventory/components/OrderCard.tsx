"use client";
import React, { useState } from 'react';
import { IoIosPaper, IoMdAdd, IoMdClose } from "react-icons/io";

interface InventoryData {
    name: string;
    quantity: number;
    unit: string;
    lowlimit: number;
    remarks: string;
}

const sampleData = [
    { name: 'Apples', quantity: 10, unit: 'kg', lowlimit: 5, remarks: '' },
    { name: 'Bananas', quantity: 20, unit: 'kg', lowlimit: 10, remarks: '' },
    { name: 'Oranges', quantity: 15, unit: 'kg', lowlimit: 5, remarks: '' },
    { name: 'Mangoes', quantity: 25, unit: 'kg', lowlimit: 10, remarks: '' },
    { name: 'Grapes', quantity: 30, unit: 'kg', lowlimit: 15, remarks: '' },
];

const units = ['kg', 'g', 'liters', 'pieces']; // Define your units

const OrderCard: React.FC = () => {
    const [inventory, setInventory] = useState<InventoryData[]>([sampleData[0]]);
    const [names] = useState<string[]>(sampleData.map(item => item.name));

    const handleAddOrder = () => {
        setInventory([...inventory, { name: names[0], quantity: 0, unit: units[0], lowlimit: 0, remarks: '' }]);
    };

    const handleRemoveOrder = (index: number) => {
        const updatedInventory = inventory.filter((_, i) => i !== index);
        setInventory(updatedInventory);
    };

    const handleSaveOrder = () => {
        // Perform save logic here
        console.log('Order saved:', inventory);
    };

    const handleFieldChange = (index: number, field: keyof InventoryData, value: any) => {
        const updatedInventory = [...inventory];
        updatedInventory[index] = { ...updatedInventory[index], [field]: value };
        setInventory(updatedInventory);
    };

    return (
        <div className="w-full max-w-full px-4 py-6">
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-300 w-full">
                <h2 className="text-2xl font-semibold mb-6 text-primary">Order Details</h2>

                {inventory.map((item, index) => (
                    <div key={index} className="relative mb-6 border-b border-gray-200 pb-4">
                        {/* Cross button */}
                        <button
                            onClick={() => handleRemoveOrder(index)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                            <IoMdClose size={20} />
                        </button>

                        <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-4 w-full">
                                <div className="flex-1">
                                    <label htmlFor={`name-${index}`} className="block font-medium text-gray-800">Name:</label>
                                    <select
                                        id={`name-${index}`}
                                        value={item.name}
                                        onChange={(e) => {
                                            const selectedName = e.target.value;
                                            const selectedItem = sampleData.find(item => item.name === selectedName);
                                            if (selectedItem) setInventory(prev => {
                                                const updated = [...prev];
                                                updated[index] = selectedItem;
                                                return updated;
                                            });
                                        }}
                                        className="border border-gray-300 rounded-md px-3 py-2 font-semibold w-full"
                                    >
                                        {names.map(name => (
                                            <option key={name} value={name}>
                                                {name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex-1">
                                    <label htmlFor={`quantity-${index}`} className="block font-medium text-gray-800">Quantity:</label>
                                    <input
                                        type="number"
                                        id={`quantity-${index}`}
                                        value={item.quantity}
                                        onChange={(e) => handleFieldChange(index, 'quantity', parseInt(e.target.value, 10))}
                                        className="border border-gray-300 rounded-md px-3 py-2 font-semibold w-full"
                                    />
                                </div>

                                <div className="flex-1">
                                    <label htmlFor={`unit-${index}`} className="block font-medium text-gray-800">Unit:</label>
                                    <select
                                        id={`unit-${index}`}
                                        value={item.unit}
                                        onChange={(e) => handleFieldChange(index, 'unit', e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-2 font-semibold w-full"
                                    >
                                        {units.map(unit => (
                                            <option key={unit} value={unit}>
                                                {unit}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor={`remarks-${index}`} className="block font-medium text-gray-800">Remarks:</label>
                            <textarea
                                id={`remarks-${index}`}
                                value={item.remarks}
                                onChange={(e) => handleFieldChange(index, 'remarks', e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 font-semibold w-full h-16 resize-none"
                                // Adjusted height
                            />
                        </div>
                    </div>
                ))}

                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={handleAddOrder}
                        className="bg-supporting1 text-white font-bold rounded-md px-4 py-2 flex items-center gap-2 hover:bg-[#9b5f9d] transition-colors"
                    >
                        <IoMdAdd />
                        <div>ADD MORE ORDER</div>
                    </button>

                    <button
                        onClick={handleSaveOrder}
                        className="bg-supporting2 text-white font-bold rounded-md px-4 py-2 flex items-center gap-2 hover:bg-[#b6d36e] transition-colors"
                    >
                        <IoIosPaper />
                        <div>GENERATE ORDER</div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;
