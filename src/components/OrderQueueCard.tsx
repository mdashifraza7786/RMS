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
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);
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
               <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
               <div className="bg-white rounded-2xl w-[420px] shadow-2xl relative p-6 transform scale-100 transition-all duration-300">
                   {/* Header */}
                   <div className="flex justify-between items-center border-b pb-3">
                       <h2 className="text-2xl font-semibold text-primary">Order Details</h2>
                       <button
                           className="text-gray-500 hover:text-gray-800 transition"
                           onClick={() => setIsModalOpen(false)}
                       >
                           <IoClose className="text-red-600 font-bold" size={28} />
                       </button>
                   </div>
   
                   {/* Order Info */}
                   <div className="mt-3 text-gray-700 text-sm">
                       <p><strong>Table:</strong> <span className='text-secondary font-bold'>#{table}</span></p>
                       <p><strong>Order ID:</strong><span className='text-secondary font-bold'> {orid}</span></p>
                   </div>
   
                   {/* Ordered Items */}
                   <ul className="mt-4 max-h-[220px] overflow-auto border-t pt-2 space-y-3">
                       {orderedItems.length > 0 ? (
                           orderedItems.map((item) => (
                               <li key={item.item_id} className="flex bg-gray-200 rounded-md justify-between items-center border-b py-2 px-2 text-gray-700">
                                   <span className="font-medium">{item.item_name}</span>
                                   <span className="text-gray-900 font-semibold">{item.quantity} x ₹{item.price.toFixed(2)}</span>
                               </li>
                           ))
                       ) : (
                           <p className="text-center text-gray-500">No items found.</p>
                       )}
                   </ul>
   
                   {/* Pricing Details */}
                   <div className="mt-4 border-t pt-3 text-gray-900 text-sm">
                       <p className="flex justify-between"><span className='text-primary'>Subtotal:</span> <span>₹{subtotal.toFixed(2)}</span></p>
                       <p className="flex justify-between"><span className='text-primary'>GST (18%):</span> <span>₹{gst.toFixed(2)}</span></p>
                       <p className="flex justify-between font-bold text-lg mt-2">
                           <span>Total:</span>
                           <span className="text-black font-bold">₹{totalAmount.toFixed(2)}</span>
                       </p>
                   </div>
               </div>
           </div>
            )}
        </>
    );
};

export default OrderQueueCard;
