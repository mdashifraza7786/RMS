"use client";

import React, { Suspense } from "react";
import { Bars } from "react-loader-spinner";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdRestaurantMenu } from "react-icons/md";
import Link from "next/link";

interface ActiveOrdersProps {
  showLeftArrow: boolean;
  showRightArrow: boolean;
  onScrollLeft: () => void;
  onScrollRight: () => void;
  sliderRef: React.RefObject<HTMLDivElement>;
  tableLoaded: boolean;
  orderedItems: any[];
  OrderQueueCard: React.ComponentType<any>;
}

const ActiveOrders: React.FC<ActiveOrdersProps> = ({
  showLeftArrow,
  showRightArrow,
  onScrollLeft,
  onScrollRight,
  sliderRef,
  tableLoaded,
  orderedItems,
  OrderQueueCard,
}) => {
  return (
    <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <MdRestaurantMenu className="text-amber-500" />
          Active Orders
        </h2>
        <Link href="/orders/active" className="text-sm text-primary hover:text-primary/80 font-medium flex items-center">
          View All
        </Link>
      </div>

      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={onScrollLeft}
            className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex justify-center items-center hover:bg-gray-50 transition-all z-10"
          >
            <MdKeyboardArrowLeft className="text-2xl text-gray-600" />
          </button>
        )}

        <div ref={sliderRef} className="flex gap-4 overflow-x-auto scroll-smooth pb-4 hide-scrollbar">
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-32 w-full">
                <span className="text-primary">
                  <Bars height="40" width="40" color="currentColor" ariaLabel="bars-loading" visible={true} />
                </span>
              </div>
            }
          >
            {tableLoaded ? (
              <div className="flex justify-center items-center h-32 w-full">
                <span className="text-primary">
                  <Bars height="40" width="40" color="currentColor" ariaLabel="bars-loading" visible={true} />
                </span>
              </div>
            ) : orderedItems.length > 0 ? (
              orderedItems.map((order) =>
                order.tablenumber > 0 ? (
                  <OrderQueueCard
                    key={order.orderid}
                    table={order.tablenumber.toString()}
                    waiter="Shyal Lal"
                    amount={(order.billing.subtotal + order.billing.subtotal * 0.18).toFixed(2)}
                    orid={order.orderid.toString()}
                    orderedItems={order.itemsordered}
                    start_time={order.start_time || "N/A"}
                  />
                ) : null
              )
            ) : (
              <div className="flex items-center justify-center h-32 w-full bg-gray-50 rounded-lg border border-dashed border-gray-200 px-4">
                <p className="text-gray-500 text-sm">No active orders at the moment</p>
              </div>
            )}
          </Suspense>
        </div>

        {showRightArrow && (
          <button
            onClick={onScrollRight}
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex justify-center items-center hover:bg-gray-50 transition-all z-10"
          >
            <MdKeyboardArrowRight className="text-2xl text-gray-600" />
          </button>
        )}
      </div>
    </section>
  );
};

export default ActiveOrders;


