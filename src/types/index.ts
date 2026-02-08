export type TaskStatus = 'completed' | 'postponed' | 'partial';

export type Difficulty = 'easy' | 'normal' | 'hard';

export interface Task {
  id: string;
  title: string;
  estimatedMinutes: number;
  repeatDays: number[]; // 0=일, 1=월, ..., 6=토
  createdAt: string;
  isActive: boolean;
  difficulty?: Difficulty;
  scheduledDate?: string; // "YYYY-MM-DD" - 특정 날짜에 예약
}

export interface DailyRecord {
  id: string;
  taskId: string;
  date: string; // "YYYY-MM-DD"
  status: TaskStatus;
  emotion?: string;
  reason?: string;
  note?: string;
  recordedAt: string;
  usedTimer: boolean;
  actualMinutes?: number;
  timerCompleted?: boolean;
}

export interface TimerState {
  taskId: string | null;
  targetMinutes: number;
  remainingSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
}

export type RootStackParamList = {
  MainTabs: undefined;
  AddTask: { taskId?: string };
  Timer: { taskId: string; minutes: number };
  Record: { taskId: string; usedTimer: boolean; timerCompleted?: boolean; actualMinutes?: number; initialStatus?: TaskStatus };
};

export type MainTabParamList = {
  Home: undefined;
  History: undefined;
};
