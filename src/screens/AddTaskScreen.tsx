import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTaskStore } from '../store/taskStore';
import { colors } from '../constants/colors';
import { messages } from '../constants/messages';
import { DAY_LABELS } from '../utils/date';
import { RootStackParamList, Difficulty } from '../types';
import { DIFFICULTY_OPTIONS } from '../constants/difficulty';
import { format, parse } from 'date-fns';
import { ko } from 'date-fns/locale';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddTask'>;
type RouteProps = RouteProp<RootStackParamList, 'AddTask'>;

const ESTIMATED_TIMES = [5, 10, 15, 20, 30];


export const AddTaskScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { addTask, updateTask, getTask, deleteTask } = useTaskStore();

  const editingTaskId = route.params?.taskId;
  const editingTask = editingTaskId ? getTask(editingTaskId) : undefined;
  const isEditing = !!editingTask;

  const [title, setTitle] = useState(editingTask?.title || '');
  const [estimatedMinutes, setEstimatedMinutes] = useState(
    editingTask?.estimatedMinutes || 15
  );
  const [repeatDays, setRepeatDays] = useState<number[]>(
    editingTask?.repeatDays || [0, 1, 2, 3, 4, 5, 6]
  );
  const [difficulty, setDifficulty] = useState<Difficulty>(
    editingTask?.difficulty || 'normal'
  );
  const [scheduledDate, setScheduledDate] = useState<Date | null>(
    editingTask?.scheduledDate ? parse(editingTask.scheduledDate, 'yyyy-MM-dd', new Date()) : null
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const toggleDay = (day: number) => {
    if (repeatDays.includes(day)) {
      if (repeatDays.length > 1) {
        setRepeatDays(repeatDays.filter((d) => d !== day));
      }
    } else {
      setRepeatDays([...repeatDays, day].sort());
    }
  };

  const handleDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setScheduledDate(selectedDate);
    }
  };

  const clearScheduledDate = () => {
    setScheduledDate(null);
    setShowDatePicker(false);
  };

  const formatScheduledDate = (date: Date): string => {
    return format(date, 'M월 d일 (EEE)', { locale: ko });
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('알림', '할 일을 입력해주세요.');
      return;
    }

    const dateString = scheduledDate
      ? format(scheduledDate, 'yyyy-MM-dd')
      : undefined;

    if (isEditing && editingTaskId) {
      await updateTask(editingTaskId, {
        title: title.trim(),
        estimatedMinutes,
        repeatDays,
        difficulty,
        scheduledDate: dateString,
      });
    } else {
      await addTask(title.trim(), estimatedMinutes, repeatDays, difficulty, dateString);
    }
    navigation.goBack();
  };

  const handleDelete = () => {
    if (!editingTaskId) return;

    Alert.alert('삭제', '이 할 일을 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          await deleteTask(editingTaskId);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.label}>할 일</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder={messages.placeholders.taskTitle}
          placeholderTextColor={colors.textLight}
          autoFocus={!isEditing}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>예상 시간</Text>
        <View style={styles.timeButtons}>
          {ESTIMATED_TIMES.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeButton,
                estimatedMinutes === time && styles.timeButtonSelected,
              ]}
              onPress={() => setEstimatedMinutes(time)}
              accessibilityRole="button"
              accessibilityLabel={`${time}분 ${estimatedMinutes === time ? '선택됨' : ''}`}
            >
              <Text
                style={[
                  styles.timeButtonText,
                  estimatedMinutes === time && styles.timeButtonTextSelected,
                ]}
              >
                {time}분
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {!scheduledDate && (
        <View style={styles.section}>
          <Text style={styles.label}>반복 요일</Text>
          <View style={styles.dayButtons}>
            {DAY_LABELS.map((label, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayButton,
                  repeatDays.includes(index) && styles.dayButtonSelected,
                ]}
                onPress={() => toggleDay(index)}
                accessibilityRole="button"
                accessibilityLabel={`${label}요일 ${repeatDays.includes(index) ? '선택됨' : '선택 안됨'}`}
              >
                <Text
                  style={[
                    styles.dayButtonText,
                    repeatDays.includes(index) && styles.dayButtonTextSelected,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>예상 난이도</Text>
        <View style={styles.difficultyButtons}>
          {DIFFICULTY_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.difficultyButton,
                difficulty === option.value && {
                  backgroundColor: option.color,
                  borderColor: option.color,
                },
              ]}
              onPress={() => setDifficulty(option.value)}
              accessibilityRole="button"
              accessibilityLabel={`난이도 ${option.label} ${difficulty === option.value ? '선택됨' : ''}`}
            >
              <Text
                style={[
                  styles.difficultyButtonText,
                  difficulty === option.value && styles.difficultyButtonTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>날짜 지정</Text>
        <Text style={styles.sublabel}>특정 날짜에 할 일을 미리 추가할 수 있어요</Text>
        {scheduledDate ? (
          <View style={styles.dateSelected}>
            <TouchableOpacity
              style={styles.dateDisplay}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateDisplayText}>
                {formatScheduledDate(scheduledDate)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateClearButton} onPress={clearScheduledDate}>
              <Text style={styles.dateClearButtonText}>해제</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.datePickerButtonText}>날짜 선택</Text>
          </TouchableOpacity>
        )}
        {showDatePicker && (
          <View style={styles.datePickerContainer}>
            <DateTimePicker
              value={scheduledDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              minimumDate={new Date()}
              onChange={handleDateChange}
              locale="ko"
              themeVariant="dark"
            />
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={styles.dateConfirmButton}
                onPress={() => {
                  if (!scheduledDate) {
                    setScheduledDate(new Date());
                  }
                  setShowDatePicker(false);
                }}
              >
                <Text style={styles.dateConfirmButtonText}>확인</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} accessibilityRole="button" accessibilityLabel={isEditing ? '할 일 수정' : '할 일 추가'}>
          <Text style={styles.saveButtonText}>
            {isEditing ? '수정' : '추가'}
          </Text>
        </TouchableOpacity>

        {isEditing && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} accessibilityRole="button" accessibilityLabel="할 일 삭제">
            <Text style={styles.deleteButtonText}>삭제</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 28,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.cardElevated,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  timeButtonTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  dayButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  dayButtonTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  difficultyButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  difficultyButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  difficultyButtonTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  sublabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
    marginTop: -4,
  },
  datePickerButton: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  datePickerButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  dateSelected: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  dateDisplay: {
    flex: 1,
    backgroundColor: colors.primaryMuted,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  dateDisplayText: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '600',
  },
  dateClearButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateClearButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  datePickerContainer: {
    marginTop: 12,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
  },
  dateConfirmButton: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  dateConfirmButtonText: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 20,
    gap: 12,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.danger,
  },
  deleteButtonText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: '500',
  },
});
