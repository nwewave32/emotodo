import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useColors } from '../hooks/useColors';
import { withOpacity } from '../utils/color';
import { getCalendarDays, getMonthLabel, getTodayString, DAY_LABELS } from '../utils/date';

export interface HeatmapDateInfo {
  status: 'completed' | 'partial' | 'postponed' | 'mixed';
  dominantEmotion?: string;
}

interface CalendarHeatmapProps {
  year: number;
  month: number;
  selectedDate: string | null;
  recordDates: Map<string, HeatmapDateInfo>;
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({
  year,
  month,
  selectedDate,
  recordDates,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}) => {
  const colors = useColors();
  const today = getTodayString();
  const days = useMemo(() => getCalendarDays(year, month), [year, month]);
  const monthLabel = useMemo(() => getMonthLabel(year, month), [year, month]);

  const heatmapColors: Record<string, string> = useMemo(() => ({
    completed: colors.heatmapCompleted,
    partial: colors.heatmapPartial,
    postponed: colors.heatmapPostponed,
    mixed: colors.heatmapMixed,
  }), [colors]);

  const styles = useMemo(() => StyleSheet.create({
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
      color: colors.textPrimary,
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
      paddingVertical: 8,
      minHeight: 48,
      borderRadius: 8,
    },
    dayText: {
      fontSize: 14,
      color: colors.textPrimary,
    },
    todayCell: {
      borderWidth: 1.5,
      borderColor: withOpacity(colors.primary, 0.3),
      borderRadius: 8,
    },
    todayText: {
      fontWeight: '700',
      color: colors.primary,
    },
    selectedUnderline: {
      width: 16,
      height: 2,
      borderRadius: 1,
      backgroundColor: colors.primary,
      marginTop: 3,
    },
  }), [colors]);

  const renderDay = (dateStr: string | null, index: number) => {
    if (!dateStr) {
      return <View key={`empty-${index}`} style={styles.dayCell} />;
    }

    const dayNumber = parseInt(dateStr.split('-')[2], 10);
    const isToday = dateStr === today;
    const isSelected = dateStr === selectedDate;
    const dateInfo = recordDates.get(dateStr);
    const cellBg = dateInfo ? heatmapColors[dateInfo.status] : undefined;

    return (
      <TouchableOpacity
        key={dateStr}
        style={[
          styles.dayCell,
          cellBg ? { backgroundColor: cellBg } : undefined,
          isToday && styles.todayCell,
        ]}
        onPress={() => onSelectDate(dateStr)}
        activeOpacity={0.6}
      >
        <Text
          style={[
            styles.dayText,
            isToday && styles.todayText,
          ]}
        >
          {dayNumber}
        </Text>
        {isSelected && <View style={styles.selectedUnderline} />}
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
