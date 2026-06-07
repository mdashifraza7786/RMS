import React, { useState } from 'react';
import { OrderedItems } from '@/hooks/useDashboardData';
import { IoClose } from 'react-icons/io5';
import { MdTableBar, MdPerson, MdOutlinePayments } from 'react-icons/md';
import { BiTimer } from 'react-icons/bi';

interface OrderQueueCardProps {
    table: string;
    waiter: string;
    waiterId?: string | null;
    amount: string;
    orid: string;
    orderedItems: OrderedItems[];
    start_time: string;
    onViewDetails?: () => void;
    chefId?: string | null;
    showAssignChef?: boolean;
    showAssignWaiter?: boolean;
}

const formatTime = (iso: string): string => {
    if (!iso) return 'N/A';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getElapsedMins = (startTime: string): number => {
    if (!startTime) return 0;
    const d = new Date(startTime);
    if (isNaN(d.getTime())) return 0;
    return Math.floor((Date.now() - d.getTime()) / 60000);
};

const getUrgency = (startTime: string) => {
    const mins = getElapsedMins(startTime);
    if (mins > 20) return {
        border: 'border-l-4 border-danger',
        badge: 'bg-danger text-white',
        label: `${mins}m ⚠`,
    };
    if (mins > 10) return {
        border: 'border-l-4 border-warning',
        badge: 'bg-warning text-white',
        label: `${mins}m`,
    };
    return {
        border: 'border-l-4 border-success',
        badge: 'bg-success/10 text-success',
        label: `${mins}m`,
    };
};

const OrderQueueCard: React.FC<OrderQueueCardProps> = ({
    table, waiter, waiterId, amount, orid, orderedItems, start_time,
    onViewDetails, chefId, showAssignChef = false, showAssignWaiter = false,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [assignChefOpen, setAssignChefOpen] = useState(false);
    const [assignWaiterOpen, setAssignWaiterOpen] = useState(false);
    const [chefs, setChefs] = useState<{ userid: string; name: string }[]>([]);
    const [waiters, setWaiters] = useState<{ userid: string; name: string }[]>([]);
    const [selectedChef, setSelectedChef] = useState(chefId || '');
    const [selectedWaiter, setSelectedWaiter] = useState(waiterId || '');
    const [loadingChefs, setLoadingChefs] = useState(false);
    const [loadingWaiters, setLoadingWaiters] = useState(false);
    const [assigning, setAssigning] = useState(false);

    const subtotal = orderedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const gst = subtotal * 0.18;
    const totalAmount = subtotal + gst;
    const urgency = getUrgency(start_time);

    const loadMembers = async (role: 'chef' | 'waiter') => {
        if (role === 'chef') setLoadingChefs(true);
        else setLoadingWaiters(true);
        try {
            const res = await fetch('/api/members?limit=200');
            const responseData = await res.json();
            const raw = responseData?.data;
            const all: any[] = Array.isArray(raw) ? raw : (Array.isArray(raw?.members) ? raw.members : []);
            const filtered = all.filter((u: any) => (u.role || '').toLowerCase() === role);
            const mapped = filtered.map((m: any) => ({ userid: m.userid, name: m.name }));
            if (role === 'chef') setChefs(mapped);
            else setWaiters(mapped);
        } catch (err) {
            console.error(`Failed to load ${role}s:`, err);
        } finally {
            if (role === 'chef') setLoadingChefs(false);
            else setLoadingWaiters(false);
        }
    };

    const statusChip = (status?: string) => {
        const s = (status || 'pending').toLowerCase();
        const map: Record<string, { bg: string; text: string; label: string }> = {
            ordered:   { bg: 'bg-gray-100',   text: 'text-gray-700',   label: 'Pending' },
            pending:   { bg: 'bg-gray-100',   text: 'text-gray-700',   label: 'Pending' },
            preparing: { bg: 'bg-amber-100',  text: 'text-amber-800',  label: 'Preparing' },
            ready:     { bg: 'bg-green-100',  text: 'text-green-800',  label: 'Ready' },
            served:    { bg: 'bg-blue-100',   text: 'text-blue-800',   label: 'Served' },
        };
        const { bg, text, label } = map[s] || map.pending;
        return <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${bg} ${text}`}>{label}</span>;
    };

    return (
        <>
            <div className={`min-w-[260px] max-w-[280px] bg-white shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 ${urgency.border}`}>
                <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                                <MdTableBar size={20} />
                            </div>
                            <div>
                                <h3 className="font-mono font-bold text-gray-800 tabular-nums">Table #{table}</h3>
                                <p className="text-xs text-gray-400 uppercase tracking-wide">Order #{orid}</p>
                            </div>
                        </div>
                        <span className={`text-xs font-mono font-semibold px-2 py-1 rounded-full ${urgency.badge}`}>
                            {urgency.label}
                        </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-1.5">
                        <MdPerson className="mr-2 text-gray-300 flex-shrink-0" />
                        <span className="truncate">{waiter}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-1.5">
                        <BiTimer className="mr-2 text-gray-300 flex-shrink-0" />
                        <span>Started {formatTime(start_time)}</span>
                    </div>
                    <div className="flex items-center text-sm font-semibold text-gray-900 mb-4">
                        <MdOutlinePayments className="mr-2 text-gray-400 flex-shrink-0" />
                        <span className="font-mono tabular-nums">₹{amount}</span>
                    </div>

                    <div className="flex items-center justify-between border-t pt-3 gap-2 flex-wrap">
                        <span className="text-xs text-gray-400 font-mono">{orderedItems.length} item{orderedItems.length !== 1 ? 's' : ''}</span>
                        <div className="flex gap-1.5 flex-wrap">
                            <button
                                className="px-2.5 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Details
                            </button>
                            {showAssignChef && (
                                <button
                                    className="px-2.5 py-1.5 text-xs font-medium bg-warning text-white rounded-lg hover:bg-warning/90 transition-colors"
                                    onClick={() => { setAssignChefOpen(true); loadMembers('chef'); }}
                                >
                                    Chef
                                </button>
                            )}
                            {showAssignWaiter && (
                                <button
                                    className="px-2.5 py-1.5 text-xs font-medium bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                                    onClick={() => { setAssignWaiterOpen(true); loadMembers('waiter'); }}
                                >
                                    Waiter
                                </button>
                            )}
                            {onViewDetails && (
                                <button
                                    className="px-2.5 py-1.5 text-xs font-medium bg-success text-white rounded-lg hover:bg-success/90 transition-colors"
                                    onClick={onViewDetails}
                                >
                                    Open
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fade-in">
                    <div className="bg-white rounded-xl w-[420px] shadow-2xl relative p-6 max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
                        <div className="flex justify-between items-center border-b pb-3">
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                <MdTableBar className="text-primary mr-2" size={22} />
                                Order Details
                            </h2>
                            <button className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setIsModalOpen(false)}>
                                <IoClose size={24} />
                            </button>
                        </div>
                        <div className="mt-3 text-gray-700 text-sm grid grid-cols-2 gap-2">
                            <p><span className="text-xs uppercase tracking-widest text-gray-400">Table</span><br /><span className="font-mono font-semibold text-primary">#{table}</span></p>
                            <p><span className="text-xs uppercase tracking-widest text-gray-400">Order ID</span><br /><span className="font-mono font-semibold">{orid}</span></p>
                            <p><span className="text-xs uppercase tracking-widest text-gray-400">Waiter</span><br />{waiter}</p>
                            <p><span className="text-xs uppercase tracking-widest text-gray-400">Started</span><br />{formatTime(start_time)}</p>
                        </div>
                        <div className="mt-4 flex-grow overflow-hidden flex flex-col">
                            <h3 className="font-medium text-gray-700 text-xs uppercase tracking-widest mb-2">Ordered Items</h3>
                            <ul className="overflow-y-auto space-y-2 flex-grow pr-1">
                                {orderedItems.length > 0 ? orderedItems.map((item) => (
                                    <li key={item.item_id} className="flex justify-between items-center bg-gray-50 rounded-lg py-2 px-3">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-800">{item.item_name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-400 font-mono">₹{Number(item.price).toFixed(2)} each</span>
                                                {statusChip(item.status)}
                                            </div>
                                        </div>
                                        <span className="bg-primary/10 text-primary px-2 py-1 rounded font-mono text-sm font-semibold">{item.quantity}×</span>
                                    </li>
                                )) : (
                                    <p className="text-center text-gray-400 py-4">No items found.</p>
                                )}
                            </ul>
                        </div>
                        <div className="mt-4 pt-3 border-t space-y-1 text-sm">
                            <p className="flex justify-between text-gray-500"><span>Subtotal</span><span className="font-mono tabular-nums">₹{subtotal.toFixed(2)}</span></p>
                            <p className="flex justify-between text-gray-500"><span>GST (18%)</span><span className="font-mono tabular-nums">₹{gst.toFixed(2)}</span></p>
                            <p className="flex justify-between font-bold text-base mt-1 text-gray-800"><span>Total</span><span className="font-mono text-primary tabular-nums">₹{totalAmount.toFixed(2)}</span></p>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Chef Modal */}
            {assignChefOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fade-in">
                    <div className="bg-white rounded-xl w-[360px] shadow-2xl p-6 animate-slide-up">
                        <div className="flex justify-between items-center border-b pb-3 mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Assign Chef</h2>
                            <button className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100" onClick={() => setAssignChefOpen(false)}><IoClose size={22} /></button>
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs uppercase tracking-widest text-gray-400 block">Select Chef</label>
                            {loadingChefs ? (
                                <div className="w-full border rounded-lg px-3 py-2.5 flex items-center gap-2 text-sm text-gray-400 bg-gray-50">
                                    <svg className="animate-spin h-4 w-4 text-warning flex-shrink-0" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                    </svg>
                                    Loading chefs…
                                </div>
                            ) : (
                                <select className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-warning/30 focus:outline-none" value={selectedChef} onChange={(e) => setSelectedChef(e.target.value)}>
                                    <option value="">{chefs.length === 0 ? '— No chefs found —' : '-- Select --'}</option>
                                    {chefs.map((c) => <option key={c.userid} value={c.userid}>{c.name} ({c.userid})</option>)}
                                </select>
                            )}
                            <button
                                disabled={!selectedChef || loadingChefs || assigning}
                                className="w-full py-2.5 text-sm font-semibold bg-warning text-white rounded-lg disabled:opacity-50 hover:bg-warning/90 transition-colors flex items-center justify-center gap-2"
                                onClick={async () => {
                                    if (!selectedChef) return;
                                    setAssigning(true);
                                    try {
                                        await fetch('/api/order/assignChef', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ orderid: Number(orid), chefid: selectedChef }),
                                        });
                                        setAssignChefOpen(false);
                                    } catch (err) {
                                        console.error('Assign chef failed:', err);
                                    } finally {
                                        setAssigning(false);
                                    }
                                }}
                            >
                                {assigning ? (
                                    <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Assigning…</>
                                ) : 'Assign Chef'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Waiter Modal */}
            {assignWaiterOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fade-in">
                    <div className="bg-white rounded-xl w-[360px] shadow-2xl p-6 animate-slide-up">
                        <div className="flex justify-between items-center border-b pb-3 mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Assign Waiter</h2>
                            <button className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100" onClick={() => setAssignWaiterOpen(false)}><IoClose size={22} /></button>
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs uppercase tracking-widest text-gray-400 block">Select Waiter</label>
                            {loadingWaiters ? (
                                <div className="w-full border rounded-lg px-3 py-2.5 flex items-center gap-2 text-sm text-gray-400 bg-gray-50">
                                    <svg className="animate-spin h-4 w-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                    </svg>
                                    Loading waiters…
                                </div>
                            ) : (
                                <select className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent/30 focus:outline-none" value={selectedWaiter} onChange={(e) => setSelectedWaiter(e.target.value)}>
                                    <option value="">{waiters.length === 0 ? '— No waiters found —' : '-- Select --'}</option>
                                    {waiters.map((w) => <option key={w.userid} value={w.userid}>{w.name} ({w.userid})</option>)}
                                </select>
                            )}
                            <button
                                disabled={!selectedWaiter || loadingWaiters || assigning}
                                className="w-full py-2.5 text-sm font-semibold bg-accent text-white rounded-lg disabled:opacity-50 hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
                                onClick={async () => {
                                    if (!selectedWaiter) return;
                                    setAssigning(true);
                                    try {
                                        await fetch('/api/order/assignWaiter', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ orderid: Number(orid), waiterid: selectedWaiter }),
                                        });
                                        setAssignWaiterOpen(false);
                                    } catch (err) {
                                        console.error('Assign waiter failed:', err);
                                    } finally {
                                        setAssigning(false);
                                    }
                                }}
                            >
                                {assigning ? (
                                    <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Assigning…</>
                                ) : 'Assign Waiter'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderQueueCard;
