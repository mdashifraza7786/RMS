import React from 'react';
import { FaSearch } from "react-icons/fa";

interface MemberSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const MemberSearch: React.FC<MemberSearchProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaSearch className="text-gray-400" />
      </div>
      <input
        type="search"
        placeholder="Search by ID, name, role..."
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary w-full md:w-80"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default MemberSearch; 