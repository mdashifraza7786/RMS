import { ChangeEvent } from "react";
import { FaSearch } from "react-icons/fa";
import { MenuSearchProps } from "./types";

const MenuSearch: React.FC<MenuSearchProps> = ({
    searchTerm,
    setSearchTerm,
    isDropdownVisible,
    filteredData,
    handleItemSelect
}) => {
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
    };

    return (
        <div className="relative">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaSearch />
                </div>
                <input
                    type="text"
                    placeholder="Search for food, drinks, desserts..."
                    className="w-full py-3 pl-10 pr-4 rounded-lg border-[1px] outline-none border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            {isDropdownVisible && filteredData.length > 0 && (
                <ul className="mt-1 border border-gray-200 bg-white z-20 max-h-64 overflow-y-auto absolute left-0 top-full w-full rounded-lg shadow-lg">
                    {filteredData.map((item, index) => (
                        <li
                            key={index}
                            className="px-4 py-3 cursor-pointer hover:bg-gray-50 flex justify-between items-center border-b border-gray-100 last:border-b-0"
                            onClick={() => handleItemSelect(item)}
                        >
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-800">{item.item_name}</span>
                                <span className="text-xs text-gray-500">{item.item_type} • {item.item_foodtype}</span>
                            </div>
                            <span className="text-primary font-semibold">₹{item.item_price}</span>
                        </li>
                    ))}
                </ul>
            )}
            {isDropdownVisible && filteredData.length === 0 && (
                <div className="mt-1 border border-gray-200 bg-white z-20 py-6 absolute left-0 top-full w-full rounded-lg shadow-lg text-center text-gray-500">
                    No menu items found matching &ldquo;{searchTerm}&rdquo;
                </div>
            )}
        </div>
    );
};

export default MenuSearch;
