"use client";
import React, { useState } from 'react';
import { FaPenToSquare } from "react-icons/fa6";
import { MdBorderColor } from "react-icons/md";

const sampleData = [
    { name: 'Apples', quantity: 10, unit: 'kg', amount: 5, id: '#CFG758' },
    { name: 'Bananas form banaras, mangoe', quantity: 20, unit: 'kg', amount: 10, id: '#CFG478' },
    { name: 'Oranges', quantity: 15, unit: 'kg', amount: 5, id: '#CFG788' },
    { name: 'Mangoes', quantity: 25, unit: 'kg', amount: 10, id: '#CFG786' },
    { name: 'Grapes', quantity: 30, unit: 'kg', amount: 15, id: '#CFG787' },
];

const KitchenOrdersCard: React.FC = () => {
    const [inventory, setInventory] = useState(sampleData);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [orderPopupVisible, setOrderPopupVisible] = useState(false);
    const [editPopupVisible, setEditPopupVisible] = useState(false);
    const [editData, setEditData] = useState({ name: '', quantity: 0, unit: '', amount: 0, id: '' });

    const handleEditClick = (data: any) => {
        setEditData(data);
        setEditPopupVisible(true);
    };

    const handleCheckboxChange = (id: string) => {
        setSelectedItems(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(itemId => itemId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSelectAllChange = () => {
        if (selectedItems.length === inventory.length) {
            setSelectedItems([]);
        } else {
            const allIds = inventory.map(item => item.id);
            setSelectedItems(allIds);
        }
    };

    const handleGenerateOrder = () => {
        setOrderPopupVisible(true);
    };

    const handleEditSave = () => {
        setInventory(prevInventory =>
            prevInventory.map(item =>
                item.id === editData.id
                    ? { ...editData, amount: editData.quantity }
                    : item
            )
        );
        setEditPopupVisible(false);
    };

    const selectedData = inventory.filter(item => selectedItems.includes(item.id));

    return (
        <div className='flex flex-col gap-5'>
            <div className='flex justify-end'>
                <button
                    onClick={handleGenerateOrder}
                    disabled={selectedItems.length === 0}
                    className={`bg-supporting2 w-1/5 text-white font-bold rounded-md px-4 py-2 flex items-center justify-center gap-2 hover:bg-supporting2-dark transition-colors mt-4 ${selectedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    <MdBorderColor className="text-lg" />
                    <span>Generate Order</span>
                </button>

            </div>
            <table className="w-full border-collapse">
                <thead>
                    <tr className='bg-primary text-white'>
                        <th className="px-4 py-2 text-left w-[50px]">
                            <input
                                type="checkbox"
                                checked={selectedItems.length === inventory.length}
                                onChange={handleSelectAllChange}
                                className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-opacity-50"
                            />
                        </th>
                        <th className="px-4 py-2 text-left w-[200px]">ID</th>
                        <th className="px-4 py-2 text-left">Item</th>
                        <th className="px-4 py-2 text-left">Order Quantity</th>
                        <th className="px-4 py-2 text-left w-[100px]">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map((item, index) => (
                        <tr key={index} className='text-[14px] font-medium font-montserrat'>
                            <td className="border px-4 py-2 transition-colors duration-300">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.id)}
                                    onChange={() => handleCheckboxChange(item.id)}
                                    className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-opacity-50"
                                />
                            </td>
                            <td className="border px-4 py-2 transition-colors duration-300">{item.id}</td>
                            <td className="border px-4 py-2 transition-colors duration-300">{item.name}</td>
                            <td className="border px-4 py-2 transition-colors duration-300">{item.amount} {item.unit}</td>
                            <td className="border px-4 py-4 transition-colors duration-300">
                                <div className='flex gap-4 justify-center'>
                                    <button className="bg-primary text-white px-4 py-2 rounded text-[12px] flex items-center gap-10"
                                        onClick={() => handleEditClick(item)}
                                    >
                                        <div>Edit</div> <FaPenToSquare />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Order Popup */}
            {orderPopupVisible && selectedData.length > 0 && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg w-96 max-w-full">
                        <h3 className="text-xl font-semibold mb-4 text-primary">Selected Orders</h3>
                        <ul>
                            {selectedData.map(item => (
                                <li key={item.id} className="mb-2 border-b pb-2">
                                    <div><strong>Item:</strong> {item.name}</div>
                                    <div><strong>Quantity:</strong> {item.amount} {item.unit}</div>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-end mt-4 gap-2">
                            <button
                                onClick={() => setOrderPopupVisible(false)}
                                className="bg-bgred text-white hover:bg-red-600 cursor-pointer rounded-md px-4 py-2"
                            >
                                CLOSE
                            </button>
                            <button
                                onClick={() => setOrderPopupVisible(false)}
                                className="bg-supporting2 text-white hover:bg-[#8bbf3b] cursor-pointer rounded-md px-4 py-2"
                            >
                                ORDER
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Popup */}
            {editPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg w-96 max-w-full">
                        {/* Edit Form */}
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block font-medium text-gray-800">Name:</label>
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    className="border border-gray-300 rounded-md px-3 py-2 font-semibold w-full"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-800">Quantity:</label>
                                <input
                                    type="number"
                                    value={editData.quantity}
                                    onChange={(e) => setEditData({ ...editData, quantity: parseInt(e.target.value, 10) })}
                                    className="border border-gray-300 rounded-md px-3 py-2 font-semibold w-full"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-800">Unit:</label>
                                <input
                                    type="text"
                                    value={editData.unit}
                                    onChange={(e) => setEditData({ ...editData, unit: e.target.value })}
                                    className="border border-gray-300 rounded-md px-3 py-2 font-semibold w-full"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setEditPopupVisible(false)}
                                className="bg-bgred text-white hover:bg-red-600 rounded-md px-4 py-2 mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSave}
                                className="bg-supporting2 text-white hover:bg-[#8bbf3b] rounded-md px-4 py-2"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KitchenOrdersCard;
