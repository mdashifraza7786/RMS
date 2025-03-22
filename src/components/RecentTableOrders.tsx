import { useState, useEffect } from "react";
import { Bars } from 'react-loader-spinner';
import Link from 'next/link';

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
    waiter_name: string;
    chef_name: string;
    order_items: OrderItem[];
    start_time: string;
    end_time: string;
    status: string;
}

export default function OrdersComponent() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

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

    // Filter only completed orders
    const completedOrders = orders.filter(order => order.status === "completed");

    return (
        <div className="bg-white rounded-lg p-[4vh] w-full flex flex-col gap-10">
            <div className='flex justify-between'>
                <div className='font-extrabold text-[15px]'>Recent Table Orders</div>
                <Link href={"/orders"} className='text-[15px] font-extrabold'>
                    <p>View More</p>
                </Link>
            </div>

            {loading ? (
                <div className='relative w-full h-40 flex justify-center items-center'>
                    <Bars height="80" width="80" color="#25476A" ariaLabel="bars-loading" visible={true} />
                </div>
            ) : completedOrders.length === 0 ? (
                <p className="text-center text-gray-500">No completed orders found.</p>
            ) : (
                <div className="space-y-4">
                    {completedOrders.map((order) => (
                        <div key={order.id} className="flex justify-between items-center bg-white rounded-xl shadow-md p-4 border-l-4 border-bgred">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                                <p className="text-gray-500 text-[13px]">Table: <span className="font-semibold">{order.table_id}</span></p>
                                <p className="text-gray-500 text-[13px]">Waiter: <span className="font-semibold">{order.waiter_name}</span></p>
                                <p className="text-gray-500 text-[13px]">Chef: <span className="font-semibold">{order.chef_name}</span></p>
                            </div>

                            <div className="flex flex-col items-center space-y-4">
                                <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-600">
                                    {order.status}
                                </span>
                                <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="px-4 py-2 w-full text-[12px] font-semibold bg-supporting2 text-white hover:bg-[#8bbf3b] rounded-lg transition"
                                >
                                    Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedOrder && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-2xl p-6 shadow-lg max-w-md w-full">
                        {/* Header */}
                        <div className="flex justify-between items-center border-b pb-3">
                            <h3 className="text-xl font-bold text-primary">Order Details <span className="text-primary">#{selectedOrder.id}</span></h3>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-500 hover:text-red-500 transition font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Order Info */}
                        <div className="mt-4 space-y-2 text-gray-700 text-sm">
                            <p><span className="font-bold">Table:</span><span className="text-secondary font-semibold"> {selectedOrder.table_id}</span></p>
                            <p><span className="font-bold">Waiter:</span> <span className="text-secondary font-semibold">{selectedOrder.waiter_id}</span></p>
                            <p><span className="font-bold">Chef:</span><span className="text-secondary font-semibold"> {selectedOrder.chef_id}</span></p>
                        </div>

                        {/* Order Items */}
                        <div className="mt-5">
                            <h4 className="text-sm font-bold text-gray-700 mb-2">Items:</h4>
                            <ul className="space-y-2 bg-gray-100 p-3 rounded-lg">
                                {selectedOrder.order_items.map((item) => (
                                    <li key={item.item_id} className="flex justify-between text-gray-700">
                                        <span>{item.item_name} (x{item.quantity})</span>
                                        <span className="font-medium">₹{item.price}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Time Info */}
                        <div className="mt-4 text-sm text-gray-600 space-y-1">
                            <p><span className="font-bold">Order Start:</span> {new Date(selectedOrder.start_time).toLocaleString()}</p>
                            <p><span className="font-bold">Order End:</span> {new Date(selectedOrder.end_time).toLocaleString()}</p>
                        </div>

                    </div>
                </div>

            )}
        </div>
    );
}
