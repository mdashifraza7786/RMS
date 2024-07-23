"use client"
import React,{ useState} from 'react';

const sampleData = [
    {name: 'Apples', quantity: 10, unit: 'kg', lowlimit: 5},
    {name: 'Bananas', quantity: 20, unit: 'kg', lowlimit: 10},
    {name: 'Oranges', quantity: 15, unit: 'kg', lowlimit: 5},
    {name: 'Mangoes', quantity: 25, unit: 'kg', lowlimit: 10},
    {name: 'Grapes', quantity: 30, unit: 'kg', lowlimit: 15},
]

const InventoryCard: React.FC = () => {
    const [inventory, setInventory] = useState(sampleData);

    return (
        <div>
            {inventory.map(item =>
            <div className="bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-3">
                <div className="flex justify-between">
                    <div className="text-[15px] font-semibold">{item.name}</div>
                    <div className="text-[15px] font-semibold">{item.quantity} {item.unit}</div>
                </div>
                <div className="text-[15px] font-semibold">{item.lowlimit} {item.unit}</div>
            </div>
            )}
        </div>
    );
};

export default InventoryCard;