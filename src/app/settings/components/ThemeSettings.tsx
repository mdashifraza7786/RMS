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

      {/* Structural Templates */}
      <div className="mb-8 pt-4 border-t border-gray-100">
        <h3 className="text-lg font-medium mb-3">Structural Templates</h3>
        <p className="text-sm text-gray-500 mb-4">
          Completely change the layout and navigation style of the dashboard.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Default Theme Card */}
          <div 
            onClick={() => updateTheme({ active_theme_folder: 'default' })}
            className={`border rounded-xl p-4 cursor-pointer transition-all ${
              theme.active_theme_folder === 'default' 
              ? 'border-primary shadow-md bg-primary/5' 
              : 'border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white'
            }`}
          >
            <div className="h-32 bg-gray-100 rounded-lg mb-3 flex flex-col overflow-hidden border border-gray-200">
              <div className="h-8 bg-white border-b border-gray-200 flex items-center px-2 shadow-sm">
                <div className="w-4 h-4 rounded-full bg-primary/80 mr-2"></div>
                <div className="flex-1 flex justify-center space-x-2">
                  <div className="w-6 h-1.5 bg-gray-300 rounded"></div>
                  <div className="w-6 h-1.5 bg-gray-300 rounded"></div>
                  <div className="w-6 h-1.5 bg-gray-300 rounded"></div>
                </div>
              </div>
              <div className="flex-1 p-2 bg-gray-50">
                <div className="w-full h-full bg-white rounded shadow-sm"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-800">Classic Top-Nav</h4>
                <p className="text-xs text-gray-500">Standard header navigation</p>
              </div>
              {theme.active_theme_folder === 'default' && (
                <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Active</span>
              )}
            </div>
          </div>

          {/* Sidebar Light Theme Card */}
          <div 
            onClick={() => updateTheme({ active_theme_folder: 'sidebar-light' })}
            className={`border rounded-xl p-4 cursor-pointer transition-all ${
              theme.active_theme_folder === 'sidebar-light' 
              ? 'border-primary shadow-md bg-primary/5' 
              : 'border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white'
            }`}
          >
            <div className="h-32 bg-gray-100 rounded-lg mb-3 flex overflow-hidden border border-gray-200">
              <div className="w-10 bg-white border-r border-gray-200 h-full flex flex-col items-center py-2 space-y-2">
                <div className="w-4 h-4 rounded-full bg-primary/80 mb-2"></div>
                <div className="w-5 h-1.5 bg-gray-300 rounded"></div>
                <div className="w-5 h-1.5 bg-gray-300 rounded"></div>
              </div>
              <div className="flex-1 flex flex-col bg-gray-50">
                <div className="h-6 bg-white border-b border-gray-200 shadow-sm"></div>
                <div className="flex-1 p-2">
                  <div className="w-full h-full bg-white rounded shadow-sm border border-gray-100"></div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-800">Sidebar Dashboard</h4>
                <p className="text-xs text-gray-500">Left-side expanded nav (Light)</p>
              </div>
              {theme.active_theme_folder === 'sidebar-light' && (
                <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Active</span>
              )}
            </div>
          </div>

          {/* Compact Sidebar Theme Card */}
          <div 
            onClick={() => updateTheme({ active_theme_folder: 'compact-sidebar' })}
            className={`border rounded-xl p-4 cursor-pointer transition-all ${
              theme.active_theme_folder === 'compact-sidebar' 
              ? 'border-primary shadow-md bg-primary/5' 
              : 'border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white'
            }`}
          >
            <div className="h-32 bg-gray-100 rounded-lg mb-3 flex overflow-hidden border border-gray-200">
              <div className="w-5 bg-white border-r border-gray-200 h-full flex flex-col items-center py-2 space-y-2">
                <div className="w-2 h-2 rounded-full bg-primary/80 mb-2"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
              <div className="flex-1 flex flex-col bg-gray-50">
                <div className="h-6 bg-white border-b border-gray-200 shadow-sm"></div>
                <div className="flex-1 p-2">
                  <div className="w-full h-full bg-white rounded shadow-sm border border-gray-100"></div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-800">Compact Sidebar</h4>
                <p className="text-xs text-gray-500">Icon-only minimal left nav</p>
              </div>
              {theme.active_theme_folder === 'compact-sidebar' && (
                <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Active</span>
              )}
            </div>
          </div>

          {/* Floating Nav Theme Card */}
          <div 
            onClick={() => updateTheme({ active_theme_folder: 'floating-nav' })}
            className={`border rounded-xl p-4 cursor-pointer transition-all ${
              theme.active_theme_folder === 'floating-nav' 
              ? 'border-primary shadow-md bg-primary/5' 
              : 'border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white'
            }`}
          >
            <div className="h-32 bg-gray-50 rounded-lg mb-3 flex flex-col items-center overflow-hidden border border-gray-200 p-2 relative">
              <div className="w-3/4 h-5 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center space-x-2 z-10">
                <div className="w-3 h-1 bg-gray-300 rounded"></div>
                <div className="w-3 h-1 bg-gray-300 rounded"></div>
                <div className="w-3 h-1 bg-gray-300 rounded"></div>
              </div>
              <div className="w-full flex-1 bg-white rounded-lg shadow-sm border border-gray-100 mt-2"></div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-800">Floating Navbar</h4>
                <p className="text-xs text-gray-500">Modern pill-shaped top nav</p>
              </div>
              {theme.active_theme_folder === 'floating-nav' && (
                <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Active</span>
              )}
            </div>
          </div>

          {/* Boxed Layout Theme Card */}
          <div 
            onClick={() => updateTheme({ active_theme_folder: 'modern-cards' })}
            className={`border rounded-xl p-4 cursor-pointer transition-all ${
              theme.active_theme_folder === 'modern-cards' 
              ? 'border-primary shadow-md bg-primary/5' 
              : 'border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white'
            }`}
          >
            <div className="h-32 bg-gray-200 rounded-lg mb-3 flex flex-col items-center overflow-hidden border border-gray-300 p-2 relative">
              <div className="w-full h-full bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col overflow-hidden">
                <div className="h-6 bg-gray-50 border-b border-gray-100 flex items-center px-2">
                    <div className="w-8 h-1 bg-gray-300 rounded"></div>
                </div>
                <div className="flex-1 p-2">
                    <div className="w-full h-full bg-gray-50 rounded border border-gray-100"></div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-800">Boxed Canvas</h4>
                <p className="text-xs text-gray-500">App sits inside a centered card</p>
              </div>
              {theme.active_theme_folder === 'modern-cards' && (
                <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Active</span>
              )}
            </div>
          </div>

          {/* Ruby Wine Theme Card */}
          <div onClick={() => updateTheme({ active_theme_folder: 'ruby-wine' })} className={`border rounded-xl p-4 cursor-pointer transition-all ${theme.active_theme_folder === 'ruby-wine' ? 'border-[#800020] shadow-md bg-[#800020]/5' : 'border-gray-200 hover:border-[#800020] hover:shadow-sm bg-white'}`}>
            <div className="h-32 bg-[#FAFAFA] rounded-lg mb-3 flex flex-col overflow-hidden border border-gray-200">
              <div className="h-6 bg-[#800020] border-b-2 border-[#E32636] w-full flex items-center px-2 space-x-1"><div className="w-4 h-1 bg-[#F9E4B7] rounded"></div><div className="w-4 h-1 bg-white/50 rounded"></div></div>
              <div className="flex-1 p-2"><div className="w-full h-full bg-white shadow-sm border border-gray-100"></div></div>
            </div>
            <div className="flex justify-between items-center">
              <div><h4 className="font-medium text-gray-800">Ruby Wine</h4><p className="text-xs text-gray-500">Dark red elegant top-nav</p></div>
              {theme.active_theme_folder === 'ruby-wine' && <span className="bg-[#800020] text-[#F9E4B7] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Active</span>}
            </div>
          </div>

          {/* Emerald Grid Theme Card */}
          <div onClick={() => updateTheme({ active_theme_folder: 'emerald-grid' })} className={`border rounded-xl p-4 cursor-pointer transition-all ${theme.active_theme_folder === 'emerald-grid' ? 'border-[#059669] shadow-md bg-[#059669]/5' : 'border-gray-200 hover:border-[#059669] hover:shadow-sm bg-white'}`}>
            <div className="h-32 bg-[#F0FDF4] rounded-lg mb-3 flex overflow-hidden border border-gray-200">
              <div className="w-8 bg-white border-r-2 border-[#059669] flex flex-col pt-2 items-center space-y-1"><div className="w-4 h-4 bg-[#059669]"></div><div className="w-4 h-4 bg-[#10B981] border border-[#059669]"></div></div>
              <div className="flex-1 flex flex-col"><div className="h-5 bg-white border-b-2 border-[#059669]"></div><div className="flex-1 p-2 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"><div className="w-full h-full bg-white border-2 border-dashed border-[#10B981]"></div></div></div>
            </div>
            <div className="flex justify-between items-center">
              <div><h4 className="font-medium text-gray-800">Emerald Grid</h4><p className="text-xs text-gray-500">Sharp green tech-layout</p></div>
              {theme.active_theme_folder === 'emerald-grid' && <span className="bg-[#059669] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Active</span>}
            </div>
          </div>

          {/* Royal Purple Theme Card */}
          <div onClick={() => updateTheme({ active_theme_folder: 'royal-purple' })} className={`border rounded-xl p-4 cursor-pointer transition-all ${theme.active_theme_folder === 'royal-purple' ? 'border-[#7C3AED] shadow-md bg-[#7C3AED]/5' : 'border-gray-200 hover:border-[#7C3AED] hover:shadow-sm bg-white'}`}>
            <div className="h-32 bg-[#F5F3FF] rounded-lg mb-3 flex flex-col overflow-hidden border border-[#EDE9FE] relative">
              <div className="h-6 bg-white/50 backdrop-blur-md px-2 flex items-center"><div className="w-12 h-2 bg-[#7C3AED] rounded-full"></div></div>
              <div className="flex-1 p-2"><div className="w-full h-full bg-white rounded-lg shadow-sm border border-[#EDE9FE]"></div></div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-5 bg-white rounded-full shadow-md flex items-center justify-center space-x-1"><div className="w-2 h-2 bg-[#7C3AED] rounded-full"></div><div className="w-2 h-2 bg-gray-300 rounded-full"></div></div>
            </div>
            <div className="flex justify-between items-center">
              <div><h4 className="font-medium text-gray-800">Royal Purple</h4><p className="text-xs text-gray-500">Floating bottom pill nav</p></div>
              {theme.active_theme_folder === 'royal-purple' && <span className="bg-[#7C3AED] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Active</span>}
            </div>
          </div>

          {/* Sunset Orange Theme Card */}
          <div onClick={() => updateTheme({ active_theme_folder: 'sunset-orange' })} className={`border rounded-xl p-4 cursor-pointer transition-all ${theme.active_theme_folder === 'sunset-orange' ? 'border-[#EA580C] shadow-md bg-[#EA580C]/5' : 'border-gray-200 hover:border-[#EA580C] hover:shadow-sm bg-white'}`}>
            <div className="h-32 bg-[#FFF7ED] rounded-lg mb-3 flex overflow-hidden border border-orange-100">
              <div className="w-10 bg-[#1C1917] rounded-r-xl shadow-lg flex flex-col pt-2 items-center space-y-2"><div className="w-6 h-2 bg-[#EA580C] rounded-full"></div><div className="w-5 h-1.5 bg-gradient-to-r from-[#EA580C] to-[#F97316] rounded-full"></div></div>
              <div className="flex-1 p-2 pl-4"><div className="w-full h-full bg-white rounded-xl shadow-sm border border-orange-50"></div></div>
            </div>
            <div className="flex justify-between items-center">
              <div><h4 className="font-medium text-gray-800">Sunset Orange</h4><p className="text-xs text-gray-500">Vibrant dark sidebar</p></div>
              {theme.active_theme_folder === 'sunset-orange' && <span className="bg-[#EA580C] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Active</span>}
            </div>
          </div>

          {/* Neo Brutalism Theme Card */}
          <div onClick={() => updateTheme({ active_theme_folder: 'neo-brutalism' })} className={`border rounded-xl p-4 cursor-pointer transition-all ${theme.active_theme_folder === 'neo-brutalism' ? 'border-black shadow-md bg-[#FDE047]/10' : 'border-gray-200 hover:border-black hover:shadow-sm bg-white'}`}>
            <div className="h-32 bg-[#FDE047] rounded-lg mb-3 p-2 flex flex-col">
              <div className="w-full h-full bg-white border-[3px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex flex-col overflow-hidden">
                <div className="h-6 bg-[#FDE047] border-b-[3px] border-black flex"><div className="w-8 bg-black border-r-[3px] border-black text-[6px] text-white flex items-center justify-center font-black">RMS</div><div className="flex-1 flex items-center px-2"><div className="w-4 h-2 bg-[#3B82F6] border-r border-black"></div></div></div>
                <div className="flex-1 p-2 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]"><div className="w-full h-full bg-white border-2 border-black"></div></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div><h4 className="font-medium text-gray-800 font-bold uppercase">Neo Brutalism</h4><p className="text-[10px] text-gray-500 font-mono uppercase">Harsh borders & shadows</p></div>
              {theme.active_theme_folder === 'neo-brutalism' && <span className="bg-black text-[#FDE047] text-[10px] font-black px-2 py-1 uppercase tracking-wider shadow-[2px_2px_0_0_rgba(100,100,100,1)] border border-black">Active</span>}
            </div>
          </div>
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
