import { ChangeEvent } from "react";
import { FaSearch } from "react-icons/fa";
import { MenuSearchProps } from "./types";

const MenuSearch: React.FC<MenuSearchProps> = ({
    searchTerm,
    setSearchTerm,
}) => {
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
    };

    return (
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
    );
};

export default MenuSearch;
