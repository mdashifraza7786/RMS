"use client";

import React from "react";

interface Title {
  role: string;
}

const Title: React.FC<Title> = ({ role }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center gap-3">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 capitalize">{role} Dashboard</h1>
      </div>
    </div>
  );
};

export default Title;


