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

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
        setSearchTerm('');
        setIsDropdownVisible(false);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result as string); // Store Base64 image
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
        <div className="h-screen w-screen bg-white fixed left-0 top-0 z-50 overflow-hidden popup-transition">
            <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
                <div className="h-16 border-b-2 border-gray-300 flex items-center justify-between px-20 text-2xl">
                    <button type="submit" className="bg-supporting2 rounded-lg px-6 py-1 text-white">SAVE</button>
                    <FaTimes className="cursor-pointer" onClick={popuphandle} />
                </div>
                <div className="px-20 grid grid-cols-5 gap-14">
                    <div className="col-span-3 flex flex-col gap-7">
                        <h1 className='text-2xl font-bold uppercase'>Add Menu</h1>
                        <div className="flex flex-col gap-7">
                            <input
                                className="outline-none border-2 border-gray-300 px-3 py-2"
                                type="text"
                                name="item_name"
                                placeholder="Enter item name"
                                value={formValues.item_name}
                                onChange={handleInputChange}
                                required
                            />
                            <textarea
                                className="outline-none border-2 border-gray-300 px-3 py-2 resize-none"
                                name="item_description"
                                placeholder="Enter description for item"
                                value={formValues.item_description}
                                onChange={handleInputChange}
                                required
                            />

                            <div className="flex gap-7 relative">
                                <div className='relative'>
                                    <input
                                        className="outline-none border-2 border-gray-300 px-3 py-2"
                                        type="text"
                                        placeholder="Search categories"
                                        name='item_category'
                                        value={searchTerm || selectedCategory}
                                        onChange={handleCategoryChange}
                                    />
                                    {isDropdownVisible && filteredCategories.length > 0 && (
                                        <ul className="absolute top-full left-0 w-full border-2 border-gray-300 bg-white z-10">
                                            {filteredCategories.map((category, index) => (
                                                <li
                                                    key={index}
                                                    className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                                                    onClick={() => handleCategorySelect(category)}
                                                >
                                                    {category}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div>
                                    <select
                                        className="outline-none border-2 border-gray-300 px-3 py-2"
                                        name="item_foodtype"
                                        value={formValues.item_foodtype}
                                        onChange={handleInputChange}
                                    >
                                        <option value="veg">Veg</option>
                                        <option value="nveg">Non - Veg</option>
                                    </select>
                                </div>
                                <div>
                                    <input  
                                        name='item_price'
                                        type="number"
                                        placeholder='Price'
                                        className="outline-none border-2 border-gray-300 px-3 py-2"
                                        value={formValues.item_price}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-4 col-span-2">
                        {imagePreviewUrl ? (
                            <div className="image-preview relative">
                                <img src={imagePreviewUrl} alt="Selected Thumbnail" className="max-w-full max-h-full object-cover" />
                                <FaTimes className="remove-icon cursor-pointer absolute top-2 right-2" onClick={handleRemoveImage} />
                            </div>
                        ) : (
                            <div className="custom-file-input-wrapper flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer">
                                <span>Select Thumbnail</span>
                                <input
                                    type="file"
                                    id="food_menu_thumbnail"
                                    className="custom-file-input"
                                    onChange={handleFileChange}
                                    name='item_thumbnail'
                                    style={{ display: 'none' }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddMenu;
