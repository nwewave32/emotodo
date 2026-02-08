import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../types';
import { storage } from '../utils/storage';
import { isTaskScheduledForToday } from '../utils/date';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;

  // Actions
  loadTasks: () => Promise<void>;
  addTask: (title: string, estimatedMinutes: number, repeatDays: number[]) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getTask: (id: string) => Task | undefined;
  getTodayTasks: () => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,

  loadTasks: async () => {
    set({ isLoading: true });
    let tasks = await storage.getTasks<Task[]>();

    // 테스트 데이터: 처음 실행 시 샘플 할 일 추가
    if (!tasks || tasks.length === 0) {
      const sampleTasks: Task[] = [
        {
          id: uuidv4(),
          title: '아침 스트레칭 10분',
          estimatedMinutes: 10,
          repeatDays: [0, 1, 2, 3, 4, 5, 6],
          createdAt: new Date().toISOString(),
          isActive: true,
        },
        {
          id: uuidv4(),
          title: '책 읽기',
          estimatedMinutes: 15,
          repeatDays: [0, 1, 2, 3, 4, 5, 6],
          createdAt: new Date().toISOString(),
          isActive: true,
        },
        {
          id: uuidv4(),
          title: '영어 단어 5개 외우기',
          estimatedMinutes: 5,
          repeatDays: [0, 1, 2, 3, 4, 5, 6],
          createdAt: new Date().toISOString(),
          isActive: true,
        },
      ];
      tasks = sampleTasks;
      await storage.saveTasks(tasks);
    }

    set({ tasks: tasks || [], isLoading: false });
  },

  addTask: async (title, estimatedMinutes, repeatDays) => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      estimatedMinutes,
      repeatDays,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    const updatedTasks = [...get().tasks, newTask];
    set({ tasks: updatedTasks });
    await storage.saveTasks(updatedTasks);
    return newTask;
  },

  updateTask: async (id, updates) => {
    const updatedTasks = get().tasks.map((task) =>
      task.id === id ? { ...task, ...updates } : task
    );
    set({ tasks: updatedTasks });
    await storage.saveTasks(updatedTasks);
  },

  deleteTask: async (id) => {
    const updatedTasks = get().tasks.filter((task) => task.id !== id);
    set({ tasks: updatedTasks });
    await storage.saveTasks(updatedTasks);
  },

  getTask: (id) => {
    return get().tasks.find((task) => task.id === id);
  },

  getTodayTasks: () => {
    return get().tasks.filter(
      (task) => task.isActive && isTaskScheduledForToday(task.repeatDays)
    );
  },
}));
