"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface ThemeSettings {
  theme_mode: 'light' | 'dark';
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_family: string;
}

interface ThemeContextType {
  theme: ThemeSettings;
  loading: boolean;
  updateTheme: (newTheme: Partial<ThemeSettings>) => Promise<void>;
  toggleThemeMode: () => Promise<void>;
}

const defaultTheme: ThemeSettings = {
  theme_mode: 'light',
  primary_color: '#00589C',
  secondary_color: '#50E3C2',
  accent_color: '#1891C3',
  font_family: 'Inter, sans-serif',
};

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  loading: true,
  updateTheme: async () => {},
  toggleThemeMode: async () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const [loading, setLoading] = useState(true);

  // Fetch theme settings from the API
  useEffect(() => {
    const fetchThemeSettings = async () => {
      try {
        const response = await axios.get('/api/settings?type=theme');
        if (response.data) {
          setTheme({
            theme_mode: response.data.theme_mode || defaultTheme.theme_mode,
            primary_color: response.data.primary_color || defaultTheme.primary_color,
            secondary_color: response.data.secondary_color || defaultTheme.secondary_color,
            accent_color: response.data.accent_color || defaultTheme.accent_color,
            font_family: response.data.font_family || defaultTheme.font_family,
          });
        }
      } catch (error) {
        console.error('Error fetching theme settings:', error);
        // Use default theme if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchThemeSettings();
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!loading) {
      // Apply theme mode
      document.documentElement.classList.remove('light-mode', 'dark-mode');
      document.documentElement.classList.add(`${theme.theme_mode}-mode`);
      
      // Apply CSS variables for colors
      document.documentElement.style.setProperty('--color-primary', theme.primary_color);
      document.documentElement.style.setProperty('--color-secondary', theme.secondary_color);
      document.documentElement.style.setProperty('--color-accent', theme.accent_color);
      document.documentElement.style.setProperty('--font-family', theme.font_family);
    }
  }, [theme, loading]);

  // Update theme settings
  const updateTheme = async (newTheme: Partial<ThemeSettings>) => {
    try {
      const updatedTheme = { ...theme, ...newTheme };
      setTheme(updatedTheme);
      
      // Save to database (admin only)
      const settings = Object.entries(newTheme).map(([key, value]) => ({
        key,
        value: String(value),
      }));
      
      await axios.post('/api/settings/update', { settings });
    } catch (error) {
      console.error('Error updating theme:', error);
      // Revert to previous theme if update fails
    }
  };

  // Toggle between light and dark mode
  const toggleThemeMode = async () => {
    const newMode = theme.theme_mode === 'light' ? 'dark' : 'light';
    await updateTheme({ theme_mode: newMode });
  };

  return (
    <ThemeContext.Provider value={{ theme, loading, updateTheme, toggleThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
