"use client"
import React from 'react';
import { MdTableBar, MdDeliveryDining } from 'react-icons/md';

interface TableStatusCardProps {
    tableno: number;
    tablestatus: string;
    doOrder: (tableno: number) => void;
    isClickable?: boolean;
}

const TableStatusCard: React.FC<TableStatusCardProps> = ({ tableno, tablestatus, doOrder, isClickable = true }) => {
    const isAvailable = tablestatus === 'available';
    const bgClass = isAvailable ? 'bg-white border-green-200 hover:border-green-300' : 'bg-white border-red-200 hover:border-red-300';
    const iconBgClass = isAvailable ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600';
    const textClass = isAvailable ? 'text-green-700' : 'text-red-700';
    
    return (
        <div 
            className={`flex flex-col items-center justify-center p-3 rounded-xl shadow-sm border ${bgClass} ${isClickable ? 'cursor-pointer hover:shadow-md' : 'cursor-not-allowed opacity-60'}`}
            onClick={() => { if (isClickable) doOrder(tableno); }}
        >
            <div className={`w-10 h-10 rounded-full ${iconBgClass} flex items-center justify-center mb-2`}>
                {tableno === 0 ? (
                    <MdDeliveryDining size={22} />
                ) : (
                    <MdTableBar size={20} />
                )}
            </div>
            
            <div className="text-center">
                <p className={`text-sm font-medium ${textClass}`}>
                    {tableno === 0 ? "Parcel" : `Table #${tableno}`}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    {isAvailable ? 'Available' : 'Occupied'}
                </p>
                {!isClickable && (
                  <p className="text-[11px] text-gray-400 mt-1">Not assigned to you</p>
                )}
            </div>
        </div>
    );
};

export default TableStatusCard;