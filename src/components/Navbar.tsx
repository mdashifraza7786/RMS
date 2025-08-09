"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { BsPersonCircle } from 'react-icons/bs';
import { Raleway } from 'next/font/google';
import { AiOutlineLogout } from "react-icons/ai";
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { GrHomeRounded } from "react-icons/gr";
import { 
  FaDollarSign,
  FaTableCells
} from "react-icons/fa6";
import { SlPeople } from "react-icons/sl";
import { MdOutlineInventory, MdBorderColor } from "react-icons/md";
import { PiChefHatThin } from "react-icons/pi";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { IoBarChartSharp } from "react-icons/io5";
import { FaBox, FaMoneyBillWave } from "react-icons/fa";
import { RiMenu3Line } from 'react-icons/ri';

const raleway = Raleway({
    weight: ['400', '500', '600'],
    subsets: ['latin'],
});

const NAV_ITEMS = [
    { 
        href: "/", 
        icon: <GrHomeRounded />, 
        label: "Dashboard", 
        roles: ["admin", "waiter", "chef"] 
    },
    { 
        href: "/orders", 
        icon: <MdBorderColor />, 
        label: "Orders", 
        roles: ["admin", "waiter", "chef"] 
    },
    { 
        href: "/payout", 
        icon: <FaDollarSign />, 
        label: "Payouts", 
        roles: ["admin","waiter","chef"] 
    },
    { 
        href: "/attendance", 
        icon: <SlPeople />, 
        label: "Attendance", 
        roles: ["admin","waiter","chef"] 
    },
    { 
        href: "/inventory", 
        icon: <MdOutlineInventory />, 
        label: "Inventory", 
        roles: ["admin", "chef"] 
    },
    { 
        href: "/members", 
        icon: <PiChefHatThin />, 
        label: "Members", 
        roles: ["admin"] 
    },
    { 
        href: "/menu", 
        icon: <MdOutlineRestaurantMenu />, 
        label: "Menu", 
        roles: ["admin","waiter","chef"] 
    },
    { 
        href: "/chart", 
        icon: <IoBarChartSharp />, 
        label: "Charts", 
        roles: ["admin"] 
    },
    { 
        href: "/expenses", 
        icon: <FaMoneyBillWave />, 
        label: "Expenses", 
        roles: ["admin"] 
    },
    { 
        href: "/tables", 
        icon: <FaTableCells />, 
        label: "Tables", 
        roles: ["admin"] 
    },
    { 
        href: "/inventory-forecast", 
        icon: <FaBox />, 
        label: "Forecast", 
        roles: ["admin"] 
    }
];

const Navbar: React.FC<{ role: string, userid: string }> = ({ role, userid }) => {
    const pathName = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    async function handleLogout() {
        await signOut({ callbackUrl: '/' });
        localStorage.removeItem('user');
    }

    const filteredNavItems = NAV_ITEMS.filter(item => item.roles.includes(role?.toLowerCase()));

    return (
        <nav className="w-full sticky top-0 z-50 shadow-sm bg-white mx-auto">
            <div className="bg-primary text-white px-[8vw]">
                <div className="container mx-auto px-6 flex justify-between items-center h-16">
                    <div className={`flex items-center ${raleway.className}`}>
                        <span className="font-semibold text-lg text-white">
                            Restaurant Management System
                        </span>
                    </div>

                    <div className="flex items-center space-x-3">
                        
                        <div className="flex items-center space-x-2 bg-primaryhover hover:bg-opacity-90 transition-all duration-200 px-4 py-2 rounded-lg cursor-pointer">
                            <BsPersonCircle className="w-4 h-4" />
                            <span className="hidden sm:block">{userid}</span>
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

            <div className={`bg-white border-b transition-all duration-300 ${isMobileMenuOpen ? 'max-h-screen' : 'max-h-14 overflow-hidden'}`}>
                <div className="container mx-auto px-2">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:h-14 overflow-x-auto scrollbar-hide px-[8vw] [@media(min-width:1920px)]:px-0">
                        {filteredNavItems.map((item) => (
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
                px-4 py-3 lg:py-4 flex items-center space-x-2 transition-all duration-200
                ${isActive
                    ? 'text-supporting2 font-semibold border-b-2 border-supporting2'
                    : 'text-gray-600 hover:text-supporting2 hover:bg-gray-50'}
            `}
        >
            <div className="w-4 h-4">
                {icon}
            </div>
            <span className="whitespace-nowrap">{label}</span>
        </Link>
    );
};

export default Navbar;
