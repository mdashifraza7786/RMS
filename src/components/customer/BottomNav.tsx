"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiList, FiClock, FiBook } from "react-icons/fi";

export default function BottomNav() {
  const path = usePathname();
  const is = (p: string) => path === p;
  const base = "flex-1 inline-flex flex-col items-center justify-center py-2 text-xs";
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t">
      <div className="max-w-md mx-auto grid grid-cols-4">
        <Link href="/customer" className={`${base} ${is('/customer') ? 'text-rose-600' : 'text-gray-500'}`}>
          <FiHome className="text-lg" />
          <span>Home</span>
        </Link>
        <Link href="/customer/menu" className={`${base} ${is('/customer/menu') ? 'text-rose-600' : 'text-gray-500'}`}>
          <FiList className="text-lg" />
          <span>Menu</span>
        </Link>
        <Link href="/customer/track" className={`${base} ${is('/customer/track') ? 'text-rose-600' : 'text-gray-500'}`}>
          <FiClock className="text-lg" />
          <span>Track</span>
        </Link>
        <Link href="/customer/history" className={`${base} ${is('/customer/history') ? 'text-rose-600' : 'text-gray-500'}`}>
          <FiBook className="text-lg" />
          <span>History</span>
        </Link>
      </div>
    </nav>
  );
}


