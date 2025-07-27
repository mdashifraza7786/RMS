import React from 'react';
import { FaUsers, FaUserPlus } from "react-icons/fa";

interface MemberHeaderProps {
  onAddMember: () => void;
}

const MemberHeader: React.FC<MemberHeaderProps> = ({ onAddMember }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-lg bg-[#1e4569]/10 flex items-center justify-center mr-3">
          <FaUsers className="text-[#1e4569]" size={20} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Members</h1>
      </div>
      
      <button 
        onClick={onAddMember} 
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#1e4569] hover:bg-[#2c5983] transition shadow-sm"
      >
        <FaUserPlus className="mr-2" />
        <span>Add Member</span>
      </button>
    </div>
  );
};

export default MemberHeader; 