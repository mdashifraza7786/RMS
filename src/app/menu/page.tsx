"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { FaPenToSquare, FaTrash } from "react-icons/fa6";
import { RiBillLine } from "react-icons/ri";
import AddMenu from './popup';
import { Bars } from 'react-loader-spinner';
import Image from 'next/image';

interface EditData {
    item_id: string;
    item_description: string;
    item_name: string;
    item_foodtype: string;
    item_price: number;
    item_type: string;
    item_thumbnail?: string;
}

const Page: React.FC = () => {
    const [popupOpened, setPopupOpened] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [editPopupVisible, setEditPopupVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [editData, setEditData] = useState<EditData>({
        item_id: '',
        item_description: '',
        item_name: '',
        item_foodtype: '',
        item_price: 0,
        item_thumbnail: '',
        item_type: ''
    });
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteMenuName, setDeleteMenuName] = useState("");
    const [deleteMenuId, setDeleteMenuId] = useState("");
    const [deleteMenuBoxValue, setDeleteMenuBoxValue] = useState("");
    const [deletePopupVisible, setDeletePopupVisible] = useState(false);

    const [menuData, setMenuData] = useState<EditData[]>([]);
    const [editLoading, setEditLoading] = useState<boolean>(false);
    const [newThumbnail, setNewThumbnail] = useState<string | null>(null);

    useEffect(() => {
        document.title = "Menu";
        fetchMenuData();
    }, []);

    const fetchMenuData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/menu');
            const data = response.data;
            if (data && Array.isArray(data.menu)) {
                setMenuData(data.menu);
            } else {
                console.error("Fetched data does not contain an array of menu:", data);
            }
        } catch (error) {
            console.error("Error fetching menu data:", error);
        }
        finally {
            setLoading(false);
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

    const handleDeleteClick = (item_id: string, item_name: string) => {
        // You can use userid here if needed
        setDeletePopupVisible(true);
        setDeleteMenuId(item_id);
        setDeleteMenuName(item_name);
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

    const editMenu= async (data: EditData) => {
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

    const handleDeleteMenuItem = async (deleteMenuId: string) => {
        try {
            setDeleteLoading(true);
            await axios.delete("/api/menu/delete", { data: { item_id: deleteMenuId } });
            fetchMenuData();
            setDeletePopupVisible(false);
        } catch (error) {
            console.error("Error deleting menu item:", error);
        } finally {
            setDeleteLoading(false);
            setDeleteMenuBoxValue("");
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
                                <button onClick={addMenuHandler} className='bg-[#9FCC2E] hover:bg-[#badb69] shadow-md px-4 py-1 text-white font-bold text-lg flex items-center justify-center gap-4 font-medium rounded-sm'>
                                    <RiBillLine />
                                    <div>Add Menu Item</div>
                                </button>
                            </div>
                        </section>
                        {loading ? (
                            <div className='flex justify-center items-center py-4'>

                                <Bars
                                    height="50"
                                    width="50"
                                    color="#25476A"
                                    ariaLabel="bars-loading"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                    visible={true}
                                />

                            </div>
                        ) :
                            (<table className="table-auto w-full">
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
                                                <td className="border px-4 py-4 transition-colors duration-300">{item.item_foodtype == "veg" ? "Veg" : "Non Veg"}</td>
                                                <td className="border px-4 py-4 transition-colors duration-300">{item.item_type}</td>
                                                <td className="border px-4 py-4 transition-colors duration-300">₹ {item.item_price}</td>
                                                <td className="border px-4 py-4 transition-colors duration-300">
                                                    {item.item_thumbnail && (
                                                        <Image
                                                            className='w-[150px] h-[100px] object-cover'
                                                            src={item.item_thumbnail}
                                                            alt={`${item.item_name} Thumbnail`}
                                                            width={150}
                                                            height={100}
                                                        />
                                                    )}
                                                </td>
                                                <td className="border px-4 py-4 transition-colors duration-300">
                                                    <div className='flex flex-col gap-4 justify-center'>
                                                        <button className="bg-primary hover:bg-[#416f9d] text-white px-4 py-2 rounded text-[12px] flex items-center gap-10" onClick={() => handleEditClick(item)}>
                                                            <div>Edit</div> <FaPenToSquare />
                                                        </button>

                                                        <button className="bg-red-600 hover:bg-red-400 text-white px-4 py-2 rounded text-[12px] flex items-center gap-10" onClick={() => handleDeleteClick(item.item_id, item.item_name)}>
                                                            <div>Delete</div> <FaTrash />
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
                            </table>)}
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
                                        <Image
                                            src={editData.item_thumbnail}
                                            alt="Current Thumbnail"
                                            className="mt-4 w-[150px] h-[100px] object-cover"
                                            width={150}
                                            height={100}
                                        />
                                    )}
                                    {newThumbnail && (
                                        <Image
                                            src={newThumbnail}
                                            alt="New Thumbnail Preview"
                                            className="mt-4 w-[150px] h-[100px] object-cover"
                                            width={150}
                                            height={100}

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
                                        onClick={() => editMenu(editData)}
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

             {/* Delete Confirmation Popup */}
             {deletePopupVisible && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-96 max-w-full">
                            <h2 className="text-xl font-bold text-red-600 text-center mb-3">Delete Item</h2>
                            <p className="text-gray-700 text-center mb-4">
                                Are you sure you want to delete this item? Type the item name ({deleteMenuName}) to confirm.
                            </p>

                            <input
                                required
                                type="text"
                                placeholder="Type the item name"
                                className="border border-gray-300 w-full rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-100 focus:outline-none"
                                value={deleteMenuBoxValue}
                                onChange={(e) => setDeleteMenuBoxValue(e.target.value)}
                            />

                            <div className="flex justify-end space-x-3 mt-4">
                                <button
                                    onClick={() => {setDeletePopupVisible(false), setDeleteMenuBoxValue("")}}
                                    className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400 transition-all"
                                >
                                    Cancel
                                </button>
                                {deleteMenuName === deleteMenuBoxValue ? (

                                    <button
                                        onClick={() => handleDeleteMenuItem(deleteMenuId)}
                                        className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-all"
                                    >
                                        Delete
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="bg-red-300 text-white px-5 py-2 rounded-lg hover:bg-red-400 transition-all"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

        </div>
    );
};

export default Page;
