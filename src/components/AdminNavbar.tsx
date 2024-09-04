"use client"
import React from 'react';
import Link from 'next/link';
import { BsPersonCircle } from 'react-icons/bs';
import { Raleway } from 'next/font/google';
import { GrHomeRounded } from 'react-icons/gr';
import { FaDollarSign } from 'react-icons/fa';
import { SlPeople } from 'react-icons/sl';
import { MdOutlineInventory } from 'react-icons/md';
import { PiChefHatThin } from 'react-icons/pi';
import { TbReportAnalytics } from 'react-icons/tb';
import { AiOutlineLogout } from "react-icons/ai";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
const raleway = Raleway({
    weight: ['400', '700'],
    subsets: ['latin'],
});

const AdminNavbar: React.FC = () => {
    const pathName = usePathname();
    async function  handleLogout(){
        await signOut({ callbackUrl: '/' });
        localStorage.removeItem('user');
    }
    return (
        <div className='shadow-lg sticky top-0 left-0 z-50'>
            {/* upper nav */}
            <div className={`bg-primary flex font-semibold justify-between items-center text-white px-[8vw] py-[3vh] ${raleway.className}`}>
                <div>
                    Restaurant Management System
                </div>
                <div className='flex gap-4'>
                <div className='flex items-center gap-2 cursor-pointer'>
                    <div><BsPersonCircle /></div>
                    <div>Admin</div>
                </div>
                <div className='flex items-center gap-2 cursor-pointer' onClick={handleLogout}>
                    <div><AiOutlineLogout /></div>
                    <div>Logout</div>
                </div>
                </div>
                
            </div>

            {/* lower nav */}
            <div className='bg-white flex items-center px-[8vw] py-[3vh] gap-9 font-extrabold text-sm'>
                <Link href='/' passHref>
                    <div className={`flex items-center gap-2 cursor-pointer ${pathName === '/' ? 'text-green-500' : ''}`}>
                        <div><GrHomeRounded /></div>
                        <div>Dashboard</div>
                    </div>
                </Link>
                <Link href='/payout' passHref>
                    <div className={`flex items-center gap-2 cursor-pointer ${pathName?.includes('/payout')  ? 'text-green-500' : ''}`}>
                        <div><FaDollarSign /></div>
                        <div>Payouts</div>
                    </div>
                </Link>
                <Link href='/attendance' passHref>
                    <div className={`flex items-center gap-2 cursor-pointer ${pathName?.includes('/attendance') ? 'text-green-500' : ''}`}>
                        <div><SlPeople /></div>
                        <div>Attendance</div>
                    </div>
                </Link>
                <Link href='/inventory' passHref>
                    <div className={`flex items-center gap-2 cursor-pointer ${pathName?.includes('/inventory') ? 'text-green-500' : ''}`}>
                        <div><MdOutlineInventory /></div>
                        <div>Inventory</div>
                    </div>
                </Link>
                <Link href='/members' passHref>
                    <div className={`flex items-center gap-2 cursor-pointer ${pathName?.includes( '/members') ? 'text-green-500' : ''}`}>
                        <div><PiChefHatThin /></div>
                        <div>Members</div>
                    </div>
                </Link>
                <Link href='/reports' passHref>
                    <div className={`flex items-center gap-2 cursor-pointer ${pathName?.includes( '/reports') ? 'text-green-500' : ''}`}>
                        <div><TbReportAnalytics /></div>
                        <div>Reports</div>
                    </div>
                </Link>
                <Link href='/menu' passHref>
                    <div className={`flex items-center gap-2 cursor-pointer ${pathName?.includes( '/menu') ? 'text-green-500' : ''}`}>
                        <div><MdOutlineRestaurantMenu /></div>
                        <div>Menu</div>
                    </div>
                </Link>
                <Link href='/chart' passHref>
                    <div className={`flex items-center gap-2 cursor-pointer ${pathName?.includes( '/chart') ? 'text-green-500' : ''}`}>
                        <div><MdOutlineRestaurantMenu /></div>
                        <div>Charts</div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default AdminNavbar;