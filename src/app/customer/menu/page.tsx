"use client";
import React, { useEffect, useMemo, useState } from "react";
import CustomerHeader from "@/components/customer/Header";
import LoadingBar from "@/components/customer/LoadingBar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CustomerMenu() {
  const { data: session } = useSession();
  const router = useRouter();
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);
  const [activeFoodType, setActiveFoodType] = useState<'all' | 'veg' | 'nveg'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [query, setQuery] = useState<string>("");
  const [tables, setTables] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<number | "">("");
  const [hasActiveOrder, setHasActiveOrder] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/menu");
        const data = await res.json();
        setMenu(data?.menu || []);
        // fetch tables for selection (for new order only)
        const tRes = await fetch("/api/tables");
        const tData = await tRes.json();
        const allTables = tData?.tables || [];
        // Only show available tables (availability === 0) when no active order
        setTables(allTables.filter((t: any) => Number(t.availability) === 0));
        // detect active order for this customer
        const mobile = (session?.user as any)?.mobile;
        if (mobile) {
          const oRes = await fetch(`/api/customer/orders?mobile=${encodeURIComponent(mobile)}`);
          const oData = await oRes.json();
          const activeOrder = Array.isArray(oData?.orders) ? oData.orders.find((o: any) => o.status !== 'completed') : null;
          setHasActiveOrder(!!activeOrder);
          if (activeOrder) {
            // lock table from the active order
            setSelectedTable(activeOrder.tableNumber || "");
          }
        }
      } catch (e) {
        setMenu([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [session?.user]);

  const addToCart = (m: any) => {
    setCart(prev => {
      const idx = prev.findIndex((x: any) => x.item_id === m.item_id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      }
      return [...prev, { item_id: m.item_id, item_name: m.item_name, price: m.item_price, quantity: 1 }];
    });
  };

  const subtotal = useMemo(() => cart.reduce((a, b) => a + b.price * b.quantity, 0), [cart]);

  const categories = useMemo(() => {
    const list = Array.from(new Set(menu.map((m: any) => m.item_type))).filter(Boolean);
    return ['all', ...list];
  }, [menu]);

  const filteredMenu = useMemo(() => {
    const q = query.trim().toLowerCase();
    return menu.filter((m: any) => {
      const itemType = String(m.item_foodtype || '').toLowerCase().replace(/[^a-z]/g, '');
      const byFood = activeFoodType === 'all'
        ? true
        : activeFoodType === 'veg'
          ? itemType === 'veg'
          : (itemType === 'nveg' || itemType === 'nonveg');
      const byCat = activeCategory === 'all' ? true : (m.item_type === activeCategory);
      const byQuery = q ? (
        m.item_name?.toLowerCase().includes(q) ||
        m.item_description?.toLowerCase().includes(q)
      ) : true;
      return byFood && byCat && byQuery;
    });
  }, [menu, activeFoodType, activeCategory, query]);

  if (loading) return (
    <div className="max-w-md mx-auto bg-white">
      <CustomerHeader title="Menu" back />
      <div className="p-4">
        <LoadingBar />
      </div>
    </div>
  );

  const placeOrder = async () => {
    const mobile = (session?.user as any)?.mobile;
    const name = (session?.user as any)?.name;
    if (!mobile) {
      router.push("/");
      return;
    }
    if (!hasActiveOrder && (selectedTable === "" || Number(selectedTable) <= 0)) {
      alert("Please select a table to continue");
      return;
    }
    const res = await fetch("/api/customer/placeOrder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart, mobile, name, tableNumber: hasActiveOrder ? undefined : Number(selectedTable) }),
    });
    const data = await res.json();
    if (data?.success) {
      setCart([]);
      router.push("/customer/track");
    }
  };

  return (
    <div className="max-w-md mx-auto pb-24 bg-white">
      <CustomerHeader title="Menu" back />
      <div className="px-4 py-2 bg-white">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search dishes..."
          className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
        />
      </div>

      <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar bg-white">
        {(['all','veg','nveg'] as const).map(ft => (
          <button
            key={ft}
            onClick={() => setActiveFoodType(ft)}
            className={`inline-flex items-center justify-center rounded-full text-sm border w-24 h-9 ${activeFoodType===ft? 'bg-black text-white border-black':'bg-white text-gray-700'}`}
          >
            {ft === 'all' ? 'All' : ft === 'veg' ? 'Veg' : 'Non-Veg'}
          </button>
        ))}
      </div>

      <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar bg-white">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`inline-flex items-center justify-center rounded-full text-sm border h-9 min-w-[96px] px-2 whitespace-nowrap ${activeCategory===cat? 'bg-black text-white border-black':'bg-white text-gray-700'}`}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      <ul className="divide-y">
        {filteredMenu.map((m) => {
          const qty = cart.find((x: any) => x.item_id === m.item_id)?.quantity || 0;
          const veg = (m.item_foodtype || '').toLowerCase() === 'veg';
          return (
            <li key={m.item_id} className="flex items-center gap-3 px-4 py-3">
              {m.item_thumbnail && (
                  <Image src={m.item_thumbnail} alt={m.item_name} className="w-14 h-14 rounded-lg object-cover" width={56} height={56} loading="lazy" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-3 h-3 rounded-sm border ${veg? 'bg-green-600 border-green-700':'bg-red-600 border-red-700'}`} />
                  <div className="text-sm font-medium truncate">{m.item_name}</div>
                </div>
                <div className="text-[11px] text-gray-500 line-clamp-1">{m.item_description}</div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{m.item_type}</span>
                  <span className="text-sm font-semibold">₹ {m.item_price}</span>
                </div>
              </div>
              {qty === 0 ? (
                <button onClick={() => addToCart(m)} className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-black text-white text-lg">+</button>
              ) : (
                <div className="shrink-0 inline-flex items-center gap-2">
                  <button
                    onClick={() => setCart(prev => {
                      const next = prev.map(x => x.item_id === m.item_id ? { ...x, quantity: x.quantity - 1 } : x).filter(x => x.quantity > 0);
                      return next;
                    })}
                    className="w-8 h-8 rounded-full border text-lg leading-none"
                  >-</button>
                  <span className="w-5 text-center text-sm">{qty}</span>
                  <button onClick={() => addToCart(m)} className="w-8 h-8 rounded-full border text-lg leading-none">+</button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="fixed left-0 right-0 bottom-20 z-40">
        <div className="max-w-md mx-auto bg-white/95 backdrop-blur shadow-lg rounded-2xl border px-4 py-3 mx-4 flex items-center gap-3">
          {!hasActiveOrder && (
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value === '' ? '' : Number(e.target.value))}
              className="border rounded-lg px-2 py-2 text-sm"
            >
              <option value="">Select table</option>
              {tables.map((t: any) => (
                <option key={t.id || t.tablenumber} value={t.tablenumber}>{`Table ${t.tablenumber}`}</option>
              ))}
            </select>
          )}
          <div className="flex-1">
            <div className="text-sm font-medium">{cart.length} item{cart.length!==1?'s':''} in cart</div>
            <div className="text-xs text-gray-500">Subtotal ₹ {subtotal}</div>
          </div>
          <button disabled={cart.length === 0 || (!hasActiveOrder && !selectedTable)} onClick={placeOrder} className="bg-black text-white rounded-xl px-4 py-2 text-sm disabled:opacity-50">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}


