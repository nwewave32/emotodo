import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import { BreathingRing } from '../components/BreathingRing';
import { colors } from '../constants/colors';
import { getRandomMessage, messages } from '../constants/messages';
import { usePulse } from '../hooks/useAnimatedValue';
import { useTaskStore } from '../store/taskStore';
import { RootStackParamList } from '../types';
import { formatTime } from '../utils/date';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Timer'>;
type RouteProps = RouteProp<RootStackParamList, 'Timer'>;

export const TimerScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { taskId, minutes } = route.params;
  const { getTask } = useTaskStore();

  const task = getTask(taskId);
  const totalSeconds = Math.max(minutes * 60, 1);

  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const encouragement = useMemo(
    () => getRandomMessage(messages.timer.encouragement),
    [isPaused]
  );

  const ctaPulse = usePulse(0.95, 1.05, 1200);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning && !isPaused && !isCompleted) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsCompleted(true);
            setIsRunning(false);
            Vibration.vibrate([0, 500, 200, 500]);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, isCompleted]);

  const handlePause = () => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleStop = () => {
    Alert.alert('타이머 종료', '타이머를 종료할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '종료',
        onPress: () => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          const elapsedSeconds = totalSeconds - remainingSeconds;
          const elapsedMinutes = Math.ceil(elapsedSeconds / 60);
          navigation.replace('Record', {
            taskId,
            usedTimer: true,
            timerCompleted: false,
            actualMinutes: elapsedMinutes,
          });
        },
      },
    ]);
  };

  const handleComplete = () => {
    navigation.replace('Record', {
      taskId,
      usedTimer: true,
      timerCompleted: true,
      actualMinutes: minutes,
    });
  };

  const remainingFraction = remainingSeconds / totalSeconds;

  const subtitle = isCompleted
    ? messages.timer.completed
    : !isPaused
    ? encouragement
    : undefined;

  if (!task) {
    navigation.goBack();
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.taskTitle}>{task.title}</Text>

      <View style={styles.ringContainer}>
        <BreathingRing
          remainingFraction={remainingFraction}
          isRunning={isRunning}
          isPaused={isPaused}
          isCompleted={isCompleted}
          timeText={formatTime(remainingSeconds)}
          subtitle={subtitle}
        />
      </View>

      <View style={styles.buttonContainer}>
        {isCompleted ? (
          <Animated.View style={{ transform: [{ scale: ctaPulse }] }}>
            <TouchableOpacity
              style={[styles.button, styles.completeButton]}
              onPress={handleComplete}
            >
              <Text style={styles.completeButtonText}>기록하러 가기</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : isPaused ? (
          <>
            <TouchableOpacity
              style={[styles.button, styles.resumeButton]}
              onPress={handleResume}
            >
              <Text style={styles.buttonText}>{messages.buttons.resume}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleStop}>
              <Text style={styles.stopLink}>{messages.buttons.stop}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.pauseButton]}
            onPress={handlePause}
          >
            <Text style={styles.pauseButtonText}>{messages.buttons.pause}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  taskTitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  ringContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    paddingBottom: 40,
    gap: 16,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: colors.timerPaused,
  },
  pauseButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  resumeButton: {
    backgroundColor: colors.primary,
  },
  completeButton: {
    backgroundColor: colors.timerComplete,
  },
  completeButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  stopLink: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
    paddingVertical: 8,
  },
});
