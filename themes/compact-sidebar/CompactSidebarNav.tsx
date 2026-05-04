import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { NAV_ITEMS, BOTTOM_NAV_ITEMS, isPathActive } from '@/components/Navbar';

export default function CompactSidebarNav({ role }: { role?: string }) {
    const pathname = usePathname();

    const handleLogout = async () => {
        localStorage.removeItem('menuData');
        await signOut({ callbackUrl: '/login' });
    };

    return (
        <div className="flex flex-col h-full w-[88px] bg-white text-gray-800 border-r border-gray-100 shadow-[2px_0_12px_rgba(0,0,0,0.03)] items-center z-30">
            {/* Logo Area */}
            <div className="flex items-center justify-center h-24 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primaryhover text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-primary/30">
                    R
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-8 w-full custom-scrollbar flex flex-col items-center">
                <ul className="space-y-4 w-full px-4">
                    {NAV_ITEMS.map((item, index) => {
                        if (!role || !item.roles.includes(role)) return null;
                        const active = isPathActive(item.href, pathname);
                        return (
                            <li key={index} className="w-full relative group flex justify-center">
                                {active && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-primary rounded-r-full shadow-[0_0_8px_rgba(var(--color-primary),0.6)]"></div>
                                )}
                                <Link 
                                    href={item.href}
                                    className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 relative ${
                                        active 
                                        ? 'bg-primary/10 text-primary shadow-inner border border-primary/20 scale-105' 
                                        : 'bg-transparent text-gray-400 hover:bg-gray-50 hover:text-primary hover:scale-110 border border-transparent hover:border-gray-100 shadow-sm'
                                    }`}
                                    title={item.label}
                                >
                                    <span className="text-[22px]">
                                        {item.icon}
                                    </span>
                                </Link>
                                {/* Tooltip */}
                                <div className="absolute left-[70px] top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg opacity-0 translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap z-50 shadow-xl">
                                    {item.label}
                                    {/* Tooltip arrow */}
                                    <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Bottom Section */}
            <div className="w-full py-6 border-t border-gray-100 bg-gray-50/50 flex flex-col items-center space-y-4 px-4">
                {BOTTOM_NAV_ITEMS.map((item, index) => {
                    if (!role || !item.roles.includes(role)) return null;
                    if (item.action === 'logout') {
                        return (
                            <button
                                key={index}
                                onClick={handleLogout}
                                className="flex items-center justify-center w-12 h-12 rounded-2xl bg-transparent text-gray-400 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100 shadow-sm transition-all duration-300 relative group hover:scale-110"
                            >
                                <span className="text-[22px]">{item.icon}</span>
                                {/* Tooltip */}
                                <div className="absolute left-[70px] top-1/2 -translate-y-1/2 bg-red-600 text-white text-xs font-medium px-3 py-2 rounded-lg opacity-0 translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap z-50 shadow-xl">
                                    {item.label}
                                    <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 bg-red-600 rotate-45"></div>
                                </div>
                            </button>
                        );
                    }
                    return (
                        <Link 
                            key={index}
                            href={item.href}
                            className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 group relative ${
                                isPathActive(item.href, pathname)
                                ? 'bg-primary/10 text-primary shadow-inner border border-primary/20 scale-105' 
                                : 'bg-transparent text-gray-400 hover:bg-gray-50 hover:text-primary hover:scale-110 border border-transparent hover:border-gray-100 shadow-sm'
                            }`}
                        >
                            <span className="text-[22px]">{item.icon}</span>
                            {/* Tooltip */}
                            <div className="absolute left-[70px] top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg opacity-0 translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap z-50 shadow-xl">
                                {item.label}
                                <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
