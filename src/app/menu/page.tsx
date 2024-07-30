"use client";
import React, { useState, useEffect } from 'react';
import { FaEye } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";

const sampleData = [
    { itemID: 'ASD124', name: 'Masala Dosa', price: '100', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMqY0HPqN5C9tpTWujLDCfsAMj4QDRtyqVrg&s' },
    { itemID: 'VFD124', name: 'Chapaati', price: '20', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUfAojSZ7c-v2vfe3R5S3sctKi-EDHsP1eMg&s' },
    { itemID: 'SED124', name: 'Pizza', price: '450', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1_PintKUupd_BtEDs2BJhSgjqfCzw-ErzFA&s' },
    { itemID: 'LKJ124', name: 'Lehsun soup', price: '200', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1_PintKUupd_BtEDs2BJhSgjqfCzw-ErzFA&s' },
    { itemID: 'HJK124', name: 'Chocolate Shake', price: '150', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1_PintKUupd_BtEDs2BJhSgjqfCzw-ErzFA&s' },
    { itemID: 'ASV124', name: 'Masala Dosa', price: '100', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMqY0HPqN5C9tpTWujLDCfsAMj4QDRtyqVrg&s' },
    { itemID: 'VFD124', name: 'Chapaati', price: '20', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUfAojSZ7c-v2vfe3R5S3sctKi-EDHsP1eMg&s' },
    { itemID: 'SED1J4', name: 'Pizza', price: '450', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1_PintKUupd_BtEDs2BJhSgjqfCzw-ErzFA&s' },
    { itemID: 'LKJ12H', name: 'Lehsun soup', price: '200', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1_PintKUupd_BtEDs2BJhSgjqfCzw-ErzFA&s' },
    { itemID: 'HJK12A', name: 'Chocolate Shake', price: '150', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1_PintKUupd_BtEDs2BJhSgjqfCzw-ErzFA&s' },
]

const Page: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState('12/07/2024');
    const [attendance, setAttendance] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        document.title = "Members";
    }, []);

    const dates = Array.from({ length: 31 }, (_, i) => {
        const day = (i + 1).toString().padStart(2, '0');
        const month = '12';
        const year = '2024';
        return `${month}/${day}/${year}`;
    });

    const giveAttendance = (id: string, status: string) => {
        setAttendance(prevState => ({ ...prevState, [id]: status }));
        console.log(attendance);
    }

    return (
        <div className='bg-[#e6e6e6] py-[5vh] px-[8vw] font-raleway flex flex-col gap-[6vh]'>
            <h1 className="font-bold">Menu</h1>

            {/* attendance box */}
            <section className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-3 relative'>

                {/* upper section */}
                <section className='flex justify-between items-center py-4'>
                    {/* date */}
                    <div className="flex">

                    </div>

                    {/* search */}
                    <input type='search' placeholder='Search Name,ID...' className='border border-[#807c7c] rounded-xl px-4 py-1'>
                    </input>
                </section>

                {/* lower section */}
                <table className="table-auto w-full">
                    <thead>
                        <tr className='bg-primary text-white font-light'>
                            <th className="px-4 py-2 text-left w-[200px]">Item ID</th>
                            <th className="px-4 py-2 text-left w-[400px]">Item Name</th>
                            <th className="px-4 py-2 text-left w-[200px]">Price</th>
                            <th className="px-4 py-2 text-left w-[200px]">Image</th>
                            <th className="px-4 py-2 text-left ">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sampleData.map((item, index) => (
                            <tr key={index} className='text-[14px] font-medium font-montserrat'>
                                <td className="border px-4 py-4 transition-colors duration-300">{item.itemID}</td>
                                <td className="border px-4 py-4 transition-colors duration-300">{item.name}</td>
                                <td className="border px-4 py-4 transition-colors duration-300">₹ {item.price}</td>
                                <td className="border px-4 py-4 transition-colors duration-300"><img className='w-[150px] h-[100px] object-cover' src={item.img}/></td>
                                <td className="border px-4 py-4 transition-colors duration-300">
                                    <div className='flex gap-4 justify-center'>
                                        {/* <button  className="bg-primary text-white px-4 py-2 rounded text-[12px] flex items-center gap-10"><div>View</div> <FaEye /></button> */}
                                        <button  className="bg-primary text-white px-4 py-2 rounded text-[12px] flex items-center gap-10"><div>Edit</div> <FaPenToSquare /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

        </div>
    );
}

export default Page;
