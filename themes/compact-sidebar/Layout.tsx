import React, { useEffect } from 'react';
import MobileNav from "@/components/MobileNav";
import CompactSidebarNav from "./CompactSidebarNav";

interface CompactSidebarLayoutProps {
  children: React.ReactNode;
  role?: string;
  userid?: string;
}

const CompactSidebarLayout: React.FC<CompactSidebarLayoutProps> = ({ children, role, userid }) => {
  useEffect(() => {
    document.body.classList.add('compact-sidebar-theme-active');
    return () => {
      document.body.classList.remove('compact-sidebar-theme-active');
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900 font-sans">
      {/* Desktop Compact Sidebar */}
      <div className="hidden lg:block w-20 flex-shrink-0 z-20 shadow-xl">
        <CompactSidebarNav role={role} />
      </div>

      <div className="lg:hidden">
         <MobileNav role={role} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="hidden lg:flex h-20 bg-white items-center justify-between px-8 z-10 shadow-sm sticky top-0">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">RMS <span className="font-normal text-gray-400 ml-2">Dashboard</span></h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-gray-50 py-2 px-4 rounded-xl border border-gray-100">
              <span className="text-sm font-medium text-gray-600 capitalize">{role}</span>
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold shadow-sm">
                {role ? role.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-6 lg:p-8 bg-gray-50 w-full max-w-[1600px] mx-auto pb-24 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CompactSidebarLayout;
