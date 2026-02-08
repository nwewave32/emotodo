import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Task, Difficulty } from '../types';
import { storage } from '../utils/storage';
import { isTaskScheduledForToday, getTodayString } from '../utils/date';

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
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,

  loadTasks: async () => {
    set({ isLoading: true });
    try {
      let tasks = await storage.getTasks<Task[]>();

      if (!tasks || tasks.length === 0) {
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

      set({ tasks: tasks || [], isLoading: false });
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

    const updatedTasks = [...get().tasks, newTask];
    await storage.saveTasks(updatedTasks);
    set({ tasks: updatedTasks });
    return newTask;
  },

  updateTask: async (id, updates) => {
    const updatedTasks = get().tasks.map((task) =>
      task.id === id ? { ...task, ...updates } : task
    );
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
}));
