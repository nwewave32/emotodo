import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmotionOrb } from '../components/EmotionOrb';
import { EnergySlider } from '../components/EnergySlider';
import { GlowDot } from '../components/GlowDot';
import { ReasonPicker } from '../components/ReasonPicker';
import { useColors } from '../hooks/useColors';
import { messages, wizard } from '../constants/messages';
import { useRecordStore } from '../store/recordStore';
import { useTaskStore } from '../store/taskStore';
import { RootStackParamList, TaskStatus } from '../types';
import { getTodayString } from '../utils/date';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Record'>;
type RouteProps = RouteProp<RootStackParamList, 'Record'>;

const AUTO_ADVANCE_DELAY = 400;

export const RecordScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const {
    taskId,
    usedTimer,
    timerCompleted,
    actualMinutes,
    initialStatus,
    recordId,
  } = route.params;

  const { getTask } = useTaskStore();
  const { addRecord, updateRecord, getRecord } = useRecordStore();

  const task = getTask(taskId);
  const existingRecord = recordId ? getRecord(recordId) : undefined;
  const isEditing = !!existingRecord;

  const getInitialStatus = (): TaskStatus | null => {
    if (existingRecord) return existingRecord.status;
    if (initialStatus !== undefined) return initialStatus;
    if (usedTimer && timerCompleted !== undefined) {
      return timerCompleted ? 'completed' : 'partial';
    }
    return null;
  };

  const hasInitialStatus = getInitialStatus() !== null;

  const statusConfig: Array<{
    status: TaskStatus;
    label: string;
    color: string;
  }> = useMemo(() => [
    { status: 'completed', label: '완료했어요', color: colors.completed },
    { status: 'partial', label: '조금 했어요', color: colors.partial },
    { status: 'postponed', label: '미뤘어요', color: colors.postponed },
  ], [colors]);

  const [status, setStatus] = useState<TaskStatus | null>(getInitialStatus);
  const [emotion, setEmotion] = useState<string | null>(
    existingRecord?.emotion ?? null
  );
  const [reason, setReason] = useState<string | null>(
    existingRecord?.reason ?? null
  );
  const [reasonNote, setReasonNote] = useState(
    existingRecord?.reasonNote ?? ''
  );
  const [energyLevel, setEnergyLevel] = useState<number | null>(
    existingRecord?.energyLevel ?? null
  );
  const [note, setNote] = useState(existingRecord?.note ?? '');
  const [step, setStep] = useState(hasInitialStatus ? 1 : 0);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const canSave = status !== null && emotion !== null && energyLevel !== null;

  const totalSteps = 4;

  const crossFade = (nextStep: number) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 125,
      useNativeDriver: true,
    }).start(() => {
      setStep(nextStep);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 125,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleStatusSelect = (s: TaskStatus) => {
    setStatus(s);
    setEmotion(null);
    setReason(null);
    setReasonNote('');
    setEnergyLevel(null);
    setTimeout(() => crossFade(1), AUTO_ADVANCE_DELAY);
  };

  const handleEmotionSelect = (e: string) => {
    setEmotion(e);
    setTimeout(() => crossFade(2), AUTO_ADVANCE_DELAY);
  };

  const handleEnergySelect = (level: number) => {
    setEnergyLevel(level);
    setTimeout(() => crossFade(3), AUTO_ADVANCE_DELAY);
  };

  const handleBack = () => {
    if (step > 0) {
      crossFade(step - 1);
    }
  };

  const handleSave = async () => {
    if (status === null) return;

    const recordData = {
      status,
      emotion: emotion ?? undefined,
      reason: status === 'postponed' ? reason ?? undefined : undefined,
      reasonNote:
        status === 'postponed' ? reasonNote.trim() || undefined : undefined,
      energyLevel: energyLevel ?? undefined,
      note: note.trim() || undefined,
    };

    try {
      if (isEditing && recordId) {
        await updateRecord(recordId, recordData);
      } else {
        await addRecord({
          ...recordData,
          taskId,
          date: getTodayString(),
          usedTimer,
          actualMinutes,
          timerCompleted,
        });
      }
      navigation.popToTop();
    } catch {
      Alert.alert(
        '저장 실패',
        '기록을 저장하는 중 문제가 발생했어요. 다시 시도해주세요.'
      );
    }
  };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    progressDots: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      paddingTop: 16,
      paddingBottom: 8,
    },
    backButton: {
      paddingHorizontal: 20,
      paddingVertical: 8,
    },
    backText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    stepContainer: {
      flex: 1,
    },
    stepContent: {
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
    statusCards: {
      width: '100%',
      gap: 12,
    },
    statusCard: {
      paddingVertical: 24,
      borderRadius: 16,
      backgroundColor: colors.cardBackground,
      borderWidth: 1.5,
      alignItems: 'center',
    },
    statusLabel: {
      fontSize: 18,
      fontWeight: '600',
    },
    scrollStep: {
      flex: 1,
    },
    scrollStepContent: {
      padding: 20,
      paddingBottom: 40,
    },
    noteInput: {
      backgroundColor: colors.cardElevated,
      borderRadius: 12,
      padding: 16,
      fontSize: 15,
      color: colors.textPrimary,
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 100,
      marginBottom: 24,
    },
    saveButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    saveButtonDisabled: {
      backgroundColor: colors.textLight,
    },
    saveButtonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: '600',
    },
  }), [colors]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Progress dots */}
      <View style={styles.progressDots}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <GlowDot
            key={i}
            color={i <= step ? colors.primary : colors.textLight}
            size={i === step ? 10 : 6}
          />
        ))}
      </View>

      {/* Back button */}
      {step > 0 && (
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backText}>◀ 뒤로</Text>
        </TouchableOpacity>
      )}

      <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
        {/* Step 0: Status selection */}
        {step === 0 && (
          <View style={styles.stepContent}>
            <Text style={styles.question}>{wizard.statusQuestion}</Text>
            <View style={styles.statusCards}>
              {statusConfig.map(({ status: s, label, color }) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.statusCard, { borderColor: color }]}
                  onPress={() => handleStatusSelect(s)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.statusLabel, { color }]}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 1: Emotion */}
        {step === 1 && status && (
          <View style={styles.stepContent}>
            <Text style={styles.question}>{wizard.emotionQuestion}</Text>
            <EmotionOrb
              status={status}
              selectedEmotion={emotion}
              onSelect={handleEmotionSelect}
            />
          </View>
        )}

        {/* Step 2: Energy */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.question}>{wizard.energyQuestion}</Text>
            <EnergySlider
              selectedLevel={energyLevel}
              onSelect={handleEnergySelect}
            />
          </View>
        )}

        {/* Step 3: Note + Reason */}
        {step === 3 && (
          <ScrollView
            style={styles.scrollStep}
            contentContainerStyle={styles.scrollStepContent}
            keyboardShouldPersistTaps='handled'
          >
            <Text style={styles.question}>{wizard.noteQuestion}</Text>

            {status === 'postponed' && (
              <ReasonPicker
                selectedReason={reason}
                onSelect={setReason}
                reasonNote={reasonNote}
                onReasonNoteChange={setReasonNote}
              />
            )}

            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
              placeholder={messages.placeholders.note}
              placeholderTextColor={colors.textLight}
              multiline
              numberOfLines={3}
              textAlignVertical='top'
            />

            <TouchableOpacity
              style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!canSave}
            >
              <Text style={styles.saveButtonText}>{messages.buttons.save}</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </Animated.View>

      <View style={{ height: insets.bottom || 20 }} />
    </KeyboardAvoidingView>
  );
};
