export interface Colors {
  // 메인 색상
  primary: string;
  primaryMuted: string;
  secondary: string;

  // 배경
  background: string;
  cardBackground: string;
  cardElevated: string;

  // 텍스트
  textPrimary: string;
  textSecondary: string;
  textLight: string;

  // 상태 색상
  completed: string;
  completedBg: string;
  partial: string;
  partialBg: string;
  postponed: string;
  postponedBg: string;

  // 감정 색상
  emotionHappy: string;
  emotionRelief: string;
  emotionTired: string;
  emotionProud: string;
  emotionAnxious: string;
  emotionNeutral: string;

  // 타이머
  timerActive: string;
  timerRingBg: string;
  timerPaused: string;
  timerComplete: string;

  // 난이도
  difficultyEasy: string;
  difficultyEasyBg: string;
  difficultyNormal: string;
  difficultyNormalBg: string;
  difficultyHard: string;
  difficultyHardBg: string;

  // UI
  overlayLight: string;

  // 감정 글로우
  glowHappy: string;
  glowRelief: string;
  glowTired: string;
  glowProud: string;
  glowAnxious: string;
  glowNeutral: string;

  // 히트맵 셀 배경
  heatmapCompleted: string;
  heatmapPartial: string;
  heatmapPostponed: string;
  heatmapMixed: string;

  // 표면
  surfaceDim: string;

  // 기타
  border: string;
  shadow: string;
  white: string;
  danger: string;
}

export const darkColors: Colors = {
  // 메인 색상 (Cozy Night)
  primary: '#B8A9E8', // Soft Lilac
  primaryMuted: 'rgba(184, 169, 232, 0.15)',
  secondary: '#E8A987', // Warm Peach

  // 배경
  background: '#14121F', // Deep Navy
  cardBackground: '#1E1B2E', // Soft Dark
  cardElevated: '#262340', // Lighter Dark

  // 텍스트
  textPrimary: '#E8E6F0', // Soft White
  textSecondary: '#9690B0', // Muted Lavender
  textLight: '#5C5675', // Deep Muted

  // 상태 색상
  completed: '#7EC9A0', // Sage
  completedBg: 'rgba(126, 201, 160, 0.15)',
  partial: '#DDB964', // Gold
  partialBg: 'rgba(221, 185, 100, 0.15)',
  postponed: '#7A7590', // Muted Grey
  postponedBg: 'rgba(122, 117, 144, 0.15)',

  // 감정 색상
  emotionHappy: '#F0C85C', // Warm Gold
  emotionRelief: '#7EC9A0', // Soft Sage
  emotionTired: '#A490D1', // Muted Lavender
  emotionProud: '#5EADB0', // Soft Teal
  emotionAnxious: '#D4868F', // Dusty Rose
  emotionNeutral: '#8E8A9E', // Silver

  // 타이머
  timerActive: '#B8A9E8',
  timerRingBg: 'rgba(184, 169, 232, 0.1)',
  timerPaused: '#5C5675',
  timerComplete: '#7EC9A0',

  // 난이도
  difficultyEasy: '#7EC9A0',
  difficultyEasyBg: 'rgba(126, 201, 160, 0.12)',
  difficultyNormal: '#B8A9E8',
  difficultyNormalBg: 'rgba(184, 169, 232, 0.12)',
  difficultyHard: '#D4868F',
  difficultyHardBg: 'rgba(212, 134, 143, 0.12)',

  // UI
  overlayLight: 'rgba(255, 255, 255, 0.08)',

  // 감정 글로우 (30% opacity)
  glowHappy: 'rgba(240, 200, 92, 0.3)',
  glowRelief: 'rgba(126, 201, 160, 0.3)',
  glowTired: 'rgba(164, 144, 209, 0.3)',
  glowProud: 'rgba(94, 173, 176, 0.3)',
  glowAnxious: 'rgba(212, 134, 143, 0.3)',
  glowNeutral: 'rgba(142, 138, 158, 0.3)',

  // 히트맵 셀 배경 (12% opacity)
  heatmapCompleted: 'rgba(126, 201, 160, 0.12)',
  heatmapPartial: 'rgba(221, 185, 100, 0.12)',
  heatmapPostponed: 'rgba(122, 117, 144, 0.12)',
  heatmapMixed: 'rgba(184, 169, 232, 0.12)',

  // 표면
  surfaceDim: 'rgba(20, 18, 31, 0.6)',

  // 기타
  border: 'rgba(184, 169, 232, 0.12)',
  shadow: 'rgba(184, 169, 232, 0.05)',
  white: '#E8E6F0',
  danger: '#D07070',
};

export const lightColors: Colors = {
  // 메인 색상 (Soft Morning)
  primary: '#7B6BC4', // Deep Lilac (대비 강화)
  primaryMuted: 'rgba(123, 107, 196, 0.12)',
  secondary: '#D4896A', // Warm Terracotta

  // 배경
  background: '#F5F3FA', // Lavender Tint White
  cardBackground: '#FFFFFF',
  cardElevated: '#EDE9F5', // Light Lavender

  // 텍스트
  textPrimary: '#1E1A2E', // Deep Navy
  textSecondary: '#6B6580', // Muted Purple
  textLight: '#A09BB5', // Light Muted

  // 상태 색상
  completed: '#4EA87A', // Deep Sage
  completedBg: 'rgba(78, 168, 122, 0.12)',
  partial: '#C4A030', // Deep Gold
  partialBg: 'rgba(196, 160, 48, 0.12)',
  postponed: '#8A859E', // Muted Grey
  postponedBg: 'rgba(138, 133, 158, 0.10)',

  // 감정 색상
  emotionHappy: '#D4A830', // Deep Gold
  emotionRelief: '#4EA87A', // Deep Sage
  emotionTired: '#8B74BF', // Deep Lavender
  emotionProud: '#3D8E91', // Deep Teal
  emotionAnxious: '#C06B75', // Deep Rose
  emotionNeutral: '#7A7690', // Deep Silver

  // 타이머
  timerActive: '#7B6BC4',
  timerRingBg: 'rgba(123, 107, 196, 0.1)',
  timerPaused: '#A09BB5',
  timerComplete: '#4EA87A',

  // 난이도
  difficultyEasy: '#4EA87A',
  difficultyEasyBg: 'rgba(78, 168, 122, 0.10)',
  difficultyNormal: '#7B6BC4',
  difficultyNormalBg: 'rgba(123, 107, 196, 0.10)',
  difficultyHard: '#C06B75',
  difficultyHardBg: 'rgba(192, 107, 117, 0.10)',

  // UI
  overlayLight: 'rgba(0, 0, 0, 0.04)',

  // 감정 글로우 (20% opacity - lighter for light mode)
  glowHappy: 'rgba(212, 168, 48, 0.20)',
  glowRelief: 'rgba(78, 168, 122, 0.20)',
  glowTired: 'rgba(139, 116, 191, 0.20)',
  glowProud: 'rgba(61, 142, 145, 0.20)',
  glowAnxious: 'rgba(192, 107, 117, 0.20)',
  glowNeutral: 'rgba(122, 118, 144, 0.20)',

  // 히트맵 셀 배경
  heatmapCompleted: 'rgba(78, 168, 122, 0.15)',
  heatmapPartial: 'rgba(196, 160, 48, 0.15)',
  heatmapPostponed: 'rgba(138, 133, 158, 0.12)',
  heatmapMixed: 'rgba(123, 107, 196, 0.15)',

  // 표면
  surfaceDim: 'rgba(245, 243, 250, 0.8)',

  // 기타
  border: 'rgba(123, 107, 196, 0.15)',
  shadow: 'rgba(30, 26, 46, 0.08)',
  white: '#FFFFFF',
  danger: '#C45050',
};
