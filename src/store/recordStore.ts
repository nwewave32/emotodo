import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { DailyRecord } from '../types';
import { storage } from '../utils/storage';
import { getTodayString } from '../utils/date';

interface RecordState {
  records: DailyRecord[];
  isLoading: boolean;

  // Actions
  loadRecords: () => Promise<void>;
  addRecord: (record: Omit<DailyRecord, 'id' | 'recordedAt'>) => Promise<DailyRecord>;
  updateRecord: (id: string, data: Partial<Omit<DailyRecord, 'id' | 'recordedAt'>>) => Promise<void>;
  getRecord: (id: string) => DailyRecord | undefined;
  getTodayRecord: (taskId: string) => DailyRecord | undefined;
  getRecordsForDate: (date: string) => DailyRecord[];
  getRecordsForTask: (taskId: string) => DailyRecord[];
  hasRecordedToday: (taskId: string) => boolean;
}

const validateEnergyLevel = (level: number | undefined): void => {
  if (level !== undefined && (level < 1 || level > 5 || !Number.isInteger(level))) {
    throw new Error('energyLevel must be an integer between 1 and 5');
  }
};

export const useRecordStore = create<RecordState>((set, get) => ({
  records: [],
  isLoading: false,

  loadRecords: async () => {
    set({ isLoading: true });
    try {
      const records = await storage.getRecords<DailyRecord[]>();
      set({ records: records || [], isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  addRecord: async (recordData) => {
    validateEnergyLevel(recordData.energyLevel);

    const newRecord: DailyRecord = {
      ...recordData,
      id: uuidv4(),
      recordedAt: new Date().toISOString(),
    };

    const updatedRecords = [...get().records, newRecord];
    await storage.saveRecords(updatedRecords);
    set({ records: updatedRecords });
    return newRecord;
  },

  updateRecord: async (id, data) => {
    validateEnergyLevel(data.energyLevel);

    const updatedRecords = get().records.map((record) =>
      record.id === id ? { ...record, ...data } : record
    );
    await storage.saveRecords(updatedRecords);
    set({ records: updatedRecords });
  },

  getRecord: (id) => {
    return get().records.find((record) => record.id === id);
  },

  getTodayRecord: (taskId) => {
    const today = getTodayString();
    return get().records.find(
      (record) => record.taskId === taskId && record.date === today
    );
  },

  getRecordsForDate: (date) => {
    return get().records.filter((record) => record.date === date);
  },

  getRecordsForTask: (taskId) => {
    return get().records.filter((record) => record.taskId === taskId);
  },

  hasRecordedToday: (taskId) => {
    const today = getTodayString();
    return get().records.some(
      (record) => record.taskId === taskId && record.date === today
    );
  },
}));
