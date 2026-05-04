import dynamic from 'next/dynamic';
import React from 'react';

// Defines what a Theme Layout component looks like
export interface ThemeLayoutProps {
  children: React.ReactNode;
  role?: string;
  userid?: string;
}

// The registry maps a theme name to its components
export const themeRegistry: Record<string, { 
  Layout: React.ComponentType<ThemeLayoutProps>;
  // Optional page overrides
  Dashboard?: React.ComponentType;
}> = {
  'default': {
    Layout: dynamic(() => import('./default/Layout')),
  },
  'sidebar-light': {
    Layout: dynamic(() => import('./sidebar-light/Layout')),
    Dashboard: dynamic(() => import('./sidebar-light/Dashboard')),
  },
  'compact-sidebar': {
    Layout: dynamic(() => import('./compact-sidebar/Layout')),
  },
  'floating-nav': {
    Layout: dynamic(() => import('./floating-nav/Layout')),
  },
  'modern-cards': {
    Layout: dynamic(() => import('./modern-cards/Layout')),
  },
  'ruby-wine': {
    Layout: dynamic(() => import('./ruby-wine/Layout')),
  },
  'emerald-grid': {
    Layout: dynamic(() => import('./emerald-grid/Layout')),
  },
  'royal-purple': {
    Layout: dynamic(() => import('./royal-purple/Layout')),
  },
  'sunset-orange': {
    Layout: dynamic(() => import('./sunset-orange/Layout')),
  },
  'neo-brutalism': {
    Layout: dynamic(() => import('./neo-brutalism/Layout')),
  }
};
