import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
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
  const greeting = getGreeting();
  const recorded = completed + partial + postponed;

  const progressText =
    total === 0
      ? progressMessages.emptyState
      : recorded >= total
        ? progressMessages.allDone
        : progressMessages.format(recorded, total);

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.greeting}>
          {greeting.emoji} {greeting.text}
        </Text>
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

const styles = StyleSheet.create({
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
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
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
});
