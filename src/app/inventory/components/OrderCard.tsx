"use client"
import React,{ useState} from 'react';

const sampleData = [
    {name: 'Apples', quantity: 10, unit: 'kg', lowlimit: 5},
    {name: 'Bananas', quantity: 20, unit: 'kg', lowlimit: 10},
    {name: 'Oranges', quantity: 15, unit: 'kg', lowlimit: 5},
    {name: 'Mangoes', quantity: 25, unit: 'kg', lowlimit: 10},
    {name: 'Grapes', quantity: 30, unit: 'kg', lowlimit: 15},
]

const OrderCard: React.FC = () => {
    const [inventory, setInventory] = useState(sampleData);

    return (
        <div>
         
        </div>
    );
};

export default OrderCard;