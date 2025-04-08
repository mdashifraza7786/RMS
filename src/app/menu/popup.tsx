import axios from 'axios';
import { useState, ChangeEvent, FormEvent } from 'react';
import { FaTimes } from 'react-icons/fa';
import { IoFastFoodOutline } from 'react-icons/io5';
import { MdOutlineAttachMoney, MdOutlineDescription } from 'react-icons/md';
import { BiFoodMenu } from 'react-icons/bi';
import { FiImage } from 'react-icons/fi';

interface AddMenuProps {
    popuphandle: () => void;
}

const categoriesData: string[] = [
    "Appetizers", "Main Course", "Desserts", "Beverages"
];

const AddMenu: React.FC<AddMenuProps> = ({ popuphandle }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formValues, setFormValues] = useState({
        item_name: '',
        item_description: '',
        item_foodtype: 'veg',
        item_price: '',
        making_cost: '', // Renamed field
    });

    const handleCategoryChange = (event: ChangeEvent<HTMLInputElement>) => {
        const category = event.target.value;
        setSearchTerm(category);
        setIsDropdownVisible(true);
    };

    const handleCategorySelect = (event: ChangeEvent<HTMLSelectElement>) => {
        const category = event.target.value;
        setSelectedCategory(category);
        setSearchTerm('');
        setIsDropdownVisible(false);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImagePreviewUrl(null);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!imagePreviewUrl) {
            alert('Please select an image');
            return;
        }

        if (!selectedCategory) {
            alert('Please select a category');
            return;
        }

        setIsLoading(true);
        const formData = {
            item_name: formValues.item_name,
            item_description: formValues.item_description,
            item_foodtype: formValues.item_foodtype,
            item_price: formValues.item_price,
            making_cost: formValues.making_cost, // Added field
            item_type: selectedCategory,
            item_thumbnail: imagePreviewUrl,
        };

        try {
            const response = await axios.post('/api/menu/register', formData);
            console.log(response.data);
            popuphandle();
        } catch (error) {
            console.error('Error uploading menu item:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredCategories = categoriesData.filter(category =>
        category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
            <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-2xl relative animate-fadeIn">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-200 pb-5 mb-6">
                    <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                        <BiFoodMenu className="text-[#9FCC2E]" size={28} />
                        Add New Menu Item
                    </h1>
                    <button 
                        className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
                        onClick={popuphandle}
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Form */}
                <form className="mt-6 space-y-7" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-8 text-gray-700">
                        {/* Left Section - Form Inputs */}
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                    <IoFastFoodOutline /> Item Name
                                </label>
                                <input
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    type="text"
                                    name="item_name"
                                    placeholder="Enter item name"
                                    value={formValues.item_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                    <MdOutlineDescription /> Description
                                </label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none h-24"
                                    name="item_description"
                                    placeholder="Enter item description"
                                    value={formValues.item_description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            {/* Category & Food Type */}
                            <div className="grid grid-cols-1 gap-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                        <BiFoodMenu /> Category
                                    </label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
                                        name="item_category"
                                        value={selectedCategory}
                                        onChange={handleCategorySelect}
                                        required
                                    >
                                        <option value="" disabled>Select Category</option>
                                        {filteredCategories.map((category, index) => (
                                            <option key={index} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Food type and Price - In a row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Food Type</label>
                                        <select
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
                                            name="item_foodtype"
                                            value={formValues.item_foodtype}
                                            onChange={handleInputChange}
                                        >
                                            <option value="veg">Vegetarian</option>
                                            <option value="nveg">Non-Vegetarian</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                            <MdOutlineAttachMoney /> Price
                                        </label>
                                        <input
                                            name="item_price"
                                            type="number"
                                            placeholder="Enter price"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                            value={formValues.item_price}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                    
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                            <MdOutlineAttachMoney /> Making Cost
                                        </label>
                                        <input
                                            name="other_cost" // Added field
                                            type="number"
                                            placeholder="Enter cost"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                            value={formValues.making_cost} // Added value
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Image Upload */}
                        <div className="flex flex-col items-center justify-center">
                            <div className="space-y-2 w-full text-center mb-3">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5 justify-center">
                                    <FiImage /> Item Image
                                </label>
                            </div>
                            
                            {imagePreviewUrl ? (
                                <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200 group">
                                    <img src={imagePreviewUrl} alt="Thumbnail" className="w-full h-64 object-cover transition duration-300 group-hover:opacity-90" />
                                    <button 
                                        type="button"
                                        className="absolute top-2 right-2 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
                                        onClick={handleRemoveImage}
                                    >
                                        <FaTimes className="text-red-500" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-300">
                                    <div className="flex flex-col items-center justify-center p-5 text-center">
                                        <FiImage className="text-gray-400 mb-2" size={40} />
                                        <p className="text-sm text-gray-500 mb-1">Drag and drop an image, or click to select</p>
                                        <p className="text-xs text-gray-400">Recommended: 800x600px or larger</p>
                                    </div>
                                    <input
                                        type="file"
                                        id="food_menu_thumbnail"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        name="item_thumbnail"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Add Button */}
                    <div className="flex justify-end pt-3 border-t border-gray-200">
                        <div className="flex gap-3">
                            <button 
                                type="button" 
                                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                                onClick={popuphandle}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="bg-[#9FCC2E] hover:bg-[#8bba1e] text-white font-semibold px-8 py-2.5 rounded-lg transition-colors duration-200 shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Adding...' : 'Add Item'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMenu;
