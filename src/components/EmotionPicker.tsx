import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { messages } from '../constants/messages';
import { TaskStatus } from '../types';

interface EmotionPickerProps {
  status: TaskStatus;
  selectedEmotion: string | null;
  onSelect: (emotion: string) => void;
}

export const EmotionPicker: React.FC<EmotionPickerProps> = ({
  status,
  selectedEmotion,
  onSelect,
}) => {
  const emotions = messages.emotions[status];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{messages.questions.howDoYouFeel}</Text>
      <View style={styles.emotionsGrid}>
        {emotions.map((emotion) => (
          <TouchableOpacity
            key={emotion.key}
            style={[
              styles.emotionButton,
              selectedEmotion === emotion.key && styles.emotionButtonSelected,
            ]}
            onPress={() => onSelect(emotion.key)}
          >
            <Text style={styles.emoji}>{emotion.emoji}</Text>
            <Text
              style={[
                styles.emotionLabel,
                selectedEmotion === emotion.key && styles.emotionLabelSelected,
              ]}
            >
              {emotion.label}
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
  emotionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  emotionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 80,
  },
  emotionButtonSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  emotionLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emotionLabelSelected: {
    color: colors.primary,
    fontWeight: '500',
  },
});
