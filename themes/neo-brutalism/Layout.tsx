"use client"
import React, { useEffect } from 'react';
import MobileNav from "@/components/MobileNav";
import { NAV_ITEMS, BOTTOM_NAV_ITEMS, isPathActive } from '@/components/Navbar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import './styles.css';

export default function NeoBrutalismLayout({ children, role }: { children: React.ReactNode, role?: string }) {
  const pathname = usePathname();
  useEffect(() => {
    document.body.classList.add('neo-brutalism-theme-active');
    return () => document.body.classList.remove('neo-brutalism-theme-active');
  }, []);

  return (
    <div className="min-h-screen bg-[#FDE047] p-4 lg:p-8 font-sans font-black uppercase text-black">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] min-h-[calc(100vh-4rem)] flex flex-col">
        <header className="border-b-4 border-black bg-[#FDE047] flex items-stretch h-20">
            <div className="border-r-4 border-black px-8 flex items-center justify-center bg-black text-white text-3xl">RMS</div>
            <div className="flex-1 flex overflow-x-auto scrollbar-hide">
                {NAV_ITEMS.map((item, i) => {
                    if (!role || !item.roles.includes(role)) return null;
                    const active = isPathActive(item.href, pathname);
                    return (
                        <Link key={i} href={item.href} className={`flex items-center space-x-2 px-6 border-r-4 border-black transition-all ${active ? 'bg-[#3B82F6] text-white' : 'hover:bg-gray-200 bg-white text-black'}`}>
                            <span className="text-xl">{item.icon}</span><span className="text-sm tracking-widest">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
            {BOTTOM_NAV_ITEMS.map((item, i) => {
                if (!role || !item.roles.includes(role)) return null;
                if (item.action === 'logout') {
                    return (
                        <button key={i} onClick={() => signOut({callbackUrl:'/'})} className="px-6 bg-[#EF4444] text-white border-l-4 border-black hover:bg-black transition-colors">{item.label}</button>
                    );
                }
                return (
                    <Link key={i} href={item.href} className="px-6 bg-white text-black border-l-4 border-black hover:bg-gray-200 transition-colors flex items-center justify-center">{item.label}</Link>
                );
            })}
        </header>
        <div className="lg:hidden"><MobileNav role={role}/></div>
        <main className="flex-1 p-8 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]">{children}</main>
      </div>
    </div>
  );
}
