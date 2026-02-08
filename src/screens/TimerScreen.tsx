import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
  Alert,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTaskStore } from '../store/taskStore';
import { colors } from '../constants/colors';
import { messages, getRandomMessage } from '../constants/messages';
import { formatTime } from '../utils/date';
import { RootStackParamList } from '../types';

const TIMER_SIZE = 250;
const STROKE_WIDTH = 8;
const RADIUS = (TIMER_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

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
    [isPaused],
  );

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
    Alert.alert(
      '타이머 종료',
      '타이머를 종료할까요?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '종료',
          onPress: () => {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            const elapsedSeconds = totalSeconds - remainingSeconds;
            const actualMinutes = Math.ceil(elapsedSeconds / 60);
            navigation.replace('Record', {
              taskId,
              usedTimer: true,
              timerCompleted: false,
              actualMinutes,
            });
          },
        },
      ]
    );
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
  const strokeDashoffset = CIRCUMFERENCE * (1 - remainingFraction);

  const ringColor = isCompleted
    ? colors.timerComplete
    : isPaused
      ? colors.timerPaused
      : colors.timerActive;

  if (!task) {
    navigation.goBack();
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.taskTitle}>{task.title}</Text>

      <View style={styles.timerContainer}>
        <View style={styles.timerWrapper}>
          <Svg
            width={TIMER_SIZE}
            height={TIMER_SIZE}
            style={styles.progressRing}
          >
            <Circle
              cx={TIMER_SIZE / 2}
              cy={TIMER_SIZE / 2}
              r={RADIUS}
              stroke={colors.border}
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />
            <Circle
              cx={TIMER_SIZE / 2}
              cy={TIMER_SIZE / 2}
              r={RADIUS}
              stroke={ringColor}
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${TIMER_SIZE / 2} ${TIMER_SIZE / 2})`}
            />
          </Svg>
          <View style={styles.timerContent}>
            <Text style={styles.timerText}>
              {formatTime(remainingSeconds)}
            </Text>
            {!isCompleted && (
              <Text style={styles.encouragement}>
                {encouragement}
              </Text>
            )}
            {isCompleted && (
              <Text style={styles.completedText}>
                {messages.timer.completed}
              </Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {isCompleted ? (
          <TouchableOpacity
            style={[styles.button, styles.completeButton]}
            onPress={handleComplete}
          >
            <Text style={styles.completeButtonText}>기록하러 가기</Text>
          </TouchableOpacity>
        ) : isPaused ? (
          <>
            <TouchableOpacity
              style={[styles.button, styles.resumeButton]}
              onPress={handleResume}
            >
              <Text style={styles.buttonText}>{messages.buttons.resume}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.stopButton]}
              onPress={handleStop}
            >
              <Text style={styles.stopButtonText}>{messages.buttons.stop}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.button, styles.pauseButton]}
              onPress={handlePause}
            >
              <Text style={styles.pauseButtonText}>{messages.buttons.pause}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.stopButton]}
              onPress={handleStop}
            >
              <Text style={styles.stopButtonText}>{messages.buttons.stop}</Text>
            </TouchableOpacity>
          </>
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
    paddingTop: 40,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 40,
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerWrapper: {
    width: TIMER_SIZE,
    height: TIMER_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRing: {
    position: 'absolute',
  },
  timerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 56,
    fontWeight: '300',
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  encouragement: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  completedText: {
    fontSize: 14,
    color: colors.timerComplete,
    marginTop: 8,
    fontWeight: '500',
  },
  buttonContainer: {
    paddingBottom: 40,
    gap: 12,
  },
  button: {
    paddingVertical: 16,
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
  stopButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
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
  stopButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
});
