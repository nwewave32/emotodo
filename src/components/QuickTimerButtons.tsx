import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

interface QuickTimerButtonsProps {
  onSelectMinutes: (minutes: number) => void;
}

const QUICK_TIMES = [5, 10, 15];

export const QuickTimerButtons: React.FC<QuickTimerButtonsProps> = ({
  onSelectMinutes,
}) => {
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
  },
  buttonText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
});
