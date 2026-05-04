"use client"
import React, { useEffect } from 'react';
import MobileNav from "@/components/MobileNav";
import { NAV_ITEMS, BOTTOM_NAV_ITEMS, isPathActive } from '@/components/Navbar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import './styles.css';

export default function RoyalPurpleLayout({ children, role }: { children: React.ReactNode, role?: string }) {
  const pathname = usePathname();
  useEffect(() => {
    document.body.classList.add('royal-purple-theme-active');
    return () => document.body.classList.remove('royal-purple-theme-active');
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F3FF] text-gray-800 pb-24">
      <header className="flex justify-between items-center p-6 bg-white/50 backdrop-blur-md">
        <h1 className="text-2xl font-black text-[#7C3AED] italic tracking-tight">RMS<span className="text-[#8B5CF6]">.cloud</span></h1>
        <div className="flex items-center space-x-4">
            <span className="px-4 py-1 rounded-full bg-[#EDE9FE] text-[#7C3AED] font-bold text-sm">Hi, {role}</span>
        </div>
      </header>
      
      <main className="container mx-auto px-4 mt-6">{children}</main>
      
      {/* Floating Bottom Nav */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-[2rem] shadow-2xl border border-[#EDE9FE] p-2 flex items-center space-x-1 z-50">
        {NAV_ITEMS.map((item, i) => {
            if (!role || !item.roles.includes(role)) return null;
            const active = isPathActive(item.href, pathname);
            return (
                <Link key={i} href={item.href} className={`flex flex-col items-center justify-center w-16 h-16 rounded-[1.5rem] transition-all ${active ? 'bg-[#7C3AED] text-white shadow-lg scale-110 -translate-y-2' : 'text-gray-400 hover:text-[#7C3AED] hover:bg-[#F5F3FF]'}`}>
                    <span className="text-xl mb-1">{item.icon}</span>
                    <span className="text-[9px] font-bold uppercase">{item.label}</span>
                </Link>
            )
        })}
        <div className="w-px h-10 bg-gray-200 mx-2"></div>
        {BOTTOM_NAV_ITEMS.map((item, i) => {
            if (!role || !item.roles.includes(role)) return null;
            if (item.action === 'logout') {
                return (
                    <button key={i} onClick={() => signOut({callbackUrl:'/'})} className="w-14 h-14 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-[1.5rem] transition-all">
                        <span className="text-xl">{item.icon}</span>
                    </button>
                );
            }
            const active = isPathActive(item.href, pathname);
            return (
                <Link key={i} href={item.href} className={`w-14 h-14 flex items-center justify-center rounded-[1.5rem] transition-all ${active ? 'bg-[#7C3AED] text-white shadow-md' : 'text-gray-400 hover:text-[#7C3AED] hover:bg-[#F5F3FF]'}`}>
                    <span className="text-xl">{item.icon}</span>
                </Link>
            );
        })}
      </div>
    </div>
  );
}
