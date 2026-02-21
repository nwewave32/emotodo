import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Task, DailyRecord, TaskStatus } from '../types';
import { useColors } from '../hooks/useColors';
import { messages } from '../constants/messages';
import { getDifficultyConfig } from '../constants/difficulty';
import { GlowDot } from './GlowDot';
import { QuickTimerButtons } from './QuickTimerButtons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface TaskCardProps {
  task: Task;
  todayRecord?: DailyRecord;
  onPressTimer: (minutes: number) => void;
  onPressAction: (status: TaskStatus) => void;
  onPressEdit: () => void;
}

const getEmotionEmoji = (emotionKey: string, status: TaskStatus): string => {
  const emotions = messages.emotions[status];
  return emotions?.find((e) => e.key === emotionKey)?.emoji || '';
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  todayRecord,
  onPressTimer,
  onPressAction,
  onPressEdit,
}) => {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);
  const isRecorded = !!todayRecord;
  const status = todayRecord?.status;

  const difficultyConfig = useMemo(() => getDifficultyConfig(colors), [colors]);

  const statusBorderColors: Record<TaskStatus, string> = useMemo(() => ({
    completed: colors.completed,
    partial: colors.partial,
    postponed: colors.postponed,
  }), [colors]);

  const emotionColorMap: Record<string, string> = useMemo(() => ({
    happy: colors.emotionHappy,
    relief: colors.emotionRelief,
    tired: colors.emotionTired,
    proud: colors.emotionProud,
    anxious: colors.emotionAnxious,
    neutral: colors.emotionNeutral,
    okay: colors.emotionRelief,
    busy: colors.emotionAnxious,
    frustrated: colors.emotionAnxious,
  }), [colors]);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: 8,
      borderLeftWidth: 3,
      borderLeftColor: colors.border,
    },
    collapsedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 28,
    },
    title: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.textPrimary,
      flex: 1,
      marginRight: 12,
    },
    collapsedRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    timeHint: {
      fontSize: 13,
      color: colors.textLight,
    },
    expandedContent: {
      marginTop: 14,
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    timerSection: {
      marginBottom: 14,
    },
    timerLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    completeButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: colors.completed,
      alignItems: 'center',
    },
    completeButtonText: {
      color: colors.white,
      fontSize: 15,
      fontWeight: '600',
    },
    secondaryActions: {
      flexDirection: 'row',
      gap: 16,
    },
    textLink: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    recordSummary: {
      gap: 4,
      marginBottom: 8,
    },
    recordDetail: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    notePreview: {
      fontSize: 13,
      color: colors.textLight,
      marginTop: 4,
    },
    editLink: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '500',
    },
  }), [colors]);

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const borderColor = isRecorded && status
    ? statusBorderColors[status]
    : task.difficulty
      ? difficultyConfig[task.difficulty].color
      : colors.border;

  return (
    <TouchableOpacity
      style={[styles.container, { borderLeftColor: borderColor }]}
      onPress={handleToggle}
      activeOpacity={0.7}
    >
      {/* Collapsed: single row */}
      <View style={styles.collapsedRow}>
        <Text style={styles.title} numberOfLines={1}>
          {task.title}
        </Text>
        <View style={styles.collapsedRight}>
          {isRecorded && todayRecord?.emotion && (
            <GlowDot
              color={emotionColorMap[todayRecord.emotion] || colors.primary}
              size={10}
            />
          )}
          {!isRecorded && (
            <Text style={styles.timeHint}>{task.estimatedMinutes}분</Text>
          )}
        </View>
      </View>

      {/* Expanded content */}
      {expanded && !isRecorded && (
        <View style={styles.expandedContent}>
          <View style={styles.timerSection}>
            <Text style={styles.timerLabel}>타이머로 시작</Text>
            <QuickTimerButtons onSelectMinutes={onPressTimer} />
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => onPressAction('completed')}
            >
              <Text style={styles.completeButtonText}>완료</Text>
            </TouchableOpacity>
            <View style={styles.secondaryActions}>
              <TouchableOpacity onPress={() => onPressAction('partial')}>
                <Text style={styles.textLink}>부분완료</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onPressAction('postponed')}>
                <Text style={styles.textLink}>미룸</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {expanded && isRecorded && todayRecord && (
        <View style={styles.expandedContent}>
          <View style={styles.recordSummary}>
            {todayRecord.emotion && (
              <Text style={styles.recordDetail}>
                {getEmotionEmoji(todayRecord.emotion, todayRecord.status)}{' '}
                {messages.emotions[todayRecord.status]?.find(
                  (e) => e.key === todayRecord.emotion,
                )?.label}
              </Text>
            )}
            {todayRecord.energyLevel != null && (
              <Text style={styles.recordDetail}>
                {messages.energyLevels[todayRecord.energyLevel - 1]?.emoji}{' '}
                에너지 {messages.energyLevels[todayRecord.energyLevel - 1]?.label}
              </Text>
            )}
            {todayRecord.note && (
              <Text style={styles.notePreview} numberOfLines={2}>
                {todayRecord.note}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={onPressEdit}>
            <Text style={styles.editLink}>수정</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};
