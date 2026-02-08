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
  getTodayRecord: (taskId: string) => DailyRecord | undefined;
  getRecordsForDate: (date: string) => DailyRecord[];
  getRecordsForTask: (taskId: string) => DailyRecord[];
  hasRecordedToday: (taskId: string) => boolean;
}

export const useRecordStore = create<RecordState>((set, get) => ({
  records: [],
  isLoading: false,

  loadRecords: async () => {
    set({ isLoading: true });
    const records = await storage.getRecords<DailyRecord[]>();
    set({ records: records || [], isLoading: false });
  },

  addRecord: async (recordData) => {
    const newRecord: DailyRecord = {
      ...recordData,
      id: uuidv4(),
      recordedAt: new Date().toISOString(),
    };

    const updatedRecords = [...get().records, newRecord];
    set({ records: updatedRecords });
    await storage.saveRecords(updatedRecords);
    return newRecord;
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
