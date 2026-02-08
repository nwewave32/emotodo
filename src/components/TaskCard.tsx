import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task, DailyRecord } from '../types';
import { colors } from '../constants/colors';
import { DIFFICULTY_CONFIG } from '../constants/difficulty';
import { QuickTimerButtons } from './QuickTimerButtons';

interface TaskCardProps {
  task: Task;
  todayRecord?: DailyRecord;
  onPressTimer: (minutes: number) => void;
  onPressComplete: () => void;
  onPressPostponed: () => void;
  onPressPartial: () => void;
  onPressEdit: () => void;
}

const statusBadgeConfig = {
  completed: { label: '완료', style: 'completedBadge' as const },
  partial: { label: '부분완료', style: 'partialBadge' as const },
  postponed: { label: '미룸', style: 'postponedBadge' as const },
};

const statusCardStyle = {
  completed: 'completed' as const,
  partial: 'partial' as const,
  postponed: 'postponed' as const,
};


export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  todayRecord,
  onPressTimer,
  onPressComplete,
  onPressPostponed,
  onPressPartial,
  onPressEdit,
}) => {
  const isRecorded = !!todayRecord;
  const status = todayRecord?.status;

  const Wrapper = isRecorded ? TouchableOpacity : View;
  const wrapperProps = isRecorded
    ? { onPress: onPressEdit, activeOpacity: 0.7 }
    : {};

  return (
    <Wrapper
      style={[
        styles.container,
        isRecorded && status && styles[statusCardStyle[status]],
      ]}
      {...wrapperProps}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{task.title}</Text>
          {task.difficulty && (
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: DIFFICULTY_CONFIG[task.difficulty].bgColor },
              ]}
            >
              <Text
                style={[
                  styles.difficultyText,
                  { color: DIFFICULTY_CONFIG[task.difficulty].color },
                ]}
              >
                {DIFFICULTY_CONFIG[task.difficulty].label}
              </Text>
            </View>
          )}
        </View>
        {isRecorded && status && (
          <View
            style={[
              styles.statusBadge,
              styles[statusBadgeConfig[status].style],
            ]}
          >
            <Text style={styles.statusText}>
              {statusBadgeConfig[status].label}
            </Text>
          </View>
        )}
      </View>

      {!isRecorded && (
        <>
          <View style={styles.timerSection}>
            <Text style={styles.timerLabel}>타이머로 시작하기</Text>
            <QuickTimerButtons onSelectMinutes={onPressTimer} />
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.completeButton]}
              onPress={onPressComplete}
              accessibilityRole="button"
              accessibilityLabel={`${task.title} 완료`}
            >
              <Text style={styles.completeButtonText}>완료</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.partialButton]}
              onPress={onPressPartial}
              accessibilityRole="button"
              accessibilityLabel={`${task.title} 부분완료`}
            >
              <Text style={styles.partialButtonText}>부분완료</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.postponedButton]}
              onPress={onPressPostponed}
              accessibilityRole="button"
              accessibilityLabel={`${task.title} 미룸`}
            >
              <Text style={styles.postponedButtonText}>미룸</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  completed: {
    backgroundColor: colors.completed,
  },
  partial: {
    backgroundColor: colors.partial,
  },
  postponed: {
    backgroundColor: colors.incomplete,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
    flexShrink: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedBadge: {
    backgroundColor: 'rgba(107, 157, 252, 0.2)',
  },
  partialBadge: {
    backgroundColor: 'rgba(150, 130, 200, 0.2)',
  },
  postponedBadge: {
    backgroundColor: 'rgba(113, 128, 150, 0.2)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  timerSection: {
    marginBottom: 16,
  },
  timerLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: colors.primary,
  },
  partialButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  postponedButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  completeButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  partialButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '500',
  },
  postponedButtonText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  },
});
