"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bars } from "react-loader-spinner";
import { FaSearch, FaFileInvoiceDollar, FaUserSlash } from "react-icons/fa";
import { IoFastFoodOutline } from "react-icons/io5";
import { BsClock, BsClockHistory, BsCalendar3 } from "react-icons/bs";
import { FiCreditCard, FiDollarSign } from "react-icons/fi";
import { BiTable } from "react-icons/bi";
import { MdPerson } from "react-icons/md";

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
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

 

    const fetchOrdersData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/order');
            
            if (response.data?.tableOrders) {
                const formattedData: Order[] = response.data.tableOrders.map((order: any) => ({
                    ...order,
                    order_items: typeof order.order_items === 'string' ? 
                        JSON.parse(order.order_items) : order.order_items,
                }));
                
                setAllOrders(formattedData);
            } else {
                console.error("Failed to fetch orders:", response.data);
                setAllOrders([]);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setAllOrders([]);
        }
        setLoading(false);
    };

    const fetchInvoicesData = async () => {
        try {
            const response = await axios.get('/api/order/orderInvoice');
            
            if (response.data?.invoice) {
                setInvoices(response.data.invoice);
            } else {
                console.error("Failed to fetch invoices:", response.data);
                setInvoices([]);
                if (!allOrders.length) {
                }
            }
        } catch (error) {
            console.error("Error fetching invoices:", error);
            setInvoices([]);
            if (!allOrders.length) {
            }
        }
    };
   
    useEffect(() => {
        document.title = "Orders";
        fetchOrdersData();
        fetchInvoicesData();
        
        const intervalId = setInterval(() => {
            fetchOrdersData();
            fetchInvoicesData();
        }, 60000);
        
        return () => clearInterval(intervalId);
    }, []);

    const handleDetailsClick = (order: Order) => {
        try {
            setSelectedOrder(order);
            
            const matchingInvoice = invoices.find(inv => inv.orderid === order.id);
            
            if (matchingInvoice) {
                setSelectedInvoice(matchingInvoice);
            } else {
                if (order.status.toLowerCase() === "completed") {
                    const orderTotal = order.order_items.reduce(
                        (sum, item) => sum + (item.price * item.quantity), 
                        0
                    );
                    
                    const gstAmount = parseFloat((orderTotal * 0.18).toFixed(2));
                    
                    const placeholderInvoice: Invoice = {
                        id: "pending-" + order.id,
                        orderid: order.id,
                        table_id: order.table_id,
                        subtotal: orderTotal,
                        gst: gstAmount,
                        total_amount: orderTotal + gstAmount,
                        discount: 0,
                        payment_method: "pending",
                        payment_status: "pending",
                        generated_at: order.end_time || order.start_time
                    };
                    
                    setSelectedInvoice(placeholderInvoice);
                } else {
                    setSelectedInvoice(null);
                }
            }
            
            setDetailsPopup(true);
        } catch (error) {
            console.error("Error handling order details:", error);
            setDetailsPopup(false);
            setSelectedOrder(null);
            setSelectedInvoice(null);
        }
    };

    const handlePrintInvoice = () => {
        if (!selectedOrder || !selectedInvoice) return;
        
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Please allow popups for this site to print invoices.');
            return;
        }
        
        const currentDate = new Date().toLocaleString();
        
        const billContent = `
            <html>
            <head>
                <title>Restaurant Bill</title>
                <style>
                    body { font-family: 'Segoe UI', Roboto, sans-serif; text-align: center; padding: 20px; }
                    .bill-container { width: 300px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px; text-align: left; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                    h2 { text-align: center; margin-bottom: 5px; color: #333; }
                    hr { border: 1px dashed #ccc; margin: 15px 0; }
                    .details, .footer { text-align: left; font-size: 14px; line-height: 1.4; }
                    table { width: 100%; border-collapse: collapse; margin-top: 10px; text-align: left; }
                    td, th { padding: 8px; font-size: 14px; }
                    th { color: #666; font-weight: 600; }
                    .total { font-weight: 600; font-size: 16px; }
                    .footer { text-align: center; margin-top: 20px; color: #666; }
                    .grand-total { font-size: 18px; font-weight: 700; color: #333; }
                    .payment-method { background: #f8f9fa; padding: 8px; border-radius: 5px; text-align: center; margin: 10px 0; }
                </style>
            </head>
            <body onload="window.print(); window.onafterprint = window.close;">
                <div class="bill-container">
                    <h2>BUSINESS NAME</h2>
                    <p style="text-align:center; color: #666;">123 Main Street, Suite 567<br>City Name, State 54321<br>📞 123-456-7890</p>
                    <hr>
                    <div class="details">
                        <p><strong>Table Number:</strong> ${selectedOrder.table_id}</p>
                        <p><strong>Date & Time:</strong> ${currentDate}</p>
                        <p><strong>Order ID: </strong>${selectedOrder.id}</p>
                    </div>
                    <hr>
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${selectedOrder.order_items.map(item => `
                                <tr>
                                    <td>${item.item_name}</td>
                                    <td>${item.quantity}</td>
                                    <td>₹${(item.quantity * item.price).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <hr>
                    <p class="total">Subtotal: ₹${selectedInvoice.subtotal.toFixed(2)}</p>
                    ${selectedInvoice.discount > 0 ? 
                        `<p class="total">Discount: ₹${selectedInvoice.discount.toFixed(2)}</p>` 
                        : ''}
                    <p class="total">GST (18%): ₹${selectedInvoice.gst.toFixed(2)}</p>
                    <p class="grand-total">TOTAL: ₹${selectedInvoice.total_amount.toFixed(2)}</p>
                    <div class="payment-method">Paid By: ${selectedInvoice.payment_method?.toUpperCase() || 'CASH'}</div>
                    <hr>
                    <p class="footer">THANK YOU FOR YOUR PURCHASE!</p>
                </div>
            </body>
            </html>
        `;

        printWindow.document.open();
        printWindow.document.write(billContent);
        printWindow.document.close();
    };

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

    const formatCurrency = (amount: number | null | undefined) => {
        if (amount === null || amount === undefined) return '₹ 0.00';
        
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount).replace('₹', '₹ ');
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'ongoing':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="container mx-auto px-4 py-6 md:px-6 lg:max-w-[90%] xl:max-w-7xl 2xl:max-w-[1400px] font-sans">
            <div className="flex items-center mb-6">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                    <FaFileInvoiceDollar className="text-primary" size={20} />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="search"
                                placeholder="Search by order ID, table, staff..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary w-full md:w-80"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Bars height="50" width="50" color="primary" ariaLabel="bars-loading" />
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {[
                                        { id: "orderId", label: "Order ID" },
                                        { id: "tableId", label: "Table" },
                                        { id: "waiter", label: "Waiter" },
                                        { id: "chef", label: "Chef" },
                                        { id: "totalPrice", label: "Total" },
                                        { id: "startTime", label: "Start Time" },
                                        { id: "endTime", label: "End Time" },
                                        { id: "status", label: "Status" },
                                        { id: "action", label: "Action" }
                                    ].map((header) => (
                                        <th 
                                            key={header.id}
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            {header.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                #{order.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <BiTable className="mr-1 text-gray-400" />
                                                    {order.table_id}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <MdPerson className="mr-1 text-gray-400" />
                                                    {order.waiter_name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order.chef_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatCurrency(order.order_items.reduce((sum, item) => sum + item.price * item.quantity, 0))}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <BsClock className="mr-1 text-gray-400" />
                                                    {new Date(order.start_time).toLocaleString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order.end_time ? (
                                                    <div className="flex items-center">
                                                        <BsClockHistory className="mr-1 text-gray-400" />
                                                        {new Date(order.end_time).toLocaleString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        Ongoing
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button 
                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition"
                                                    onClick={() => handleDetailsClick(order)}
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={9} className="py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <FaUserSlash className="text-primary text-2xl" />
                                                <p className="text-lg font-medium">No orders available</p>
                                                <p className="mt-1 text-sm">Try adjusting your search to find what {"you're"} looking for.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {detailsPopup && selectedOrder && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-auto animate-scaleIn">
                        <div className="bg-primary text-white p-5 rounded-t-xl sticky top-0 z-10">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <IoFastFoodOutline />
                                    Order #{selectedOrder.id}
                                </h3>
                                <button
                                    onClick={() => setDetailsPopup(false)}
                                    className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="text-sm text-white/80 flex items-center">
                                <BiTable className="mr-1" /> Table {selectedOrder.table_id}
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Waiter</p>
                                    <p className="font-medium text-gray-900">{selectedOrder.waiter_name}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Chef</p>
                                    <p className="font-medium text-gray-900">{selectedOrder.chef_name}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Start Time</p>
                                    <p className="font-medium text-gray-900">
                                        {new Date(selectedOrder.start_time).toLocaleString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Status</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                                        {selectedOrder.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <h2 className="font-semibold text-gray-800 mb-3">Order Items</h2>
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <ul className="divide-y divide-gray-200">
                                    {selectedOrder.order_items.map((item) => (
                                        <li key={item.item_id} className="py-3 flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className="ml-1">
                                                    <p className="text-sm font-medium text-gray-900">{item.item_name}</p>
                                                    <p className="text-sm text-gray-500">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                                                </div>
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatCurrency(item.price * item.quantity)}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-primary/5 rounded-lg p-4 mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-900">
                                        {formatCurrency(selectedOrder.order_items.reduce((total, item) => total + item.price * item.quantity, 0))}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">GST (18%)</span>
                                    <span className="font-medium text-gray-900">
                                        {selectedInvoice 
                                            ? formatCurrency(selectedInvoice.gst)
                                            : formatCurrency(selectedOrder.order_items.reduce((total, item) => total + item.price * item.quantity, 0) * 0.18)}
                                    </span>
                                </div>
                                
                                {selectedInvoice && selectedInvoice.discount > 0 && (
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600">Discount</span>
                                        <span className="font-medium text-green-600">
                                            -{formatCurrency(selectedInvoice.discount)}
                                        </span>
                                    </div>
                                )}
                                
                                <div className="border-t border-gray-200 my-2 pt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-900">Total</span>
                                        <span className="text-xl font-bold text-primary">
                                            {selectedInvoice 
                                                ? formatCurrency(selectedInvoice.total_amount)
                                                : formatCurrency(
                                                    selectedOrder.order_items.reduce((total, item) => total + item.price * item.quantity, 0) * 1.18
                                                  )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-2 justify-end">
                                <button
                                    onClick={() => setDetailsPopup(false)}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg"
                                >
                                    Close
                                </button>
                                
                                {selectedOrder.status.toLowerCase() === "completed" && (
                                    <button
                                        onClick={handlePrintInvoice}
                                        className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg flex items-center justify-center"
                                    >
                                        <FaFileInvoiceDollar className="mr-2" />
                                        Print Invoice
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default Page;