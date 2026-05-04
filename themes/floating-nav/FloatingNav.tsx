"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { AiOutlineLogout } from "react-icons/ai";
import { FaCog } from "react-icons/fa";
import { NAV_ITEMS, BOTTOM_NAV_ITEMS, isPathActive } from '@/components/Navbar';

export default function FloatingNav({ role }: { role?: string }) {
    const pathname = usePathname();

    const handleLogout = async () => {
        localStorage.removeItem('menuData');
        await signOut({ callbackUrl: '/login' });
    };

    return (
        <div className="w-full flex justify-center pt-8 px-4 absolute top-0 z-50 pointer-events-none">
            <div className="bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] border border-white/50 px-3 py-2 flex items-center justify-between max-w-6xl w-full pointer-events-auto transition-all duration-300 hover:bg-white/80">
                {/* Logo Area */}
                <div className="flex items-center pl-4 pr-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primaryhover text-white flex items-center justify-center font-black shadow-lg shadow-primary/20 mr-3">
                        R
                    </div>
                    <h2 className="text-xl font-extrabold tracking-tight text-gray-800">RMS</h2>
                </div>

                {/* Vertical Divider */}
                <div className="h-8 w-px bg-gray-200/50 mx-2"></div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-x-auto scrollbar-hide px-4 flex items-center justify-center space-x-1.5">
                    {NAV_ITEMS.map((item, index) => {
                        if (!role || !item.roles.includes(role)) return null;
                        const active = isPathActive(item.href, pathname);
                        return (
                            <Link 
                                key={index}
                                href={item.href}
                                className={`flex items-center space-x-2.5 px-5 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap ${
                                    active 
                                    ? 'bg-white text-primary shadow-sm border border-gray-100 font-bold scale-105' 
                                    : 'hover:bg-white/50 text-gray-500 hover:text-gray-900 font-medium'
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
                <div className="flex items-center pl-4 border-l border-gray-200/50 space-x-2 pr-2">
                    {BOTTOM_NAV_ITEMS.map((item, index) => {
                        if (!role || !item.roles.includes(role)) return null;
                        if (item.action === 'logout') {
                            return (
                                <button
                                    key={index}
                                    onClick={handleLogout}
                                    className="p-3 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
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
                                className={`p-3 rounded-full transition-all duration-300 ${
                                    isPathActive(item.href, pathname)
                                    ? 'bg-primary text-white shadow-md scale-105' 
                                    : 'hover:bg-white text-gray-400 hover:text-primary shadow-sm hover:shadow-md'
                                }`}
                                title={item.label}
                            >
                                <span className="text-lg">{item.icon}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
