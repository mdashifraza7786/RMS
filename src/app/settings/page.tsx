"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import ThemeSettings from './components/ThemeSettings';
import GeneralSettings from './components/GeneralSettings';
import PageHeader from '@/components/PageHeader';
import { FaPalette, FaStore } from 'react-icons/fa';

const SettingsPage: React.FC = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';
  const [activeTab, setActiveTab] = useState<'general' | 'theme'>('general');

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
    <div className="px-6 lg:px-10 py-4 pb-8">
      <PageHeader
        title="Settings"
        subtitle="Configure system preferences"
        accent="primary"
      />

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center px-6 py-3 font-medium text-sm transition-colors ${
            activeTab === 'general'
              ? 'border-b-2 border-accent text-accent'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <FaStore className="mr-2" />
          General
        </button>
        <button
          onClick={() => setActiveTab('theme')}
          className={`flex items-center px-6 py-3 font-medium text-sm transition-colors ${
            activeTab === 'theme'
              ? 'border-b-2 border-accent text-accent'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <FaPalette className="mr-2" />
          Theme
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          {activeTab === 'general' ? <GeneralSettings /> : <ThemeSettings />}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
