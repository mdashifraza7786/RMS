"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { FaPenToSquare, FaTrash, FaPlus } from "react-icons/fa6";
import { FaSearch, FaUserSlash } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import AddMenu from './popup';
import Skeleton from '@/components/ui/Skeleton';
import Image from 'next/image';
import IngredientModal from './IngredientModal';
import { FaListUl } from 'react-icons/fa';

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
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [limit] = useState<number>(12);
    const [recipeMenuItem, setRecipeMenuItem] = useState<EditData | null>(null);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchMenuData(currentPage, searchTerm, activeCategory);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [currentPage, activeCategory, searchTerm]);

    const fetchMenuData = async (page: number = 1, search: string = '', category: string = 'all') => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/menu?page=${page}&limit=${limit}&search=${search}&category=${category}`);
            const data = response.data;
            if (data && Array.isArray(data.menu)) {
                setMenuData(data.menu);
                setTotalItems(data.total);
                setTotalPages(Math.ceil(data.total / limit));
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
        setCurrentPage(1);
    };

    const handleEditClick = (data: EditData) => {
        setEditData(data);
        setNewThumbnail(null);
        setEditPopupVisible(true);
    };

    const handleDeleteClick = (item_id: string, item_name: string) => {
        setDeletePopupVisible(true);
        setDeleteMenuId(item_id);
        setDeleteMenuName(item_name);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewThumbnail(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const editMenu = async (data: EditData) => {
        try {
            setEditLoading(true);

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
            fetchMenuData(currentPage, searchTerm, activeCategory);
        } catch (error) {
            console.error("Error updating menu item:", error);
        } finally {
            setEditLoading(false);
            setEditPopupVisible(false);
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
            fetchMenuData(currentPage, searchTerm, activeCategory);
        }
    };

    const categories = ["all", ...categoriesData];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount).replace('₹', '₹ ');
    };

    const getFoodTypeBadge = (foodType: string) => {
        return foodType === "veg"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800";
    };

    return (
        <div className="container mx-auto px-6 pt-4 pb-8">
            <div className="py-4">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-semibold text-gray-800">Menu</h1>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="search"
                                placeholder="Search by name or ID..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary w-full md:w-80"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <button
                            onClick={addMenuHandler}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition shadow-sm"
                        >
                            <FaPlus size={16} />
                            <span>Add Item</span>
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 border-b border-gray-200">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => {
                                    setActiveCategory(category);
                                    setCurrentPage(1);
                                }}
                                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${activeCategory === category
                                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {category === "all" ? "All Categories" : category}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="p-6 space-y-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0">
                                <Skeleton variant="rect" width="64px" height="64px" className="rounded-md" />
                                <div className="flex-grow space-y-2">
                                    <Skeleton variant="text" width="200px" height="16px" />
                                    <Skeleton variant="text" width="150px" height="12px" />
                                </div>
                                <div className="hidden md:flex gap-8">
                                    <Skeleton variant="text" width="80px" height="16px" />
                                    <Skeleton variant="text" width="80px" height="16px" />
                                    <Skeleton variant="rect" width="60px" height="20px" className="rounded-full" />
                                </div>
                                <div className="flex gap-2">
                                    <Skeleton variant="rect" width="32px" height="32px" className="rounded-md" />
                                    <Skeleton variant="rect" width="32px" height="32px" className="rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 table-fixed">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {menuData.length > 0 ? (
                                        menuData.map((item) => (
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
                                                                unoptimized
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
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition"
                                                            onClick={() => setRecipeMenuItem(item)}
                                                        >
                                                            <FaListUl className="mr-1.5" size={12} />
                                                            Recipe
                                                        </button>
                                                        <button
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition"
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
                                                    <MdOutlineRestaurantMenu className="text-primary text-4xl mb-2" />
                                                    <p className="text-lg font-medium">No menu items found</p>
                                                    <p className="mt-1 text-sm">Try adjusting your search or adding a new item.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden px-4">
                            {menuData.length > 0 ? (
                                <div className="space-y-4">
                                    {menuData.map((item) => (
                                        <div key={item.item_id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                            <div className="flex p-4 items-center">
                                                <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 border border-gray-200 mr-4 flex-shrink-0">
                                                    {item.item_thumbnail ? (
                                                        <Image
                                                            src={item.item_thumbnail}
                                                            alt={item.item_name}
                                                            width={64}
                                                            height={64}
                                                            className="w-full h-full object-cover"
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            No image
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="font-medium text-gray-800">{item.item_name}</div>
                                                    <div className="text-sm text-gray-500 mt-1 line-clamp-1">{item.item_description}</div>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className="text-sm font-medium text-gray-900">{formatCurrency(item.item_price)}</span>
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getFoodTypeBadge(item.item_foodtype)}`}>
                                                            {item.item_foodtype === "veg" ? "Veg" : "Non-Veg"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="border-t border-gray-100 p-3 bg-gray-50 flex justify-between items-center">
                                                <div className="text-xs text-gray-500">{item.item_type}</div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition"
                                                        onClick={() => setRecipeMenuItem(item)}
                                                    >
                                                        <FaListUl className="mr-1.5" size={12} />
                                                        Recipe
                                                    </button>
                                                    <button
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition"
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
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        <MdOutlineRestaurantMenu className="text-primary text-4xl mb-2" />
                                        <p className="text-lg font-medium">No menu items found</p>
                                        <p className="mt-1 text-sm">Try adjusting your search or adding a new item.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )
                }
                
                {/* Pagination Controls */}
                {!loading && totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-gray-500">
                            Showing <span className="font-medium">{((currentPage - 1) * limit) + 1}</span> to <span className="font-medium">{Math.min(currentPage * limit, totalItems)}</span> of <span className="font-medium">{totalItems}</span> results
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <div className="flex items-center gap-1">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                                            currentPage === i + 1
                                                ? 'bg-primary text-white shadow-sm'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {popupOpened && (
                <AddMenu popuphandle={addMenuHandler} />
            )}

            {editPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
                    <div className="bg-white shadow-2xl rounded-xl p-8 w-[90%] max-w-[600px] relative animate-fadeIn">
                        {editLoading && (
                            <div className='absolute inset-0 flex flex-col justify-center items-center bg-white bg-opacity-90 rounded-xl z-10 p-8 space-y-4'>
                                <Skeleton variant="text" width="40%" height="24px" />
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <Skeleton variant="rect" width="100%" height="40px" className="rounded-lg" />
                                    <Skeleton variant="rect" width="100%" height="40px" className="rounded-lg" />
                                </div>
                                <Skeleton variant="rect" width="100%" height="100px" className="rounded-lg" />
                                <p className="text-primary font-medium animate-pulse">Saving changes...</p>
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
                                            <Image
                                                src={newThumbnail || editData.item_thumbnail || ''}
                                                alt={editData.item_name}
                                                className="w-full h-full object-cover"
                                                width={120}
                                                height={80}
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
                                        className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-2.5 rounded-lg transition-colors duration-200 shadow-sm"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deletePopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
                    <div className="bg-white shadow-2xl rounded-xl p-8 max-w-md w-full animate-fadeIn">
                        {deleteLoading && (
                            <div className='absolute inset-0 flex flex-col justify-center items-center bg-white bg-opacity-90 rounded-xl z-10 p-8 space-y-4 text-center'>
                                <Skeleton variant="circle" width="64px" height="64px" className="mx-auto" />
                                <Skeleton variant="text" width="80%" height="20px" className="mx-auto" />
                                <Skeleton variant="rect" width="100%" height="40px" className="rounded-lg" />
                                <p className="text-red-500 font-medium animate-pulse">Deleting item...</p>
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
            {recipeMenuItem && (
                <IngredientModal 
                    menuItem={recipeMenuItem} 
                    onClose={() => setRecipeMenuItem(null)} 
                />
            )}
        </div>
    );
};

export default Page;
