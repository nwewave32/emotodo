import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { colors } from '../constants/colors';
import { messages } from '../constants/messages';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface EnergySliderProps {
  selectedLevel: number | null;
  onSelect: (level: number) => void;
}

const energyColors = [
  colors.emotionAnxious,
  colors.emotionTired,
  colors.emotionNeutral,
  colors.emotionRelief,
  colors.emotionHappy,
];

export const EnergySlider: React.FC<EnergySliderProps> = ({
  selectedLevel,
  onSelect,
}) => {
  const handleSelect = (level: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onSelect(level);
  };

  return (
    <View style={styles.container}>
      {messages.energyLevels.map(({ level, label, emoji }, index) => {
        const isSelected = selectedLevel === level;
        const barColor = energyColors[index];
        const barWidth = `${level * 20}%` as const;

        return (
          <TouchableOpacity
            key={level}
            style={[
              styles.row,
              isSelected && styles.rowSelected,
            ]}
            onPress={() => handleSelect(level)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{emoji}</Text>
            <Text
              style={[
                styles.label,
                isSelected && { color: barColor, fontWeight: '600' },
              ]}
            >
              {label}
            </Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: barWidth,
                    backgroundColor: isSelected ? barColor : colors.textLight,
                    opacity: isSelected ? 1 : 0.3,
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.cardElevated,
    gap: 12,
  },
  rowSelected: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emoji: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    width: 40,
  },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.cardElevated,
  },
  barFill: {
    height: 8,
    borderRadius: 4,
  },
});
