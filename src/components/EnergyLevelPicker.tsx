import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { messages } from '../constants/messages';

interface EnergyLevelPickerProps {
  selectedLevel: number | null;
  onSelect: (level: number) => void;
}

export const EnergyLevelPicker: React.FC<EnergyLevelPickerProps> = ({
  selectedLevel,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{messages.questions.energyLevel}</Text>
      <View style={styles.levelsRow}>
        {messages.energyLevels.map(({ level, label, emoji }) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.levelButton,
              selectedLevel === level && styles.levelButtonSelected,
            ]}
            onPress={() => onSelect(level)}
          >
            <Text style={styles.emoji}>{emoji}</Text>
            <Text
              style={[
                styles.levelLabel,
                selectedLevel === level && styles.levelLabelSelected,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  levelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  levelButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  levelButtonSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  emoji: {
    fontSize: 22,
  },
  levelLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  levelLabelSelected: {
    color: colors.primary,
    fontWeight: '500',
  },
});
