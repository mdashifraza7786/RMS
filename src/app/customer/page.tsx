"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function CustomerHome() {
  const { data: session } = useSession();
  const name = (session?.user as any)?.name || "";
  return (
    <div className="max-w-md mx-auto bg-white">
      <header className="sticky top-0 z-10 bg-gradient-to-r from-amber-50 to-rose-50/80 backdrop-blur border-b px-4 py-3">
        <div className="text-lg font-semibold text-gray-900">Hi {name.split(" ")[0] || "there"} 👋</div>
        <div className="text-xs text-gray-600">Welcome back! What would you like to do today?</div>
      </header>

      <main className="p-4 space-y-4">
        <Link href="/customer/menu" className="block bg-gradient-to-r from-amber-100 via-orange-100 to-rose-100 rounded-2xl p-4 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-base font-semibold text-gray-900">Browse Menu</div>
              <div className="text-xs text-gray-600">Explore dishes and add to cart</div>
            </div>
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-black text-white">→</span>
          </div>
        </Link>

        <Link href="/customer/track" className="block bg-gradient-to-r from-teal-100 via-cyan-100 to-sky-100 rounded-2xl p-4 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-base font-semibold text-gray-900">Track Order</div>
              <div className="text-xs text-gray-600">See live status of your order</div>
            </div>
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-black text-white">→</span>
          </div>
        </Link>

        <Link href="/customer/history" className="block bg-gradient-to-r from-indigo-100 via-purple-100 to-fuchsia-100 rounded-2xl p-4 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-base font-semibold text-gray-900">Order History</div>
              <div className="text-xs text-gray-600">Your previous orders</div>
            </div>
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-black text-white">→</span>
          </div>
        </Link>
      </main>
    </div>
  );
}


