import { useState } from "react";
import { IoClose } from "react-icons/io5";
import QRCode from "react-qr-code";
import { FaCashRegister, FaCreditCard, FaMoneyBillWave, FaPercent, FaRupeeSign } from "react-icons/fa";
import { CompleteOrderModalProps } from "./types";

const CompleteOrderModal: React.FC<CompleteOrderModalProps> = ({
    isVisible,
    tableNumber,
    orderId,
    totalAmount,
    closeModal,
    completeOrder
}) => {
    const [paymentMethod, setPaymentMethod] = useState<string>("cash");
    const [discountValue, setDiscountValue] = useState<string>("0");
    const [discountType, setDiscountType] = useState<string>("flat");
    const [showQR, setShowQR] = useState<boolean>(false);
    const upiId = process.env.NEXT_PUBLIC_UPI_ID || "default-upi-id";

    if (!isVisible) {
        return null;
    }

    const calculatedAmount = () => {
        if (!discountValue || parseFloat(discountValue) <= 0) return totalAmount;
        
        if (discountType === "flat") {
            return Math.max(0, totalAmount - parseFloat(discountValue));
        } else {
            // Percentage discount
            const discount = (parseFloat(discountValue) / 100) * totalAmount;
            return Math.max(0, totalAmount - discount);
        }
    };

    const finalAmount = calculatedAmount();
    const discountAmount = totalAmount - finalAmount;
    
    const handleCompletePayment = () => {
        const discountValueNum = parseFloat(discountValue);
        if (discountValueNum > 0) {
            completeOrder(
                tableNumber, 
                orderId, 
                paymentMethod, 
                { 
                    value: discountValueNum, 
                    type: discountType 
                }
            );
        } else {
            completeOrder(tableNumber, orderId, paymentMethod);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
            <div className="bg-white p-6 w-[90%] max-w-lg rounded-xl shadow-2xl text-center animate-fadeIn">
                <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="font-bold text-xl text-gray-800">
                        Complete Payment
                    </h2>
                    <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
                    >
                        <IoClose size={24} />
                    </button>
                </div>

                <div className="py-4 flex flex-col items-center border-b">
                    <div className="text-gray-500 text-sm">Order ID: #{orderId}</div>
                    <div className="text-gray-600 mt-1">
                        {tableNumber === 0 ? "Parcel Order" : `Table #${tableNumber}`}
                    </div>
                </div>

                <div className="mt-6 text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <FaPercent size={14} className="text-primary" />
                        Apply Discount
                    </label>
                    <div className="flex items-center gap-2">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                {discountType === "flat" ? <FaRupeeSign size={14} /> : <FaPercent size={14} />}
                            </div>
                            <input
                                type="number"
                                placeholder={discountType === "flat" ? "Enter amount" : "Enter percentage"}
                                className="w-full py-3 pl-9 pr-4 rounded-lg border outline-none border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                value={discountValue}
                                onChange={(e) => setDiscountValue(e.target.value)}
                            />
                        </div>
                        <select
                            className="py-3 px-4 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
                            onChange={(e) => setDiscountType(e.target.value)}
                            value={discountType}
                        >
                            <option value="flat">Flat ₹</option>
                            <option value="percent">Percent %</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 text-left">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FaCreditCard size={14} className="text-primary" />
                        Select Payment Method
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <label className={`flex items-center gap-2 border px-4 py-3 rounded-lg cursor-pointer transition-all ${
                            paymentMethod === "cash" 
                                ? "border-primary bg-primary/5 text-primary" 
                                : "hover:bg-gray-50 text-gray-700"
                        }`}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cash"
                                onChange={() => { setShowQR(false); setPaymentMethod("cash") }}
                                checked={paymentMethod === "cash"}
                                className="hidden"
                            />
                            <FaMoneyBillWave size={18} />
                            Cash Payment
                        </label>
                        <label className={`flex items-center gap-2 border px-4 py-3 rounded-lg cursor-pointer transition-all ${
                            paymentMethod === "upi" 
                                ? "border-primary bg-primary/5 text-primary" 
                                : "hover:bg-gray-50 text-gray-700"
                        }`}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="upi"
                                onChange={() => { setShowQR(true); setPaymentMethod("upi") }}
                                checked={paymentMethod === "upi"}
                                className="hidden"
                            />
                            <FaCashRegister size={18} />
                            UPI Payment
                        </label>
                    </div>
                </div>

                {showQR && (
                    <div className="mt-6 flex justify-center">
                        <div className="flex flex-col items-center p-4 border rounded-lg shadow-md bg-white">
                            <div className="mb-2 text-sm text-gray-500">Scan to pay</div>
                            <div className="p-2 bg-white rounded-lg border">
                                <QRCode 
                                    value={`upi://pay?pa=${upiId}&pn=RMS&am=${finalAmount.toFixed(2)}&cu=INR`} 
                                    size={180} 
                                />
                            </div>
                            <div className="mt-2 text-xs text-gray-500">UPI ID: {upiId}</div>
                        </div>
                    </div>
                )}

                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div className="text-left text-gray-600">Original Amount:</div>
                        <div className="text-right">₹{totalAmount.toFixed(2)}</div>
                        
                        {discountAmount > 0 && (
                            <>
                                <div className="text-left text-gray-600">Discount ({discountType === "percent" ? `${discountValue}%` : "Flat"}):</div>
                                <div className="text-right text-green-600">-₹{discountAmount.toFixed(2)}</div>
                            </>
                        )}
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
                        <span>Total:</span>
                        <span className="text-primary">₹{finalAmount.toFixed(2)}</span>
                    </div>
                </div>

                <button
                    onClick={handleCompletePayment}
                    className="mt-6 w-full bg-gradient-to-r from-primary to-primaryhover text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all font-medium"
                >
                    Complete Payment
                </button>
            </div>
        </div>
    );
};

export default CompleteOrderModal;
