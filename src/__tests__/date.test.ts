import {
  formatDate,
  formatDisplayDate,
  getTodayString,
  getDayOfWeek,
  isTaskScheduledForToday,
  isSameDateString,
  DAY_LABELS,
} from '../utils/date';
import { format } from 'date-fns';

describe('date utils', () => {
  describe('formatDate', () => {
    it('formats a Date object to YYYY-MM-DD', () => {
      const date = new Date(2026, 1, 8); // Feb 8, 2026
      expect(formatDate(date)).toBe('2026-02-08');
    });

    it('formats a string date to YYYY-MM-DD', () => {
      expect(formatDate('2026-02-08')).toBe('2026-02-08');
    });
  });

  describe('formatDisplayDate', () => {
    it('returns "오늘" for today', () => {
      const today = new Date();
      expect(formatDisplayDate(today)).toBe('오늘');
    });

    it('returns formatted date for past dates', () => {
      const pastDate = new Date(2025, 0, 15); // Jan 15, 2025
      const result = formatDisplayDate(pastDate);
      expect(result).toContain('1월');
      expect(result).toContain('15일');
    });

    it('accepts string dates', () => {
      const result = formatDisplayDate('2025-03-20');
      expect(result).toContain('3월');
      expect(result).toContain('20일');
    });
  });

  describe('getTodayString', () => {
    it('returns today in YYYY-MM-DD format', () => {
      const expected = format(new Date(), 'yyyy-MM-dd');
      expect(getTodayString()).toBe(expected);
    });
  });

  describe('getDayOfWeek', () => {
    it('returns correct day index for a given date', () => {
      // Feb 8, 2026 is a Sunday
      const sunday = new Date(2026, 1, 8);
      expect(getDayOfWeek(sunday)).toBe(0);

      // Feb 9, 2026 is a Monday
      const monday = new Date(2026, 1, 9);
      expect(getDayOfWeek(monday)).toBe(1);
    });

    it('defaults to current date when no argument', () => {
      const result = getDayOfWeek();
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(6);
    });
  });

  describe('isTaskScheduledForToday', () => {
    it('returns true when today is in repeatDays', () => {
      const todayIndex = new Date().getDay();
      expect(isTaskScheduledForToday([todayIndex])).toBe(true);
    });

    it('returns false when today is not in repeatDays', () => {
      const todayIndex = new Date().getDay();
      const otherDay = (todayIndex + 1) % 7;
      expect(isTaskScheduledForToday([otherDay])).toBe(false);
    });

    it('returns true for all days array', () => {
      expect(isTaskScheduledForToday([0, 1, 2, 3, 4, 5, 6])).toBe(true);
    });

    it('returns false for empty array', () => {
      expect(isTaskScheduledForToday([])).toBe(false);
    });
  });

  describe('isSameDateString', () => {
    it('returns true for same dates', () => {
      expect(isSameDateString('2026-02-08', '2026-02-08')).toBe(true);
    });

    it('returns false for different dates', () => {
      expect(isSameDateString('2026-02-08', '2026-02-09')).toBe(false);
    });
  });

  describe('DAY_LABELS', () => {
    it('has 7 labels', () => {
      expect(DAY_LABELS).toHaveLength(7);
    });

    it('starts with Sunday (일)', () => {
      expect(DAY_LABELS[0]).toBe('일');
    });
  });
});
