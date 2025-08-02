import { useState, useEffect } from "react";
import { Bars } from 'react-loader-spinner';
import Link from 'next/link';
import { MdHistory, MdTableBar, MdPerson, MdOutlineRestaurantMenu, MdAccessTime, MdOutlineInfo, MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

interface OrderItem {
    item_id: string;
    item_name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    table_id: string;
    waiter_id: string;
    chef_id: string;
    waiter_name: string | null;
    chef_name: string | null;
    order_items: OrderItem[];
    start_time: string;
    end_time: string;
    status: string;
    invoice_subtotal?: string;
    invoice_gst?: string;
    invoice_total_amount?: string;
    invoice_payment_status?: string;
}

export default function OrdersComponent() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(3);

    async function getRecentOrders() {
        setLoading(true);
        try {
            const response = await fetch("/api/order");
            const data = await response.json();

            if (data?.tableOrders) {
                const formattedData: Order[] = data.tableOrders.map((order: any) => ({
                    ...order,
                    order_items: safeParse(order.order_items),
                }));

                setOrders(formattedData);
                console.log("Orders:", formattedData);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    }

    function safeParse(jsonString: string) {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.error("Failed to parse order_items:", jsonString, error);
            return [];
        }
    }

    useEffect(() => {
        getRecentOrders();
    }, []);
    
    // Reset to first page when orders change
    useEffect(() => {
        setCurrentPage(1);
    }, [orders]);

    // Calculate total for an order
    const calculateTotal = (items: OrderItem[]) => {
        return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    };

    // Filter only completed orders
    const completedOrders = orders.filter(order => order.status === "completed");

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <MdHistory className="text-green-500" />
                    Recent Table Orders
                </h2>
                <Link
                    href="/orders"
                    className="text-sm text-primary hover:text-primary/80 font-medium flex items-center"
                >
                    View All
                </Link>
            </div>

            {loading ? (
                <div className='flex-grow flex justify-center items-center'>
                    <span className="text-primary">
                        <Bars height="40" width="40" color="currentColor" ariaLabel="bars-loading" visible={true} />
                    </span>
                </div>
            ) : completedOrders.length === 0 ? (
                <div className="flex-grow flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <p className="text-gray-500 text-sm">No completed orders found</p>
                </div>
            ) : (
                <div className="space-y-3 flex-grow overflow-auto pr-1">
                    {completedOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((order) => (
                        <div key={order.id} className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                                        <MdTableBar size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">Order #{order.id}</h3>
                                        <p className="text-xs text-gray-500">Table {order.table_id}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-1">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-50 text-green-600">
                                            {order.status}
                                        </span>
                                        {order.invoice_payment_status && (
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-600 capitalize">
                                                {order.invoice_payment_status}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500 mt-1">
                                        {formatDate(order.end_time)}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center px-4 py-2 text-xs">
                                <div className="flex items-center gap-1">
                                    <MdPerson className="text-gray-400" />
                                    <span className="text-gray-500">Waiter: </span>
                                    <span className="text-gray-700 font-medium">{order.waiter_name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MdOutlineRestaurantMenu className="text-gray-400" />
                                    <span className="text-gray-500">Chef: </span>
                                    <span className="text-gray-700 font-medium">{order.chef_name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MdOutlineInfo className="text-gray-400" />
                                    <span className="text-gray-500">Items: </span>
                                    <span className="text-gray-700 font-medium">{order.order_items.length}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MdAccessTime className="text-gray-400" />
                                    <span className="text-gray-500">Duration: </span>
                                    <span className="text-gray-700 font-medium">
                                        {Math.floor((new Date(order.end_time).getTime() - new Date(order.start_time).getTime()) / 60000)} min
                                    </span>
                                </div>
                            </div>
                            
                            <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center">
                                <div className="text-sm">
                                    <span className="text-gray-500">Total: </span>
                                    <span className="font-medium text-gray-900">
                                        ₹{order.invoice_total_amount || calculateTotal(order.order_items).toFixed(2)}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
                {completedOrders.length > 0 && (
                    <div className="flex justify-center items-center mt-4 pt-3 border-t border-gray-100">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <MdKeyboardArrowLeft size={20} />
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {currentPage} of {Math.ceil(completedOrders.length / itemsPerPage)}
                        </span>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(completedOrders.length / itemsPerPage)))}
                            disabled={currentPage >= Math.ceil(completedOrders.length / itemsPerPage)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ml-2 ${currentPage >= Math.ceil(completedOrders.length / itemsPerPage) ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <MdKeyboardArrowRight size={20} />
                        </button>
                    </div>
                )}

            {selectedOrder && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
                    <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center border-b pb-3">
                            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                <MdTableBar className="text-primary" size={22} />
                                Order #{selectedOrder.id}
                            </h3>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                            <div className="flex flex-col gap-1">
                                <p className="text-gray-500">Table</p>
                                <p className="font-medium text-gray-900">{selectedOrder.table_id}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-gray-500">Status</p>
                                <p className="font-medium">
                                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-50 text-green-600">
                                        {selectedOrder.status}
                                    </span>
                                </p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-gray-500">Waiter</p>
                                <p className="font-medium text-gray-900">{selectedOrder.waiter_name || 'Not assigned'}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-gray-500">Chef</p>
                                <p className="font-medium text-gray-900">{selectedOrder.chef_name || 'Not assigned'}</p>
                            </div>
                        </div>

                        <div className="mt-5 flex-grow overflow-hidden flex flex-col">
                            <h4 className="font-medium text-gray-800 mb-2">Ordered Items</h4>
                            <div className="overflow-y-auto flex-grow pr-1">
                                <ul className="space-y-2">
                                    {selectedOrder.order_items.map((item) => (
                                        <li key={item.item_id} className="flex justify-between items-center bg-gray-50 rounded-lg py-2 px-3 text-sm text-gray-700">
                                            <div>
                                                <span className="font-medium">{item.item_name}</span>
                                                <div className="text-xs text-gray-500">₹{item.price} per item</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium">{item.quantity}x</span>
                                                <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100">
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                                <div>
                                    <p>Start Time:</p>
                                    <p className="text-gray-700">{new Date(selectedOrder.start_time).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p>End Time:</p>
                                    <p className="text-gray-700">{new Date(selectedOrder.end_time).toLocaleString()}</p>
                                </div>
                            </div>
                            
                            {/* Invoice Information */}
                            {selectedOrder.invoice_subtotal && (
                                <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
                                    <h4 className="font-medium text-gray-800 mb-2">Invoice Details</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Subtotal:</span>
                                            <span>₹{selectedOrder.invoice_subtotal}</span>
                                        </div>
                                        {selectedOrder.invoice_gst && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">GST:</span>
                                                <span>₹{selectedOrder.invoice_gst}</span>
                                            </div>
                                        )}
                                        {selectedOrder.invoice_payment_status && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Payment Status:</span>
                                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-50 text-green-600 capitalize">
                                                    {selectedOrder.invoice_payment_status}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex justify-between items-center font-medium text-base mt-3">
                                <span>Total Amount:</span>
                                <span className="text-primary">
                                    {selectedOrder.invoice_total_amount ? 
                                        `₹${selectedOrder.invoice_total_amount}` : 
                                        `₹${calculateTotal(selectedOrder.order_items).toFixed(2)}`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
