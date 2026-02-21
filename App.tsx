import 'react-native-get-random-values';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useTaskStore } from './src/store/taskStore';
import { useRecordStore } from './src/store/recordStore';
import { storage } from './src/utils/storage';
import { colors } from './src/constants/colors';

const appTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.cardBackground,
    text: colors.textPrimary,
    border: colors.border,
    notification: colors.primary,
  },
};

export default function App() {
  const loadTasks = useTaskStore((state) => state.loadTasks);
  const loadRecords = useRecordStore((state) => state.loadRecords);

  useEffect(() => {
    // TODO: 데이터 확인 후 이 줄 삭제
    storage.clear().then(() => { loadTasks(); loadRecords(); });
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={appTheme}>
        <AppNavigator />
        <StatusBar style="light" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
