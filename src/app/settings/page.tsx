"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import ThemeSettings from './components/ThemeSettings';

const SettingsPage: React.FC = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
          <p className="text-gray-500">Only administrators can access the settings page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Theme Settings</h1>
      </div>

      {/* Theme Settings Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <ThemeSettings />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
