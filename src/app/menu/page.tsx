"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { FaPenToSquare, FaTrash } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
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

const categoriesData: string[] = [
    "Appetizers", "Main Course", "Desserts", "Beverages"
];

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
            setDeletePopupVisible(false);
        } catch (error) {
            console.error("Error deleting menu item:", error);
        } finally {
            setDeleteLoading(false);
            setDeleteMenuBoxValue("");
            fetchMenuData();
        }
    };

    return (
        <div className='bg-[#e6e6e6] py-[5vh] px-[8vw] font-raleway flex flex-col gap-[6vh] relative'>
            <>
                    <h1 className="font-bold">Menu</h1>
                    <section className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-3 relative'>
                        <section className='flex justify-between items-center py-4'>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                    </svg>
                                </div>
                                <input
                                    type='search'
                                    placeholder='Search by name or ID...'
                                    className='pl-10 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all w-[280px]'
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            <div className="flex">
                                <button 
                                    onClick={addMenuHandler} 
                                    className='bg-[#9FCC2E] hover:bg-[#8bba1e] text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-200 shadow-sm flex items-center gap-2.5'
                                >
                                    <RiBillLine size={20} />
                                    <span>Add Item</span>
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
                            (<table className="table-fixed w-full border-collapse">
                                <thead>
                                    <tr className='bg-primary text-white font-light'>
                                        <th className="px-4 py-3 text-left w-[15%]">Item ID</th>
                                        <th className="px-4 py-3 text-left w-[25%]">Item Name</th>
                                        <th className='px-4 py-3 text-left w-[15%]'>Category</th>
                                        <th className='px-4 py-3 text-left w-[15%]'>Type</th>
                                        <th className="px-4 py-3 text-left w-[10%]">Price</th>
                                        <th className="px-4 py-3 text-left w-[15%]">Image</th>
                                        <th className="px-4 py-3 text-left w-[20%]">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length > 0 ? (
                                        filteredData.map((item, index) => (
                                            <tr key={index} className='text-[14px] font-medium font-montserrat hover:bg-gray-50 transition-colors duration-200'>
                                                <td className="border border-gray-200 px-4 py-4 transition-colors duration-300 truncate">{item.item_id}</td>
                                                <td className="border border-gray-200 px-4 py-4 transition-colors duration-300">{item.item_name}</td>
                                                <td className="border border-gray-200 px-4 py-4 transition-colors duration-300">{item.item_foodtype == "veg" ? "Veg" : "Non Veg"}</td>
                                                <td className="border border-gray-200 px-4 py-4 transition-colors duration-300">{item.item_type}</td>
                                                <td className="border border-gray-200 px-4 py-4 transition-colors duration-300">₹ {item.item_price}</td>
                                                <td className="border border-gray-200 px-4 py-4 transition-colors duration-300">
                                                    {item.item_thumbnail && (
                                                        <Image
                                                            className='w-[100px] h-[70px] object-cover rounded-md shadow-sm'
                                                            src={item.item_thumbnail}
                                                            alt={`${item.item_name} Thumbnail`}
                                                            width={100}
                                                            height={70}
                                                        />
                                                    )}
                                                </td>
                                                <td className="border border-gray-200 px-4 py-4 transition-colors duration-300">
                                                    <div className='flex flex-col gap-3'>
                                                        <button className="bg-primary hover:bg-[#416f9d] text-white px-4 py-2 rounded-lg text-[12px] flex items-center justify-between transition-colors duration-200" onClick={() => handleEditClick(item)}>
                                                            <div>Edit</div> <FaPenToSquare className="ml-3" />
                                                        </button>

                                                        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-[12px] flex items-center justify-between transition-colors duration-200" onClick={() => handleDeleteClick(item.item_id, item.item_name)}>
                                                            <div>Delete</div> <FaTrash className="ml-3" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="text-center py-6 text-gray-500 font-medium">No menu items found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>)}
                    </section>
                </>
            {popupOpened && (
                <AddMenu popuphandle={addMenuHandler} />
            )}

            {editPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
                    <div className="bg-white shadow-2xl rounded-xl p-8 w-[90%] max-w-[600px] relative animate-fadeIn">
                        {editLoading && (
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
                                <FaPenToSquare className="text-primary" size={24} />
                                Edit Menu Item
                            </h1>
                            <button 
                                className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
                                onClick={() => setEditPopupVisible(false)}
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                        
                        <form className="mt-6 space-y-5" onSubmit={(e) => { e.preventDefault(); editMenu(editData); }}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                        Item Name
                                    </label>
                                    <input
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                        type="text"
                                        name="item_name"
                                        value={editData.item_name}
                                        onChange={(e) => setEditData({ ...editData, item_name: e.target.value })}
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none h-20"
                                        name="item_description"
                                        value={editData.item_description}
                                        onChange={(e) => setEditData({ ...editData, item_description: e.target.value })}
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Food Type
                                        </label>
                                        <select
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
                                            name="item_foodtype"
                                            value={editData.item_foodtype}
                                            onChange={(e) => setEditData({ ...editData, item_foodtype: e.target.value })}
                                        >
                                            <option value="veg">Vegetarian</option>
                                            <option value="nveg">Non-Vegetarian</option>
                                        </select>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Category
                                        </label>
                                        <select
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
                                            name="item_type"
                                            value={editData.item_type}
                                            onChange={(e) => setEditData({ ...editData, item_type: e.target.value })}
                                        >
                                            {categoriesData.map((category, index) => (
                                                <option key={index} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Price
                                    </label>
                                    <input
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                        type="number"
                                        name="item_price"
                                        value={editData.item_price}
                                        onChange={(e) => setEditData({ ...editData, item_price: Number(e.target.value) })}
                                    />
                                </div>
                                
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700">
                                        Image
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-lg overflow-hidden shadow-md border border-gray-200 w-[120px] h-[80px]">
                                            <img 
                                                src={newThumbnail || editData.item_thumbnail} 
                                                alt={editData.item_name} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 text-sm font-medium">
                                            Change Image
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end pt-3 border-t border-gray-200 mt-6">
                                <div className="flex gap-3">
                                    <button 
                                        type="button" 
                                        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                                        onClick={() => setEditPopupVisible(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="bg-primary hover:bg-[#3a6485] text-white font-semibold px-8 py-2.5 rounded-lg transition-colors duration-200 shadow-sm"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

             {/* Delete Confirmation Popup */}
             {deletePopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
                    <div className="bg-white shadow-2xl rounded-xl p-8 max-w-md w-full animate-fadeIn">
                        {deleteLoading && (
                            <div className='absolute inset-0 flex justify-center items-center bg-white bg-opacity-90 rounded-xl z-10'>
                                <Bars
                                    height="60"
                                    width="60"
                                    color="#25476A"
                                    ariaLabel="bars-loading"
                                    visible={true}
                                />
                            </div>
                        )}
                        
                        <div className="text-center mb-6">
                            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <FaTrash className="text-red-500" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Delete Menu Item</h2>
                            <p className="text-gray-600">
                                Are you sure you want to delete <span className="font-bold text-primary">{deleteMenuName}</span>? This action cannot be undone.
                            </p>
                        </div>
                        
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Type {"delete"} to confirm
                            </label>
                            <input
                                type="text"
                                placeholder="delete"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                value={deleteMenuBoxValue}
                                onChange={(e) => setDeleteMenuBoxValue(e.target.value)}
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
                                onClick={() => handleDeleteMenuItem(deleteMenuId)}
                                disabled={deleteMenuBoxValue !== "delete"}
                            >
                                Delete Item
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Page;
