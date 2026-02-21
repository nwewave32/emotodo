import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

interface GlowDotProps {
  color: string;
  size?: number;
}

export const GlowDot: React.FC<GlowDotProps> = ({ color, size = 10 }) => {
  return (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          ...(Platform.OS === 'ios'
            ? {
                shadowColor: color,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: size * 0.8,
              }
            : {
                borderWidth: size * 0.3,
                borderColor: color + '4D',
              }),
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  dot: {},
});
