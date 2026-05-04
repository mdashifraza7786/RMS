"use client";
import React from 'react';
import { useSession } from "next-auth/react";
import DefaultDashboard from "@/components/Dashboard";

// This is a Theme Override for the Dashboard!
export default function SidebarDarkDashboard() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  // We can still use the core Dashboard logic, but we could also build an entirely custom UI here!
  // For demonstration, let's wrap the default dashboard in a radically different thematic container,
  // or build a completely custom welcome header.
  
  return (
    <div className="w-full h-full text-gray-100 bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-800">
      <div className="mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          Welcome back, {(session?.user as any)?.name || 'Staff'}!
        </h1>
        <p className="text-gray-400 mt-2 font-medium">
          Sidebar Dark Theme Active • Logged in as <span className="uppercase text-accent">{role}</span>
        </p>
      </div>

      {/* 
        We render the standard Dashboard component here so we don't break the existing logic, 
        but because we are in the sidebar-dark theme, any Tailwind classes inside DefaultDashboard 
        will inherit our dark mode parent context if they use dark: modifier, or we can completely 
        rewrite the Dashboard UI from scratch here.
      */}
      <div className="theme-override-container">
        <DefaultDashboard />
      </div>

      {/* Inject theme-specific CSS for the dashboard overrides */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Force the default dashboard cards to look dark and sleek */
        .theme-override-container .bg-white {
          background-color: #1f2937 !important; /* gray-800 */
          border-color: #374151 !important; /* gray-700 */
          color: #f3f4f6 !important; /* gray-100 */
        }
        .theme-override-container .text-gray-800,
        .theme-override-container .text-gray-700,
        .theme-override-container .text-gray-900 {
          color: #f9fafb !important; /* gray-50 */
        }
        .theme-override-container .text-gray-500,
        .theme-override-container .text-gray-600 {
          color: #9ca3af !important; /* gray-400 */
        }
        .theme-override-container .border-gray-100,
        .theme-override-container .border-gray-200 {
          border-color: #374151 !important;
        }
        .theme-override-container .shadow-sm,
        .theme-override-container .shadow-md {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.25) !important;
        }
      `}} />
    </div>
  );
}
