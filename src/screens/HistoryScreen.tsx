import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTaskStore } from '../store/taskStore';
import { useRecordStore } from '../store/recordStore';
import { colors } from '../constants/colors';
import { formatDisplayDate } from '../utils/date';
import { messages } from '../constants/messages';
import { DailyRecord, TaskStatus } from '../types';

interface GroupedRecord {
  date: string;
  displayDate: string;
  records: (DailyRecord & { taskTitle: string })[];
}

const statusEmoji: Record<TaskStatus, string> = {
  completed: '✓',
  partial: '△',
  postponed: '−',
};

const statusCardStyle: Record<TaskStatus, 'completedCard' | 'partialCard' | 'postponedCard'> = {
  completed: 'completedCard',
  partial: 'partialCard',
  postponed: 'postponedCard',
};

export const HistoryScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { tasks, loadTasks } = useTaskStore();
  const { records, loadRecords, isLoading } = useRecordStore();
  const [groupedRecords, setGroupedRecords] = useState<GroupedRecord[]>([]);

  useEffect(() => {
    loadTasks();
    loadRecords();
  }, []);

  useEffect(() => {
    // Group records by date
    const taskMap = new Map(tasks.map((t) => [t.id, t.title]));
    const recordsWithTitle = records.map((r) => ({
      ...r,
      taskTitle: taskMap.get(r.taskId) || '삭제된 할 일',
    }));

    // Group by date
    const groups: { [key: string]: (DailyRecord & { taskTitle: string })[] } = {};
    recordsWithTitle.forEach((record) => {
      if (!groups[record.date]) {
        groups[record.date] = [];
      }
      groups[record.date].push(record);
    });

    // Convert to array and sort by date descending
    const sortedGroups = Object.entries(groups)
      .map(([date, records]) => ({
        date,
        displayDate: formatDisplayDate(date),
        records: records.sort(
          (a, b) =>
            new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
        ),
      }))
      .sort((a, b) => b.date.localeCompare(a.date));

    setGroupedRecords(sortedGroups);
  }, [records, tasks]);

  const handleRefresh = async () => {
    await Promise.all([loadTasks(), loadRecords()]);
  };

  const getEmotionEmoji = (emotionKey: string, status: TaskStatus): string => {
    const emotions = messages.emotions[status];
    if (!emotions) return '';
    const emotion = emotions.find((e) => e.key === emotionKey);
    return emotion?.emoji || '';
  };

  const getReasonLabel = (reasonKey: string): string => {
    const reason = messages.reasons.find((r) => r.key === reasonKey);
    return reason?.label || reasonKey;
  };

  const renderRecord = (record: DailyRecord & { taskTitle: string }) => (
    <View
      key={record.id}
      style={[
        styles.recordCard,
        styles[statusCardStyle[record.status]],
      ]}
    >
      <View style={styles.recordHeader}>
        <Text style={styles.taskTitle}>{record.taskTitle}</Text>
        <Text style={styles.statusEmoji}>
          {statusEmoji[record.status]}
        </Text>
      </View>

      {record.emotion && (
        <Text style={styles.emotionText}>
          {getEmotionEmoji(record.emotion, record.status)}{' '}
          {messages.emotions[record.status]?.find(
            (e) => e.key === record.emotion
          )?.label || record.emotion}
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

  const renderDateGroup = ({ item }: { item: GroupedRecord }) => (
    <View style={styles.dateGroup}>
      <Text style={styles.dateHeader}>{item.displayDate}</Text>
      {item.records.map(renderRecord)}
    </View>
  );

  if (groupedRecords.length === 0) {
    return (
      <View style={[styles.emptyContainer, { paddingTop: insets.top }]}>
        <Text style={styles.emptyText}>아직 기록이 없어요</Text>
        <Text style={styles.emptySubtext}>
          할 일을 완료하거나 기록하면{'\n'}여기에 나타나요
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={groupedRecords}
        keyExtractor={(item) => item.date}
        renderItem={renderDateGroup}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom || 20 }]}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  recordCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  completedCard: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  partialCard: {
    borderLeftWidth: 3,
    borderLeftColor: colors.partial,
  },
  postponedCard: {
    borderLeftWidth: 3,
    borderLeftColor: colors.textLight,
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
  statusEmoji: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  emotionText: {
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
});
