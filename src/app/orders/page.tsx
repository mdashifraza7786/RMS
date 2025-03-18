"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bars } from "react-loader-spinner";
import { FaPenSquare } from "react-icons/fa";

interface Order {
    id: string;
    table_id: string;
    waiter_id: string;
    chef_id: string;
    waiter_name: string;
    chef_name: string;
    order_items: { item_id: string; item_name: string; price: number; quantity: number }[];
    start_time: string;
    end_time: string;
    status: string;
}

interface Invoice {
    id: string;
    orderid: string;
    table_id: string;
    subtotal: number;
    gst: number;
    total_amount: number;
    discount: number;
    payment_method: string;
    payment_status: string;
    generated_at: string;
}

const Page: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [selectedRole, setSelectedRole] = useState("orders");
    const [detailsPopup, setDetailsPopup] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        document.title = "Orders";
        fetchOrdersData();
        fetchInvoicesData();
    }, []);

    const fetchOrdersData = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/order");
            const data = await response.json();

            if (data?.tableOrders) {
                const formattedData: Order[] = data.tableOrders.map((order: any) => ({
                    ...order,
                    order_items: safeParse(order.order_items),
                }));

                setAllOrders(formattedData);
                console.log("Orders:", formattedData);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
        finally {
            setLoading(false);
        }
    };

    function safeParse(jsonString: string) {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.error("Failed to parse order_items:", jsonString, error);
            return [];
        }
    }


    const fetchInvoicesData = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/order/orderInvoice");
            setInvoices(response.data?.invoice || []);
        } catch (error) {
            console.error("Error fetching invoices:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDetailsClick = (order: Order) => {
        try {
            setSelectedOrder(order);
            setDetailsPopup(true);
        }
        catch (error) {
            console.error("Error fetching order details:", error);
            setDetailsPopup(false);
            setSelectedOrder(null);
        }
    }

    const filteredOrders = allOrders.filter((order) =>
        order.id.toString().includes(searchTerm) ||
        order.table_id.toString().includes(searchTerm) ||
        order.waiter_name.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.chef_name.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.order_items.some((item) => item.item_name.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const filteredInvoices = invoices.filter((invoice) =>
        invoice.orderid.toString().includes(searchTerm) ||
        invoice.table_id.toString().includes(searchTerm) ||
        invoice.payment_method.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.payment_status.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.generated_at.toString().includes(searchTerm) ||
        invoice.total_amount.toString().toString().includes(searchTerm) ||
        invoice.subtotal.toString().toString().includes(searchTerm)
    );


    return (
        <div className="bg-[#e6e6e6] py-8 px-16 font-raleway flex flex-col gap-6 relative">
            <h1 className="font-bold">Orders and Payments</h1>
            <section className="bg-white rounded-xl p-6 font-semibold flex flex-col gap-3 relative">
                <section className="flex justify-between items-center py-4">
                    <input
                        type="search"
                        placeholder="Search Name, ID..."
                        className="border border-gray-500 rounded-xl px-4 py-1"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </section>

                {/* Tabs for Orders & Payments */}
                <section className="flex gap-4">
                    {["orders", "payments"].map((role) => (
                        <div
                            key={role}
                            className={`px-4 py-2 rounded-xl cursor-pointer ${selectedRole === role ? "font-bold bg-[#FA9F1B70] text-[#fc9802e3]" : ""
                                }`}
                            onClick={() => setSelectedRole(role)}
                        >
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                        </div>
                    ))}
                </section>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-4">
                        <Bars height="50" width="50" color="#25476A" ariaLabel="bars-loading" />
                    </div>
                ) : (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-primary text-white">
                                {selectedRole === "orders"
                                    ? ["Order ID", "Table ID", "Waiter", "Chef", "Total Price", "Start Time", "End Time", "Status", "Action"].map(
                                        (header) => (
                                            <th key={header} className="px-4 py-2 text-left font-medium w-[150px]">{header}</th>
                                        )
                                    )
                                    : ["Order ID", "Table ID", "Subtotal", "GST", "Discount", "Total Amount", "Payment Mode", "Payment Status", "Time"].map(
                                        (header) => (
                                            <th key={header} className="px-4 py-2 text-left font-medium w-[150px]">{header}</th>
                                        )
                                    )}
                            </tr>
                        </thead>
                        <tbody>
                            {selectedRole === "orders" && filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="text-[14px] text-[#2e2b2b] font-medium font-montserrat border-b">
                                        <td className="border px-4 py-3">{order.id}</td>
                                        <td className="border px-4 py-3">{order.table_id}</td>
                                        <td className="border px-4 py-3">{order.waiter_name}</td>
                                        <td className="border px-4 py-3">{order.chef_name}</td>
                                        <td className="border px-4 py-3">₹ {order.order_items.reduce((sum, item) => sum + item.price * item.quantity, 0)}</td>
                                        <td className="border px-4 py-3">{new Date(order.start_time).toLocaleString()}</td>
                                        <td className="border px-4 py-3">{order.end_time ? new Date(order.end_time).toLocaleString() : "Ongoing"}</td>
                                        <td className="border px-4 py-3">{order.status.toUpperCase()}</td>
                                        <td className="border px-4 py-3">
                                            <button className="bg-supporting2 hover:bg-[#badb69] font-bold text-white px-6 py-2 rounded text-[12px] flex items-center gap-4"
                                                onClick={() => handleDetailsClick(order)}>
                                                <div>Details</div>
                                                <FaPenSquare />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : selectedRole === "payments" && filteredInvoices.length > 0 ? (
                                filteredInvoices.map((invoice) => (
                                    <tr key={invoice.id} className="text-[14px] text-[#464646] font-medium font-montserrat border-b">
                                        <td className="border px-4 py-2">{invoice.orderid}</td>
                                        <td className="border px-4 py-2">{invoice.table_id}</td>
                                        <td className="border px-4 py-2">₹ {invoice.subtotal}</td>
                                        <td className="border px-4 py-2">₹ {invoice.gst}</td>
                                        <td className="border px-4 py-2">₹ {invoice.discount}</td>
                                        <td className="border px-4 py-2">₹ {invoice.total_amount}</td>
                                        <td className="border px-4 py-2">{invoice.payment_method}</td>
                                        <td className="border px-4 py-2">{invoice.payment_status || "Pending"}</td>
                                        <td className="border px-4 py-2">{new Date(invoice.generated_at).toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="text-center py-4">No data available</td>
                                </tr>
                            )}
                        </tbody>

                    </table>

                )}

                {detailsPopup && selectedOrder && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white shadow-xl rounded-2xl p-6 font-semibold flex flex-col gap-4 relative w-[400px] backdrop-blur-md">
                            {/* Close Button */}
                            <button
                                onClick={() => setDetailsPopup(false)}
                                className="absolute top-3 right-3 bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded-full text-sm transition"
                            >
                                ✕
                            </button>

                            {/* Order Details Title */}
                            <h1 className="font-extrabold text-xl text-gray-800 text-center">Order Details</h1>

                            {/* Items List */}
                            <h2 className="font-bold text-lg text-gray-700">Items</h2>
                            <ul className="border rounded-lg p-3 max-h-40 overflow-auto space-y-2 bg-gray-100">
                                {selectedOrder.order_items.map((item) => (
                                    <li
                                        key={item.item_id}
                                        className="flex justify-between items-center border-b last:border-none py-2 px-2 rounded-lg bg-white shadow-sm"
                                    >
                                        <span className="text-gray-700">{item.item_name} (x{item.quantity})</span>
                                        <span className="font-medium text-gray-900">₹{item.price * item.quantity}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Total Price */}
                            <p className="font-extrabold text-lg text-gray-900 text-center">
                                Total: ₹{selectedOrder.order_items.reduce((total, item) => total + item.price * item.quantity, 0)}
                            </p>
                        </div>
                    </div>
                )}

            </section>
        </div>
    );

};

export default Page;