import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useColors } from '../hooks/useColors';
import { useFadeIn } from '../hooks/useAnimatedValue';

interface WizardStepProps {
  question: string;
  isActive: boolean;
  children: React.ReactNode;
}

export const WizardStep: React.FC<WizardStepProps> = ({
  question,
  isActive,
  children,
}) => {
  const colors = useColors();
  const fadeOpacity = useFadeIn(250);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    question: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: 32,
    },
    content: {
      width: '100%',
      alignItems: 'center',
    },
  }), [colors]);

  if (!isActive) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeOpacity }]}>
      <Text style={styles.question}>{question}</Text>
      <View style={styles.content}>{children}</View>
    </Animated.View>
  );
};
