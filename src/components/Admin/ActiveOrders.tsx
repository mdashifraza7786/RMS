"use client";

import React, { Suspense } from "react";
import Skeleton from "../ui/Skeleton";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import Link from "next/link";

interface ActiveOrdersProps {
  showLeftArrow: boolean;
  showRightArrow: boolean;
  onScrollLeft: () => void;
  onScrollRight: () => void;
  sliderRef: React.RefObject<HTMLDivElement>;
  isTableLoading: boolean;
  orderedItems: any[];
  OrderQueueCard: React.ComponentType<any>;
  onViewOrder: (tablenumber: number) => void;
  canAssignChef?: boolean;
  canAssignWaiter?: boolean;
}

const EmptyOrders = () => (
  <div className="flex flex-col items-center justify-center h-32 w-full bg-gray-50 rounded-xl border border-dashed border-gray-200 gap-3">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-gray-300">
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
      <path d="M13 20h14M20 13v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <circle cx="20" cy="20" r="5" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
    </svg>
    <p className="text-gray-400 text-sm">No active orders right now</p>
  </div>
);

const ActiveOrders: React.FC<ActiveOrdersProps> = ({
  showLeftArrow,
  showRightArrow,
  onScrollLeft,
  onScrollRight,
  sliderRef,
  isTableLoading,
  orderedItems,
  OrderQueueCard,
  onViewOrder,
  canAssignChef = false,
  canAssignWaiter = false,
}) => {
  return (
    <section className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 mb-6 sm:mb-8">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-5">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2.5">
          <span className="w-1 h-5 bg-warning rounded-full inline-block flex-shrink-0" />
          Active Orders
          {!isTableLoading && orderedItems.length > 0 && (
            <span className="ml-1 bg-warning/10 text-warning text-xs font-mono font-semibold px-2 py-0.5 rounded-full">
              {orderedItems.filter(o => o.tablenumber > 0).length}
            </span>
          )}
        </h2>
        <Link href="/orders/active" className="text-xs sm:text-sm text-accent hover:text-accent/80 font-medium flex items-center gap-1 transition-colors">
          View All
        </Link>
      </div>

      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={onScrollLeft}
            className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex justify-center items-center hover:bg-gray-50 transition-all z-10"
          >
            <MdKeyboardArrowLeft className="text-2xl text-gray-600" />
          </button>
        )}

        <div ref={sliderRef} className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth pb-2 scrollbar-hide">
          <Suspense
            fallback={
              <div className="flex gap-4 w-full">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} variant="rect" width="280px" height="160px" className="flex-shrink-0 rounded-xl" />
                ))}
              </div>
            }
          >
            {isTableLoading ? (
              <div className="flex gap-4 w-full">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} variant="rect" width="280px" height="160px" className="flex-shrink-0 rounded-xl" />
                ))}
              </div>
            ) : orderedItems.filter(o => o.tablenumber > 0).length > 0 ? (
              orderedItems.map((order, index) =>
                order.tablenumber > 0 ? (
                  <div
                    key={order.orderid}
                    className="animate-slide-up flex-shrink-0"
                    style={{ animationDelay: `${index * 55}ms` }}
                  >
                    <OrderQueueCard
                      table={order.tablenumber.toString()}
                      waiter={order.waiter_name || "Not assigned"}
                      waiterId={order.waiter_id || null}
                      amount={(Number(order.billing.subtotal) + Number(order.billing.subtotal) * 0.18).toFixed(2)}
                      orid={order.orderid.toString()}
                      orderedItems={order.itemsordered}
                      start_time={order.start_time || ""}
                      chefId={order.chef_id || null}
                      onViewDetails={() => onViewOrder(order.tablenumber)}
                      showAssignChef={canAssignChef}
                      showAssignWaiter={canAssignWaiter}
                    />
                  </div>
                ) : null
              )
            ) : (
              <EmptyOrders />
            )}
          </Suspense>
        </div>

        {showRightArrow && (
          <button
            onClick={onScrollRight}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex justify-center items-center hover:bg-gray-50 transition-all z-10"
          >
            <MdKeyboardArrowRight className="text-2xl text-gray-600" />
          </button>
        )}
      </div>
    </section>
  );
};

export default ActiveOrders;
