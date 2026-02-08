import { storage } from '../utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  multiRemove: jest.fn(),
}));

const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('returns parsed data from storage', async () => {
      const data = [{ id: '1', title: 'test' }];
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(data));

      const result = await storage.getTasks();
      expect(result).toEqual(data);
    });

    it('returns null when no data', async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(null);

      const result = await storage.getTasks();
      expect(result).toBeNull();
    });

    it('throws on error instead of swallowing', async () => {
      mockedAsyncStorage.getItem.mockRejectedValue(new Error('read fail'));

      await expect(storage.getTasks()).rejects.toThrow('Failed to get tasks');
    });
  });

  describe('saveTasks', () => {
    it('serializes and saves data', async () => {
      mockedAsyncStorage.setItem.mockResolvedValue(undefined);

      const data = [{ id: '1' }];
      await storage.saveTasks(data);

      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        '@emotodo/tasks',
        JSON.stringify(data),
      );
    });

    it('throws on error instead of swallowing', async () => {
      mockedAsyncStorage.setItem.mockRejectedValue(new Error('write fail'));

      await expect(storage.saveTasks([])).rejects.toThrow('Failed to save tasks');
    });
  });

  describe('getRecords', () => {
    it('returns parsed records', async () => {
      const data = [{ id: 'r1' }];
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(data));

      const result = await storage.getRecords();
      expect(result).toEqual(data);
    });

    it('throws on error', async () => {
      mockedAsyncStorage.getItem.mockRejectedValue(new Error('fail'));
      await expect(storage.getRecords()).rejects.toThrow('Failed to get records');
    });
  });

  describe('saveRecords', () => {
    it('throws on error', async () => {
      mockedAsyncStorage.setItem.mockRejectedValue(new Error('fail'));
      await expect(storage.saveRecords([])).rejects.toThrow('Failed to save records');
    });
  });

  describe('clear', () => {
    it('removes all keys', async () => {
      mockedAsyncStorage.multiRemove.mockResolvedValue(undefined);

      await storage.clear();

      expect(mockedAsyncStorage.multiRemove).toHaveBeenCalledWith([
        '@emotodo/tasks',
        '@emotodo/records',
      ]);
    });

    it('throws on error', async () => {
      mockedAsyncStorage.multiRemove.mockRejectedValue(new Error('fail'));
      await expect(storage.clear()).rejects.toThrow('Failed to clear storage');
    });
  });
});
