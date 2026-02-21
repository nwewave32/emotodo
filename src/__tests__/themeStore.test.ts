import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeStore } from '../store/themeStore';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('themeStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useThemeStore.setState({ mode: 'dark', isLoaded: false });
  });

  describe('initial state', () => {
    it('starts with dark mode', () => {
      expect(useThemeStore.getState().mode).toBe('dark');
    });

    it('starts with isLoaded false', () => {
      expect(useThemeStore.getState().isLoaded).toBe(false);
    });
  });

  describe('loadTheme', () => {
    it('loads saved dark theme from storage', async () => {
      mockedAsyncStorage.getItem.mockResolvedValue('dark');

      await useThemeStore.getState().loadTheme();

      expect(useThemeStore.getState().mode).toBe('dark');
      expect(useThemeStore.getState().isLoaded).toBe(true);
      expect(mockedAsyncStorage.getItem).toHaveBeenCalledWith('@emotodo/theme');
    });

    it('loads saved light theme from storage', async () => {
      mockedAsyncStorage.getItem.mockResolvedValue('light');

      await useThemeStore.getState().loadTheme();

      expect(useThemeStore.getState().mode).toBe('light');
      expect(useThemeStore.getState().isLoaded).toBe(true);
    });

    it('defaults to dark when no saved value', async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(null);

      await useThemeStore.getState().loadTheme();

      expect(useThemeStore.getState().mode).toBe('dark');
      expect(useThemeStore.getState().isLoaded).toBe(true);
    });

    it('defaults to dark when saved value is invalid', async () => {
      mockedAsyncStorage.getItem.mockResolvedValue('invalid');

      await useThemeStore.getState().loadTheme();

      expect(useThemeStore.getState().mode).toBe('dark');
      expect(useThemeStore.getState().isLoaded).toBe(true);
    });

    it('sets isLoaded even when storage throws', async () => {
      mockedAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      await useThemeStore.getState().loadTheme();

      expect(useThemeStore.getState().mode).toBe('dark');
      expect(useThemeStore.getState().isLoaded).toBe(true);
    });
  });

  describe('toggleTheme', () => {
    it('toggles from dark to light', async () => {
      useThemeStore.setState({ mode: 'dark' });

      await useThemeStore.getState().toggleTheme();

      expect(useThemeStore.getState().mode).toBe('light');
      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith('@emotodo/theme', 'light');
    });

    it('toggles from light to dark', async () => {
      useThemeStore.setState({ mode: 'light' });

      await useThemeStore.getState().toggleTheme();

      expect(useThemeStore.getState().mode).toBe('dark');
      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith('@emotodo/theme', 'dark');
    });

    it('updates UI immediately even if storage fails', async () => {
      mockedAsyncStorage.setItem.mockRejectedValue(new Error('Write error'));
      useThemeStore.setState({ mode: 'dark' });

      await useThemeStore.getState().toggleTheme();

      expect(useThemeStore.getState().mode).toBe('light');
    });
  });

  describe('setTheme', () => {
    it('sets theme to light', async () => {
      await useThemeStore.getState().setTheme('light');

      expect(useThemeStore.getState().mode).toBe('light');
      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith('@emotodo/theme', 'light');
    });

    it('sets theme to dark', async () => {
      useThemeStore.setState({ mode: 'light' });

      await useThemeStore.getState().setTheme('dark');

      expect(useThemeStore.getState().mode).toBe('dark');
      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith('@emotodo/theme', 'dark');
    });

    it('updates UI immediately even if storage fails', async () => {
      mockedAsyncStorage.setItem.mockRejectedValue(new Error('Write error'));

      await useThemeStore.getState().setTheme('light');

      expect(useThemeStore.getState().mode).toBe('light');
    });
  });
});
