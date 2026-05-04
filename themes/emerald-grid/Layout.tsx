"use client"
import React, { useEffect } from 'react';
import MobileNav from "@/components/MobileNav";
import { NAV_ITEMS, BOTTOM_NAV_ITEMS, isPathActive } from '@/components/Navbar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import './styles.css';

export default function EmeraldGridLayout({ children, role }: { children: React.ReactNode, role?: string }) {
  const pathname = usePathname();
  useEffect(() => {
    document.body.classList.add('emerald-grid-theme-active');
    return () => document.body.classList.remove('emerald-grid-theme-active');
  }, []);

  return (
    <div className="min-h-screen bg-[#F0FDF4] flex flex-col md:flex-row border-[12px] border-[#059669]">
      <aside className="w-64 bg-white border-r-4 border-[#059669] flex flex-col hidden lg:flex">
        <div className="h-24 bg-[#059669] flex items-center justify-center text-white text-3xl font-mono font-bold tracking-tighter">RMS_OS</div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {NAV_ITEMS.map((item, i) => {
                if (!role || !item.roles.includes(role)) return null;
                const active = isPathActive(item.href, pathname);
                return (
                    <Link key={i} href={item.href} className={`flex items-center space-x-3 p-3 border-2 transition-all ${active ? 'border-[#059669] bg-[#10B981] text-white font-bold' : 'border-gray-200 hover:border-[#059669] text-gray-700'}`}>
                        <span className="text-xl">{item.icon}</span><span className="font-mono uppercase">{item.label}</span>
                    </Link>
                )
            })}
        </nav>
      </aside>
      <div className="lg:hidden"><MobileNav role={role}/></div>
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-16 border-b-4 border-[#059669] bg-white flex items-center px-6 justify-between">
            <span className="font-mono text-[#059669] font-bold">/// ACTIVE_USER: {role}</span>
            <div className="flex items-center space-x-3">
                {BOTTOM_NAV_ITEMS.map((item, i) => {
                    if (!role || !item.roles.includes(role)) return null;
                    if (item.action === 'logout') {
                        return (
                            <button key={i} onClick={() => signOut({callbackUrl:'/'})} className="font-mono text-red-600 hover:bg-red-50 px-4 py-1 border-2 border-red-600">{item.label}</button>
                        );
                    }
                    return (
                        <Link key={i} href={item.href} className="font-mono text-[#059669] hover:bg-[#F0FDF4] px-4 py-1 border-2 border-[#059669]">{item.label}</Link>
                    );
                })}
            </div>
        </header>
        <div className="p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">{children}</div>
      </main>
    </div>
  );
}
