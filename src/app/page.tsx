"use client";
import React from 'react';
import DefaultDashboard from "@/components/Dashboard";
import { useTheme } from "@/contexts/ThemeContext";
import { themeRegistry } from "../../themes/theme-registry";

export default function Home() {
  const { theme } = useTheme();
  
  // Look up the active theme
  const activeThemeName = theme.active_theme_folder || 'default';
  const ThemeConfig = themeRegistry[activeThemeName] || themeRegistry['default'];
  
  // Use the theme's Dashboard override if it exists, otherwise use the DefaultDashboard
  const ActiveDashboard = ThemeConfig.Dashboard || DefaultDashboard;

  return (
    <div>
      <ActiveDashboard />
    </div>
  );
}