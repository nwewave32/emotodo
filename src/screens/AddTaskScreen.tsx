import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTaskStore } from '../store/taskStore';
import { colors } from '../constants/colors';
import { messages } from '../constants/messages';
import { DAY_LABELS } from '../utils/date';
import { RootStackParamList } from '../types';

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

  const toggleDay = (day: number) => {
    if (repeatDays.includes(day)) {
      if (repeatDays.length > 1) {
        setRepeatDays(repeatDays.filter((d) => d !== day));
      }
    } else {
      setRepeatDays([...repeatDays, day].sort());
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('알림', '할 일을 입력해주세요.');
      return;
    }

    if (isEditing && editingTaskId) {
      await updateTask(editingTaskId, {
        title: title.trim(),
        estimatedMinutes,
        repeatDays,
      });
    } else {
      await addTask(title.trim(), estimatedMinutes, repeatDays);
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

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {isEditing ? '수정' : '추가'}
          </Text>
        </TouchableOpacity>

        {isEditing && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
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
    backgroundColor: colors.cardBackground,
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
