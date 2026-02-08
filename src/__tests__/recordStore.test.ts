import { useRecordStore } from '../store/recordStore';
import { storage } from '../utils/storage';
import { DailyRecord } from '../types';
import { getTodayString } from '../utils/date';

jest.mock('../utils/storage', () => ({
  storage: {
    getRecords: jest.fn(),
    saveRecords: jest.fn(),
  },
}));

jest.mock('uuid', () => ({
  v4: () => 'test-record-uuid',
}));

const mockedStorage = storage as jest.Mocked<typeof storage>;

const makeRecord = (overrides: Partial<DailyRecord> = {}): DailyRecord => ({
  id: 'rec-1',
  taskId: 'task-1',
  date: '2026-02-08',
  status: 'completed',
  emotion: 'happy',
  energyLevel: 3,
  recordedAt: '2026-02-08T10:00:00.000Z',
  usedTimer: false,
  ...overrides,
});

describe('recordStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useRecordStore.setState({ records: [], isLoading: false });
  });

  describe('addRecord', () => {
    it('creates a record with all fields', async () => {
      mockedStorage.saveRecords.mockResolvedValue(undefined);

      const record = await useRecordStore.getState().addRecord({
        taskId: 'task-1',
        date: '2026-02-08',
        status: 'completed',
        emotion: 'happy',
        energyLevel: 4,
        note: '잘했다',
        usedTimer: true,
        actualMinutes: 15,
        timerCompleted: true,
      });

      expect(record.id).toBe('test-record-uuid');
      expect(record.taskId).toBe('task-1');
      expect(record.emotion).toBe('happy');
      expect(record.energyLevel).toBe(4);
      expect(record.note).toBe('잘했다');
      expect(record.recordedAt).toBeDefined();
      expect(useRecordStore.getState().records).toHaveLength(1);
    });

    it('creates a record with reasonNote for postponed', async () => {
      mockedStorage.saveRecords.mockResolvedValue(undefined);

      const record = await useRecordStore.getState().addRecord({
        taskId: 'task-1',
        date: '2026-02-08',
        status: 'postponed',
        emotion: 'tired',
        reason: 'tired',
        reasonNote: '밤을 새서 너무 피곤했다',
        energyLevel: 1,
        usedTimer: false,
      });

      expect(record.status).toBe('postponed');
      expect(record.reason).toBe('tired');
      expect(record.reasonNote).toBe('밤을 새서 너무 피곤했다');
    });

    it('creates a record without optional fields', async () => {
      mockedStorage.saveRecords.mockResolvedValue(undefined);

      const record = await useRecordStore.getState().addRecord({
        taskId: 'task-1',
        date: '2026-02-08',
        status: 'completed',
        usedTimer: false,
      });

      expect(record.emotion).toBeUndefined();
      expect(record.energyLevel).toBeUndefined();
      expect(record.reasonNote).toBeUndefined();
    });

    it('persists to storage before updating state', async () => {
      let stateAtSaveTime: { records: DailyRecord[] } | null = null;
      mockedStorage.saveRecords.mockImplementation(async () => {
        stateAtSaveTime = { records: [...useRecordStore.getState().records] };
      });

      await useRecordStore.getState().addRecord({
        taskId: 'task-1',
        date: '2026-02-08',
        status: 'completed',
        usedTimer: false,
      });

      expect(stateAtSaveTime!.records).toHaveLength(0);
      expect(useRecordStore.getState().records).toHaveLength(1);
    });

    it('does not update state if storage fails', async () => {
      mockedStorage.saveRecords.mockRejectedValue(new Error('Storage error'));

      await expect(
        useRecordStore.getState().addRecord({
          taskId: 'task-1',
          date: '2026-02-08',
          status: 'completed',
          usedTimer: false,
        })
      ).rejects.toThrow('Storage error');

      expect(useRecordStore.getState().records).toHaveLength(0);
    });

    it('validates energyLevel range on add', async () => {
      await expect(
        useRecordStore.getState().addRecord({
          taskId: 'task-1',
          date: '2026-02-08',
          status: 'completed',
          energyLevel: 0,
          usedTimer: false,
        })
      ).rejects.toThrow('energyLevel must be an integer between 1 and 5');

      await expect(
        useRecordStore.getState().addRecord({
          taskId: 'task-1',
          date: '2026-02-08',
          status: 'completed',
          energyLevel: 6,
          usedTimer: false,
        })
      ).rejects.toThrow('energyLevel must be an integer between 1 and 5');

      expect(mockedStorage.saveRecords).not.toHaveBeenCalled();
    });

    it('rejects non-integer energyLevel', async () => {
      await expect(
        useRecordStore.getState().addRecord({
          taskId: 'task-1',
          date: '2026-02-08',
          status: 'completed',
          energyLevel: 2.5,
          usedTimer: false,
        })
      ).rejects.toThrow('energyLevel must be an integer between 1 and 5');
    });

    it('allows valid energyLevel values 1 through 5', async () => {
      mockedStorage.saveRecords.mockResolvedValue(undefined);

      for (const level of [1, 2, 3, 4, 5]) {
        useRecordStore.setState({ records: [] });
        const record = await useRecordStore.getState().addRecord({
          taskId: 'task-1',
          date: '2026-02-08',
          status: 'completed',
          energyLevel: level,
          usedTimer: false,
        });
        expect(record.energyLevel).toBe(level);
      }
    });
  });

  describe('updateRecord', () => {
    it('updates record fields immutably', async () => {
      const existing = makeRecord();
      useRecordStore.setState({ records: [existing] });
      mockedStorage.saveRecords.mockResolvedValue(undefined);

      await useRecordStore.getState().updateRecord('rec-1', {
        emotion: 'proud',
        energyLevel: 5,
      });

      const updated = useRecordStore.getState().records[0];
      expect(updated.emotion).toBe('proud');
      expect(updated.energyLevel).toBe(5);
      expect(updated.status).toBe('completed');
      // Original not mutated
      expect(existing.emotion).toBe('happy');
    });

    it('updates status and reason for postponed', async () => {
      const existing = makeRecord({ status: 'postponed', reason: 'tired' });
      useRecordStore.setState({ records: [existing] });
      mockedStorage.saveRecords.mockResolvedValue(undefined);

      await useRecordStore.getState().updateRecord('rec-1', {
        reason: 'mood',
        reasonNote: '그냥 하기 싫었다',
      });

      const updated = useRecordStore.getState().records[0];
      expect(updated.reason).toBe('mood');
      expect(updated.reasonNote).toBe('그냥 하기 싫었다');
    });

    it('does not affect other records', async () => {
      const rec1 = makeRecord({ id: 'rec-1', emotion: 'happy' });
      const rec2 = makeRecord({ id: 'rec-2', emotion: 'tired' });
      useRecordStore.setState({ records: [rec1, rec2] });
      mockedStorage.saveRecords.mockResolvedValue(undefined);

      await useRecordStore.getState().updateRecord('rec-1', { emotion: 'proud' });

      const records = useRecordStore.getState().records;
      expect(records[0].emotion).toBe('proud');
      expect(records[1].emotion).toBe('tired');
    });

    it('does not update state if storage fails', async () => {
      useRecordStore.setState({ records: [makeRecord()] });
      mockedStorage.saveRecords.mockRejectedValue(new Error('write fail'));

      await expect(
        useRecordStore.getState().updateRecord('rec-1', { emotion: 'proud' })
      ).rejects.toThrow('write fail');

      expect(useRecordStore.getState().records[0].emotion).toBe('happy');
    });

    it('validates energyLevel range on update', async () => {
      useRecordStore.setState({ records: [makeRecord()] });

      await expect(
        useRecordStore.getState().updateRecord('rec-1', { energyLevel: 0 })
      ).rejects.toThrow('energyLevel must be an integer between 1 and 5');

      await expect(
        useRecordStore.getState().updateRecord('rec-1', { energyLevel: 6 })
      ).rejects.toThrow('energyLevel must be an integer between 1 and 5');

      expect(mockedStorage.saveRecords).not.toHaveBeenCalled();
    });

    it('allows updating without energyLevel', async () => {
      useRecordStore.setState({ records: [makeRecord()] });
      mockedStorage.saveRecords.mockResolvedValue(undefined);

      await useRecordStore.getState().updateRecord('rec-1', { note: '메모 추가' });

      expect(useRecordStore.getState().records[0].note).toBe('메모 추가');
      expect(useRecordStore.getState().records[0].energyLevel).toBe(3);
    });

    it('handles non-existent record id gracefully', async () => {
      useRecordStore.setState({ records: [makeRecord()] });
      mockedStorage.saveRecords.mockResolvedValue(undefined);

      await useRecordStore.getState().updateRecord('non-existent', { emotion: 'proud' });

      // No record changed
      expect(useRecordStore.getState().records[0].emotion).toBe('happy');
    });
  });

  describe('getRecord', () => {
    it('returns record by id', () => {
      useRecordStore.setState({ records: [makeRecord()] });

      const record = useRecordStore.getState().getRecord('rec-1');
      expect(record?.id).toBe('rec-1');
      expect(record?.emotion).toBe('happy');
    });

    it('returns undefined for non-existent id', () => {
      useRecordStore.setState({ records: [makeRecord()] });

      expect(useRecordStore.getState().getRecord('non-existent')).toBeUndefined();
    });

    it('returns undefined when store is empty', () => {
      expect(useRecordStore.getState().getRecord('rec-1')).toBeUndefined();
    });
  });

  describe('loadRecords', () => {
    it('loads records from storage', async () => {
      const stored = [makeRecord()];
      mockedStorage.getRecords.mockResolvedValue(stored);

      await useRecordStore.getState().loadRecords();

      expect(useRecordStore.getState().records).toEqual(stored);
      expect(useRecordStore.getState().isLoading).toBe(false);
    });

    it('sets empty array when storage returns null', async () => {
      mockedStorage.getRecords.mockResolvedValue(null);

      await useRecordStore.getState().loadRecords();

      expect(useRecordStore.getState().records).toEqual([]);
    });

    it('resets isLoading on error', async () => {
      mockedStorage.getRecords.mockRejectedValue(new Error('read fail'));

      await expect(useRecordStore.getState().loadRecords()).rejects.toThrow('read fail');
      expect(useRecordStore.getState().isLoading).toBe(false);
    });
  });

  describe('getTodayRecord', () => {
    it('returns record matching taskId and today', () => {
      const today = getTodayString();
      useRecordStore.setState({
        records: [
          makeRecord({ id: 'rec-1', taskId: 'task-1', date: today }),
          makeRecord({ id: 'rec-2', taskId: 'task-2', date: today }),
        ],
      });

      const result = useRecordStore.getState().getTodayRecord('task-1');
      expect(result?.id).toBe('rec-1');
    });

    it('returns undefined when no match', () => {
      useRecordStore.setState({
        records: [makeRecord({ date: '2020-01-01' })],
      });

      expect(useRecordStore.getState().getTodayRecord('task-1')).toBeUndefined();
    });
  });

  describe('getRecordsForDate', () => {
    it('filters records by date', () => {
      useRecordStore.setState({
        records: [
          makeRecord({ id: 'r1', date: '2026-02-08' }),
          makeRecord({ id: 'r2', date: '2026-02-09' }),
          makeRecord({ id: 'r3', date: '2026-02-08' }),
        ],
      });

      const result = useRecordStore.getState().getRecordsForDate('2026-02-08');
      expect(result).toHaveLength(2);
      expect(result.map((r) => r.id)).toEqual(['r1', 'r3']);
    });
  });

  describe('getRecordsForTask', () => {
    it('filters records by taskId', () => {
      useRecordStore.setState({
        records: [
          makeRecord({ id: 'r1', taskId: 'task-1' }),
          makeRecord({ id: 'r2', taskId: 'task-2' }),
          makeRecord({ id: 'r3', taskId: 'task-1' }),
        ],
      });

      const result = useRecordStore.getState().getRecordsForTask('task-1');
      expect(result).toHaveLength(2);
    });
  });

  describe('hasRecordedToday', () => {
    it('returns true when record exists for today', () => {
      const today = getTodayString();
      useRecordStore.setState({
        records: [makeRecord({ taskId: 'task-1', date: today })],
      });

      expect(useRecordStore.getState().hasRecordedToday('task-1')).toBe(true);
    });

    it('returns false when no record for today', () => {
      useRecordStore.setState({
        records: [makeRecord({ taskId: 'task-1', date: '2020-01-01' })],
      });

      expect(useRecordStore.getState().hasRecordedToday('task-1')).toBe(false);
    });

    it('returns false for different taskId', () => {
      const today = getTodayString();
      useRecordStore.setState({
        records: [makeRecord({ taskId: 'task-2', date: today })],
      });

      expect(useRecordStore.getState().hasRecordedToday('task-1')).toBe(false);
    });
  });
});
