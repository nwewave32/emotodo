import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTaskStore } from '../store/taskStore';
import { useRecordStore } from '../store/recordStore';
import { colors } from '../constants/colors';
import { formatDisplayDate, getTodayString } from '../utils/date';
import { messages } from '../constants/messages';
import { DailyRecord, Task, TaskStatus } from '../types';
import { Calendar, DateStatus } from '../components/Calendar';

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
  const { tasks, loadTasks, getTasksForDate } = useTaskStore();
  const { records, loadRecords, isLoading, getRecordsForDate } = useRecordStore();
  const [groupedRecords, setGroupedRecords] = useState<GroupedRecord[]>([]);

  const today = getTodayString();
  const [selectedDate, setSelectedDate] = useState<string | null>(today);
  const [showAllRecords, setShowAllRecords] = useState(false);
  const [calendarYear, setCalendarYear] = useState(() => new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(() => new Date().getMonth());

  useEffect(() => {
    loadTasks();
    loadRecords();
  }, []);

  useEffect(() => {
    const taskMap = new Map(tasks.map((t) => [t.id, t.title]));
    const recordsWithTitle = records.map((r) => ({
      ...r,
      taskTitle: taskMap.get(r.taskId) || '삭제된 할 일',
    }));

    const groups: { [key: string]: (DailyRecord & { taskTitle: string })[] } = {};
    recordsWithTitle.forEach((record) => {
      if (!groups[record.date]) {
        groups[record.date] = [];
      }
      groups[record.date].push(record);
    });

    const sortedGroups = Object.entries(groups)
      .map(([date, recs]) => ({
        date,
        displayDate: formatDisplayDate(date),
        records: recs.sort(
          (a, b) =>
            new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
        ),
      }))
      .sort((a, b) => b.date.localeCompare(a.date));

    setGroupedRecords(sortedGroups);
  }, [records, tasks]);

  const recordDates = useMemo(() => {
    const map = new Map<string, DateStatus>();
    const dateGroups = new Map<string, Set<TaskStatus>>();

    records.forEach((r) => {
      if (!dateGroups.has(r.date)) {
        dateGroups.set(r.date, new Set());
      }
      dateGroups.get(r.date)?.add(r.status);
    });

    dateGroups.forEach((statuses, date) => {
      if (statuses.size > 1) {
        map.set(date, 'mixed');
      } else if (statuses.has('completed')) {
        map.set(date, 'completed');
      } else if (statuses.has('partial')) {
        map.set(date, 'partial');
      } else {
        map.set(date, 'postponed');
      }
    });

    return map;
  }, [records]);

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
      // Store already handles loading state reset on error
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

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setShowAllRecords(false);
  };

  const handleShowAll = () => {
    setShowAllRecords(true);
    setSelectedDate(null);
  };

  const handleBackToCalendar = () => {
    setShowAllRecords(false);
    setSelectedDate(today);
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

      {record.energyLevel != null && (
        <Text style={styles.energyText}>
          {messages.energyLevels[record.energyLevel - 1]?.emoji}{' '}
          에너지 {messages.energyLevels[record.energyLevel - 1]?.label}
        </Text>
      )}

      {record.status === 'postponed' && record.reason && (
        <Text style={styles.reasonText}>{getReasonLabel(record.reason)}</Text>
      )}

      {record.status === 'postponed' && record.reasonNote && (
        <Text style={styles.reasonNoteText}>{record.reasonNote}</Text>
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

  const renderDateGroup = ({ item }: { item: GroupedRecord }) => (
    <View style={styles.dateGroup}>
      <Text style={styles.dateHeader}>{item.displayDate}</Text>
      {item.records.map(renderRecord)}
    </View>
  );

  const renderSelectedDateView = () => {
    if (!selectedDate || !selectedDateData) return null;

    const { recordedItems, unrecordedTasks } = selectedDateData;
    const hasContent = recordedItems.length > 0 || unrecordedTasks.length > 0;

    return (
      <View style={styles.selectedDateSection}>
        <View style={styles.selectedDateHeader}>
          <Text style={styles.selectedDateLabel}>
            {formatDisplayDate(selectedDate)}
          </Text>
          <TouchableOpacity onPress={handleShowAll}>
            <Text style={styles.showAllButton}>전체 보기</Text>
          </TouchableOpacity>
        </View>

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

  if (showAllRecords) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.allRecordsHeader}>
          <TouchableOpacity onPress={handleBackToCalendar}>
            <Text style={styles.backButton}>◀ 달력</Text>
          </TouchableOpacity>
          <Text style={styles.allRecordsTitle}>전체 기록</Text>
          <View style={styles.headerSpacer} />
        </View>
        {groupedRecords.length === 0 ? (
          <View style={styles.emptyInner}>
            <Text style={styles.emptyText}>아직 기록이 없어요</Text>
            <Text style={styles.emptySubtext}>
              할 일을 완료하거나 기록하면{'\n'}여기에 나타나요
            </Text>
          </View>
        ) : (
          <FlatList
            data={groupedRecords}
            keyExtractor={(item) => item.date}
            renderItem={renderDateGroup}
            contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom || 20 }]}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
            }
          />
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom || 20 }]}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        <Calendar
          year={calendarYear}
          month={calendarMonth}
          selectedDate={selectedDate}
          recordDates={recordDates}
          onSelectDate={handleSelectDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
        {renderSelectedDateView()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  listContent: {
    padding: 20,
  },
  emptyInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  // Calendar date selection
  selectedDateSection: {
    marginTop: 4,
  },
  selectedDateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedDateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  showAllButton: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  noContentContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  noContentText: {
    fontSize: 14,
    color: colors.textLight,
  },
  // All records view header
  allRecordsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  allRecordsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  headerSpacer: {
    width: 50,
  },
  // Record cards (preserved from original)
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
  unrecordedCard: {
    borderLeftWidth: 3,
    borderLeftColor: colors.incomplete,
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
  reasonNoteText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
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
