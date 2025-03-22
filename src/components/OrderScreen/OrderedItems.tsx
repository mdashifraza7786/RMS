import { IoClose } from "react-icons/io5";
import { FaShoppingBag } from "react-icons/fa";
import { OrderedItemsProps } from "./types";

const OrderedItems: React.FC<OrderedItemsProps> = ({
    tableNumber,
    orderedItem,
    removeOrderedItems
}) => {
    const currentOrders = orderedItem.filter(order => order.tablenumber === tableNumber);

    if (currentOrders.length === 0) {
        return (
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col h-full">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Current Order</h3>
                <div className="flex-grow flex flex-col items-center justify-center text-gray-400 py-10">
                    <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-full mb-3">
                        <FaShoppingBag size={24} />
                    </div>
                    <p className="text-center">No active orders for this table</p>
                    <p className="text-sm">Place an order to see it here</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
            <div className="flex justify-between items-center mb-3 flex-shrink-0">
                <h3 className="font-semibold text-lg text-gray-800">Current Order</h3>
                <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Order #{currentOrders[0].orderid}
                </div>
            </div>
            
            <div className="flex-grow overflow-hidden">
                {currentOrders.flatMap(order => order.itemsordered).length === 0 ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-gray-400 py-10">
                        <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-full mb-3">
                            <FaShoppingBag size={24} />
                        </div>
                        <p className="text-center">No items in current order</p>
                        <p className="text-sm">Add items to update this order</p>
                    </div>
                ) : (
                    <ul className="space-y-3 overflow-y-auto pr-2 h-full">
                        {currentOrders.flatMap(order =>
                            order.itemsordered.map((item) => (
                                <li 
                                    key={item.item_id} 
                                    className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:border-primary/30 transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 flex items-center justify-center bg-primary/10 text-primary rounded-full text-sm font-medium">
                                            {item.quantity}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-800">{item.item_name}</span>
                                            <span className="text-xs text-gray-500">₹{item.price} per item</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium text-primary">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </span>
                                        <button
                                            onClick={() => removeOrderedItems(item.item_id, tableNumber, order.orderid)}
                                            className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-all"
                                        >
                                            <IoClose size={18} />
                                        </button>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                )}
            </div>
            
            <div className="text-xs text-gray-500 pt-3 mt-3 border-t border-gray-100 flex-shrink-0">
                Items already ordered for Table #{tableNumber}
            </div>
        </div>
    );
};

export default OrderedItems;
