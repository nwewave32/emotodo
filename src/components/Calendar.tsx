import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { getCalendarDays, getMonthLabel, getTodayString, DAY_LABELS } from '../utils/date';

export type DateStatus = 'completed' | 'partial' | 'postponed' | 'mixed';

interface CalendarProps {
  year: number;
  month: number;
  selectedDate: string | null;
  recordDates: Map<string, DateStatus>;
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const dotColors: Record<DateStatus, string> = {
  completed: colors.primary,
  partial: colors.partial,
  postponed: colors.textLight,
  mixed: colors.partial,
};

export const Calendar: React.FC<CalendarProps> = ({
  year,
  month,
  selectedDate,
  recordDates,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}) => {
  const today = getTodayString();
  const days = useMemo(() => getCalendarDays(year, month), [year, month]);
  const monthLabel = useMemo(() => getMonthLabel(year, month), [year, month]);

  const renderDay = (dateStr: string | null, index: number) => {
    if (!dateStr) {
      return <View key={`empty-${index}`} style={styles.dayCell} />;
    }

    const dayNumber = parseInt(dateStr.split('-')[2], 10);
    const isToday = dateStr === today;
    const isSelected = dateStr === selectedDate;
    const status = recordDates.get(dateStr);

    return (
      <TouchableOpacity
        key={dateStr}
        style={[
          styles.dayCell,
          isToday && styles.todayCell,
          isSelected && styles.selectedCell,
        ]}
        onPress={() => onSelectDate(dateStr)}
        activeOpacity={0.6}
      >
        <Text
          style={[
            styles.dayText,
            isToday && styles.todayText,
            isSelected && styles.selectedText,
          ]}
        >
          {dayNumber}
        </Text>
        {status && (
          <View
            style={[styles.dot, { backgroundColor: dotColors[status] }]}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onPrevMonth} style={styles.navButton}>
          <Text style={styles.navText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <TouchableOpacity onPress={onNextMonth} style={styles.navButton}>
          <Text style={styles.navText}>▶</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekHeader}>
        {DAY_LABELS.map((label, i) => (
          <View key={label} style={styles.dayCell}>
            <Text
              style={[
                styles.weekLabel,
                i === 0 && styles.sundayLabel,
                i === 6 && styles.saturdayLabel,
              ]}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map((day, index) => renderDay(day, index))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  navButton: {
    padding: 8,
  },
  navText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sundayLabel: {
    color: colors.danger,
  },
  saturdayLabel: {
    color: colors.primary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    minHeight: 40,
  },
  dayText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  todayCell: {
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
  },
  todayText: {
    fontWeight: '700',
    color: colors.primary,
  },
  selectedCell: {
    borderRadius: 20,
    backgroundColor: colors.primary,
  },
  selectedText: {
    color: colors.white,
    fontWeight: '700',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 2,
  },
});
