import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useColors } from '../hooks/useColors';
import { useThemeStore } from '../store/themeStore';
import { formatDisplayDate } from '../utils/date';
import { getGreeting } from '../utils/greeting';
import { progressMessages } from '../constants/messages';
import { ProgressOrb } from './ProgressOrb';

interface GreetingHeaderProps {
  completed: number;
  partial: number;
  postponed: number;
  total: number;
  onPressAdd: () => void;
}

export const GreetingHeader: React.FC<GreetingHeaderProps> = ({
  completed,
  partial,
  postponed,
  total,
  onPressAdd,
}) => {
  const colors = useColors();
  const { mode, toggleTheme } = useThemeStore();
  const greeting = getGreeting();
  const recorded = completed + partial + postponed;

  const progressText =
    total === 0
      ? progressMessages.emptyState
      : recorded >= total
        ? progressMessages.allDone
        : progressMessages.format(recorded, total);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 16,
    },
    left: {
      flex: 1,
      paddingRight: 16,
    },
    greetingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 4,
    },
    greeting: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    themeToggle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.cardElevated,
      justifyContent: 'center',
      alignItems: 'center',
    },
    themeToggleText: {
      fontSize: 16,
    },
    date: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    progress: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    right: {
      alignItems: 'center',
      gap: 8,
    },
    addButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addButtonText: {
      color: colors.white,
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 22,
    },
  }), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.greetingRow}>
          <Text style={styles.greeting}>
            {greeting.emoji} {greeting.text}
          </Text>
          <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
            <Text style={styles.themeToggleText}>
              {mode === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.date}>{formatDisplayDate(new Date())}</Text>
        <Text style={styles.progress}>{progressText}</Text>
      </View>
      <View style={styles.right}>
        <ProgressOrb
          completed={completed}
          partial={partial}
          postponed={postponed}
          total={total}
        />
        <TouchableOpacity style={styles.addButton} onPress={onPressAdd}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
