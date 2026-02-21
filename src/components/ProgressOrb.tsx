import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useColors } from '../hooks/useColors';
import { usePulse } from '../hooks/useAnimatedValue';

interface ProgressOrbProps {
  completed: number;
  partial: number;
  postponed: number;
  total: number;
}

const ORB_SIZE = 80;
const STROKE_WIDTH = 6;
const RADIUS = (ORB_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const ProgressOrb: React.FC<ProgressOrbProps> = ({
  completed,
  partial,
  postponed,
  total,
}) => {
  const colors = useColors();
  const allDone = total > 0 && completed + partial + postponed >= total;
  const pulseOpacity = usePulse(0.5, 1, 2000);

  const completedFraction = total > 0 ? completed / total : 0;
  const partialFraction = total > 0 ? partial / total : 0;
  const postponedFraction = total > 0 ? postponed / total : 0;

  const completedLength = CIRCUMFERENCE * completedFraction;
  const partialLength = CIRCUMFERENCE * partialFraction;
  const postponedLength = CIRCUMFERENCE * postponedFraction;

  const completedOffset = 0;
  const partialOffset = completedLength;
  const postponedOffset = completedLength + partialLength;

  const WrapperComponent = allDone ? Animated.View : View;
  const wrapperStyle = allDone ? { opacity: pulseOpacity } : {};

  const styles = useMemo(() => StyleSheet.create({
    container: {
      width: ORB_SIZE,
      height: ORB_SIZE,
      justifyContent: 'center',
      alignItems: 'center',
    },
    centerText: {
      position: 'absolute',
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    count: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    total: {
      fontSize: 13,
      color: colors.textSecondary,
    },
  }), [colors]);

  return (
    <WrapperComponent style={[styles.container, wrapperStyle]}>
      <Svg width={ORB_SIZE} height={ORB_SIZE}>
        <Circle
          cx={ORB_SIZE / 2}
          cy={ORB_SIZE / 2}
          r={RADIUS}
          stroke={colors.cardElevated}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        {postponedLength > 0 && (
          <Circle
            cx={ORB_SIZE / 2}
            cy={ORB_SIZE / 2}
            r={RADIUS}
            stroke={colors.postponed}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={`${postponedLength} ${CIRCUMFERENCE - postponedLength}`}
            strokeDashoffset={-postponedOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${ORB_SIZE / 2} ${ORB_SIZE / 2})`}
          />
        )}
        {partialLength > 0 && (
          <Circle
            cx={ORB_SIZE / 2}
            cy={ORB_SIZE / 2}
            r={RADIUS}
            stroke={colors.partial}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={`${partialLength} ${CIRCUMFERENCE - partialLength}`}
            strokeDashoffset={-partialOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${ORB_SIZE / 2} ${ORB_SIZE / 2})`}
          />
        )}
        {completedLength > 0 && (
          <Circle
            cx={ORB_SIZE / 2}
            cy={ORB_SIZE / 2}
            r={RADIUS}
            stroke={colors.completed}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={`${completedLength} ${CIRCUMFERENCE - completedLength}`}
            strokeDashoffset={-completedOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${ORB_SIZE / 2} ${ORB_SIZE / 2})`}
          />
        )}
      </Svg>
      <View style={styles.centerText}>
        <Text style={styles.count}>
          {completed + partial + postponed}
        </Text>
        <Text style={styles.total}>/{total}</Text>
      </View>
    </WrapperComponent>
  );
};
