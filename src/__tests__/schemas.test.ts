import {
  TaskSchema,
  DailyRecordSchema,
  parseValidTasks,
  parseValidRecords,
  TITLE_MAX_LENGTH,
  NOTE_MAX_LENGTH,
} from '../types/schemas';

const validTask = {
  id: 'task-1',
  title: '아침 스트레칭',
  estimatedMinutes: 10,
  repeatDays: [0, 1, 2, 3, 4, 5, 6],
  createdAt: '2026-01-01T00:00:00.000Z',
  isActive: true,
  difficulty: 'easy' as const,
  scheduledDate: '2026-01-01',
};

const validRecord = {
  id: 'record-1',
  taskId: 'task-1',
  date: '2026-01-01',
  status: 'completed' as const,
  recordedAt: '2026-01-01T00:00:00.000Z',
  usedTimer: false,
  energyLevel: 3,
};

describe('TaskSchema', () => {
  it('accepts a valid task', () => {
    expect(TaskSchema.safeParse(validTask).success).toBe(true);
  });

  it('rejects an empty title', () => {
    expect(TaskSchema.safeParse({ ...validTask, title: '' }).success).toBe(false);
  });

  it('rejects a title over the max length', () => {
    const longTitle = 'a'.repeat(TITLE_MAX_LENGTH + 1);
    expect(TaskSchema.safeParse({ ...validTask, title: longTitle }).success).toBe(false);
  });

  it('rejects non-positive estimatedMinutes', () => {
    expect(TaskSchema.safeParse({ ...validTask, estimatedMinutes: 0 }).success).toBe(false);
    expect(TaskSchema.safeParse({ ...validTask, estimatedMinutes: -5 }).success).toBe(false);
  });

  it('rejects repeatDays outside 0-6', () => {
    expect(TaskSchema.safeParse({ ...validTask, repeatDays: [7] }).success).toBe(false);
    expect(TaskSchema.safeParse({ ...validTask, repeatDays: [-1] }).success).toBe(false);
  });

  it('rejects an invalid scheduledDate format', () => {
    expect(TaskSchema.safeParse({ ...validTask, scheduledDate: '2026/01/01' }).success).toBe(false);
  });

  it('allows omitting optional fields', () => {
    const { difficulty, scheduledDate, ...minimal } = validTask;
    expect(TaskSchema.safeParse(minimal).success).toBe(true);
  });
});

describe('DailyRecordSchema', () => {
  it('accepts a valid record', () => {
    expect(DailyRecordSchema.safeParse(validRecord).success).toBe(true);
  });

  it('rejects an invalid status', () => {
    expect(DailyRecordSchema.safeParse({ ...validRecord, status: 'done' }).success).toBe(false);
  });

  it('rejects energyLevel outside 1-5', () => {
    expect(DailyRecordSchema.safeParse({ ...validRecord, energyLevel: 0 }).success).toBe(false);
    expect(DailyRecordSchema.safeParse({ ...validRecord, energyLevel: 6 }).success).toBe(false);
  });

  it('rejects a note over the max length', () => {
    const longNote = 'a'.repeat(NOTE_MAX_LENGTH + 1);
    expect(DailyRecordSchema.safeParse({ ...validRecord, note: longNote }).success).toBe(false);
  });

  it('rejects an invalid date format', () => {
    expect(DailyRecordSchema.safeParse({ ...validRecord, date: '20260101' }).success).toBe(false);
  });
});

describe('parseValidTasks', () => {
  it('returns valid tasks unchanged', () => {
    expect(parseValidTasks([validTask])).toEqual([validTask]);
  });

  it('drops corrupted items and keeps valid ones', () => {
    const corrupted = { ...validTask, estimatedMinutes: -1 };
    expect(parseValidTasks([validTask, corrupted])).toEqual([validTask]);
  });

  it('returns an empty array for non-array input', () => {
    expect(parseValidTasks(null)).toEqual([]);
    expect(parseValidTasks(undefined)).toEqual([]);
    expect(parseValidTasks({ not: 'an array' })).toEqual([]);
    expect(parseValidTasks('garbage')).toEqual([]);
  });

  it('returns an empty array for an empty array', () => {
    expect(parseValidTasks([])).toEqual([]);
  });
});

describe('parseValidRecords', () => {
  it('returns valid records unchanged', () => {
    expect(parseValidRecords([validRecord])).toEqual([validRecord]);
  });

  it('drops corrupted items and keeps valid ones', () => {
    const corrupted = { ...validRecord, status: 'invalid' };
    expect(parseValidRecords([validRecord, corrupted])).toEqual([validRecord]);
  });

  it('returns an empty array for non-array input', () => {
    expect(parseValidRecords(null)).toEqual([]);
    expect(parseValidRecords({})).toEqual([]);
  });
});
