import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  TASKS: '@emotodo/tasks',
  RECORDS: '@emotodo/records',
};

export const storage = {
  async getTasks<T>(): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.TASKS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      throw new Error(`Failed to get tasks: ${error}`);
    }
  },

  async saveTasks<T>(tasks: T): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      throw new Error(`Failed to save tasks: ${error}`);
    }
  },

  async getRecords<T>(): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.RECORDS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      throw new Error(`Failed to get records: ${error}`);
    }
  },

  async saveRecords<T>(records: T): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.RECORDS, JSON.stringify(records));
    } catch (error) {
      throw new Error(`Failed to save records: ${error}`);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([KEYS.TASKS, KEYS.RECORDS]);
    } catch (error) {
      throw new Error(`Failed to clear storage: ${error}`);
    }
  },
};
