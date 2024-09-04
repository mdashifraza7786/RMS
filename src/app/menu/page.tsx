"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { FaPenToSquare } from "react-icons/fa6";
import { IoFastFoodSharp } from "react-icons/io5";
import { RiBillLine } from "react-icons/ri";
import AddMenu from './popup';
import { Bars } from 'react-loader-spinner';

interface EditData {
    item_id: string;
    item_description: string;
    item_name: string;
    item_foodtype: string;
    item_price: number;
    item_type: string;
    item_thumbnail?: string; // Make thumbnail optional for cases when it's not updated
}

const Page: React.FC = () => {
    const [popupOpened, setPopupOpened] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [editPopupVisible, setEditPopupVisible] = useState<boolean>(false);
    const [editData, setEditData] = useState<EditData>({
        item_id: '',
        item_description: '',
        item_name: '',
        item_foodtype: '',
        item_price: 0,
        item_thumbnail: '',
        item_type: ''
    });

    const [menuData, setMenuData] = useState<EditData[]>([]);
    const [editLoading, setEditLoading] = useState<boolean>(false);
    const [newThumbnail, setNewThumbnail] = useState<string | null>(null); // Track if new thumbnail is uploaded

    useEffect(() => {
        document.title = "Menu";
        fetchMenuData();
    }, []);

    const fetchMenuData = async () => {
        try {
            const response = await axios.get('/api/menu');
            const data = response.data;
            if (data && Array.isArray(data.users)) {
                setMenuData(data.users);
            } else {
                console.error("Fetched data does not contain an array of users:", data);
            }
        } catch (error) {
            console.error("Error fetching menu data:", error);
        }
    };

    const addMenuHandler = () => {
        setPopupOpened(prevState => !prevState);
    };

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleEditClick = (data: EditData) => {
        setEditData(data);
        setNewThumbnail(null); // Reset newThumbnail on each edit
        setEditPopupVisible(true);
    };

    const filteredData = menuData.filter(item =>
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.item_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewThumbnail(reader.result as string); // Set the new thumbnail
            };
            reader.readAsDataURL(file);
        }
    };

    const editMember = async (data: EditData) => {
        try {
            setEditLoading(true);

            // Use the new thumbnail if uploaded, otherwise keep the old one
            const updatedData = {
                ...data,
                item_thumbnail: newThumbnail || data.item_thumbnail,
            };

            await fetch('/api/menu/updateMenu', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });
            fetchMenuData();
        } catch (error) {
            console.error("Error updating menu item:", error);
        } finally {
            setEditLoading(false);
            setEditPopupVisible(false); // Close the popup after saving
        }
    };

    return (
        <div className='bg-[#e6e6e6] py-[5vh] px-[8vw] font-raleway flex flex-col gap-[6vh] relative'>
            {popupOpened ? (
                <AddMenu popuphandle={addMenuHandler} />
            ) : (
                <>
                    <h1 className="font-bold">Menu</h1>
                    <section className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-3 relative'>
                        <section className='flex justify-between items-center py-4'>
                            <input
                                type='search'
                                placeholder='Search Name, ID...'
                                className='border border-[#807c7c] rounded-xl px-4 py-1'
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <div className="flex">
                                <button onClick={addMenuHandler} className='bg-[#9FCC2E] shadow-md px-4 py-1 text-white text-lg flex items-center justify-center gap-4 font-medium rounded-sm'>
                                    <RiBillLine />
                                    <div>Add Menu</div>
                                </button>
                            </div>
                        </section>
                        <table className="table-auto w-full">
                            <thead>
                                <tr className='bg-primary text-white font-light'>
                                    <th className="px-4 py-2 text-left w-[200px]">Item ID</th>
                                    <th className="px-4 py-2 text-left w-[400px]">Item Name</th>
                                    <th className='px-4 py-2 text-left w-[400px]'>Category</th>
                                    <th className='px-4 py-2 text-left w-[400px]'>Type</th>
                                    <th className="px-4 py-2 text-left w-[200px]">Price</th>
                                    <th className="px-4 py-2 text-left w-[200px]">Image</th>
                                    <th className="px-4 py-2 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((item, index) => (
                                        <tr key={index} className='text-[14px] font-medium font-montserrat'>
                                            <td className="border px-4 py-4 transition-colors duration-300">{item.item_id}</td>
                                            <td className="border px-4 py-4 transition-colors duration-300">{item.item_name}</td>
                                            <td className="border px-4 py-4 transition-colors duration-300">{item.item_foodtype}</td>
                                            <td className="border px-4 py-4 transition-colors duration-300">{item.item_type}</td>
                                            <td className="border px-4 py-4 transition-colors duration-300">₹ {item.item_price}</td>
                                            <td className="border px-4 py-4 transition-colors duration-300">
                                                {item.item_thumbnail && (
                                                    <img
                                                        className='w-[150px] h-[100px] object-cover'
                                                        src={item.item_thumbnail}
                                                        alt={`${item.item_name} Thumbnail`}
                                                    />
                                                )}
                                            </td>
                                            <td className="border px-4 py-4 transition-colors duration-300">
                                                <div className='flex gap-4 justify-center'>
                                                    <button className="bg-primary text-white px-4 py-2 rounded text-[12px] flex items-center gap-10" onClick={() => handleEditClick(item)}>
                                                        <div>Edit</div> <FaPenToSquare />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="text-center py-4">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </section>
                </>
            )}

            {editPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className={`bg-white p-8 rounded-lg w-[90%] max-w-[600px] ${editLoading ? 'overflow-hidden' : 'overflow-auto'}`}>
                        {editLoading && (
                            <div className='absolute inset-0 flex justify-center items-center bg-white bg-opacity-80'>
                                <Bars
                                    height="80"
                                    width="80"
                                    color="#25476A"
                                    ariaLabel="bars-loading"
                                    visible={true}
                                />
                            </div>
                        )}
                        <h2 className="text-xl text-primary font-bold mb-4">Edit Menu Item</h2>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            <div className="flex flex-col gap-3 col-span-2">
                                <div className="flex flex-row gap-3">
                                    <div className="flex-grow">
                                        <label className="block text-sm font-medium text-gray-800">Name:</label>
                                        <input
                                            type="text"
                                            value={editData?.item_name || ''}
                                            onChange={(e) => setEditData(prev => ({ ...prev, item_name: e.target.value }))}
                                            className="border border-gray-300 rounded-md p-2 w-full"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <label className="block text-sm font-medium text-gray-800">Category:</label>
                                        <input
                                            type="text"
                                            value={editData?.item_foodtype || ''}
                                            onChange={(e) => setEditData(prev => ({ ...prev, item_foodtype: e.target.value }))}
                                            className="border border-gray-300 rounded-md p-2 w-full"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-row gap-3">
                                    <div className="flex-grow">
                                        <label className="block text-sm font-medium text-gray-800">Price:</label>
                                        <input
                                            type="number"
                                            value={editData?.item_price || 0}
                                            onChange={(e) => setEditData(prev => ({ ...prev, item_price: parseFloat(e.target.value) }))}
                                            className="border border-gray-300 rounded-md p-2 w-full"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <label className="block text-sm font-medium text-gray-800">Type:</label>
                                        <input
                                            type="text"
                                            value={editData?.item_type || ''}
                                            onChange={(e) => setEditData(prev => ({ ...prev, item_type: e.target.value }))}
                                            className="border border-gray-300 rounded-md p-2 w-full"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-800">Description:</label>
                                    <textarea
                                        value={editData?.item_description || ''}
                                        onChange={(e) => setEditData(prev => ({ ...prev, item_description: e.target.value }))}
                                        className="border border-gray-300 rounded-md p-2 w-full h-[100px]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-800">Thumbnail:</label>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="border border-gray-300 rounded-md p-2 w-full"
                                    />
                                    {editData?.item_thumbnail && !newThumbnail && (
                                        <img
                                            src={editData.item_thumbnail}
                                            alt="Current Thumbnail"
                                            className="mt-4 w-[150px] h-[100px] object-cover"
                                        />
                                    )}
                                    {newThumbnail && (
                                        <img
                                            src={newThumbnail}
                                            alt="New Thumbnail Preview"
                                            className="mt-4 w-[150px] h-[100px] object-cover"
                                        />
                                    )}
                                </div>

                                <div className="flex justify-between mt-6">
                                    <button
                                        onClick={() => setEditPopupVisible(false)}
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => editMember(editData)}
                                        className="bg-primary text-white px-4 py-2 rounded"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;
