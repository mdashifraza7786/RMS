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
    items = []
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
                                <li key={(it.item_id || idx.toString()) + '-bill'} className="py-2 flex justify-between items-center">
                                    <div className="text-sm text-gray-800">
                                        {it.item_name}
                                        <span className="text-gray-500 text-xs ml-2">× {it.quantity}</span>
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">₹{(it.price * it.quantity).toFixed(2)}</div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>

            <div className="mt-4 space-y-3">
                <button
                    onClick={handleCompleteOrder}
                    disabled={!booked}
                    className={`w-full bg-gradient-to-r from-supporting2 to-[#8ebf11] text-white font-medium py-3 px-4 rounded-lg hover:shadow-md transition ${!booked ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                    Complete Order
                </button>
                <button
                    onClick={handlePlaceOrder}
                    disabled={subtotal === 0}
                    className={`w-full font-medium py-3 px-4 rounded-lg transition ${
                        subtotal === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:shadow-md'
                    }`}
                >
                    {booked ? 'Update Order' : 'Place Order'}
                </button>
            </div>
        </div>
    );
};

export default BillSummary;
