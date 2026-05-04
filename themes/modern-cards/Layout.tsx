import React, { useEffect } from 'react';
import MobileNav from "@/components/MobileNav";
import CardNav from "./CardNav";

interface ModernCardsLayoutProps {
  children: React.ReactNode;
  role?: string;
  userid?: string;
}

const ModernCardsLayout: React.FC<ModernCardsLayoutProps> = ({ children, role, userid }) => {
  useEffect(() => {
    document.body.classList.add('modern-cards-theme-active');
    return () => {
      document.body.classList.remove('modern-cards-theme-active');
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 text-gray-900 font-sans lg:p-6 xl:p-12 relative flex flex-col">
      {/* 
        The Boxed Canvas Layout wraps the entire app in a centered card 
        with a soft shadow, standing out from the gray background.
      */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto bg-white lg:rounded-3xl shadow-2xl lg:border border-gray-300 flex flex-col overflow-hidden relative">
        
        {/* Desktop Navigation */}
        <div className="hidden lg:block relative z-20">
          <CardNav role={role} />
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
           <MobileNav role={role} />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50/30">
            {children}
        </main>
      </div>
    </div>
  );
};

export default ModernCardsLayout;
