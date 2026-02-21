import React, { useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTaskStore } from '../store/taskStore';
import { useRecordStore } from '../store/recordStore';
import { TaskCard } from '../components/TaskCard';
import { GreetingHeader } from '../components/GreetingHeader';
import { useColors } from '../hooks/useColors';
import { progressMessages } from '../constants/messages';
import { RootStackParamList, TaskStatus } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { tasks, loadTasks, isLoading: tasksLoading, getTodayTasks } = useTaskStore();
  const { records, loadRecords, getTodayRecord } = useRecordStore();

  const todayTasks = getTodayTasks();

  const staggerAnims = useRef<Animated.Value[]>([]);
  if (staggerAnims.current.length < todayTasks.length) {
    staggerAnims.current = [
      ...staggerAnims.current,
      ...Array.from(
        { length: todayTasks.length - staggerAnims.current.length },
        () => new Animated.Value(0),
      ),
    ];
  }

  const progress = useMemo(() => {
    let completed = 0;
    let partial = 0;
    let postponed = 0;

    todayTasks.forEach((task) => {
      const record = getTodayRecord(task.id);
      if (record) {
        if (record.status === 'completed') completed++;
        else if (record.status === 'partial') partial++;
        else if (record.status === 'postponed') postponed++;
      }
    });

    return { completed, partial, postponed, total: todayTasks.length };
  }, [todayTasks, records]);

  useEffect(() => {
    loadTasks();
    loadRecords();
  }, []);

  useEffect(() => {
    if (todayTasks.length > 0) {
      const animations = staggerAnims.current
        .slice(0, todayTasks.length)
        .map((anim) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        );
      Animated.stagger(60, animations).start();
    }
  }, [todayTasks.length]);

  const handleRefresh = async () => {
    await Promise.all([loadTasks(), loadRecords()]);
  };

  const handlePressAction = (taskId: string, status: TaskStatus) => {
    navigation.navigate('Record', {
      taskId,
      usedTimer: false,
      initialStatus: status,
    });
  };

  const handlePressTimer = (taskId: string, minutes: number) => {
    navigation.navigate('Timer', { taskId, minutes });
  };

  const handlePressEdit = (taskId: string, recordId: string) => {
    navigation.navigate('Record', {
      taskId,
      usedTimer: false,
      recordId,
    });
  };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
    },
  }), [colors]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <GreetingHeader
        completed={progress.completed}
        partial={progress.partial}
        postponed={progress.postponed}
        total={progress.total}
        onPressAdd={() => navigation.navigate('AddTask', {})}
      />

      {todayTasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{progressMessages.emptyState}</Text>
        </View>
      ) : (
        <FlatList
          data={todayTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            const anim = staggerAnims.current[index];
            return (
              <Animated.View
                style={
                  anim
                    ? {
                        opacity: anim,
                        transform: [
                          {
                            translateY: anim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [12, 0],
                            }),
                          },
                        ],
                      }
                    : undefined
                }
              >
                <TaskCard
                  task={item}
                  todayRecord={getTodayRecord(item.id)}
                  onPressTimer={(minutes) => handlePressTimer(item.id, minutes)}
                  onPressAction={(status) => handlePressAction(item.id, status)}
                  onPressEdit={() => {
                    const record = getTodayRecord(item.id);
                    if (record) handlePressEdit(item.id, record.id);
                  }}
                />
              </Animated.View>
            );
          }}
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
