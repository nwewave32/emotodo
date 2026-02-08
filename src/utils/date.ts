import { format, isToday, parseISO, startOfDay, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy-MM-dd');
};

export const formatDisplayDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (isToday(d)) {
    return '오늘';
  }
  return format(d, 'M월 d일 (EEE)', { locale: ko });
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getTodayString = (): string => {
  return formatDate(new Date());
};

export const getDayOfWeek = (date: Date = new Date()): number => {
  return date.getDay(); // 0=일, 1=월, ..., 6=토
};

export const isTaskScheduledForToday = (repeatDays: number[]): boolean => {
  const today = getDayOfWeek();
  return repeatDays.includes(today);
};

export const isSameDateString = (date1: string, date2: string): boolean => {
  return isSameDay(parseISO(date1), parseISO(date2));
};

export const getStartOfDay = (date: Date = new Date()): Date => {
  return startOfDay(date);
};

export const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];
