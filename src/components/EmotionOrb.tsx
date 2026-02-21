import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { colors } from '../constants/colors';
import { messages } from '../constants/messages';
import { TaskStatus } from '../types';

interface EmotionOrbProps {
  status: TaskStatus;
  selectedEmotion: string | null;
  onSelect: (emotion: string) => void;
}

const emotionColorMap: Record<string, { color: string; glow: string }> = {
  happy: { color: colors.emotionHappy, glow: colors.glowHappy },
  relief: { color: colors.emotionRelief, glow: colors.glowRelief },
  tired: { color: colors.emotionTired, glow: colors.glowTired },
  proud: { color: colors.emotionProud, glow: colors.glowProud },
  anxious: { color: colors.emotionAnxious, glow: colors.glowAnxious },
  neutral: { color: colors.emotionNeutral, glow: colors.glowNeutral },
  okay: { color: colors.emotionRelief, glow: colors.glowRelief },
  busy: { color: colors.emotionAnxious, glow: colors.glowAnxious },
  frustrated: { color: colors.emotionAnxious, glow: colors.glowAnxious },
};

const getEmotionColors = (key: string) =>
  emotionColorMap[key] || { color: colors.primary, glow: colors.primaryMuted };

const ORB_SIZE = 64;
const ORB_SELECTED_SIZE = 72;

const OrbItem: React.FC<{
  emotionKey: string;
  emoji: string;
  label: string;
  isSelected: boolean;
  onPress: () => void;
}> = ({ emotionKey, emoji, label, isSelected, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const { color, glow } = getEmotionColors(emotionKey);

  const handlePress = () => {
    scaleAnim.setValue(0.85);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 200,
      useNativeDriver: true,
    }).start();
    onPress();
  };

  const size = isSelected ? ORB_SELECTED_SIZE : ORB_SIZE;

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Animated.View
        style={[
          styles.orb,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ scale: scaleAnim }],
            backgroundColor: isSelected ? glow : colors.cardElevated,
            ...(isSelected && Platform.OS === 'ios'
              ? {
                  shadowColor: color,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.5,
                  shadowRadius: 12,
                }
              : {}),
            ...(isSelected && Platform.OS === 'android'
              ? { elevation: 6 }
              : {}),
          },
        ]}
      >
        <Text style={styles.emoji}>{emoji}</Text>
      </Animated.View>
      <Text
        style={[
          styles.label,
          isSelected && { color, fontWeight: '600' },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export const EmotionOrb: React.FC<EmotionOrbProps> = ({
  status,
  selectedEmotion,
  onSelect,
}) => {
  const emotions = messages.emotions[status];
  const topRow = emotions.slice(0, 3);
  const bottomRow = emotions.slice(3);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {topRow.map((e) => (
          <OrbItem
            key={e.key}
            emotionKey={e.key}
            emoji={e.emoji}
            label={e.label}
            isSelected={selectedEmotion === e.key}
            onPress={() => onSelect(e.key)}
          />
        ))}
      </View>
      <View style={[styles.row, styles.bottomRow]}>
        {bottomRow.map((e) => (
          <OrbItem
            key={e.key}
            emotionKey={e.key}
            emoji={e.emoji}
            label={e.label}
            isSelected={selectedEmotion === e.key}
            onPress={() => onSelect(e.key)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  bottomRow: {
    paddingHorizontal: 20,
  },
  orb: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 28,
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
});
