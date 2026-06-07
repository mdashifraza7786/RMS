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

    const bgClass = isAvailable
        ? 'bg-white border-green-200 hover:border-green-400 hover:shadow-md'
        : 'bg-white border-red-200 hover:border-red-400 hover:shadow-md';

    const iconBgClass = isAvailable ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600';
    const textClass = isAvailable ? 'text-green-700' : 'text-red-700';

    return (
        <button
            className={`
                flex flex-col items-center justify-center p-3 rounded-xl border shadow-sm
                min-h-[80px] w-full transition-all duration-200
                ${bgClass}
                ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-55'}
            `}
            onClick={() => { if (isClickable) doOrder(tableno); }}
            disabled={!isClickable}
        >
            <div className={`w-9 h-9 rounded-full ${iconBgClass} flex items-center justify-center mb-1.5`}>
                {tableno === 0 ? (
                    <MdDeliveryDining size={18} />
                ) : (
                    <MdTableBar size={17} />
                )}
            </div>

            <p className={`text-sm font-semibold ${textClass}`}>
                {tableno === 0 ? 'Parcel' : `Table #${tableno}`}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wide">
                {isAvailable ? 'Available' : 'Occupied'}
            </p>
            {!isClickable && (
                <p className="text-[9px] text-gray-300 mt-0.5">Not assigned</p>
            )}
        </button>
    );
};

export default TableStatusCard;
