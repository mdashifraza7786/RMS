import React, { useEffect, useState } from 'react';
import { OrderedItems } from './AdminDashboard';
import { IoClose } from 'react-icons/io5';

interface OrderQueueCardProps {
    table: string;
    waiter: string;
    amount: string;
    orid: string;
    orderedItems: OrderedItems[];
}

const OrderQueueCard: React.FC<OrderQueueCardProps> = ({ table, waiter, amount, orid, orderedItems }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const subtotal = orderedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const gst = subtotal * 0.18;
    const totalAmount = subtotal + gst;
    
    return (
        <>
            <div className='min-w-[22rem] h-[6rem] border border-[#25476A] rounded-[10px] relative'>
                <div className='w-[20px] h-[20px] bg-[#FF0000] rounded-full absolute -right-[7px] -top-[7px]'></div>
                <div className='grid grid-cols-2 px-3 py-4'>
                    <div className='flex flex-col gap-[5px]'>
                        <h1 className='text-[17px]'>Table: <span className='text-secondary'>#{table}</span></h1>
                        <p className='text-[14px]'>Waiter: <span className='text-secondary'>{waiter}</span></p>
                    </div>
                    <div className='flex flex-col gap-[5px]'>
                        <h1 className='text-[17px]'>Amount: <span className='text-secondary'>₹{amount}</span></h1>
                        <button
                            className='bg-supporting2 rounded-[10px] py-[3px] text-white text-[14px]'
                            onClick={() => setIsModalOpen(true)}
                        >
                            View Details
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
                    <div className='bg-white rounded-lg w-[400px] shadow-2xl relative p-6 transform scale-95 transition-all duration-300'>
                        <h2 className='text-xl font-bold mb-4 text-center text-gray-800'>Order Details</h2>
                        <p className='text-sm text-gray-600'><strong>Table:</strong> #{table}</p>
                        <p className='text-sm text-gray-600'><strong>Order ID:</strong> {orid}</p>

                        <ul className='mt-4 max-h-[200px] overflow-auto border-t pt-2 space-y-2'>
                            {orderedItems.length > 0 ? (
                                orderedItems.map((item) => (
                                    <li key={item.item_id} className='flex justify-between items-center border-b py-2 px-2 text-gray-700'>
                                        <span className='font-medium'>{item.item_name}</span>
                                        <span>{item.quantity} x ₹{item.price.toFixed(2)}</span>
                                    </li>
                                ))
                            ) : (
                                <p className='text-center text-gray-500'>No items found.</p>
                            )}
                        </ul>

                        <div className='mt-4 border-t pt-3 space-y-2 text-gray-800'>
                            <p className='flex justify-between'><span>Subtotal:</span> <span>₹{subtotal.toFixed(2)}</span></p>
                            <p className='flex justify-between'><span>GST (18%):</span> <span>₹{gst.toFixed(2)}</span></p>
                            <p className='flex justify-between font-bold text-lg'><span>Total:</span> <span>₹{totalAmount.toFixed(2)}</span></p>
                        </div>

                        <button
                            className='absolute top-3 right-3 px-3 py-1 rounded-full transition-all duration-200'
                            onClick={() => setIsModalOpen(false)}
                        >
                            <IoClose size={24} />

                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderQueueCard;
