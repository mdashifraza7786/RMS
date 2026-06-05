"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { NAV_ITEMS, BOTTOM_NAV_ITEMS, isPathActive } from '@/components/Navbar';

export default function SidebarNav({ role }: { role?: string }) {
    const pathname = usePathname();

    const handleLogout = async () => {
        localStorage.removeItem('menuData');
        await signOut({ callbackUrl: '/login' });
    };

    return (
        <div className="flex flex-col h-full w-full bg-white text-gray-800 border-r border-gray-100 shadow-[2px_0_8px_rgba(0,0,0,0.02)] z-30">
            {/* Logo Area */}
            <div className="flex flex-col items-center justify-center h-24 border-b border-gray-100 bg-white/50 backdrop-blur-sm">
                <h2 className="text-2xl font-black tracking-widest text-primary drop-shadow-sm">RMS</h2>
                <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-widest mt-1">Management</span>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
                <ul className="space-y-2">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Main Menu</div>
                    {NAV_ITEMS.map((item, index) => {
                        if (!role || !item.roles.includes(role)) return null;
                        
                        const active = isPathActive(item.href, pathname);
                        return (
                            <li key={index} className="relative group">
                                {active && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-r-full shadow-[0_0_8px_rgba(var(--color-primary),0.6)]"></div>
                                )}
                                <Link 
                                    href={item.href}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                                        active 
                                        ? 'bg-primary/10 text-primary font-semibold' 
                                        : 'hover:bg-gray-50 text-gray-500 hover:text-gray-900 font-medium'
                                    }`}
                                >
                                    <span className={`text-xl transition-transform duration-300 ${active ? 'text-primary scale-110' : 'text-gray-400 group-hover:scale-110 group-hover:text-primary'}`}>
                                        {item.icon}
                                    </span>
                                    <span className="text-sm">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                {BOTTOM_NAV_ITEMS.map((item, index) => {
                    if (!role || !item.roles.includes(role)) return null;
                    if (item.action === 'logout') {
                        return (
                            <button
                                key={index}
                                onClick={handleLogout}
                                className="flex items-center w-full space-x-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 font-medium transition-all duration-300 group"
                            >
                                <span className="text-xl text-gray-400 group-hover:text-red-500 transition-colors">{item.icon}</span>
                                <span className="text-sm">{item.label}</span>
                            </button>
                        );
                    }
                    return (
                        <Link 
                            key={index}
                            href={item.href}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group mb-2 ${
                                isPathActive(item.href, pathname)
                                ? 'bg-primary/10 text-primary font-semibold' 
                                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900 font-medium'
                            }`}
                        >
                            <span className={`text-xl transition-transform duration-300 ${isPathActive(item.href, pathname) ? 'text-primary scale-110' : 'text-gray-400 group-hover:scale-110 group-hover:text-primary'}`}>
                                {item.icon}
                            </span>
                            <span className="text-sm">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
