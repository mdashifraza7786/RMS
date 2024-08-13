"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';
import { FaEye } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";
import AddMenu from './popup';

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
];

const Page: React.FC = () => {
    const [popupopened, setPopupopened] = useState<true | false>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [editPopupVisible, setEditPopupVisible] = useState(false);
    const [editData, setEditData] = useState({ itemID: '', name: '', price: '',img:null });

    useEffect(() => {
        document.title = "Menu";
    }, []);

    const addMenuHandler = () => {
        setPopupopened(!popupopened);
    };

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleEditClick = (data: any) => {
        setEditData(data);
        setEditPopupVisible(true);
    };

    const filteredData = sampleData.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemID.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='bg-[#e6e6e6] py-[5vh] px-[8vw] font-raleway flex flex-col gap-[6vh] relative'>
            {popupopened ? (
                <AddMenu popuphandle={addMenuHandler} />
            ) : (
                <>
                    <h1 className="font-bold">Menu</h1>

                    <section className='bg-white rounded-[10px] p-[4vh] font-semibold flex flex-col gap-3 relative'>
                        <section className='flex justify-between items-center py-4'>
                            <input
                                type='search'
                                placeholder='Search Name, ID...'
                                className='border border-[#807c7c] rounded-xl px-4 py-1'
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <div className="flex">
                                <button onClick={addMenuHandler} className='bg-secondary px-5 py-1 text-white text-lg font-medium rounded-md'>Add Menu</button>
                            </div>
                        </section>

                        {/* Lower section */}
                        <table className="table-auto w-full">
                            <thead>
                                <tr className='bg-secondary text-white font-light'>
                                    <th className="px-4 py-2 text-left w-[200px]">Item ID</th>
                                    <th className="px-4 py-2 text-left w-[400px]">Item Name</th>
                                    <th className="px-4 py-2 text-left w-[200px]">Price</th>
                                    <th className="px-4 py-2 text-left w-[200px]">Image</th>
                                    <th className="px-4 py-2 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item, index) => (
                                    <tr key={index} className='text-[14px] font-medium font-montserrat'>
                                        <td className="border px-4 py-4 transition-colors duration-300">{item.itemID}</td>
                                        <td className="border px-4 py-4 transition-colors duration-300">{item.name}</td>
                                        <td className="border px-4 py-4 transition-colors duration-300">₹ {item.price}</td>
                                        <td className="border px-4 py-4 transition-colors duration-300">
                                            <img className='w-[150px] h-[100px] object-cover' src={item.img} alt={item.name} />
                                        </td>
                                        <td className="border px-4 py-4 transition-colors duration-300">
                                            <div className='flex gap-4 justify-center'>
                                                {/* <button className="bg-primary text-white px-4 py-2 rounded text-[12px] flex items-center gap-10">
                                                    <div>View</div> <FaEye />
                                                </button> */}
                                                <button className="bg-primary text-white px-4 py-2 rounded text-[12px] flex items-center gap-10"  onClick={() => handleEditClick(item)}>
                                                    <div>Edit</div> <FaPenToSquare />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </>
            )}

            {/* Edit Popup */}
            {editPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg">
                        
                        <div className="flex justify-end">
                            <button
                                onClick={() => setEditPopupVisible(false)}
                                className="bg-gray-200 text-gray-700 rounded-md px-4 py-2 mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                // onClick={handleEdit}
                                className="bg-blue-500 text-white rounded-md px-4 py-2"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Page;
