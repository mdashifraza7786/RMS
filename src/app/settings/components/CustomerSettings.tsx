"use client";

import React, { useState, useEffect } from 'react';
import { FaMobile, FaImages, FaStar, FaThLarge, FaUserPlus, FaCheck, FaUndo } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

interface CustomerSettingsType {
  enable_customer_ordering: string;
  show_item_images: string;
  enable_customer_reviews: string;
  menu_layout: string;
  enable_customer_registration: string;
}

const CustomerSettings: React.FC = () => {
  const [settings, setSettings] = useState<CustomerSettingsType>({
    enable_customer_ordering: 'true',
    show_item_images: 'true',
    enable_customer_reviews: 'false',
    menu_layout: 'grid',
    enable_customer_registration: 'true',
  });
  const [originalSettings, setOriginalSettings] = useState<CustomerSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/settings?type=customer');
        if (response.data) {
          setSettings(response.data);
          setOriginalSettings(response.data);
        }
      } catch (error) {
        console.error('Error fetching customer settings:', error);
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
        { key: 'enable_customer_ordering', value: settings.enable_customer_ordering },
        { key: 'show_item_images', value: settings.show_item_images },
        { key: 'enable_customer_reviews', value: settings.enable_customer_reviews },
        { key: 'menu_layout', value: settings.menu_layout },
        { key: 'enable_customer_registration', value: settings.enable_customer_registration },
      ];

      await axios.post('/api/settings/update', { settings: settingsToSave });
      
      // Update original settings after save
      setOriginalSettings({...settings});
      
      toast.success('Customer interface settings saved successfully');
    } catch (error) {
      console.error('Error saving customer settings:', error);
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
      settings.enable_customer_ordering !== originalSettings.enable_customer_ordering ||
      settings.show_item_images !== originalSettings.show_item_images ||
      settings.enable_customer_reviews !== originalSettings.enable_customer_reviews ||
      settings.menu_layout !== originalSettings.menu_layout ||
      settings.enable_customer_registration !== originalSettings.enable_customer_registration
    );
  };

  if (loading) {
    return <div className="py-4">Loading settings...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Customer Interface Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ordering Settings */}
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <FaMobile className="mr-2" />
            Ordering Settings
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center text-sm font-medium">
                <input
                  type="checkbox"
                  name="enable_customer_ordering"
                  checked={settings.enable_customer_ordering === 'true'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-2">Enable Customer Ordering</span>
              </label>
              <p className="mt-1 text-xs text-gray-500 ml-6">
                Allow customers to place orders directly from their devices
              </p>
            </div>
            
            <div>
              <label className="flex items-center text-sm font-medium">
                <input
                  type="checkbox"
                  name="enable_customer_registration"
                  checked={settings.enable_customer_registration === 'true'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-2">Enable Customer Registration</span>
              </label>
              <p className="mt-1 text-xs text-gray-500 ml-6">
                Allow customers to create accounts to save preferences and order history
              </p>
            </div>
          </div>
        </div>

        {/* Menu Display Settings */}
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <FaThLarge className="mr-2" />
            Menu Display Settings
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Menu Layout
                <select
                  name="menu_layout"
                  value={settings.menu_layout}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-input"
                >
                  <option value="grid">Grid View</option>
                  <option value="list">List View</option>
                  <option value="compact">Compact View</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  How menu items are displayed to customers
                </p>
              </label>
            </div>
            
            <div>
              <label className="flex items-center text-sm font-medium">
                <input
                  type="checkbox"
                  name="show_item_images"
                  checked={settings.show_item_images === 'true'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-2">Show Item Images</span>
              </label>
              <p className="mt-1 text-xs text-gray-500 ml-6">
                Display images alongside menu items
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Feedback Settings */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <FaStar className="mr-2" />
          Customer Feedback
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="flex items-center text-sm font-medium">
              <input
                type="checkbox"
                name="enable_customer_reviews"
                checked={settings.enable_customer_reviews === 'true'}
                onChange={handleChange}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="ml-2">Enable Customer Reviews</span>
            </label>
            <p className="mt-1 text-xs text-gray-500 ml-6">
              Allow customers to leave reviews and ratings for menu items
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Preview */}
      <div className="mt-8 hidden md:block">
        <h3 className="text-lg font-medium mb-3">Preview</h3>
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="mx-auto w-64 h-96 bg-white rounded-3xl border-8 border-gray-800 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 left-0 right-0 h-6 bg-gray-800 rounded-t-lg"></div>
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gray-800 rounded-b-lg"></div>
            
            <div className="h-full overflow-y-auto pt-6 pb-6">
              {/* Simulated Mobile App Interface */}
              <div className="p-2">
                <div className="text-center mb-3">
                  <div className="font-bold text-lg">Restaurant Name</div>
                  <div className="text-xs text-gray-500">Menu</div>
                </div>
                
                {settings.menu_layout === 'grid' ? (
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                        {settings.show_item_images === 'true' && (
                          <div className="h-12 bg-gray-200"></div>
                        )}
                        <div className="p-1">
                          <div className="text-xs font-medium">Item {i}</div>
                          <div className="text-xs text-gray-500">₹199</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="flex border rounded-lg overflow-hidden bg-white shadow-sm">
                        {settings.show_item_images === 'true' && (
                          <div className="w-12 h-12 bg-gray-200"></div>
                        )}
                        <div className="p-2 flex-1">
                          <div className="text-xs font-medium">Item {i}</div>
                          <div className="text-xs text-gray-500">₹199</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {settings.enable_customer_ordering === 'true' && (
                  <div className="mt-3">
                    <button className="w-full py-1 bg-primary text-white text-xs rounded">
                      Place Order
                    </button>
                  </div>
                )}
                
                {settings.enable_customer_reviews === 'true' && (
                  <div className="mt-3 border-t pt-2">
                    <div className="text-xs font-medium mb-1">Reviews</div>
                    <div className="text-xs text-gray-500">★★★★☆ (4.2)</div>
                  </div>
                )}
              </div>
            </div>
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

export default CustomerSettings;
