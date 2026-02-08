import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTaskStore } from '../store/taskStore';
import { useRecordStore } from '../store/recordStore';
import { EmotionPicker } from '../components/EmotionPicker';
import { ReasonPicker } from '../components/ReasonPicker';
import { colors } from '../constants/colors';
import { messages, getRandomMessage } from '../constants/messages';
import { getTodayString } from '../utils/date';
import { RootStackParamList, TaskStatus } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Record'>;
type RouteProps = RouteProp<RootStackParamList, 'Record'>;

const statusLabels: Record<TaskStatus, string> = {
  completed: '완료',
  partial: '부분완료',
  postponed: '미룸',
};

const allStatuses: TaskStatus[] = ['completed', 'partial', 'postponed'];

export const RecordScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const { taskId, usedTimer, timerCompleted, actualMinutes, initialStatus } = route.params;

  const { getTask } = useTaskStore();
  const { addRecord } = useRecordStore();

  const task = getTask(taskId);

  const getInitialStatus = (): TaskStatus | null => {
    if (initialStatus !== undefined) return initialStatus;
    if (usedTimer && timerCompleted !== undefined) {
      return timerCompleted ? 'completed' : 'partial';
    }
    return null;
  };

  const [status, setStatus] = useState<TaskStatus | null>(getInitialStatus);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [note, setNote] = useState('');

  // 메시지가 타이핑마다 바뀌지 않도록 고정
  const statusMessage = useMemo(() => {
    if (status === 'completed') {
      return getRandomMessage(messages.completionMessages);
    } else if (status === 'postponed') {
      return getRandomMessage(messages.postponedMessages);
    } else if (status === 'partial') {
      return getRandomMessage(messages.partialMessages);
    }
    return '';
  }, [status]);

  const handleSave = async () => {
    if (status === null) return;

    await addRecord({
      taskId,
      date: getTodayString(),
      status,
      emotion: emotion || undefined,
      reason: status === 'postponed' ? reason || undefined : undefined,
      note: note.trim() || undefined,
      usedTimer,
      actualMinutes,
      timerCompleted,
    });

    navigation.popToTop();
  };

  const canSave = status !== null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.taskTitle}>{task?.title}</Text>

        {status === null && (
          <View style={styles.completionButtons}>
            <TouchableOpacity
              style={[styles.completionButton, styles.completeButton]}
              onPress={() => setStatus('completed')}
            >
              <Text style={styles.completeButtonText}>
                {messages.buttons.complete}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.completionButton, styles.partialButton]}
              onPress={() => setStatus('partial')}
            >
              <Text style={styles.partialButtonText}>
                {messages.buttons.partial}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.completionButton, styles.postponedButton]}
              onPress={() => setStatus('postponed')}
            >
              <Text style={styles.postponedButtonText}>
                {messages.buttons.postponed}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {status !== null && (
          <>
            <View style={styles.statusBanner}>
              <Text style={styles.statusText}>{statusMessage}</Text>
              <View style={styles.statusToggleGroup}>
                {allStatuses
                  .filter((s) => s !== status)
                  .map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={styles.statusToggle}
                      onPress={() => {
                        setStatus(s);
                        setEmotion(null);
                        setReason(null);
                      }}
                    >
                      <Text style={styles.statusToggleText}>
                        {statusLabels[s]}으로 변경
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>

            <EmotionPicker
              status={status}
              selectedEmotion={emotion}
              onSelect={setEmotion}
            />

            {status === 'postponed' && (
              <ReasonPicker selectedReason={reason} onSelect={setReason} />
            )}

            <View style={styles.noteSection}>
              <Text style={styles.noteLabel}>
                {messages.questions.anyThoughts}
              </Text>
              <TextInput
                style={styles.noteInput}
                value={note}
                onChangeText={setNote}
                placeholder={messages.placeholders.note}
                placeholderTextColor={colors.textLight}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom || 20 }]}>
        <TouchableOpacity
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!canSave}
        >
          <Text style={styles.saveButtonText}>{messages.buttons.save}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  taskTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 24,
  },
  completionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  completionButton: {
    flex: 1,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: colors.primary,
  },
  partialButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  postponedButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  completeButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  partialButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '500',
  },
  postponedButtonText: {
    color: colors.textSecondary,
    fontSize: 18,
    fontWeight: '500',
  },
  statusBanner: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  statusText: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 8,
  },
  statusToggleGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  statusToggle: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  statusToggleText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  noteSection: {
    marginBottom: 24,
  },
  noteLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  noteInput: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    padding: 20,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
});
