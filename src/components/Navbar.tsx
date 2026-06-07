"use client"
import React, { useState } from 'react';
import ChangePasswordModal from './ChangePasswordModal';
import Link from 'next/link';
import { BsPersonCircle } from 'react-icons/bs';
import { AiOutlineLogout } from "react-icons/ai";
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { GrHomeRounded } from "react-icons/gr";
import { FaDollarSign, FaTableCells } from "react-icons/fa6";
import { SlPeople } from "react-icons/sl";
import { MdOutlineInventory, MdBorderColor, MdOutlineRestaurantMenu } from "react-icons/md";
import { PiChefHatThin } from "react-icons/pi";
import { IoBarChartSharp } from "react-icons/io5";
import { FaBox, FaMoneyBillWave, FaCog } from "react-icons/fa";

export const NAV_ITEMS = [
    { href: "/", icon: <GrHomeRounded />, label: "Dashboard", roles: ["admin", "waiter", "chef"] },
    { href: "/orders", icon: <MdBorderColor />, label: "Orders", roles: ["admin", "waiter", "chef"] },
    { href: "/payout", icon: <FaDollarSign />, label: "Payouts", roles: ["admin"] },
    { href: "/attendance", icon: <SlPeople />, label: "Attendance", roles: ["admin", "waiter", "chef"] },
    { href: "/inventory", icon: <MdOutlineInventory />, label: "Inventory", roles: ["admin"] },
    { href: "/members", icon: <PiChefHatThin />, label: "Members", roles: ["admin"] },
    { href: "/menu", icon: <MdOutlineRestaurantMenu />, label: "Menu", roles: ["admin", "waiter", "chef"] },
    { href: "/chart", icon: <IoBarChartSharp />, label: "Charts", roles: ["admin"] },
    { href: "/expenses", icon: <FaMoneyBillWave />, label: "Expenses", roles: ["admin"] },
    { href: "/tables", icon: <FaTableCells />, label: "Tables", roles: ["admin"] },
    { href: "/inventory-forecast", icon: <FaBox />, label: "Forecast", roles: ["admin"] },
];

export const BOTTOM_NAV_ITEMS = [
    { href: "/settings", icon: <FaCog />, label: "Settings", roles: ["admin"], action: null },
    { href: "#", icon: <AiOutlineLogout />, label: "Logout", roles: ["admin", "waiter", "chef"], action: "logout" },
];

export const isPathActive = (href: string, path: string | null) => {
    if (!path) return false;
    if (href === '/') return path === '/';
    const escapedHref = href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`^${escapedHref}(?:/|$)`);
    return pattern.test(path);
};

const LogoIcon = () => (
    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
        <MdOutlineRestaurantMenu className="text-white text-base" />
    </div>
);

const Navbar: React.FC<{ role?: string; userid?: string }> = ({ role = '', userid = '' }) => {
    const pathName = usePathname();
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    async function handleLogout() {
        await signOut({ callbackUrl: '/' });
        localStorage.removeItem('user');
    }

    const filteredNavItems = NAV_ITEMS.filter(item => item.roles.includes(role?.toLowerCase()));

    return (
        <>
            <nav className="w-full sticky top-0 z-50 hidden lg:block">
                {/* Tier 1: Brand + user actions */}
                <div className="bg-primary h-14 flex items-center px-6 xl:px-10 shadow-md">
                    <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
                        <LogoIcon />
                        <span className="font-display font-bold text-white text-[15px] tracking-tight whitespace-nowrap">
                            Restaurant MS
                        </span>
                    </Link>

                    <div className="flex items-center gap-2 ml-auto flex-shrink-0">
                        <button
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-all duration-150 px-3 py-1.5 rounded-lg text-white text-sm"
                        >
                            <BsPersonCircle className="w-4 h-4" />
                            <span className="max-w-[120px] truncate">{userid}</span>
                        </button>

                        {BOTTOM_NAV_ITEMS.map((item, index) => {
                            if (!role || !item.roles.includes(role)) return null;
                            if (item.action === 'logout') {
                                return (
                                    <button
                                        key={index}
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 bg-white/10 hover:bg-red-500/80 transition-all duration-150 px-3 py-1.5 rounded-lg text-white text-sm"
                                    >
                                        {React.cloneElement(item.icon, { className: "w-4 h-4" })}
                                        <span>{item.label}</span>
                                    </button>
                                );
                            }
                            return (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-all duration-150 px-3 py-1.5 rounded-lg text-white text-sm"
                                >
                                    {React.cloneElement(item.icon, { className: "w-4 h-4" })}
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Tier 2: Navigation links */}
                <div className="bg-white border-b border-gray-100 shadow-sm">
                    <div className="flex items-center h-11 px-6 xl:px-10">
                        {filteredNavItems.map((item) => (
                            <NavItem
                                key={item.href}
                                href={item.href}
                                icon={React.cloneElement(item.icon, { className: "w-3.5 h-3.5" })}
                                label={item.label}
                                isActive={isPathActive(item.href, pathName)}
                            />
                        ))}
                    </div>
                </div>
            </nav>
            <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
        </>
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
                flex items-center gap-1.5 px-3.5 h-full text-sm font-medium transition-all duration-150 whitespace-nowrap border-b-2
                ${isActive
                    ? 'text-accent border-accent bg-accent/5'
                    : 'text-gray-500 border-transparent hover:text-accent hover:bg-accent/5'}
            `}
        >
            <div className="w-3.5 h-3.5 flex-shrink-0">{icon}</div>
            <span>{label}</span>
        </Link>
    );
};

export default Navbar;
