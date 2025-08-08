"use client";

import React from "react";
import RecentTableOrders from "@/components/RecentTableOrders";
const RecentPaymentCard = React.lazy(() => import("@/components/RecentPaymentCard"));

const RecentSection: React.FC = () => {
  return (
    <div className="flex gap-6 w-full">
      <RecentTableOrders />
      {/* RecentPaymentCard is already lazy in consumer; keep import consistent */}
      {/* @ts-ignore - rendered where Suspense exists in parent */}
      <RecentPaymentCard />
    </div>
  );
};

export default RecentSection;


