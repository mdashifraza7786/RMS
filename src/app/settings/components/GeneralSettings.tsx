"use client";

import React, { useState, useEffect } from 'react';
import { FaStore, FaMapMarkerAlt, FaPhone, FaEnvelope, FaPercent, FaRupeeSign, FaCheck, FaUndo, FaImage } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

interface GeneralSettingsType {
  restaurant_name: string;
  restaurant_logo: string;
  restaurant_address: string;
  restaurant_phone: string;
  restaurant_email: string;
  tax_rate: string;
  currency_symbol: string;
}

const GeneralSettings: React.FC = () => {
  const [settings, setSettings] = useState<GeneralSettingsType>({
    restaurant_name: '',
    restaurant_logo: '',
    restaurant_address: '',
    restaurant_phone: '',
    restaurant_email: '',
    tax_rate: '',
    currency_symbol: '',
  });
  const [originalSettings, setOriginalSettings] = useState<GeneralSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/settings?type=general');
        if (response.data) {
          setSettings(response.data);
          setOriginalSettings(response.data);
          if (response.data.restaurant_logo) {
            setLogoPreview(response.data.restaurant_logo);
          }
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
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let logoUrl = settings.restaurant_logo;

      // Handle logo upload if there's a new file
      if (logoFile) {
        // In a real app, you'd upload to a storage service
        // For this example, we'll use base64 encoding
        const base64 = await convertFileToBase64(logoFile);
        logoUrl = base64;
      }

      const settingsToSave = [
        { key: 'restaurant_name', value: settings.restaurant_name },
        { key: 'restaurant_logo', value: logoUrl },
        { key: 'restaurant_address', value: settings.restaurant_address },
        { key: 'restaurant_phone', value: settings.restaurant_phone },
        { key: 'restaurant_email', value: settings.restaurant_email },
        { key: 'tax_rate', value: settings.tax_rate },
        { key: 'currency_symbol', value: settings.currency_symbol },
      ];

      await axios.post('/api/settings/update', { settings: settingsToSave });
      
      // Update original settings after save
      setOriginalSettings({
        ...settings,
        restaurant_logo: logoUrl,
      });
      
      toast.success('General settings saved successfully');
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
      setLogoPreview(originalSettings.restaurant_logo);
      setLogoFile(null);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const hasChanges = () => {
    if (!originalSettings) return false;
    
    return (
      settings.restaurant_name !== originalSettings.restaurant_name ||
      settings.restaurant_address !== originalSettings.restaurant_address ||
      settings.restaurant_phone !== originalSettings.restaurant_phone ||
      settings.restaurant_email !== originalSettings.restaurant_email ||
      settings.tax_rate !== originalSettings.tax_rate ||
      settings.currency_symbol !== originalSettings.currency_symbol ||
      logoFile !== null
    );
  };

  if (loading) {
    return <div className="py-4">Loading settings...</div>;
  }

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
                  name="restaurant_name"
                  value={settings.restaurant_name}
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
                    {logoPreview ? (
                      <div className="relative w-24 h-24 mr-4 border rounded-lg overflow-hidden">
                        <img 
                          src={logoPreview} 
                          alt="Logo preview" 
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setLogoPreview('');
                            setLogoFile(null);
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ) : null}
                    
                    <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                      <FaImage className="mr-2" />
                      {logoPreview ? 'Change Logo' : 'Upload Logo'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Recommended size: 200x200 pixels. Max size: 2MB.
                  </p>
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
                  name="restaurant_address"
                  value={settings.restaurant_address}
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
                    name="restaurant_phone"
                    value={settings.restaurant_phone}
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
                    name="restaurant_email"
                    value={settings.restaurant_email}
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
              Tax Rate (%)
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPercent className="text-gray-400" />
                </div>
                <input
                  type="number"
                  name="tax_rate"
                  value={settings.tax_rate}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.01"
                  className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md text-sm bg-input"
                  placeholder="18.00"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Default tax rate applied to orders
              </p>
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
              <p className="mt-1 text-xs text-gray-500">
                Symbol displayed with prices (e.g., ₹, $, €)
              </p>
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

export default GeneralSettings;
