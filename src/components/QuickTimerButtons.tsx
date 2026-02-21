import React, { useMemo } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useColors } from '../hooks/useColors';

interface QuickTimerButtonsProps {
  onSelectMinutes: (minutes: number) => void;
}

const QUICK_TIMES = [5, 10, 15];

export const QuickTimerButtons: React.FC<QuickTimerButtonsProps> = ({
  onSelectMinutes,
}) => {
  const colors = useColors();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: 8,
    },
    button: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: colors.primaryMuted,
    },
    buttonText: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: '500',
    },
  }), [colors]);

  return (
    <View style={styles.container}>
      {QUICK_TIMES.map((minutes) => (
        <TouchableOpacity
          key={minutes}
          style={styles.button}
          onPress={() => onSelectMinutes(minutes)}
        >
          <Text style={styles.buttonText}>{minutes}분</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
