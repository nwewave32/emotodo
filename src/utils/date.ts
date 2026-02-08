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

export const getCalendarDays = (year: number, month: number): (string | null)[] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const days: (string | null)[] = [];

  // Fill leading nulls for days before month start
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }

  // Fill actual days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = format(new Date(year, month, d), 'yyyy-MM-dd');
    days.push(dateStr);
  }

  // Fill trailing nulls to complete the grid (6 weeks x 7 days = 42)
  while (days.length < 42) {
    days.push(null);
  }

  return days;
};

export const getMonthLabel = (year: number, month: number): string => {
  return format(new Date(year, month, 1), 'yyyy년 M월', { locale: ko });
};

export const getDayOfWeekForDate = (dateString: string): number => {
  return parseISO(dateString).getDay();
};

export const isTaskScheduledForDate = (
  repeatDays: number[],
  scheduledDate: string | undefined,
  targetDate: string
): boolean => {
  if (scheduledDate) {
    return scheduledDate === targetDate;
  }
  const dayOfWeek = getDayOfWeekForDate(targetDate);
  return repeatDays.includes(dayOfWeek);
};
