import React, { useEffect } from 'react';
import MobileNav from "@/components/MobileNav";
import FloatingNav from "./FloatingNav";

interface FloatingNavLayoutProps {
  children: React.ReactNode;
  role?: string;
  userid?: string;
}

const FloatingNavLayout: React.FC<FloatingNavLayoutProps> = ({ children, role, userid }) => {
  useEffect(() => {
    document.body.classList.add('floating-nav-theme-active');
    return () => {
      document.body.classList.remove('floating-nav-theme-active');
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-900 font-sans relative">
      {/* Desktop Floating Navigation */}
      <div className="hidden lg:block">
        <FloatingNav role={role} />
      </div>

      <div className="lg:hidden">
         <MobileNav role={role} />
      </div>

      {/* Main Content Area - Needs extra top padding to clear the floating nav */}
      <main className="w-full max-w-[1600px] mx-auto px-6 lg:px-8 pt-24 lg:pt-32 pb-24 lg:pb-12 min-h-screen flex flex-col">
        {/* We can provide a nice subtle header intro here for the active page */}
        <div className="mb-6 hidden lg:flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">RMS <span className="font-normal text-gray-400 ml-2">System</span></h1>
            <div className="flex items-center space-x-3 bg-white py-1.5 px-4 rounded-full shadow-sm border border-gray-100">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-medium text-gray-500">Connected as {role}</span>
            </div>
        </div>
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {children}
        </div>
      </main>
    </div>
  );
};

export default FloatingNavLayout;
