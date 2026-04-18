import { FaCreditCard, FaHistory, FaShoppingCart } from "react-icons/fa";
import { BillSummaryProps } from "./types";

const BillSummary: React.FC<BillSummaryProps> = ({
    subtotal,
    gst,
    totalAmount,
    booked,
    handlePlaceOrder,
    handleCompleteOrder,
    tableNumber,
    isSubmitting = false,
    items = [],
    selectedItemsRaw = [],
    handleQuantityChange
}) => {
    return (
        <div className="border border-gray-100 p-6 rounded-lg shadow-sm bg-white flex flex-col h-full">
            <div className="pb-4 mb-4 border-b border-gray-100">
                <div className="flex justify-between items-center pb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                    <span className="text-gray-600">GST (18%):</span>
                    <span className="font-medium">₹{gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 text-lg">
                    <span className="font-semibold text-gray-800">Total:</span>
                    <span className="font-bold text-primary">₹{totalAmount.toFixed(2)}</span>
                </div>
            </div>
            <div className="flex-grow overflow-auto">
                <div className="bg-gray-50 rounded-md p-3">
                    <div className="text-sm text-gray-600 mb-2">Items</div>
                    <ul className="max-h-64 overflow-auto divide-y divide-gray-200">
                        {items.length === 0 ? (
                            <li className="py-6 text-center text-gray-400 text-sm">No items selected</li>
                        ) : (
                            items.map((it, idx) => (
                                <li key={(it.item_id || idx.toString()) + '-bill'} className="py-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 border-b border-gray-100 last:border-0">
                                    <div className="text-sm text-gray-800 font-medium">
                                        {it.item_name}
                                    </div>
                                    <div className="flex justify-between items-center w-full sm:w-auto gap-4">
                                        <div className="flex items-center text-xs">
                                            {handleQuantityChange && it.item_id ? (
                                                <div className="flex items-center bg-white border border-gray-200 rounded text-gray-600 shadow-sm">
                                                    <button 
                                                        className="px-1.5 py-0.5 hover:bg-gray-100 disabled:opacity-30"
                                                        onClick={() => handleQuantityChange(it.item_id!, (it.quantity - 1).toString())}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-2 font-medium">{it.quantity}</span>
                                                    <button 
                                                        className="px-1.5 py-0.5 hover:bg-gray-100"
                                                        onClick={() => handleQuantityChange(it.item_id!, (it.quantity + 1).toString())}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">Qty: {it.quantity}</span>
                                            )}
                                        </div>
                                        <div className="text-sm font-semibold text-gray-900">₹{(it.price * it.quantity).toFixed(2)}</div>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>

            <div className="mt-4 space-y-3">
                <button
                    onClick={handleCompleteOrder}
                    disabled={!booked || isSubmitting}
                    className={`w-full bg-gradient-to-r from-supporting2 to-[#8ebf11] text-white font-medium py-3 px-4 rounded-lg hover:shadow-md transition ${(!booked || isSubmitting) ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                    {isSubmitting ? 'Processing...' : 'Complete Order'}
                </button>
                <button
                    onClick={handlePlaceOrder}
                    disabled={subtotal === 0 || isSubmitting}
                    className={`w-full font-medium py-3 px-4 rounded-lg transition ${
                        (subtotal === 0 || isSubmitting) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:shadow-md'
                    }`}
                >
                    {isSubmitting ? 'Processing...' : (booked ? 'Update Order' : 'Place Order')}
                </button>
            </div>
        </div>
    );
};

export default BillSummary;
