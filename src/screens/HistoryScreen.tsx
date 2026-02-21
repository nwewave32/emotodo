import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTaskStore } from '../store/taskStore';
import { useRecordStore } from '../store/recordStore';
import { useColors } from '../hooks/useColors';
import { formatDisplayDate, getTodayString } from '../utils/date';
import { messages } from '../constants/messages';
import { DailyRecord, Task, TaskStatus } from '../types';
import { CalendarHeatmap, HeatmapDateInfo } from '../components/CalendarHeatmap';
import { WeekSummary } from '../components/WeekSummary';

const statusEmoji: Record<TaskStatus, string> = {
  completed: '\u2713',
  partial: '\u25B3',
  postponed: '\u2212',
};

const statusCardStyleKey: Record<TaskStatus, 'completedCard' | 'partialCard' | 'postponedCard'> = {
  completed: 'completedCard',
  partial: 'partialCard',
  postponed: 'postponedCard',
};

export const HistoryScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { tasks, loadTasks, getTasksForDate } = useTaskStore();
  const { records, loadRecords, isLoading, getRecordsForDate } = useRecordStore();

  const today = getTodayString();
  const [selectedDate, setSelectedDate] = useState<string | null>(today);
  const [calendarYear, setCalendarYear] = useState(() => new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(() => new Date().getMonth());

  useEffect(() => {
    loadTasks();
    loadRecords();
  }, []);

  const recordDates = useMemo(() => {
    const map = new Map<string, HeatmapDateInfo>();
    const dateGroups = new Map<string, { statuses: Set<TaskStatus>; emotions: Map<string, number> }>();

    records.forEach((r) => {
      if (!dateGroups.has(r.date)) {
        dateGroups.set(r.date, { statuses: new Set(), emotions: new Map() });
      }
      const group = dateGroups.get(r.date)!;
      group.statuses.add(r.status);
      if (r.emotion) {
        group.emotions.set(r.emotion, (group.emotions.get(r.emotion) || 0) + 1);
      }
    });

    dateGroups.forEach(({ statuses, emotions }, date) => {
      let status: HeatmapDateInfo['status'];
      if (statuses.size > 1) {
        status = 'mixed';
      } else if (statuses.has('completed')) {
        status = 'completed';
      } else if (statuses.has('partial')) {
        status = 'partial';
      } else {
        status = 'postponed';
      }

      let dominantEmotion: string | undefined;
      if (emotions.size > 0) {
        let maxCount = 0;
        emotions.forEach((count, key) => {
          if (count > maxCount) {
            maxCount = count;
            dominantEmotion = key;
          }
        });
      }

      map.set(date, { status, dominantEmotion });
    });

    return map;
  }, [records]);

  const weekRecords = useMemo(
    () => records.map((r) => ({ date: r.date, status: r.status })),
    [records],
  );

  const selectedDateData = useMemo(() => {
    if (!selectedDate) return null;

    const dateRecords = getRecordsForDate(selectedDate);
    const dateTasks = getTasksForDate(selectedDate);
    const taskMap = new Map(tasks.map((t) => [t.id, t]));
    const recordedTaskIds = new Set(dateRecords.map((r) => r.taskId));

    const recordedItems = dateRecords.map((r) => ({
      ...r,
      taskTitle: taskMap.get(r.taskId)?.title || '삭제된 할 일',
    }));

    const unrecordedTasks = dateTasks.filter((t) => !recordedTaskIds.has(t.id));

    return { recordedItems, unrecordedTasks };
  }, [selectedDate, records, tasks]);

  const handleRefresh = async () => {
    try {
      await Promise.all([loadTasks(), loadRecords()]);
    } catch {
      // Store handles loading state reset on error
    }
  };

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarYear((y) => y - 1);
      setCalendarMonth(11);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarYear((y) => y + 1);
      setCalendarMonth(0);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  const getEmotionEmoji = (emotionKey: string, status: TaskStatus): string => {
    const emotions = messages.emotions[status];
    if (!emotions) return '';
    return emotions.find((e) => e.key === emotionKey)?.emoji || '';
  };

  const getReasonLabel = (reasonKey: string): string => {
    return messages.reasons.find((r) => r.key === reasonKey)?.label || reasonKey;
  };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: 20,
    },
    selectedDateSection: {
      marginTop: 4,
    },
    selectedDateLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 12,
    },
    noContentContainer: {
      paddingVertical: 32,
      alignItems: 'center',
    },
    noContentText: {
      fontSize: 14,
      color: colors.textLight,
    },
    recordCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      padding: 14,
      marginBottom: 8,
    },
    completedCard: {
      borderLeftWidth: 3,
      borderLeftColor: colors.completed,
    },
    partialCard: {
      borderLeftWidth: 3,
      borderLeftColor: colors.partial,
    },
    postponedCard: {
      borderLeftWidth: 3,
      borderLeftColor: colors.postponed,
    },
    unrecordedCard: {
      borderLeftWidth: 3,
      borderLeftColor: colors.textLight,
      backgroundColor: colors.background,
    },
    recordHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    taskTitle: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.textPrimary,
      flex: 1,
    },
    unrecordedTitle: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.textLight,
      flex: 1,
    },
    unrecordedBadge: {
      fontSize: 16,
      color: colors.textLight,
    },
    unrecordedLabel: {
      fontSize: 13,
      color: colors.textLight,
    },
    statusEmoji: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    emotionText: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 4,
    },
    energyText: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 4,
    },
    reasonText: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 4,
      fontStyle: 'italic',
    },
    noteText: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    timerInfo: {
      fontSize: 12,
      color: colors.textLight,
      marginTop: 6,
    },
  }), [colors]);

  const renderRecord = (record: DailyRecord & { taskTitle: string }) => (
    <View
      key={record.id}
      style={[styles.recordCard, styles[statusCardStyleKey[record.status]]]}
    >
      <View style={styles.recordHeader}>
        <Text style={styles.taskTitle}>{record.taskTitle}</Text>
        <Text style={styles.statusEmoji}>{statusEmoji[record.status]}</Text>
      </View>

      {record.emotion && (
        <Text style={styles.emotionText}>
          {getEmotionEmoji(record.emotion, record.status)}{' '}
          {messages.emotions[record.status]?.find((e) => e.key === record.emotion)?.label || record.emotion}
        </Text>
      )}

      {record.energyLevel != null && (
        <Text style={styles.energyText}>
          {messages.energyLevels[record.energyLevel - 1]?.emoji}{' '}
          에너지 {messages.energyLevels[record.energyLevel - 1]?.label}
        </Text>
      )}

      {record.status === 'postponed' && record.reason && (
        <Text style={styles.reasonText}>{getReasonLabel(record.reason)}</Text>
      )}

      {record.note && <Text style={styles.noteText}>{record.note}</Text>}

      {record.usedTimer && (
        <Text style={styles.timerInfo}>
          타이머 {record.actualMinutes}분 {record.timerCompleted ? '완료' : ''}
        </Text>
      )}
    </View>
  );

  const renderUnrecordedTask = (task: Task) => (
    <View key={task.id} style={[styles.recordCard, styles.unrecordedCard]}>
      <View style={styles.recordHeader}>
        <Text style={styles.unrecordedTitle}>{task.title}</Text>
        <Text style={styles.unrecordedBadge}>○</Text>
      </View>
      <Text style={styles.unrecordedLabel}>미완료</Text>
    </View>
  );

  const renderSelectedDateView = () => {
    if (!selectedDate || !selectedDateData) return null;

    const { recordedItems, unrecordedTasks } = selectedDateData;
    const hasContent = recordedItems.length > 0 || unrecordedTasks.length > 0;

    return (
      <View style={styles.selectedDateSection}>
        <Text style={styles.selectedDateLabel}>
          {formatDisplayDate(selectedDate)}
        </Text>

        {!hasContent ? (
          <View style={styles.noContentContainer}>
            <Text style={styles.noContentText}>이 날짜에는 기록이 없어요</Text>
          </View>
        ) : (
          <>
            {recordedItems.map(renderRecord)}
            {unrecordedTasks.map(renderUnrecordedTask)}
          </>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom || 20 }]}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        <CalendarHeatmap
          year={calendarYear}
          month={calendarMonth}
          selectedDate={selectedDate}
          recordDates={recordDates}
          onSelectDate={setSelectedDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />

        <WeekSummary records={weekRecords} />

        {renderSelectedDateView()}
      </ScrollView>
    </View>
  );
};
