import React, { useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { AddTaskScreen } from '../screens/AddTaskScreen';
import { TimerScreen } from '../screens/TimerScreen';
import { RecordScreen } from '../screens/RecordScreen';
import { ChecklistIcon } from '../components/icons/ChecklistIcon';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { useColors } from '../hooks/useColors';
import { RootStackParamList, MainTabParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs: React.FC = () => {
  const colors = useColors();

  const tabBarStyle = useMemo(() => ({
    backgroundColor: colors.cardBackground,
    borderTopColor: colors.border,
    paddingBottom: 20,
    paddingTop: 8,
    height: 80,
  }), [colors]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '오늘',
          tabBarIcon: ({ color }) => (
            <ChecklistIcon color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: '기록',
          tabBarIcon: ({ color }) => (
            <CalendarIcon color={color} size={22} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const colors = useColors();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddTask"
        component={AddTaskScreen}
        options={{
          title: '할 일 추가',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="Timer"
        component={TimerScreen}
        options={{
          title: '타이머',
          headerBackVisible: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="Record"
        component={RecordScreen}
        options={{
          title: '기록하기',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};
