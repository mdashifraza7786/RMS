"use client";

import React from "react";

interface TitleProps {
  role: string;
}

const roleLabels: Record<string, string> = {
  admin: "Admin Dashboard",
  waiter: "Waiter Dashboard",
  chef: "Chef Dashboard",
};

const roleSubtitles: Record<string, string> = {
  admin: "Overview of revenue, orders, and operations",
  waiter: "Your active tables and pending orders",
  chef: "Kitchen queue and order status",
};

const Title: React.FC<TitleProps> = ({ role }) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="px-6 lg:px-10 pt-6 pb-2">
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
        {roleLabels[role?.toLowerCase()] ?? `${role} Dashboard`}
      </h1>
      <div className="flex items-center gap-3 mt-1">
        <p className="text-sm text-gray-400">{roleSubtitles[role?.toLowerCase()] ?? ''}</p>
        <span className="text-gray-300 hidden sm:inline">·</span>
        <p className="text-sm text-gray-400 hidden sm:block">{today}</p>
      </div>
    </div>
  );
};

export default Title;
