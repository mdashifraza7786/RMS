import React, { useState, useEffect } from "react";
import { Bars } from "react-loader-spinner";
import Link from "next/link";

interface InvoiceItem {
    id: string;
    orderid: string;
    table_id: string;
    subtotal: number;
    gst: number;
    total_amount: number;
    payment_status: string;
    payment_method: string;
    discount: number;
    waiter_name: string;
    customer_name: string;
    customer_mobile: number;
    generated_at: string;
}

export default function PaymentsComponent() {
    const [invoice, setInvoice] = useState<InvoiceItem[]>([]);
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

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

    return (
        <div className="bg-white rounded-lg p-[4vh] w-full flex flex-col gap-10">
            <div className="flex justify-between">
                <div className="font-extrabold text-[15px]">Recent Payments</div>
                <Link href={"/orders"} className="text-[15px] font-extrabold">
                    <p>View More</p>
                </Link>
            </div>

            {loading ? (
                <div className="absolute w-[88%] min-h-full z-50 flex justify-center items-center">
                    <Bars height="80" width="80" color="#25476A" ariaLabel="bars-loading" visible={true} />
                </div>
            ) : invoice.length === 0 ? (
                <p className="text-center text-gray-500">No recent orders found.</p>
            ) : (
                <div className="space-y-4">
                    {invoice.slice(0, 5).map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between items-center bg-white rounded-xl shadow-md p-4 border-l-4 border-secondary"
                        >
                            <div className="flex flex-col gap-1 col-span-2 text-gray-500">
                                <h2 className="text-sm font-bold text-[#131212]">{item.customer_name ? item.customer_name : "Guest"}</h2>
                                <p className="text-xs">
                                    <span className="font-semibold">{item.customer_mobile ? item.customer_mobile : "-"}</span>
                                </p>
                                <p className="text-xs">
                                    Table: <span className="font-semibold">#{item.table_id}</span>
                                </p>
                                <p className="text-xs">
                                    Waiter: <span className="font-semibold">{item.waiter_name}</span>
                                </p>
                            </div>
                            <div className="flex flex-col gap-1 text-gray-500">
                                <h2 className="text-sm font-extrabold text-primary">₹ {item.total_amount}</h2>
                                <p className="text-xs">
                                    <span className="font-semibold">{new Date(item.generated_at).toLocaleDateString()}</span>
                                </p>
                                <p className="text-xs">
                                    <span className="font-semibold">{new Date(item.generated_at).toLocaleTimeString()}</span>
                                </p>
                                <button
                                    onClick={() => setSelectedInvoice(item)}
                                    className="bg-supporting2 rounded-md py-1 px-4 text-white text-xs font-semibold hover:bg-[#8bbf3b] transition-colors"
                                >
                                    Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedInvoice && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-lg w-full">

                        {/* Header */}
                        <div className="flex justify-between items-center border-b pb-3">
                            <h3 className="text-lg font-bold text-gray-800">
                                Payment Details <span className="text-primary">#{selectedInvoice.id}</span>
                            </h3>
                            <button
                                onClick={() => setSelectedInvoice(null)}
                                className="text-gray-500 hover:text-red-500 transition text-xl font-semibold"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Order Info */}
                        <div className="mt-5 space-y-3 text-gray-700 text-sm">
                            <div className="flex justify-between">
                                <span className="font-semibold">Payment Status:</span>
                                <span className="px-4 py-2 rounded-md text-white text-xs font-semibold bg-green-500">
                                    {selectedInvoice.payment_status.toUpperCase()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Amount:</span>
                                <span className="text-primary font-bold">₹{selectedInvoice.subtotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">GST:</span>
                                <span className="text-secondary font-bold">{selectedInvoice.gst}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Discount:</span>
                                <span className="text-green-500 font-bold">₹{selectedInvoice.discount}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t pt-3">
                                <span>Total:</span>
                                <span className="text-primary">₹{selectedInvoice.total_amount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Payment Method:</span>
                                <span className="text-secondary font-bold">{selectedInvoice.payment_method.toUpperCase()}</span>
                            </div>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
