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
      <View style={styles.tagsRow}>
        {emotions.map((emotion) => (
          <TouchableOpacity
            key={emotion.key}
            style={[
              styles.tag,
              selectedEmotion === emotion.key && styles.tagSelected,
            ]}
            onPress={() => onSelect(emotion.key)}
          >
            <Text style={styles.emoji}>{emotion.emoji}</Text>
            <Text
              style={[
                styles.tagLabel,
                selectedEmotion === emotion.key && styles.tagLabelSelected,
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
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  tagSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  emoji: {
    fontSize: 18,
  },
  tagLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  tagLabelSelected: {
    color: colors.primary,
    fontWeight: '500',
  },
});
