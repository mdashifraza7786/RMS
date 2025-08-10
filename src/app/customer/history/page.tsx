"use client";
import { useEffect, useState } from "react";
import CustomerHeader from "@/components/customer/Header";
import LoadingBar from "@/components/customer/LoadingBar";
import { useSession } from "next-auth/react";

export default function CustomerHistory() {
  const { data: session } = useSession();
  const mobile = (session?.user as any)?.mobile;
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!mobile) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/customer/orders?mobile=${encodeURIComponent(mobile)}`);
      const data = await res.json();
      const paid = (data?.orders || []).filter((o: any) => o.payment_status === 'paid');
      setOrders(paid);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [mobile]);

  return (
    <div className="max-w-md mx-auto pb-16 bg-white">
      <CustomerHeader title="Order History" back />

      <div className="p-4">
        {loading ? (
          <LoadingBar />
        ) : orders.length === 0 ? (
          <div className="text-sm text-gray-600">No paid orders yet.</div>
        ) : (
          <ul className="space-y-3">
            {orders.map((o) => (
              <li key={o.orderId} className="bg-white rounded-xl border shadow-sm p-4">
                <div className="text-sm font-medium">Order #{o.orderId}</div>
                <ul className="mt-2 text-sm space-y-1">
                  {o.items.map((it: any) => (
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
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


