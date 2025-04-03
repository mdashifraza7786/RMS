"use client"
import React from 'react';
import Link from 'next/link';
import { BsPersonCircle } from 'react-icons/bs';
import { Raleway } from 'next/font/google';
import { AiOutlineLogout } from "react-icons/ai";
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  GrHomeRounded, 
  GrRestaurant 
} from "react-icons/gr";
import { 
  FaDollarSign,
  FaTableCells
} from "react-icons/fa6";
import { SlPeople } from "react-icons/sl";
import { MdOutlineInventory, MdBorderColor } from "react-icons/md";
import { PiChefHatThin } from "react-icons/pi";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { IoBarChartSharp } from "react-icons/io5";

const raleway = Raleway({
    weight: ['400', '500', '600'],
    subsets: ['latin'],
});

const AdminNavbar: React.FC = () => {
    const pathName = usePathname();
    
    async function handleLogout() {
        await signOut({ callbackUrl: '/' });
        localStorage.removeItem('user');
    }
    
    return (
        <div className={` w-full sticky top-0 z-50 shadow-sm `}>
            {/* Top navbar */}
            <div className="bg-[#1e4569] text-white px-[8vw]">
                <div className="container mx-auto px-4  flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <GrRestaurant className="w-5 h-5 mr-2 text-white" />
                        <span className="font-semibold">Restaurant Management System</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 cursor-pointer bg-[#2c5983] hover:bg-[#386890] transition-colors px-3 py-1.5 rounded">
                            <BsPersonCircle className="w-4 h-4" />
                            <span>Admin</span>
                        </div>
                        <div 
                            onClick={handleLogout}
                            className="flex items-center gap-2 cursor-pointer bg-[#2c5983] hover:bg-[#386890] transition-colors px-3 py-1.5 rounded"
                        >
                            <AiOutlineLogout className="w-4 h-4" />
                            <span>Logout</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Navigation menu */}
            <div className="bg-white border-b px-[8vw]">
                <div className="container mx-auto">
                    <div className="flex items-center h-14 overflow-x-auto no-scrollbar">
                        <NavItem 
                            href="/" 
                            icon={<GrHomeRounded className="w-4 h-4" />} 
                            label="Dashboard" 
                            isActive={pathName === '/'} 
                        />
                        <NavItem 
                            href="/orders" 
                            icon={<MdBorderColor className="w-4 h-4" />} 
                            label="Orders" 
                            isActive={pathName?.includes('/orders')} 
                        />
                        <NavItem 
                            href="/payout" 
                            icon={<FaDollarSign className="w-4 h-4" />} 
                            label="Payouts" 
                            isActive={pathName?.includes('/payout')} 
                        />
                        <NavItem 
                            href="/attendance" 
                            icon={<SlPeople className="w-4 h-4" />} 
                            label="Attendance" 
                            isActive={pathName?.includes('/attendance')} 
                        />
                        <NavItem 
                            href="/inventory" 
                            icon={<MdOutlineInventory className="w-4 h-4" />} 
                            label="Inventory" 
                            isActive={pathName?.includes('/inventory')} 
                        />
                        <NavItem 
                            href="/members" 
                            icon={<PiChefHatThin className="w-4 h-4" />} 
                            label="Members" 
                            isActive={pathName?.includes('/members')} 
                        />
                        <NavItem 
                            href="/menu" 
                            icon={<MdOutlineRestaurantMenu className="w-4 h-4" />} 
                            label="Menu" 
                            isActive={pathName?.includes('/menu')} 
                        />
                        <NavItem 
                            href="/chart" 
                            icon={<IoBarChartSharp className="w-4 h-4" />} 
                            label="Charts" 
                            isActive={pathName?.includes('/chart')} 
                        />
                        <NavItem 
                            href="/tables" 
                            icon={<FaTableCells className="w-4 h-4" />} 
                            label="Tables" 
                            isActive={pathName?.includes('/tables')} 
                        />
                    </div>
                </div>
            </div>
            
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

interface NavItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label, isActive }) => {
    return (
        <Link href={href} className="px-4">
            <div className="flex items-center gap-2 py-4 text-sm" style={{ color: isActive ? '#1e4569' : '#666' }}>
                <div>{icon}</div>
                <span className={`whitespace-nowrap ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
            </div>
        </Link>
    );
};

export default AdminNavbar;