import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

type ThemeColors = {
  background: string;
  card: string;
  text: string;
  subtext: string;
  border: string;
  primary: string;
  secondary: string;
  tint: string;
  tabBar: string;
  inputBg: string;
  success: string;
  error: string;
  warning: string;
  info: string;
};

const lightColors: ThemeColors = {
  background: '#F3F4F6',
  card: '#FFFFFF',
  text: '#111827',
  subtext: '#6B7280',
  border: '#E5E7EB',
  primary: '#4c8bf5',
  secondary: '#F9FAFB',
  tint: '#4c8bf5',
  tabBar: '#FFFFFF',
  inputBg: '#F9FAFB',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
};

const darkColors: ThemeColors = {
  background: '#0f1020',
  card: '#161726',
  text: '#FFFFFF',
  subtext: '#9CA3AF',
  border: '#2D3045',
  primary: '#4c8bf5',
  secondary: '#1E2032',
  tint: '#FFFFFF',
  tabBar: '#161726',
  inputBg: '#1E2032',
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
};

type ThemeContextType = {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  colors: darkColors,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>('dark'); // Varsayılan Dark

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('app_theme');
      if (savedTheme) {
        setTheme(savedTheme as Theme);
      }
    } catch (e) {
      console.log('Tema yüklenemedi');
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    await AsyncStorage.setItem('app_theme', newTheme);
  };

  const colors = theme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
