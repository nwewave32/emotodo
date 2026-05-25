import { z } from 'zod';
import { Task, DailyRecord } from './index';

// "YYYY-MM-DD" 형식 검증
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// 입력 길이 상한 - UI maxLength와 동일하게 유지
export const TITLE_MAX_LENGTH = 100;
export const NOTE_MAX_LENGTH = 500;

export const TaskStatusSchema = z.enum(['completed', 'postponed', 'partial']);
export const DifficultySchema = z.enum(['easy', 'normal', 'hard']);

export const TaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(TITLE_MAX_LENGTH),
  estimatedMinutes: z.number().int().positive(),
  repeatDays: z.array(z.number().int().min(0).max(6)),
  createdAt: z.string(),
  isActive: z.boolean(),
  difficulty: DifficultySchema.optional(),
  scheduledDate: z.string().regex(DATE_REGEX).optional(),
});

export const DailyRecordSchema = z.object({
  id: z.string().min(1),
  taskId: z.string().min(1),
  date: z.string().regex(DATE_REGEX),
  status: TaskStatusSchema,
  emotion: z.string().optional(),
  reason: z.string().optional(),
  reasonNote: z.string().max(NOTE_MAX_LENGTH).optional(),
  note: z.string().max(NOTE_MAX_LENGTH).optional(),
  energyLevel: z.number().int().min(1).max(5).optional(),
  recordedAt: z.string(),
  usedTimer: z.boolean(),
  actualMinutes: z.number().nonnegative().optional(),
  timerCompleted: z.boolean().optional(),
});

/**
 * 신뢰할 수 없는 저장소 데이터를 검증한다.
 * 배열이 아니면 빈 배열, 손상된 항목은 조용히 버리고 유효한 항목만 반환한다.
 * (개별 항목 손상이 전체 로드를 막지 않도록 비파괴적으로 처리)
 */
export function parseValidTasks(raw: unknown): Task[] {
  if (!Array.isArray(raw)) return [];
  const valid: Task[] = [];
  for (const item of raw) {
    const result = TaskSchema.safeParse(item);
    if (result.success) valid.push(result.data);
  }
  return valid;
}

export function parseValidRecords(raw: unknown): DailyRecord[] {
  if (!Array.isArray(raw)) return [];
  const valid: DailyRecord[] = [];
  for (const item of raw) {
    const result = DailyRecordSchema.safeParse(item);
    if (result.success) valid.push(result.data);
  }
  return valid;
}
