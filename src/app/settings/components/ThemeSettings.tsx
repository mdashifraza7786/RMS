"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ThemeSettings: React.FC = () => {
  const { theme, updateTheme, toggleThemeMode } = useTheme();
  const [primaryColor, setPrimaryColor] = useState(theme.primary_color);
  const [secondaryColor, setSecondaryColor] = useState(theme.secondary_color);
  const [accentColor, setAccentColor] = useState(theme.accent_color);
  const [fontFamily, setFontFamily] = useState(theme.font_family);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Check if any values have changed from the original theme
    if (
      primaryColor !== theme.primary_color ||
      secondaryColor !== theme.secondary_color ||
      accentColor !== theme.accent_color ||
      fontFamily !== theme.font_family
    ) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [primaryColor, secondaryColor, accentColor, fontFamily, theme]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateTheme({
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        accent_color: accentColor,
        font_family: fontFamily,
      });
      toast.success('Theme settings saved successfully');
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving theme settings:', error);
      toast.error('Failed to save theme settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setPrimaryColor(theme.primary_color);
    setSecondaryColor(theme.secondary_color);
    setAccentColor(theme.accent_color);
    setFontFamily(theme.font_family);
    setHasChanges(false);
  };

  const fontOptions = [
    'Inter, sans-serif',
    'Roboto, sans-serif',
    'Poppins, sans-serif',
    'Open Sans, sans-serif',
    'Montserrat, sans-serif',
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Theme Settings</h2>

      {/* Theme Mode Toggle */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3">Theme Mode</h3>
        <div className="flex items-center">
          <button
            onClick={toggleThemeMode}
            className="flex items-center px-4 py-2 rounded-lg border border-gray-300 hover:bg-hover transition-colors"
          >
            {theme.theme_mode === 'light' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <span className="ml-3 text-sm text-gray-500">
            {theme.theme_mode === 'light'
              ? 'Using light mode for the interface'
              : 'Using dark mode for the interface'}
          </span>
        </div>
      </div>

      {/* Color Settings */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3">Colors</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Color */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Primary Color
              <div className="flex items-center mt-1">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="ml-2 px-3 py-2 border border-gray-300 rounded-md text-sm bg-input"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Main color for buttons and headers</p>
            </label>
          </div>

          {/* Secondary Color */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Secondary Color
              <div className="flex items-center mt-1">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-10 h-10 rounded border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="ml-2 px-3 py-2 border border-gray-300 rounded-md text-sm bg-input"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Used for secondary elements and accents</p>
            </label>
          </div>

          {/* Accent Color */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Accent Color
              <div className="flex items-center mt-1">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-10 h-10 rounded border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="ml-2 px-3 py-2 border border-gray-300 rounded-md text-sm bg-input"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Used for highlights and special elements</p>
            </label>
          </div>

          {/* Preview */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Preview</h4>
            <div className="flex flex-col gap-2">
              <div className="h-8 rounded" style={{ backgroundColor: primaryColor }}></div>
              <div className="h-8 rounded" style={{ backgroundColor: secondaryColor }}></div>
              <div className="h-8 rounded" style={{ backgroundColor: accentColor }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Font Settings */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3">Typography</h3>
        <div>
          <label className="block text-sm font-medium mb-2">
            Font Family
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-input"
            >
              {fontOptions.map((font) => (
                <option key={font} value={font}>
                  {font.split(',')[0]}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">Primary font used throughout the application</p>
          </label>
          
          {/* Font Preview */}
          <div className="mt-4 p-4 border border-gray-200 rounded-lg">
            <p style={{ fontFamily }} className="text-lg">
              This is a preview of the selected font.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 mt-8">
        <button
          onClick={handleReset}
          disabled={!hasChanges || isSaving}
          className={`px-4 py-2 rounded-lg ${
            !hasChanges || isSaving
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className={`px-4 py-2 rounded-lg ${
            !hasChanges || isSaving
              ? 'bg-primary/60 text-white cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primaryhover'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default ThemeSettings;
