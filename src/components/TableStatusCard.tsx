"use client"
import React from 'react';

interface TableStatusCardProps {
    tableno: number;
    tablestatus: string;
    doOrder : (tableno: number)=> void;
}

const TableStatusCard: React.FC<TableStatusCardProps> = ({ tableno, tablestatus,doOrder }) => {
    const bgColorClass = tablestatus === 'available' ? 'bg-supporting2' : 'bg-bgred';

    return (
        <div className={`min-w-[10.2rem] h-[48px] flex justify-center items-center font-semibold text-[15px] text-white rounded-[6.08px] tracking-wider ${bgColorClass}`} onClick={()=>{doOrder(tableno)}}>
            Table No.: #{tableno}
        </div>
    );
};

export default TableStatusCard;