import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'dark' | 'light';

const THEME_KEY = '@emotodo/theme';

interface ThemeState {
  mode: ThemeMode;
  isLoaded: boolean;
  loadTheme: () => Promise<void>;
  toggleTheme: () => Promise<void>;
  setTheme: (mode: ThemeMode) => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'dark',
  isLoaded: false,

  loadTheme: async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      if (saved === 'light' || saved === 'dark') {
        set({ mode: saved, isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch {
      set({ isLoaded: true });
    }
  },

  toggleTheme: async () => {
    const newMode: ThemeMode = get().mode === 'dark' ? 'light' : 'dark';
    set({ mode: newMode });
    try {
      await AsyncStorage.setItem(THEME_KEY, newMode);
    } catch {
      // Storage write failure is non-critical; UI already updated
    }
  },

  setTheme: async (mode: ThemeMode) => {
    set({ mode });
    try {
      await AsyncStorage.setItem(THEME_KEY, mode);
    } catch {
      // Storage write failure is non-critical; UI already updated
    }
  },
}));
