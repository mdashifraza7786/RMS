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
    order_items: OrderItem[];
    start_time: string;
    end_time: string;
    status: string;
}

export default function OrdersComponent() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    async function getRecentOrders() {
        try {
            const response = await fetch("/api/order");
            const data = await response.json();

            if (data?.tableOrders) {
                const formattedData: Order[] = data.tableOrders.map((order: any) => ({
                    ...order,
                    order_items: safeParse(order.order_items),
                }));

                setOrders(formattedData);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
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
                <Link href={""} className='text-[15px] font-extrabold'>
                    <p>View More</p>
                </Link>
            </div>

            {orders.length === 0 ? (
                <div className='absolute w-[88%] min-h-full z-50 flex justify-center items-center'>
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
                                <p className="text-gray-500 text-[13px]">Table: {order.table_id}</p>
                                <p className="text-gray-500 text-[13px]">Waiter: {order.waiter_id}</p>
                                <p className="text-gray-500 text-[13px]">Chef: {order.chef_id}</p>
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
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 shadow max-w-lg w-full">
                        <h3 className="text-xl font-semibold text-gray-900">Order Details (#{selectedOrder.id})</h3>
                        <p className="text-gray-600 text-sm">Table: {selectedOrder.table_id}</p>
                        <p className="text-gray-600 text-sm">Waiter: {selectedOrder.waiter_id}</p>
                        <p className="text-gray-600 text-sm">Chef: {selectedOrder.chef_id}</p>

                        <div className="mt-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Items:</h4>
                            <ul className="space-y-1">
                                {selectedOrder.order_items.map((item) => (
                                    <li key={item.item_id} className="text-gray-700">
                                        • {item.item_name} (x{item.quantity}) - ₹{item.price}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-4 text-sm text-gray-600">
                            <p>Start: <span className="font-medium">{selectedOrder.start_time}</span></p>
                            <p>End: <span className="font-medium">{selectedOrder.end_time}</span></p>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
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
