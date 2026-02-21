import 'react-native-get-random-values';
import React, { useEffect, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useTaskStore } from './src/store/taskStore';
import { useRecordStore } from './src/store/recordStore';
import { useThemeStore } from './src/store/themeStore';
import { useColors } from './src/hooks/useColors';

function AppContent() {
  const colors = useColors();
  const mode = useThemeStore((s) => s.mode);

  const appTheme = useMemo(() => {
    const baseTheme = mode === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.cardBackground,
        text: colors.textPrimary,
        border: colors.border,
        notification: colors.primary,
      },
    };
  }, [colors, mode]);

  return (
    <NavigationContainer theme={appTheme}>
      <AppNavigator />
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
    </NavigationContainer>
  );
}

export default function App() {
  const loadTasks = useTaskStore((state) => state.loadTasks);
  const loadRecords = useRecordStore((state) => state.loadRecords);
  const loadTheme = useThemeStore((state) => state.loadTheme);

  useEffect(() => {
    const init = async () => {
      await loadTheme();
      await Promise.all([loadTasks(), loadRecords()]);
    };
    init();
  }, []);

  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}
