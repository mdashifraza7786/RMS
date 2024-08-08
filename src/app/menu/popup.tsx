import axios from 'axios';
import { useState, ChangeEvent, FocusEvent, FormEvent } from 'react';
import { FaTimes } from 'react-icons/fa';

interface AddMenuProps {
    popuphandle: () => void;
}

const categoriesData: string[] = [
    "Appetizers", "Main Course", "Desserts", "Beverages"
];

const AddMenu: React.FC<AddMenuProps> = ({ popuphandle }) => {
    const [categories, setCategories] = useState<string[]>(categoriesData);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [displayCategory, setDisplayCategory] = useState<string>('');
    const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [formValues, setFormValues] = useState({
        item_name: '',
        item_description: '',
        item_foodtype: 'veg',
        item_price: '',
        item_category: ''
    });

    const handleCategoryChange = (event: ChangeEvent<HTMLInputElement>) => {
        const category = event.target.value;
        setSearchTerm(category);
        if (categories.includes(category)) {
            setDisplayCategory(category);
            setFormValues(prevValues => ({
                ...prevValues,
                item_category: category
            }));
        } else {
            setIsDropdownVisible(true);
            setDisplayCategory("");
        }
    };

    const handleCategorySelect = (category: string) => {
        setDisplayCategory(category);
        setSearchTerm('');
        setIsDropdownVisible(false);
        setFormValues(prevValues => ({
            ...prevValues,
            item_category: category
        }));
    };

    const handleFocus = () => {
        setIsDropdownVisible(true);
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        setTimeout(() => {
            setIsDropdownVisible(false);
        }, 200);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
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
        
        if (!selectedFile) {
            alert('Please select an image');
            return;
        }

        const formData = new FormData();
        formData.append('item_name', formValues.item_name);
        formData.append('item_description', formValues.item_description);
        formData.append('item_foodtype', formValues.item_foodtype);
        formData.append('item_price', formValues.item_price);
        formData.append('item_category', formValues.item_category);
        formData.append('item_thumbnail', selectedFile);

        try {
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            // Handle success
        } catch (error) {
            console.error('Error uploading menu item:', error);
            // Handle error
        }
    };

    const filteredCategories = categories.filter(category =>
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
                                        value={searchTerm || displayCategory}
                                        onChange={handleCategoryChange}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                    />
                                    {isDropdownVisible && filteredCategories.length > 0 && (
                                        <ul className="absolute top-full left-0 w-full border-2 border-gray-300 bg-white z-10">
                                            {filteredCategories.map((category, index) => (
                                                <li
                                                    key={index}
                                                    className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                                                    onMouseDown={(e) => e.preventDefault()} // Prevent input blur
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
                                        <option value="non-veg">Non - Veg</option>
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
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-4 col-span-2">
                        {imagePreviewUrl ? (
                            <div className="image-preview">
                                <img src={imagePreviewUrl} alt="Selected Thumbnail" />
                                <FaTimes className="remove-icon" onClick={handleRemoveImage} />
                            </div>
                        ) : (
                            <div className="custom-file-input-wrapper" onClick={() => document.getElementById('food_menu_thumbnail')?.click()}>
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
