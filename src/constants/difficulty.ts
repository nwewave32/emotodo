import { Difficulty } from '../types';
import { colors } from './colors';

export interface DifficultyOption {
  value: Difficulty;
  label: string;
  color: string;
  bgColor: string;
}

export const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  { value: 'easy', label: '쉬움', color: colors.difficultyEasy, bgColor: colors.difficultyEasyBg },
  { value: 'normal', label: '보통', color: colors.difficultyNormal, bgColor: colors.difficultyNormalBg },
  { value: 'hard', label: '어려움', color: colors.difficultyHard, bgColor: colors.difficultyHardBg },
];

export const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; color: string; bgColor: string }> = {
  easy: { label: '쉬움', color: colors.difficultyEasy, bgColor: colors.difficultyEasyBg },
  normal: { label: '보통', color: colors.difficultyNormal, bgColor: colors.difficultyNormalBg },
  hard: { label: '어려움', color: colors.difficultyHard, bgColor: colors.difficultyHardBg },
};
