import React, { useMemo } from 'react';
import { MenuData } from './types';
import { FaPlus, FaMinus } from 'react-icons/fa';

interface MenuDisplayProps {
    filteredData: MenuData[];
    selectedItems: { item: MenuData; quantity: number }[];
    handleItemSelect: (item: MenuData) => void;
    handleQuantityChange: (itemId: string, newQuantity: string) => void;
    loading?: boolean;
}

const SkeletonCard = () => (
    <div className="border border-gray-100 rounded-xl overflow-hidden bg-white animate-pulse">
        <div className="h-28 bg-gray-200" />
        <div className="p-2 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
    </div>
);

const MenuDisplay: React.FC<MenuDisplayProps> = ({
    filteredData,
    selectedItems,
    handleItemSelect,
    handleQuantityChange,
    loading = false,
}) => {
    const groupedMenu = useMemo(() => {
        return filteredData.reduce((acc, item) => {
            const type = item.item_type || 'Uncategorized';
            if (!acc[type]) acc[type] = [];
            acc[type].push(item);
            return acc;
        }, {} as Record<string, MenuData[]>);
    }, [filteredData]);

    // ── Loading skeleton ──────────────────────────────────────────
    if (loading) {
        return (
            <div className="w-full h-full overflow-y-auto pr-2 pb-10">
                {/* Top progress bar */}
                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-primary rounded-full animate-[loading-bar_1.2s_ease-in-out_infinite]" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[...Array(12)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
                <style jsx global>{`
                    @keyframes loading-bar {
                        0%   { width: 0%;   margin-left: 0; }
                        50%  { width: 60%;  margin-left: 20%; }
                        100% { width: 0%;   margin-left: 100%; }
                    }
                `}</style>
            </div>
        );
    }

    // ── Empty state (only after loading is done) ──────────────────
    if (filteredData.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 border border-gray-100 rounded-lg gap-2">
                <span className="text-4xl">🍽️</span>
                <p className="font-medium text-gray-500">No menu items found</p>
                <p className="text-sm">Try a different search term</p>
            </div>
        );
    }

    // ── Menu grid ─────────────────────────────────────────────────
    return (
        <div className="w-full h-full overflow-y-auto pr-2 pb-10 custom-scrollbar rounded-lg">
            {Object.entries(groupedMenu).map(([type, items]) => (
                <div key={type} className="mb-6">
                    <h3 className="font-bold text-lg text-gray-800 mb-3 sticky top-0 bg-white/90 backdrop-blur pb-2 z-10 border-b border-gray-100 capitalize">
                        {type}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {items.map(item => {
                            const selectedEntry = selectedItems.find(entry => entry.item.item_id === item.item_id);
                            const quantity = selectedEntry ? selectedEntry.quantity : 0;
                            return (
                                <div
                                    key={item.item_id}
                                    onClick={() => handleItemSelect(item)}
                                    className={`border ${quantity > 0 ? 'border-primary shadow-md' : 'border-gray-100 shadow-sm'} rounded-xl overflow-hidden hover:shadow-md hover:border-primary/50 cursor-pointer transition-all flex flex-col group bg-white`}
                                >
                                    <div className="h-28 bg-gray-100 w-full overflow-hidden relative">
                                        {item.item_thumbnail ? (
                                            <img
                                                src={item.item_thumbnail}
                                                alt={item.item_name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/fallback-food.png';
                                                    (e.target as HTMLImageElement).onerror = null;
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 flex-col group-hover:bg-gray-100 transition-colors">
                                                <span className="text-3xl mt-1 opacity-50">🍽️</span>
                                            </div>
                                        )}
                                        {item.item_foodtype && (
                                            <div className="absolute top-2 right-2">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm ${
                                                    item.item_foodtype.toLowerCase() === 'veg'
                                                        ? 'bg-green-100 text-green-700 border border-green-200'
                                                        : item.item_foodtype.toLowerCase() === 'non-veg'
                                                        ? 'bg-red-100 text-red-700 border border-red-200'
                                                        : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                                }`}>
                                                    {item.item_foodtype}
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-gray-900/80 to-transparent p-2 pt-8 flex justify-between items-end">
                                            <span className="text-white font-bold text-sm">₹{item.item_price}</span>
                                            {quantity > 0 && (
                                                <div
                                                    className="flex items-center bg-white rounded-md shadow-sm border border-gray-200"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <button
                                                        className="p-1.5 text-primary hover:bg-gray-100 rounded-l-md transition-colors"
                                                        onClick={() => handleQuantityChange(item.item_id, (quantity - 1).toString())}
                                                    >
                                                        <FaMinus size={10} />
                                                    </button>
                                                    <span className="text-xs font-bold text-gray-800 px-2 min-w-[24px] text-center">{quantity}</span>
                                                    <button
                                                        className="p-1.5 text-primary hover:bg-gray-100 rounded-r-md transition-colors"
                                                        onClick={() => handleQuantityChange(item.item_id, (quantity + 1).toString())}
                                                    >
                                                        <FaPlus size={10} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-2 flex flex-col flex-grow justify-between">
                                        <h4 className="font-medium text-sm text-gray-800 line-clamp-2 leading-tight" title={item.item_name}>
                                            {item.item_name}
                                        </h4>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MenuDisplay;
