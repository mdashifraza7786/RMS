"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaDollarSign,
  FaMoneyBillWave,
  FaBox
} from "react-icons/fa";
import { LuLayoutGrid } from "react-icons/lu";
import { GrHomeRounded } from "react-icons/gr";
import { SlPeople } from "react-icons/sl";
import { MdOutlineInventory, MdBorderColor } from "react-icons/md";
import { PiChefHatThin } from "react-icons/pi";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { IoBarChartSharp } from "react-icons/io5";
import { RiMenu3Line } from 'react-icons/ri';
import { AiOutlineLogout } from "react-icons/ai";
import { signOut } from 'next-auth/react';

const NAV_ITEMS = [
  { 
    href: "/", 
    icon: <GrHomeRounded />, 
    label: "Dashboard", 
    roles: ["admin", "waiter", "chef"] 
  },
  { 
    href: "/orders", 
    icon: <MdBorderColor />, 
    label: "Orders", 
    roles: ["admin", "waiter", "chef"] 
  },
  { 
    href: "/payout", 
    icon: <FaDollarSign />, 
    label: "Payouts", 
    roles: ["admin","waiter","chef"] 
  },
  { 
    href: "/attendance", 
    icon: <SlPeople />, 
    label: "Attendance", 
    roles: ["admin","waiter","chef"] 
  },
  { 
    href: "/inventory", 
    icon: <MdOutlineInventory />, 
    label: "Inventory", 
    roles: ["admin", "chef"] 
  },
  { 
    href: "/members", 
    icon: <PiChefHatThin />, 
    label: "Members", 
    roles: ["admin"] 
  },
  { 
    href: "/menu", 
    icon: <MdOutlineRestaurantMenu />, 
    label: "Menu", 
    roles: ["admin","waiter","chef"] 
  },
  { 
    href: "/chart", 
    icon: <IoBarChartSharp />, 
    label: "Charts", 
    roles: ["admin"] 
  },
  { 
    href: "/expenses", 
    icon: <FaMoneyBillWave />, 
    label: "Expenses", 
    roles: ["admin"] 
  },
  { 
    href: "/tables", 
    icon: <LuLayoutGrid />, 
    label: "Tables", 
    roles: ["admin"] 
  },
  { 
    href: "/inventory-forecast", 
    icon: <FaBox />, 
    label: "Forecast", 
    roles: ["admin"] 
  }
];

const isPathActive = (href: string, path: string | null) => {
  if (!path) return false;
  if (href === '/') return path === '/';
  const escapedHref = href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`^${escapedHref}(?:/|$)`);
  return pattern.test(path);
};

const MobileNav: React.FC<{ role: string }> = ({ role }) => {
  const pathName = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  async function handleLogout() {
    await signOut({ callbackUrl: '/' });
    localStorage.removeItem('user');
  }

  const filteredNavItems = NAV_ITEMS.filter(item => item.roles.includes(role?.toLowerCase()));
  
  // Get 4 most important nav items for bottom bar
  const bottomNavItems = filteredNavItems.slice(0, 4);

  return (
    <>
      {/* Mobile header */}
      <header className="fixed top-0 left-0 right-0 bg-primary text-white shadow-md h-14 flex items-center justify-between px-4 z-30 lg:hidden">
        <h1 className="text-base font-medium">Restaurant Management System</h1>
        <div className="flex items-center">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2 rounded-full hover:bg-primaryhover"
          >
            <RiMenu3Line className="text-white text-xl" />
          </button>
        </div>
      </header>
      
      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile slide-out menu */}
      <div className={`fixed top-0 right-0 h-full w-3/4 max-w-xs bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 bg-primary text-white">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Menu</h3>
            <button onClick={() => setIsMenuOpen(false)} className="p-2">
              ✕
            </button>
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100%-64px)]">
          <div className="flex flex-col py-2">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 transition-all
                  ${isPathActive(item.href, pathName)
                    ? 'text-primary bg-primary/5 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'}
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 mt-2"
            >
              <span className="text-lg"><AiOutlineLogout /></span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom navigation removed as we now have the header */}
    </>
  );
};

export default MobileNav;
