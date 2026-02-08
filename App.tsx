import 'react-native-get-random-values';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useTaskStore } from './src/store/taskStore';
import { useRecordStore } from './src/store/recordStore';

export default function App() {
  const loadTasks = useTaskStore((state) => state.loadTasks);
  const loadRecords = useRecordStore((state) => state.loadRecords);

  useEffect(() => {
    loadTasks();
    loadRecords();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
