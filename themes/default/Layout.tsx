import React from 'react';
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";

interface DefaultLayoutProps {
  children: React.ReactNode;
  role?: string;
  userid?: string;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children, role, userid }) => {
  return (
    <div>
      <Navbar role={role} userid={userid} />
      <MobileNav role={role} />
      <div className="min-h-screen px-2 sm:px-4 md:px-[8vw] pt-16 lg:pt-0">
        {children}
      </div>
    </div>
  );
};

export default DefaultLayout;
