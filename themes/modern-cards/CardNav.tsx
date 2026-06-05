"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { AiOutlineLogout } from "react-icons/ai";
import { FaCog } from "react-icons/fa";
import { NAV_ITEMS, BOTTOM_NAV_ITEMS, isPathActive } from '@/components/Navbar';

export default function CardNav({ role }: { role?: string }) {
    const pathname = usePathname();

    const handleLogout = async () => {
        localStorage.removeItem('menuData');
        await signOut({ callbackUrl: '/login' });
    };

    return (
        <div className="w-full flex justify-between items-center bg-gray-50/80 backdrop-blur-sm border-b border-gray-100 p-4 rounded-t-3xl">
            {/* Logo Area */}
            <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-black shadow-inner">
                    R
                </div>
                <h2 className="text-xl font-bold tracking-widest text-gray-800">RMS</h2>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-x-auto scrollbar-hide px-6 flex items-center justify-center space-x-2">
                {NAV_ITEMS.map((item, index) => {
                    if (!role || !item.roles.includes(role)) return null;
                    const active = isPathActive(item.href, pathname);
                    return (
                        <Link 
                            key={index}
                            href={item.href}
                            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap ${
                                active 
                                ? 'bg-white shadow-sm border border-gray-200 text-primary font-bold' 
                                : 'hover:bg-white/60 text-gray-500 hover:text-gray-800 font-medium'
                            }`}
                        >
                            <span className={active ? 'text-primary' : 'text-gray-400'}>
                                {item.icon}
                            </span>
                            <span className="text-sm hidden lg:inline-block">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-3">
                {BOTTOM_NAV_ITEMS.map((item, index) => {
                    if (!role || !item.roles.includes(role)) return null;
                    if (item.action === 'logout') {
                        return (
                            <button
                                key={index}
                                onClick={handleLogout}
                                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-gray-200 shadow-sm text-red-400 hover:text-red-500 hover:border-red-200 transition-all duration-200"
                                title={item.label}
                            >
                                <span className="text-lg">{item.icon}</span>
                            </button>
                        );
                    }
                    return (
                        <Link 
                            key={index}
                            href={item.href}
                            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 bg-white border border-gray-200 shadow-sm ${
                                isPathActive(item.href, pathname)
                                ? 'text-primary border-primary bg-primary/5' 
                                : 'text-gray-500 hover:text-primary hover:border-primary/50'
                            }`}
                            title={item.label}
                        >
                            {item.icon}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
