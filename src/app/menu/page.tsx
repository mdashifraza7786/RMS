"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { FaPenToSquare, FaTrash, FaPlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa"; // Changed from fa6 to fa
import { FaTimes } from "react-icons/fa";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import AddMenu from './popup';
import { Bars } from 'react-loader-spinner';
import Image from 'next/image';

interface EditData {
    item_id: string;
    item_description: string;
    item_name: string;
    item_foodtype: string;
    item_price: number;
    making_cost?: number;
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
        making_cost: 0,
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
    const [activeCategory, setActiveCategory] = useState<string>("all");

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
        setDeletePopupVisible(true);
        setDeleteMenuId(item_id);
        setDeleteMenuName(item_name);
    };

    const filteredData = menuData.filter(item => {
        const matchesSearch = 
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.item_id.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = 
            activeCategory === "all" || 
            item.item_type === activeCategory;
        
        return matchesSearch && matchesCategory;
    });

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

    const editMenu = async (data: EditData) => {
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
            alert("Menu item deleted successfully!");
        } catch (error) {
            console.error("Error deleting menu item:", error);
        } finally {
            setDeleteLoading(false);
            setDeleteMenuBoxValue("");
            fetchMenuData();
        }
    };

    // Get unique categories from menu data
    const uniqueCategories = Array.from(new Set(menuData.map(item => item.item_type)));
    const categories = ["all", ...uniqueCategories];

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount).replace('₹', '₹ ');
    };

    // Get food type badge style
    const getFoodTypeBadge = (foodType: string) => {
        return foodType === "veg" 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800";
    };

    return (
        <div className="container mx-auto px-4 py-6 md:px-6 lg:max-w-[90%] xl:max-w-7xl 2xl:max-w-[1400px] font-sans">
            {/* Page Header */}
            <div className="flex items-center mb-6">
                <div className="h-10 w-10 rounded-lg bg-[#1e4569]/10 flex items-center justify-center mr-3">
                    <MdOutlineRestaurantMenu className="text-[#1e4569]" size={20} />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Menu</h1>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header with search */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                            <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                                </div>
                                <input
                                type="search"
                                placeholder="Search by name or ID..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#1e4569] focus:border-[#1e4569] w-full md:w-80"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>
                                <button 
                                    onClick={addMenuHandler} 
                            className="bg-[#1e4569] hover:bg-[#2c5983] text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-200 shadow-sm flex items-center gap-2.5"
                                >
                            <FaPlus size={16} />
                                    <span>Add Item</span>
                                </button>
                            </div>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2 border-b border-gray-200">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                                    activeCategory === category
                                        ? 'text-[#1e4569] border-b-2 border-[#1e4569] bg-[#1e4569]/5'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {category === "all" ? "All Categories" : category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table content */}
                <div className="overflow-x-auto">
                        {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Bars height="50" width="50" color="#1e4569" ariaLabel="bars-loading" />
                            </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Making Cost</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredData.length > 0 ? (
                                    filteredData.map((item) => (
                                        <tr key={item.item_id} className="hover:bg-gray-50 transition duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                                    {item.item_thumbnail ? (
                                                        <Image
                                                            src={item.item_thumbnail}
                                                            alt={item.item_name}
                                                            width={64}
                                                            height={64}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            No image
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {item.item_id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                <div>
                                                    <div className="font-medium">{item.item_name}</div>
                                                    <div className="text-xs text-gray-500 mt-1 line-clamp-1">{item.item_description}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.item_type}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFoodTypeBadge(item.item_foodtype)}`}>
                                                    {item.item_foodtype === "veg" ? "Vegetarian" : "Non-Vegetarian"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatCurrency(item.item_price)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatCurrency(item.making_cost || 0)}
                                                </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-[#1e4569] hover:bg-[#2c5983] transition"
                                                        onClick={() => handleEditClick(item)}
                                                    >
                                                        <FaPenToSquare className="mr-1.5" size={12} />
                                                        Edit
                                                        </button>
                                                    <button
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition"
                                                        onClick={() => handleDeleteClick(item.item_id, item.item_name)}
                                                    >
                                                        <FaTrash className="mr-1.5" size={12} />
                                                        Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                        <td colSpan={8} className="py-12 text-center">
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
                                                <p className="text-lg font-medium">No menu items found</p>
                                                <p className="mt-1 text-sm">Try adjusting your search or adding a new item.</p>
                                            </div>
                                        </td>
                                        </tr>
                                    )}
                                </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Add Menu Popup */}
            {popupOpened && (
                <AddMenu popuphandle={addMenuHandler} />
            )}

            {/* Edit Popup */}
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
                                
                                <div className="grid grid-cols-2 gap-4">
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

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Making Cost
                                    </label>
                                    <input
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                        type="number"
                                        name="making_cost"
                                        value={editData.making_cost}
                                        onChange={(e) => setEditData({ ...editData, making_cost: Number(e.target.value) })}
                                    />
                                    </div>
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
                                        className="bg-[#1e4569] hover:bg-[#2c5983] text-white font-semibold px-8 py-2.5 rounded-lg transition-colors duration-200 shadow-sm"
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
                                Are you sure you want to delete <span className="font-bold text-[#1e4569]">{deleteMenuName}</span>? This action cannot be undone.
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

export default Page;
