import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTaskStore } from '../store/taskStore';
import { useRecordStore } from '../store/recordStore';
import { TaskCard } from '../components/TaskCard';
import { colors } from '../constants/colors';
import { formatDisplayDate, getTodayString } from '../utils/date';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { tasks, loadTasks, isLoading: tasksLoading, getTodayTasks } = useTaskStore();
  const { records, loadRecords, getTodayRecord } = useRecordStore();

  const todayTasks = getTodayTasks();
  const today = getTodayString();

  useEffect(() => {
    loadTasks();
    loadRecords();
  }, []);

  const handleRefresh = async () => {
    await Promise.all([loadTasks(), loadRecords()]);
  };

  const handlePressTimer = (taskId: string, minutes: number) => {
    navigation.navigate('Timer', { taskId, minutes });
  };

  const handlePressComplete = (taskId: string) => {
    navigation.navigate('Record', {
      taskId,
      usedTimer: false,
      initialStatus: 'completed',
    });
  };

  const handlePressPostponed = (taskId: string) => {
    navigation.navigate('Record', {
      taskId,
      usedTimer: false,
      initialStatus: 'postponed',
    });
  };

  const handlePressPartial = (taskId: string) => {
    navigation.navigate('Record', {
      taskId,
      usedTimer: false,
      initialStatus: 'partial',
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.dateText}>{formatDisplayDate(new Date())}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddTask', {})}
        >
          <Text style={styles.addButtonText}>+ 추가</Text>
        </TouchableOpacity>
      </View>

      {todayTasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>오늘 할 일이 없어요</Text>
          <TouchableOpacity
            style={styles.emptyAddButton}
            onPress={() => navigation.navigate('AddTask', {})}
          >
            <Text style={styles.emptyAddButtonText}>할 일 추가하기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={todayTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              todayRecord={getTodayRecord(item.id)}
              onPressTimer={(minutes) => handlePressTimer(item.id, minutes)}
              onPressComplete={() => handlePressComplete(item.id)}
              onPressPostponed={() => handlePressPostponed(item.id)}
              onPressPartial={() => handlePressPartial(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={tasksLoading} onRefresh={handleRefresh} />
          }
        />
      )}
      <View style={{ height: insets.bottom || 20 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  dateText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  emptyAddButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 24,
  },
  emptyAddButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
