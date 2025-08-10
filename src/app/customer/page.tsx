"use client";
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Bars } from 'react-loader-spinner';

type View = 'login' | 'menu' | 'orders' | 'track';

interface Customer {
  id: number;
  name: string;
  email?: string;
  mobile?: string;
}

interface MenuItem {
  item_id: string;
  item_name: string;
  item_price: number;
}

export default function CustomerHome() {
  const [view, setView] = useState<View>('login');
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<Record<string, { item: MenuItem; qty: number }>>({});

  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    document.title = 'Customer';
  }, []);

  const subtotal = useMemo(() => {
    return Object.values(cart).reduce((sum, line) => sum + line.item.item_price * line.qty, 0);
  }, [cart]);

  const handleLogin = async () => {
    if (!email && !mobile) return;
    setLoading(true);
    try {
      const res = await axios.post('/api/customer/login', { email, mobile, name });
      setCustomer(res.data.customer);
      setView('menu');
      const menuRes = await axios.get('/api/menu');
      setMenu(menuRes.data?.menu || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (mi: MenuItem) => {
    setCart(prev => {
      const next = { ...prev };
      next[mi.item_id] = next[mi.item_id] ? { item: mi, qty: next[mi.item_id].qty + 1 } : { item: mi, qty: 1 };
      return next;
    });
  };

  const placeOrder = async () => {
    if (!customer || Object.keys(cart).length === 0) return;
    setLoading(true);
    try {
      const items = Object.values(cart).map(({ item, qty }) => ({ item_id: item.item_id, item_name: item.item_name, quantity: qty, price: item.item_price }));
      const gst = Math.round(subtotal * 0.18);
      const totalAmount = subtotal + gst;
      const payload = { items, subtotal, gst, totalAmount, customerName: customer.name, customerMobile: customer.mobile };
      const res = await axios.post('/api/customer/placeOrder', payload);
      if (res.data?.success) {
        setCart({});
        setView('track');
        await fetchOrders();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    if (!customer?.mobile) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/customer/orders?mobile=${encodeURIComponent(customer.mobile)}`);
      setOrders(res.data?.orders || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const SectionCard: React.FC<{ title: string; children: React.ReactNode; right?: React.ReactNode }>= ({ title, children, right }) => (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {right}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );

  return (
    <div className="container mx-auto px-6 pt-4 pb-8">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Customer</h1>
        <p className="text-gray-500 text-sm mt-1">Order from the menu, track and view your orders</p>
      </header>

      {loading && (
        <div className="flex justify-center items-center py-6"><Bars height={40} width={40} color="#25476A"/></div>
      )}

      {view === 'login' && (
        <SectionCard title="Login" right={null}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Name</label>
              <input className="p-2 border border-gray-200 rounded-md w-full" value={name} onChange={e=>setName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Email</label>
              <input className="p-2 border border-gray-200 rounded-md w-full" value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Mobile</label>
              <input className="p-2 border border-gray-200 rounded-md w-full" value={mobile} onChange={e=>setMobile(e.target.value)} />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleLogin} className="px-4 py-2 rounded-lg text-white bg-primary hover:bg-primary/80">Continue</button>
          </div>
        </SectionCard>
      )}

      {view === 'menu' && (
        <SectionCard title="Menu" right={<button onClick={()=>setView('orders')} className="px-3 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200">My Orders</button>}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menu.map(m => (
              <div key={m.item_id} className="border rounded-lg p-4 hover:shadow-sm">
                <div className="font-medium text-gray-800">{m.item_name}</div>
                <div className="text-sm text-gray-600">₹ {Number(m.item_price).toFixed(2)}</div>
                <button className="mt-3 px-3 py-1.5 rounded bg-primary text-white text-sm" onClick={()=>addToCart(m)}>Add</button>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="font-semibold text-gray-800 mb-2">Cart</div>
            {Object.keys(cart).length === 0 ? (
              <div className="text-sm text-gray-500">No items</div>
            ) : (
              <>
                {Object.values(cart).map(({ item, qty }) => (
                  <div key={item.item_id} className="flex justify-between text-sm py-1">
                    <div>{item.item_name} x {qty}</div>
                    <div>₹ {(item.item_price * qty).toFixed(2)}</div>
                  </div>
                ))}
                <div className="flex justify-between font-medium mt-2">
                  <div>Subtotal</div>
                  <div>₹ {subtotal.toFixed(2)}</div>
                </div>
                <div className="flex justify-end mt-3">
                  <button onClick={placeOrder} className="px-4 py-2 rounded-lg text-white bg-primary hover:bg-primary/80">Place Order</button>
                </div>
              </>
            )}
          </div>
        </SectionCard>
      )}

      {view === 'orders' && (
        <SectionCard title="My Orders" right={<button onClick={()=>{setView('menu')}} className="px-3 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200">Back to Menu</button>}>
          <button onClick={fetchOrders} className="mb-3 px-3 py-2 text-sm rounded-lg bg-primary text-white">Refresh</button>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Order ID','Date','Status','Amount','Payment'].map(h=> <th key={h} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>)}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map(o => (
                <tr key={o.order_id}>
                  <td className="px-4 py-2 text-sm">#{o.order_id}</td>
                  <td className="px-4 py-2 text-sm">{o.generated_at ? new Date(o.generated_at).toLocaleString() : '—'}</td>
                  <td className="px-4 py-2 text-sm">{o.order_status || 'pending'}</td>
                  <td className="px-4 py-2 text-sm">₹ {Number(o.total_amount || 0).toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm">{o.payment_status || 'unpaid'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      )}

      {view === 'track' && (
        <SectionCard title="Track Order" right={<button onClick={()=>setView('orders')} className="px-3 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200">My Orders</button>}>
          <div className="text-sm text-gray-600">Your latest order has been placed. You can monitor its status in "My Orders". Status is updated as the kitchen progresses.</div>
          <button onClick={fetchOrders} className="mt-3 px-3 py-2 text-sm rounded-lg bg-primary text-white">Refresh Status</button>
        </SectionCard>
      )}
    </div>
  );
}


