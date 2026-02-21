import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useColors } from '../hooks/useColors';
import { withOpacity } from '../utils/color';

interface BreathingRingProps {
  remainingFraction: number;
  isRunning: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  timeText: string;
  subtitle?: string;
}

const RING_SIZE = 300;
const STROKE_WIDTH = 8;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const BreathingRing: React.FC<BreathingRingProps> = ({
  remainingFraction,
  isRunning,
  isPaused,
  isCompleted,
  timeText,
  subtitle,
}) => {
  const colors = useColors();
  const breatheScale = useRef(new Animated.Value(1)).current;
  const completeScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRunning && !isPaused && !isCompleted) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(breatheScale, {
            toValue: 1.03,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(breatheScale, {
            toValue: 0.97,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      );
      animation.start();
      return () => animation.stop();
    } else {
      breatheScale.setValue(1);
    }
  }, [isRunning, isPaused, isCompleted]);

  useEffect(() => {
    if (isCompleted) {
      Animated.sequence([
        Animated.spring(completeScale, {
          toValue: 1.05,
          friction: 4,
          tension: 150,
          useNativeDriver: true,
        }),
        Animated.spring(completeScale, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isCompleted]);

  const strokeDashoffset = CIRCUMFERENCE * (1 - remainingFraction);
  const ringColor = isCompleted
    ? colors.timerComplete
    : isPaused
      ? colors.timerPaused
      : colors.timerActive;

  const animatedScale = isCompleted ? completeScale : breatheScale;

  const styles = useMemo(() => StyleSheet.create({
    container: {
      width: RING_SIZE + 40,
      height: RING_SIZE + 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    ambientGlow: {
      position: 'absolute',
      width: RING_SIZE + 40,
      height: RING_SIZE + 40,
      borderRadius: (RING_SIZE + 40) / 2,
    },
    ringWrapper: {
      width: RING_SIZE,
      height: RING_SIZE,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    },
    timeText: {
      fontSize: 56,
      fontWeight: '300',
      color: colors.textPrimary,
      fontVariant: ['tabular-nums'],
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 8,
      fontWeight: '500',
    },
  }), [colors]);

  return (
    <View style={styles.container}>
      {/* Ambient glow behind the ring */}
      <View
        style={[
          styles.ambientGlow,
          {
            backgroundColor: withOpacity(ringColor, 0.05),
            ...(Platform.OS === 'ios'
              ? {
                  shadowColor: ringColor,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.15,
                  shadowRadius: 60,
                }
              : {}),
          },
        ]}
      />

      <Animated.View
        style={[
          styles.ringWrapper,
          { transform: [{ scale: animatedScale }] },
        ]}
      >
        <Svg width={RING_SIZE} height={RING_SIZE}>
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            stroke={colors.timerRingBg}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            stroke={ringColor}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
          />
        </Svg>
        <View style={styles.content}>
          <Text style={styles.timeText}>{timeText}</Text>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                isCompleted && { color: colors.timerComplete },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </Animated.View>
    </View>
  );
};
