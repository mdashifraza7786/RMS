"use client"
import React, { useEffect } from 'react';
import MobileNav from "@/components/MobileNav";
import { NAV_ITEMS, BOTTOM_NAV_ITEMS, isPathActive } from '@/components/Navbar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './styles.css';

export default function SunsetOrangeLayout({ children, role }: { children: React.ReactNode, role?: string }) {
  const pathname = usePathname();
  useEffect(() => {
    document.body.classList.add('sunset-orange-theme-active');
    return () => document.body.classList.remove('sunset-orange-theme-active');
  }, []);

  return (
    <div className="h-screen flex bg-[#FFF7ED] overflow-hidden">
      <aside className="w-72 bg-[#1C1917] text-gray-300 hidden lg:flex flex-col rounded-r-3xl my-4 shadow-[10px_0_30px_rgba(234,88,12,0.1)] relative overflow-hidden flex-shrink-0">
        {/* Decorative background circle */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#EA580C]/20 to-transparent rounded-bl-full pointer-events-none"></div>
        
        <div className="p-8 pb-4 relative z-10">
            <h1 className="text-4xl font-black text-white">RMS<span className="text-[#EA580C]">.</span></h1>
            <p className="text-sm mt-2 text-[#F97316]">Modern Restaurant Ops</p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto relative z-10">
            {NAV_ITEMS.map((item, i) => {
                if (!role || !item.roles.includes(role)) return null;
                const active = isPathActive(item.href, pathname);
                return (
                    <Link key={i} href={item.href} className={`flex items-center space-x-4 p-4 rounded-2xl transition-all ${active ? 'bg-gradient-to-r from-[#EA580C] to-[#F97316] text-white shadow-lg shadow-orange-500/30' : 'hover:bg-white/5 hover:text-white'}`}>
                        <span className="text-2xl">{item.icon}</span><span className="font-semibold text-lg">{item.label}</span>
                    </Link>
                )
            })}
        </nav>
        <div className="p-4 border-t border-white/5 space-y-2 relative z-10">
            {BOTTOM_NAV_ITEMS.map((item, i) => {
                if (!role || !item.roles.includes(role)) return null;
                if (item.action === 'logout') {
                    return (
                        <button key={i} onClick={() => {
                            import('next-auth/react').then(({ signOut }) => signOut({ callbackUrl: '/' }));
                        }} className="flex items-center justify-center space-x-2 w-full p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all font-semibold">
                            <span>{item.label}</span>
                        </button>
                    );
                }
                return (
                    <Link key={i} href={item.href} className="flex items-center justify-center space-x-2 w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all font-semibold">
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </div>
      </aside>
      <div className="lg:hidden w-full absolute top-0"><MobileNav role={role}/></div>
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto pt-24 lg:pt-12">{children}</main>
    </div>
  );
}
