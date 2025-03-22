import { IoClose } from "react-icons/io5";
import { FaMinus, FaPlus } from "react-icons/fa";
import { SelectedItemsProps } from "./types";

const SelectedItems: React.FC<SelectedItemsProps> = ({
    selectedItems,
    handleQuantityChange,
    handleBlur,
    removeSelectedItem
}) => {
    return (
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
            <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center justify-between">
                <span>Selected Items</span>
                <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {selectedItems.length} items
                </span>
            </h3>
            
            <div className="flex-grow flex flex-col overflow-hidden">
                {selectedItems.length === 0 ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-gray-400 py-10">
                        <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-full mb-3">
                            <IoClose size={28} />
                        </div>
                        <p className="text-center">No items selected</p>
                        <p className="text-sm">Search and select items from the menu</p>
                    </div>
                ) : (
                    <ul className="overflow-y-auto space-y-3 pr-2 flex-grow">
                        {selectedItems.map(({ item, quantity }) => (
                            <li 
                                key={item.item_id} 
                                className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:border-primary/30 transition-all"
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-800">{item.item_name}</span>
                                    <span className="text-xs text-gray-500">{item.item_type} • ₹{item.item_price}</span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                        <button 
                                            onClick={() => {
                                                if (quantity > 1) {
                                                    handleQuantityChange(item.item_id, (quantity - 1).toString());
                                                } else {
                                                    removeSelectedItem(item.item_id);
                                                }
                                            }} 
                                            className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600"
                                        >
                                            <FaMinus size={10} />
                                        </button>
                                        
                                        <input
                                            type="text"
                                            value={quantity === 0 ? "" : quantity.toString()}
                                            onChange={(e) => handleQuantityChange(item.item_id, e.target.value)}
                                            onBlur={() => handleBlur(item.item_id, quantity)}
                                            className="w-10 border-x text-center py-1 focus:outline-none"
                                        />
                                        
                                        <button 
                                            onClick={() => handleQuantityChange(item.item_id, (quantity + 1).toString())} 
                                            className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600"
                                        >
                                            <FaPlus size={10} />
                                        </button>
                                    </div>
                                    
                                    <button 
                                        onClick={() => removeSelectedItem(item.item_id)} 
                                        className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-all"
                                    >
                                        <IoClose size={18} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            
            {selectedItems.length > 0 && (
                <div className="text-xs text-gray-500 pt-3 mt-3 border-t border-gray-100 text-center">
                    Use quantity controls to adjust or remove items
                </div>
            )}
        </div>
    );
};

export default SelectedItems;
