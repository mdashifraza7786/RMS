import axios from 'axios';
import { useState, ChangeEvent, FormEvent } from 'react';
import { FaTimes } from 'react-icons/fa';

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
    const [formValues, setFormValues] = useState({
        item_name: '',
        item_description: '',
        item_foodtype: 'veg',
        item_price: '',
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

        const formData = {
            item_name: formValues.item_name,
            item_description: formValues.item_description,
            item_foodtype: formValues.item_foodtype,
            item_price: formValues.item_price,
            item_type: selectedCategory,
            item_thumbnail: imagePreviewUrl,
        };

        try {
            const response = await axios.post('/api/menu/register', formData);
            console.log(response.data);
            popuphandle();
        } catch (error) {
            console.error('Error uploading menu item:', error);
        }
    };

    const filteredCategories = categoriesData.filter(category =>
        category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-2xl relative">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-4">
                    <h1 className="text-2xl font-semibold text-primary">Add Menu</h1>
                    <FaTimes className="text-gray-600 text-[25px] cursor-pointer hover:text-red-500" onClick={popuphandle} />
                </div>

                {/* Form */}
                <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 text-gray-700 items-center justify-center gap-2">
                        {/* Left Section - Form Inputs */}
                        <div className="space-y-5">
                            <input
                                className="w-full border border-gray-300 rounded-md px-4 py-2"
                                type="text"
                                name="item_name"
                                placeholder="Enter item name"
                                value={formValues.item_name}
                                onChange={handleInputChange}
                                required
                            />
                            <textarea
                                className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none"
                                name="item_description"
                                placeholder="Enter description"
                                value={formValues.item_description}
                                onChange={handleInputChange}
                                required
                            />

                            {/* Category & Price */}
                            <div className="grid grid-cols-1 gap-4">
                                {/* Category input - Full Width */}
                                <div className="relative">
                                    <select
                                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                                        name="item_category"
                                        value={selectedCategory}
                                        onChange={handleCategorySelect}
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
                                    <select
                                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                                        name="item_foodtype"
                                        value={formValues.item_foodtype}
                                        onChange={handleInputChange}
                                    >
                                        <option value="veg">Veg</option>
                                        <option value="nveg">Non-Veg</option>
                                    </select>

                                    <input
                                        name="item_price"
                                        type="number"
                                        placeholder="Price"
                                        className="w-full border border-gray-300 rounded-md px-4 py-2"
                                        value={formValues.item_price}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                        </div>

                        {/* Right Section - Image Upload */}
                        <div className="flex flex-col items-center">
                            {imagePreviewUrl ? (
                                <div className="relative">
                                    <img src={imagePreviewUrl} alt="Thumbnail" className="w-40 h-40 object-cover rounded-md shadow-md" />
                                    <FaTimes className="absolute top-2 right-2 text-gray-600 cursor-pointer hover:text-red-500" onClick={handleRemoveImage} />
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                                    <span className="text-gray-600">Select Thumbnail</span>
                                    <input
                                        type="file"
                                        id="food_menu_thumbnail"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        name="item_thumbnail"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Add Button */}
                    <div className="flex justify-end">
                        <button type="submit" className="bg-[#9FCC2E] hover:bg-[#badb69]  text-white font-bold px-6 py-2 rounded-md hover:bg-primary-dark">
                            ADD NOW
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMenu;
