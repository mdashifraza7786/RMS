"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { BsPersonCircle } from 'react-icons/bs';
import { Raleway } from 'next/font/google';
import { AiOutlineLogout } from "react-icons/ai";
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
    GrHomeRounded,
    GrRestaurant
} from "react-icons/gr";
import {
    FaDollarSign,
    FaTableCells
} from "react-icons/fa6";
import { SlPeople } from "react-icons/sl";
import { MdOutlineInventory, MdBorderColor } from "react-icons/md";
import { PiChefHatThin } from "react-icons/pi";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { IoBarChartSharp } from "react-icons/io5";
import { FaMoneyBillWave } from "react-icons/fa";
import { RiMenu3Line } from 'react-icons/ri';

const raleway = Raleway({
    weight: ['400', '500', '600'],
    subsets: ['latin'],
});

// Navigation items configuration
const NAV_ITEMS = [
    { href: "/", icon: <GrHomeRounded />, label: "Dashboard" },
    { href: "/orders", icon: <MdBorderColor />, label: "Orders" },
    { href: "/payout", icon: <FaDollarSign />, label: "Payouts" },
    { href: "/attendance", icon: <SlPeople />, label: "Attendance" },
    { href: "/inventory", icon: <MdOutlineInventory />, label: "Inventory" },
    { href: "/members", icon: <PiChefHatThin />, label: "Members" },
    { href: "/menu", icon: <MdOutlineRestaurantMenu />, label: "Menu" },
    { href: "/chart", icon: <IoBarChartSharp />, label: "Charts" },
    { href: "/expenses", icon: <FaMoneyBillWave />, label: "Expenses" },
    { href: "/tables", icon: <FaTableCells />, label: "Tables" }
];

const AdminNavbar: React.FC = () => {
    const pathName = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    async function handleLogout() {
        await signOut({ callbackUrl: '/' });
        localStorage.removeItem('user');
    }

    return (
        <nav className={`w-full sticky top-0 z-50 shadow-sm bg-white`}>
            {/* Top navbar */}
            <div className="bg-primary text-white">
                <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3">

                        <span className="font-semibold text-md hidden sm:block">Restaurant Management System</span>
                        <span className="font-semibold text-lg sm:hidden">RMS</span>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 bg-primaryhover hover:bg-opacity-90 transition-all duration-200 px-4 py-2 rounded-lg cursor-pointer">
                            <BsPersonCircle className="w-4 h-4" />
                            <span className="hidden sm:block">Admin</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 bg-primaryhover hover:bg-opacity-90 transition-all duration-200 px-4 py-2 rounded-lg"
                        >
                            <AiOutlineLogout className="w-4 h-4" />
                            <span className="hidden sm:block">Logout</span>
                        </button>
                        <button
                            className="lg:hidden bg-primaryhover p-2 rounded-lg"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <RiMenu3Line className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation menu */}
            <div className={`bg-white border-b transition-all duration-300 ${isMobileMenuOpen ? 'max-h-screen' : 'max-h-14 overflow-hidden'}`}>
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:h-14 overflow-x-auto scrollbar-hide">
                        {NAV_ITEMS.map((item) => (
                            <NavItem
                                key={item.href}
                                href={item.href}
                                icon={React.cloneElement(item.icon, { className: "w-4 h-4" })}
                                label={item.label}
                                isActive={item.href === '/' ? pathName === '/' : pathName?.includes(item.href)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

interface NavItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label, isActive }) => {
    return (
        <Link
            href={href}
            className={`
                group px-4 py-3 lg:py-4 flex items-center space-x-2 transition-all duration-200
                ${isActive
                    ? 'text-supporting2 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }
            `}
        >
            <div className={`w-4 h-4 ${isActive ? 'text-supporting2' : 'text-gray-500 group-hover:text-supporting2'}`}>
                {icon}
            </div>
            <span className={`whitespace-nowrap text-sm ${isActive ? 'text-supporting2' : 'group-hover:text-supporting2'}`}>
                {label}
            </span>
        </Link>
    );
};


export default AdminNavbar;