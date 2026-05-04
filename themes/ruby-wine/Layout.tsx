"use client"
import React, { useEffect } from 'react';
import MobileNav from "@/components/MobileNav";
import { NAV_ITEMS, BOTTOM_NAV_ITEMS, isPathActive } from '@/components/Navbar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import './styles.css';

export default function RubyWineLayout({ children, role }: { children: React.ReactNode, role?: string }) {
  const pathname = usePathname();
  useEffect(() => {
    document.body.classList.add('ruby-wine-theme-active');
    return () => document.body.classList.remove('ruby-wine-theme-active');
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-serif">
      <header className="w-full bg-[#800020] text-white border-b-[8px] border-[#E32636]">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-widest uppercase text-[#F9E4B7]">RMS</h1>
            <nav className="hidden lg:flex space-x-6">
                {NAV_ITEMS.map((item, i) => {
                    if (!role || !item.roles.includes(role)) return null;
                    const active = isPathActive(item.href, pathname);
                    return (
                        <Link key={i} href={item.href} className={`flex items-center space-x-2 pb-1 border-b-2 transition-all ${active ? 'border-[#F9E4B7] text-[#F9E4B7]' : 'border-transparent text-white hover:text-[#F9E4B7]'}`}>
                            <span>{item.icon}</span><span className="uppercase text-sm tracking-wider">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
            <div className="flex items-center space-x-4">
                {BOTTOM_NAV_ITEMS.map((item, i) => {
                    if (!role || !item.roles.includes(role)) return null;
                    if (item.action === 'logout') {
                        return (
                            <button key={i} onClick={() => signOut({callbackUrl:'/'})} className="px-4 py-2 bg-white text-[#800020] hover:bg-[#F9E4B7] font-bold uppercase text-xs tracking-wider transition-colors">{item.label}</button>
                        );
                    }
                    return (
                        <Link key={i} href={item.href} className="px-4 py-2 bg-transparent text-[#F9E4B7] border border-[#F9E4B7] hover:bg-[#F9E4B7] hover:text-[#800020] font-bold uppercase text-xs tracking-wider transition-colors">{item.label}</Link>
                    );
                })}
            </div>
        </div>
      </header>
      <div className="lg:hidden"><MobileNav role={role}/></div>
      <main className="container mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
