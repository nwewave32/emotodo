import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { formatDate } from '../utils/date';
import { TaskStatus } from '../types';

interface WeekSummaryProps {
  records: Array<{ date: string; status: TaskStatus }>;
}

const statusColors: Record<TaskStatus, string> = {
  completed: colors.completed,
  partial: colors.partial,
  postponed: colors.postponed,
};

export const WeekSummary: React.FC<WeekSummaryProps> = ({ records }) => {
  const weekData = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const days: Array<{ date: string; color: string | null }> = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - dayOfWeek + i);
      const dateStr = formatDate(d);

      const dayRecords = records.filter((r) => r.date === dateStr);
      let dayColor: string | null = null;

      if (dayRecords.length > 0) {
        const statuses = new Set(dayRecords.map((r) => r.status));
        if (statuses.has('completed') && statuses.size === 1) {
          dayColor = statusColors.completed;
        } else if (statuses.has('completed')) {
          dayColor = statusColors.partial;
        } else if (statuses.has('partial')) {
          dayColor = statusColors.partial;
        } else {
          dayColor = statusColors.postponed;
        }
      }

      days.push({ date: dateStr, color: dayColor });
    }

    const recordedDays = days.filter((d) => d.color !== null).length;
    return { days, recordedDays };
  }, [records]);

  return (
    <View style={styles.container}>
      <View style={styles.barRow}>
        {weekData.days.map((day) => (
          <View
            key={day.date}
            style={[
              styles.block,
              { backgroundColor: day.color || colors.cardElevated },
            ]}
          />
        ))}
      </View>
      <Text style={styles.summary}>
        이번 주: {weekData.recordedDays}일 기록 완료
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  barRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  block: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  summary: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
