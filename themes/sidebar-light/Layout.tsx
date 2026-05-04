import React, { useEffect } from 'react';
import MobileNav from "@/components/MobileNav";
import SidebarNav from "./SidebarNav"; // Import our custom theme SidebarNav
import './styles.css'; // Import Theme-specific CSS

interface SidebarDarkLayoutProps {
  children: React.ReactNode;
  role?: string;
  userid?: string;
}

const SidebarDarkLayout: React.FC<SidebarDarkLayoutProps> = ({ children, role, userid }) => {
  useEffect(() => {
    document.body.classList.add('sidebar-light-theme-active');
    return () => {
      document.body.classList.remove('sidebar-light-theme-active');
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900 font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0 shadow-2xl z-20">
        <SidebarNav role={role} />
      </div>

      {/* Mobile Navigation (using default MobileNav for now, could be customized) */}
      <div className="lg:hidden">
         {/* Since MobileNav usually pairs with Navbar, we might need a mobile top bar here if MobileNav doesn't provide it */}
         <MobileNav role={role} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="hidden lg:flex h-20 bg-white border-b border-gray-200 items-center justify-between px-8 z-10 shadow-sm sticky top-0">
          <div className="flex items-center">
            {/* Can add breadcrumbs or page title here dynamically if needed */}
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">RMS Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 py-2 px-4 rounded-full">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-sm">
                {role ? role.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-sm font-medium text-gray-700 capitalize">{role}</span>
            </div>
          </div>
        </header>
        
        {/* Children container */}
        <main className="flex-1 p-6 lg:p-8 bg-gray-50 w-full max-w-[1600px] mx-auto pb-24 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarDarkLayout;
