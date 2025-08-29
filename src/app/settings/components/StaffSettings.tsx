"use client";

import React, { useState, useEffect } from 'react';
import { FaBell, FaSync, FaList, FaTable, FaComments, FaExclamationTriangle, FaCheck, FaUndo } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

interface StaffSettingsType {
  dashboard_refresh_rate: string;
  enable_notifications: string;
  default_order_view: string;
  enable_staff_chat: string;
  enable_kitchen_alerts: string;
}

const StaffSettings: React.FC = () => {
  const [settings, setSettings] = useState<StaffSettingsType>({
    dashboard_refresh_rate: '10',
    enable_notifications: 'true',
    default_order_view: 'list',
    enable_staff_chat: 'false',
    enable_kitchen_alerts: 'true',
  });
  const [originalSettings, setOriginalSettings] = useState<StaffSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/settings?type=staff');
        if (response.data) {
          setSettings(response.data);
          setOriginalSettings(response.data);
        }
      } catch (error) {
        console.error('Error fetching staff settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings(prev => ({ ...prev, [name]: checked.toString() }));
    } else {
      setSettings(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const settingsToSave = [
        { key: 'dashboard_refresh_rate', value: settings.dashboard_refresh_rate },
        { key: 'enable_notifications', value: settings.enable_notifications },
        { key: 'default_order_view', value: settings.default_order_view },
        { key: 'enable_staff_chat', value: settings.enable_staff_chat },
        { key: 'enable_kitchen_alerts', value: settings.enable_kitchen_alerts },
      ];

      await axios.post('/api/settings/update', { settings: settingsToSave });
      
      // Update original settings after save
      setOriginalSettings({...settings});
      
      toast.success('Staff interface settings saved successfully');
    } catch (error) {
      console.error('Error saving staff settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (originalSettings) {
      setSettings(originalSettings);
    }
  };

  const hasChanges = () => {
    if (!originalSettings) return false;
    
    return (
      settings.dashboard_refresh_rate !== originalSettings.dashboard_refresh_rate ||
      settings.enable_notifications !== originalSettings.enable_notifications ||
      settings.default_order_view !== originalSettings.default_order_view ||
      settings.enable_staff_chat !== originalSettings.enable_staff_chat ||
      settings.enable_kitchen_alerts !== originalSettings.enable_kitchen_alerts
    );
  };

  if (loading) {
    return <div className="py-4">Loading settings...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Staff Interface Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dashboard Settings */}
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <FaSync className="mr-2" />
            Dashboard Settings
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Dashboard Refresh Rate (seconds)
                <select
                  name="dashboard_refresh_rate"
                  value={settings.dashboard_refresh_rate}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-input"
                >
                  <option value="5">5 seconds</option>
                  <option value="10">10 seconds</option>
                  <option value="15">15 seconds</option>
                  <option value="30">30 seconds</option>
                  <option value="60">60 seconds</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  How often the dashboard data refreshes automatically
                </p>
              </label>
            </div>
            
            <div>
              <label className="flex items-center text-sm font-medium">
                <input
                  type="checkbox"
                  name="enable_notifications"
                  checked={settings.enable_notifications === 'true'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-2">Enable Notifications</span>
              </label>
              <p className="mt-1 text-xs text-gray-500 ml-6">
                Show notifications for new orders and important events
              </p>
            </div>
          </div>
        </div>

        {/* Order View Settings */}
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <FaList className="mr-2" />
            Order View Settings
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Default Order View
                <select
                  name="default_order_view"
                  value={settings.default_order_view}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-input"
                >
                  <option value="list">List View</option>
                  <option value="grid">Grid View</option>
                  <option value="compact">Compact View</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Default layout for displaying orders
                </p>
              </label>
            </div>
            
            <div>
              <label className="flex items-center text-sm font-medium">
                <input
                  type="checkbox"
                  name="enable_kitchen_alerts"
                  checked={settings.enable_kitchen_alerts === 'true'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-2">Enable Kitchen Alerts</span>
              </label>
              <p className="mt-1 text-xs text-gray-500 ml-6">
                Show alerts for delayed orders and kitchen status
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Communication Settings */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <FaComments className="mr-2" />
          Staff Communication
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="flex items-center text-sm font-medium">
              <input
                type="checkbox"
                name="enable_staff_chat"
                checked={settings.enable_staff_chat === 'true'}
                onChange={handleChange}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="ml-2">Enable Staff Chat</span>
            </label>
            <p className="mt-1 text-xs text-gray-500 ml-6">
              Allow staff members to communicate through the built-in chat system
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 mt-8">
        <button
          onClick={handleReset}
          disabled={!hasChanges() || isSaving}
          className={`px-4 py-2 rounded-lg flex items-center ${
            !hasChanges() || isSaving
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FaUndo className="mr-2" />
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges() || isSaving}
          className={`px-4 py-2 rounded-lg flex items-center ${
            !hasChanges() || isSaving
              ? 'bg-primary/60 text-white cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primaryhover'
          }`}
        >
          <FaCheck className="mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default StaffSettings;
