import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

export const useFadeIn = (duration = 300): Animated.Value => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  }, []);

  return opacity;
};

export const usePulse = (min = 0.6, max = 1, duration = 1500): Animated.Value => {
  const value = useRef(new Animated.Value(max)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: min,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: max,
          duration,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return value;
};

export const useSpringScale = (): {
  scale: Animated.Value;
  triggerSpring: () => void;
} => {
  const scale = useRef(new Animated.Value(1)).current;

  const triggerSpring = () => {
    scale.setValue(0.9);
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 200,
      useNativeDriver: true,
    }).start();
  };

  return { scale, triggerSpring };
};
