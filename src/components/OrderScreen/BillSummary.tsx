import { FaCreditCard, FaHistory, FaShoppingCart } from "react-icons/fa";
import { BillSummaryProps } from "./types";

const BillSummary: React.FC<BillSummaryProps> = ({
    subtotal,
    gst,
    totalAmount,
    booked,
    handlePlaceOrder,
    handleCompleteOrder,
    tableNumber
}) => {
    return (
        <div className="border border-gray-100 p-6 rounded-lg shadow-sm bg-white h-full flex flex-col">
            <div className="pb-5 mb-5 border-b border-gray-100">
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
                {subtotal > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-5">
                        <div className="flex items-start gap-3">
                            <div className="text-blue-500 mt-1">
                                <FaHistory size={16} />
                            </div>
                            <div>
                                <h4 className="font-medium text-blue-800 mb-1">Order Summary</h4>
                                <p className="text-sm text-blue-700">
                                    {tableNumber > 0 ? `Table #${tableNumber}` : 'Parcel Order'}
                                    {booked ? ' - Order is active' : ' - New order'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-auto space-y-3 pt-4">
                {booked && (
                    <button
                        onClick={handleCompleteOrder}
                        className="w-full bg-gradient-to-r from-supporting2 to-[#8ebf11] text-white font-medium py-3 px-4 rounded-lg hover:shadow-md transition flex items-center justify-center gap-2"
                    >
                        <FaCreditCard size={16} />
                        <span>Complete Order</span>
                    </button>
                )}

                <button
                    onClick={handlePlaceOrder}
                    disabled={subtotal === 0}
                    className={`w-full font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition ${
                        subtotal === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-primary to-primaryhover text-white hover:shadow-md'
                    }`}
                >
                    <FaShoppingCart size={16} />
                    <span>{!booked ? "Place Order" : "Update Order"}</span>
                </button>
            </div>
        </div>
    );
};

export default BillSummary;
