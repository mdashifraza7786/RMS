"use client";

import React, { useState, useEffect } from 'react';
import { FaStore, FaMapMarkerAlt, FaPhone, FaEnvelope, FaPercent, FaRupeeSign, FaCheck, FaUndo, FaImage } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

interface GeneralSettingsType {
  business_name: string;
  business_logo: string;
  business_address: string;
  business_phone: string;
  business_email: string;
  gst_percentage: string;
  currency_symbol: string;
  waiter_zones_enabled: string;
}

const DEFAULTS: GeneralSettingsType = {
  business_name: '',
  business_logo: '',
  business_address: '',
  business_phone: '',
  business_email: '',
  gst_percentage: '',
  currency_symbol: '',
  waiter_zones_enabled: 'false',
};

const GeneralSettings: React.FC = () => {
  const [settings, setSettings] = useState<GeneralSettingsType>(DEFAULTS);
  const [originalSettings, setOriginalSettings] = useState<GeneralSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/settings?type=general');
        if (response.data?.success) {
          const merged: GeneralSettingsType = { ...DEFAULTS, ...(response.data.data || {}) };
          setSettings(merged);
          setOriginalSettings(merged);
          if (merged.business_logo) setLogoPreview(merged.business_logo);
        }
      } catch (error) {
        console.error('Error fetching general settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const convertFileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let logoUrl = settings.business_logo;
      if (logoFile) logoUrl = await convertFileToBase64(logoFile);

      const settingsToSave = [
        { key: 'business_name',       value: settings.business_name,       type: 'general' },
        { key: 'business_logo',       value: logoUrl,                      type: 'general' },
        { key: 'business_address',    value: settings.business_address,    type: 'general' },
        { key: 'business_phone',      value: settings.business_phone,      type: 'general' },
        { key: 'business_email',      value: settings.business_email,      type: 'general' },
        { key: 'gst_percentage',      value: settings.gst_percentage,      type: 'general' },
        { key: 'currency_symbol',     value: settings.currency_symbol,     type: 'general' },
        { key: 'waiter_zones_enabled',value: settings.waiter_zones_enabled,type: 'general' },
      ];

      await axios.post('/api/settings/update', { settings: settingsToSave });

      const saved = { ...settings, business_logo: logoUrl };
      setOriginalSettings(saved);
      setSettings(saved);
      setLogoFile(null);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving general settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (originalSettings) {
      setSettings(originalSettings);
      setLogoPreview(originalSettings.business_logo);
      setLogoFile(null);
    }
  };

  const hasChanges = () => {
    if (!originalSettings) return false;
    return (
      settings.business_name    !== originalSettings.business_name    ||
      settings.business_address !== originalSettings.business_address ||
      settings.business_phone   !== originalSettings.business_phone   ||
      settings.business_email   !== originalSettings.business_email   ||
      settings.gst_percentage   !== originalSettings.gst_percentage   ||
      settings.currency_symbol  !== originalSettings.currency_symbol  ||
      logoFile !== null
    );
  };

  if (loading) return <div className="py-4">Loading settings...</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">General Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Restaurant Information */}
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <FaStore className="mr-2" />
            Restaurant Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Restaurant Name
                <input
                  type="text"
                  name="business_name"
                  value={settings.business_name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-input"
                  placeholder="Enter restaurant name"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Restaurant Logo
                <div className="mt-1">
                  <div className="flex items-center">
                    {logoPreview && (
                      <div className="relative w-24 h-24 mr-4 border rounded-lg overflow-hidden">
                        <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => { setLogoPreview(''); setLogoFile(null); setSettings(prev => ({ ...prev, business_logo: '' })); }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                        >✕</button>
                      </div>
                    )}
                    <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                      <FaImage className="mr-2" />
                      {logoPreview ? 'Change Logo' : 'Upload Logo'}
                      <input type="file" accept="image/*" onChange={handleLogoChange} className="sr-only" />
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Recommended: 200×200px, max 2 MB</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <FaMapMarkerAlt className="mr-2" />
            Contact Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Address
                <textarea
                  name="business_address"
                  value={settings.business_address}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-input"
                  placeholder="Enter restaurant address"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="business_phone"
                    value={settings.business_phone}
                    onChange={handleChange}
                    className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md text-sm bg-input"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="business_email"
                    value={settings.business_email}
                    onChange={handleChange}
                    className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md text-sm bg-input"
                    placeholder="restaurant@example.com"
                  />
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Settings */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <FaRupeeSign className="mr-2" />
          Financial Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              GST / Tax Rate (%)
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPercent className="text-gray-400" />
                </div>
                <input
                  type="number"
                  name="gst_percentage"
                  value={settings.gst_percentage}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.01"
                  className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md text-sm bg-input"
                  placeholder="18.00"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Enter as percentage, e.g. 18 for 18%</p>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Currency Symbol
              <input
                type="text"
                name="currency_symbol"
                value={settings.currency_symbol}
                onChange={handleChange}
                maxLength={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-input"
                placeholder="₹"
              />
              <p className="mt-1 text-xs text-gray-500">Symbol displayed with prices (e.g. ₹, $, €)</p>
            </label>
          </div>
        </div>
      </div>

      {/* Operational Settings */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <FaStore className="mr-2" />
          Operational Settings
        </h3>
        <div className="grid grid-cols-1 gap-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-800">Waiter-Specific Table Zones</h4>
              <p className="text-xs text-gray-500 mt-1">
                When enabled, waiters can only see tables assigned to them. When disabled, any waiter can manage any table.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.waiter_zones_enabled === 'true'}
                onChange={async (e) => {
                  const newValue = e.target.checked ? 'true' : 'false';
                  setSettings(prev => ({ ...prev, waiter_zones_enabled: newValue }));
                  try {
                    await axios.post('/api/settings/update', {
                      settings: [{ key: 'waiter_zones_enabled', value: newValue, type: 'general' }]
                    });
                    setOriginalSettings(prev => prev ? { ...prev, waiter_zones_enabled: newValue } : null);
                    toast.success(e.target.checked ? 'Waiter Zones Enabled' : 'Waiter Zones Disabled');
                  } catch {
                    setSettings(prev => ({ ...prev, waiter_zones_enabled: e.target.checked ? 'false' : 'true' }));
                    toast.error('Failed to save setting');
                  }
                }}
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 mt-8">
        <button
          onClick={handleReset}
          disabled={!hasChanges() || isSaving}
          className={`px-4 py-2 rounded-lg flex items-center ${
            !hasChanges() || isSaving ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FaUndo className="mr-2" /> Reset
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges() || isSaving}
          className={`px-4 py-2 rounded-lg flex items-center ${
            !hasChanges() || isSaving ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90'
          }`}
        >
          <FaCheck className="mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default GeneralSettings;
