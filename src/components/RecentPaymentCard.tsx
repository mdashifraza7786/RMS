import React, { useState, useEffect } from "react";
import { Bars } from "react-loader-spinner";
import Link from "next/link";
import { MdPayment, MdPerson, MdTableBar, MdOutlineLocalAtm, MdAttachMoney, MdPhone, MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { FaRegCreditCard } from "react-icons/fa";

interface InvoiceItem {
    id: string;
    orderid: string;
    table_id: string;
    subtotal: number | string;
    gst: number | string;
    total_amount: number | string;
    payment_status: string;
    payment_method: string;
    discount: number | string;
    waiter_name: string;
    customer_name: string;
    customer_mobile: number | string;
    generated_at: string;
}

export default function PaymentsComponent() {
    const [invoice, setInvoice] = useState<InvoiceItem[]>([]);
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(3);

    async function getRecentPayments() {
        try {
            const response = await fetch("/api/order/recentPayments");
            const data = await response.json();
            setInvoice(data.payments);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getRecentPayments();
    }, []);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [invoice]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (value: number | string): string => {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        return isNaN(numValue) ? '0.00' : numValue.toFixed(2);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col w-[50%]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <MdPayment className="text-primary" />
                    Recent Payments
                </h2>
                <Link 
                    href="/orders" 
                    className="text-sm text-primary hover:text-primary/80 font-medium flex items-center"
                >
                    View All
                </Link>
            </div>

            {loading ? (
                <div className="flex-grow flex justify-center items-center">
                    <span className="text-primary">
                        <Bars height="40" width="40" color="currentColor" ariaLabel="bars-loading" visible={true} />
                    </span>
                </div>
            ) : invoice.length === 0 ? (
                <div className="flex-grow flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <p className="text-gray-500 text-sm">No recent payments found</p>
                </div>
            ) : (
                <div className="space-y-3 flex-grow overflow-auto pr-1">
                    {invoice.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                        <div
                            key={item.id}
                            className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                        <MdPerson size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">
                                            {item.customer_name ? item.customer_name : "Guest"}
                                        </h3>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <MdPhone size={12} />
                                            {item.customer_mobile ? item.customer_mobile : "No phone"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-medium text-primary">
                                        ₹{item.total_amount}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {formatDate(item.generated_at)}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center px-4 py-2 text-xs">
                                <div className="flex items-center gap-1">
                                    <MdTableBar className="text-gray-400" />
                                    <span className="text-gray-500">Table: </span>
                                    <span className="text-gray-700 font-medium">#{item.table_id}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FaRegCreditCard className="text-gray-400" />
                                    <span className="text-gray-500">Method: </span>
                                    <span className="text-gray-700 font-medium capitalize">{item.payment_method}</span>
                                </div>
                            </div>
                            
                            <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center">
                                <div className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full font-medium">
                                    {item.payment_status}
                                </div>
                                <button
                                    onClick={() => setSelectedInvoice(item)}
                                    className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
                {invoice.length > 0 && (
                    <div className="flex justify-center items-center mt-4 pt-3 border-t border-gray-100">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <MdKeyboardArrowLeft size={20} />
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {currentPage} of {Math.ceil(invoice.length / itemsPerPage)}
                        </span>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(invoice.length / itemsPerPage)))}
                            disabled={currentPage >= Math.ceil(invoice.length / itemsPerPage)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ml-2 ${currentPage >= Math.ceil(invoice.length / itemsPerPage) ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <MdKeyboardArrowRight size={20} />
                        </button>
                    </div>
                )}

            {selectedInvoice && (
                <div 
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setSelectedInvoice(null);
                        }
                    }}
                >
                    <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
                        <div className="flex justify-between items-center border-b pb-3 sticky top-0 bg-white z-10">
                            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                <MdOutlineLocalAtm className="text-primary" size={22} />
                                Invoice #{selectedInvoice.id}
                            </h3>
                            <button
                                onClick={() => setSelectedInvoice(null)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mt-4 px-4 py-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                    <MdPerson size={18} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-800">
                                        {selectedInvoice.customer_name ? selectedInvoice.customer_name : "Guest"}
                                    </h4>
                                    <p className="text-xs text-gray-500">
                                        {selectedInvoice.customer_mobile ? selectedInvoice.customer_mobile : "No phone"}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                                <div className="flex items-center gap-1">
                                    <MdTableBar className="text-gray-400" />
                                    <span className="text-gray-500">Table: </span>
                                    <span className="text-gray-700 font-medium">#{selectedInvoice.table_id}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MdPerson className="text-gray-400" />
                                    <span className="text-gray-500">Waiter: </span>
                                    <span className="text-gray-700 font-medium">{selectedInvoice.waiter_name}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 space-y-3">
                            <div className="flex justify-between items-center px-1">
                                <span className="text-gray-500 text-sm">Payment Status</span>
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">
                                    {selectedInvoice.payment_status.toUpperCase()}
                                </span>
                            </div>
                            
                            <div className="flex justify-between items-center px-1">
                                <span className="text-gray-500 text-sm">Payment Method</span>
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                                    {selectedInvoice.payment_method}
                                </span>
                            </div>
                            
                            <div className="border-t border-dashed border-gray-200 my-3"></div>
                            
                            <div className="flex justify-between items-center px-1 text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">₹{formatCurrency(selectedInvoice.subtotal)}</span>
                            </div>
                            
                            <div className="flex justify-between items-center px-1 text-sm">
                                <span className="text-gray-600">GST ({typeof selectedInvoice.gst === 'string' ? selectedInvoice.gst : selectedInvoice.gst.toFixed(0)}%)</span>
                                <span className="font-medium">₹{formatCurrency((parseFloat(formatCurrency(selectedInvoice.subtotal)) * parseFloat(selectedInvoice.gst.toString()) / 100))}</span>
                            </div>
                            
                            {parseFloat(selectedInvoice.discount.toString()) > 0 && (
                                <div className="flex justify-between items-center px-1 text-sm">
                                    <span className="text-gray-600">Discount</span>
                                    <span className="font-medium text-green-600">-₹{formatCurrency(selectedInvoice.discount)}</span>
                                </div>
                            )}
                            
                            <div className="border-t border-gray-200 pt-3 mt-3">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-gray-900 font-medium">Total Amount</span>
                                    <span className="text-lg font-semibold text-primary">₹{formatCurrency(selectedInvoice.total_amount)}</span>
                                </div>
                            </div>
                            
                            <div className="text-center text-xs text-gray-500 mt-4 pb-2">
                                Generated on {new Date(selectedInvoice.generated_at).toLocaleString()}
                            </div>
                        </div>
                        
                        <div className="mt-6 flex justify-end border-t pt-4">
                            <button
                                onClick={() => setSelectedInvoice(null)}
                                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
