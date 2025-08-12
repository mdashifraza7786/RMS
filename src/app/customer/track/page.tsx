"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import CustomerHeader from "@/components/customer/Header";
import LoadingBar from "@/components/customer/LoadingBar";
import { useSession } from "next-auth/react";

type OrderItem = { item_id: string; item_name: string; quantity: number; status?: string };
type Order = {
  orderId: number;
  status: string;
  payment_status?: string;
  items: OrderItem[];
};

const OrderCard = React.memo(function OrderCard({ o }: { o: Order }) {
  return (
    <li className="bg-white rounded-xl border shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Order #{o.orderId}</div>
        <div className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 capitalize">{o.status}</div>
      </div>
      <div className="text-xs text-gray-500 mt-1">Payment: {o.payment_status || 'pending'}</div>
      <ul className="mt-3 text-sm space-y-1">
        {o.items.map((it) => (
          <li key={it.item_id} className="flex items-center justify-between">
            <span className="text-gray-800">{it.item_name}</span>
            <div className="flex items-center gap-3">
              <span className="text-xs px-2 py-0.5 rounded-full capitalize bg-gray-100 text-gray-700">{it.status || 'pending'}</span>
              <span className="text-gray-600">× {it.quantity}</span>
            </div>
          </li>
        ))}
      </ul>
    </li>
  );
});

export default function TrackOrder() {
  const { data: session } = useSession();
  const mobile = (session?.user as any)?.mobile;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!mobile) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/customer/orders?mobile=${encodeURIComponent(mobile)}`);
      const data = await res.json();
      const incoming: Order[] = (data?.orders || []) as Order[];

      setOrders((prev) => {
        // Build maps for fast lookup
        const prevMap = new Map(prev.map((o) => [o.orderId, o]));

        const merged = incoming.map((n) => {
          const p = prevMap.get(n.orderId);
          if (!p) return n;

          // Merge items by item_id, reusing references when unchanged
          const pItemsMap = new Map(p.items.map((it) => [it.item_id, it]));
          const nextItems = n.items.map((ni) => {
            const pi = pItemsMap.get(ni.item_id);
            if (pi && pi.quantity === ni.quantity && (pi.status || 'pending') === (ni.status || 'pending') && pi.item_name === ni.item_name) {
              return pi; // reuse to avoid re-render
            }
            return { ...pi, ...(ni as any) } as OrderItem;
          });

          const sameTop = p.status === n.status && (p.payment_status || 'pending') === (n.payment_status || 'pending');
          const sameLen = p.items.length === nextItems.length;
          const sameItemsRef = sameLen && nextItems.every((it, idx) => it === p.items[idx]);
          if (sameTop && sameItemsRef) return p; // nothing changed

          return { ...p, ...n, items: nextItems } as Order;
        });

        // If arrays are shallow-equal, return prev to avoid re-render
        if (merged.length === prev.length && merged.every((o, i) => o === prev[i])) {
          return prev;
        }
        return merged;
      });
    } finally {
      setLoading(false);
    }
  }, [mobile]);

  useEffect(() => {
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, [load]);

  return (
    <div className="max-w-md mx-auto pb-16 bg-white">
      <CustomerHeader title="Track Order" back />

      <div className="p-4">
        {loading ? (
          <LoadingBar />
        ) : orders.length === 0 ? (
          <div className="text-sm text-gray-600">No active orders.</div>
        ) : (
          <ul className="space-y-3">
            {orders.map((o) => (
              <OrderCard key={o.orderId} o={o} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


