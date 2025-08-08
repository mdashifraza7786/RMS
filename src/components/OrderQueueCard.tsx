import React, { useState } from 'react';
import { OrderedItems } from './Dashboard';
import { IoClose } from 'react-icons/io5';
import { MdTableBar, MdPerson, MdOutlinePayments } from 'react-icons/md';
import { BiTimer } from 'react-icons/bi';

interface OrderQueueCardProps {
    table: string;
    waiter: string;
    amount: string;
    orid: string;
    orderedItems: OrderedItems[];
    start_time: string;
}

const OrderQueueCard: React.FC<OrderQueueCardProps> = ({ table, waiter, amount, orid, orderedItems, start_time }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const subtotal = orderedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const gst = subtotal * 0.18;
    const totalAmount = subtotal + gst;
    
    return (
        <>
            <div className="min-w-[260px] max-w-[280px] bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-all duration-200">
                <div className="relative">
                    <div className="absolute right-2 top-2 flex items-center justify-center w-2 h-2">
                        <span className="animate-ping absolute w-full h-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative rounded-full w-2 h-2 bg-red-500"></span>
                    </div>
                </div>
                
                <div className="p-4">
                    <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                            <MdTableBar size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">Table #{table}</h3>
                            <p className="text-xs text-gray-500">Order #{orid}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                        <MdPerson className="mr-2 text-gray-400" />
                        <span>{waiter}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                        <BiTimer className="mr-2 text-gray-400" />
                        <span>{start_time}</span>
                    </div>
                    
                    <div className="flex items-center text-sm font-medium text-gray-900 mb-4">
                        <MdOutlinePayments className="mr-2 text-gray-600" />
                        <span>₹{amount}</span>
                    </div>
                    
                    <div className="flex items-center justify-between border-t pt-3">
                        <div className="text-xs text-gray-500">
                            {orderedItems.length} item{orderedItems.length !== 1 ? 's' : ''}
                        </div>
                        <button
                            className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                            onClick={() => setIsModalOpen(true)}
                        >
                            View Details
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
               <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-xl w-[420px] shadow-xl relative p-6 transform scale-100 transition-all duration-300 max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center border-b pb-3">
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                <MdTableBar className="text-primary mr-2" size={22} />
                                Order Details
                            </h2>
                            <button
                                className="text-gray-400 hover:text-gray-600 transition"
                                onClick={() => setIsModalOpen(false)}
                            >
                                <IoClose size={24} />
                            </button>
                        </div>
   
                        <div className="mt-3 text-gray-700 text-sm grid grid-cols-2 gap-2">
                            <p className="flex items-center"><span className="font-medium mr-1">Table:</span> <span className="text-primary font-medium">#{table}</span></p>
                            <p className="flex items-center"><span className="font-medium mr-1">Order ID:</span> <span className="text-gray-900">{orid}</span></p>
                            <p className="flex items-center"><span className="font-medium mr-1">Waiter:</span> <span className="text-gray-900">{waiter}</span></p>
                            <p className="flex items-center"><span className="font-medium mr-1">Time:</span> <span className="text-gray-900">{start_time}</span></p>
                        </div>
   
                        <div className="mt-4 flex-grow overflow-hidden flex flex-col">
                            <h3 className="font-medium text-gray-800 mb-2">Ordered Items</h3>
                            <ul className="overflow-y-auto space-y-2 flex-grow pr-1">
                                {orderedItems.length > 0 ? (
                                    orderedItems.map((item) => (
                                        <li key={item.item_id} className="flex justify-between items-center bg-gray-50 rounded-lg py-2 px-3 text-gray-700">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-800">{item.item_name}</span>
                                                <span className="text-xs text-gray-500">₹{item.price.toFixed(2)} per item</span>
                                            </div>
                                            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
                                                {item.quantity}x
                                            </span>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 py-4">No items found.</p>
                                )}
                            </ul>
                        </div>
   
                        <div className="mt-4 pt-3 border-t text-gray-700 space-y-1">
                            <p className="flex justify-between"><span className="text-gray-600">Subtotal:</span> <span>₹{subtotal.toFixed(2)}</span></p>
                            <p className="flex justify-between"><span className="text-gray-600">GST (18%):</span> <span>₹{gst.toFixed(2)}</span></p>
                            <p className="flex justify-between font-medium text-lg mt-2">
                                <span>Total:</span>
                                <span className="text-primary">₹{totalAmount.toFixed(2)}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderQueueCard;
