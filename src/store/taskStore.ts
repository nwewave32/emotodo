import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Task, Difficulty } from '../types';
import { TaskSchema, parseValidTasks } from '../types/schemas';
import { storage } from '../utils/storage';
import { isTaskScheduledForToday, isTaskScheduledForDate, getTodayString } from '../utils/date';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;

  // Actions
  loadTasks: () => Promise<void>;
  addTask: (title: string, estimatedMinutes: number, repeatDays: number[], difficulty?: Difficulty, scheduledDate?: string) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getTask: (id: string) => Task | undefined;
  getTodayTasks: () => Task[];
  getTasksForDate: (date: string) => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,

  loadTasks: async () => {
    set({ isLoading: true });
    try {
      // 신뢰할 수 없는 저장소 데이터 검증 - 손상 항목은 버리고 유효한 것만 로드
      let tasks = parseValidTasks(await storage.getTasks<unknown>());

      if (tasks.length === 0) {
        const sampleTasks: Task[] = [
          {
            id: uuidv4(),
            title: '아침 스트레칭 10분',
            estimatedMinutes: 10,
            repeatDays: [0, 1, 2, 3, 4, 5, 6],
            createdAt: new Date().toISOString(),
            isActive: true,
            difficulty: 'easy',
          },
          {
            id: uuidv4(),
            title: '책 읽기',
            estimatedMinutes: 15,
            repeatDays: [0, 1, 2, 3, 4, 5, 6],
            createdAt: new Date().toISOString(),
            isActive: true,
            difficulty: 'normal',
          },
          {
            id: uuidv4(),
            title: '영어 단어 5개 외우기',
            estimatedMinutes: 5,
            repeatDays: [0, 1, 2, 3, 4, 5, 6],
            createdAt: new Date().toISOString(),
            isActive: true,
            difficulty: 'easy',
          },
        ];
        tasks = sampleTasks;
        await storage.saveTasks(tasks);
      }

      set({ tasks, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  addTask: async (title, estimatedMinutes, repeatDays, difficulty, scheduledDate) => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      estimatedMinutes,
      repeatDays,
      createdAt: new Date().toISOString(),
      isActive: true,
      ...(difficulty !== undefined && { difficulty }),
      ...(scheduledDate !== undefined && { scheduledDate }),
    };

    // 입력 검증 - 잘못된 값은 저장 전에 차단
    TaskSchema.parse(newTask);

    const updatedTasks = [...get().tasks, newTask];
    await storage.saveTasks(updatedTasks);
    set({ tasks: updatedTasks });
    return newTask;
  },

  updateTask: async (id, updates) => {
    const updatedTasks = get().tasks.map((task) =>
      task.id === id ? { ...task, ...updates } : task
    );

    // 변경된 task가 유효한지 검증 - 잘못된 업데이트 차단
    const target = updatedTasks.find((task) => task.id === id);
    if (target) {
      TaskSchema.parse(target);
    }

    await storage.saveTasks(updatedTasks);
    set({ tasks: updatedTasks });
  },

  deleteTask: async (id) => {
    const updatedTasks = get().tasks.filter((task) => task.id !== id);
    await storage.saveTasks(updatedTasks);
    set({ tasks: updatedTasks });
  },

  getTask: (id) => {
    return get().tasks.find((task) => task.id === id);
  },

  getTodayTasks: () => {
    const today = getTodayString();
    return get().tasks.filter(
      (task) => task.isActive && (
        task.scheduledDate
          ? task.scheduledDate === today
          : isTaskScheduledForToday(task.repeatDays)
      )
    );
  },

  getTasksForDate: (date) => {
    return get().tasks.filter(
      (task) => task.isActive && isTaskScheduledForDate(task.repeatDays, task.scheduledDate, date)
    );
  },
}));
