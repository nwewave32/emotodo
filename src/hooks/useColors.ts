import { useThemeStore } from '../store/themeStore';
import { darkColors, lightColors, Colors } from '../constants/colors';

export const useColors = (): Colors => {
  const mode = useThemeStore((state) => state.mode);
  return mode === 'dark' ? darkColors : lightColors;
};
