import {
  formatDate,
  formatDisplayDate,
  getTodayString,
  getDayOfWeek,
  isTaskScheduledForToday,
  isSameDateString,
  DAY_LABELS,
  getCalendarDays,
  getMonthLabel,
  getDayOfWeekForDate,
  isTaskScheduledForDate,
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

  describe('getCalendarDays', () => {
    it('returns 42 elements (6 weeks x 7 days)', () => {
      const days = getCalendarDays(2026, 1); // Feb 2026
      expect(days).toHaveLength(42);
    });

    it('starts with nulls when month does not begin on Sunday', () => {
      // Feb 2026 starts on Sunday → no leading nulls
      const febDays = getCalendarDays(2026, 1);
      expect(febDays[0]).toBe('2026-02-01');

      // Mar 2026 starts on Sunday → no leading nulls
      const marDays = getCalendarDays(2026, 2);
      expect(marDays[0]).toBe('2026-03-01');

      // Apr 2026 starts on Wednesday → 3 leading nulls
      const aprDays = getCalendarDays(2026, 3);
      expect(aprDays[0]).toBeNull();
      expect(aprDays[1]).toBeNull();
      expect(aprDays[2]).toBeNull();
      expect(aprDays[3]).toBe('2026-04-01');
    });

    it('contains all days of the month', () => {
      // Feb 2026 has 28 days (non-leap year)
      const days = getCalendarDays(2026, 1);
      const nonNullDays = days.filter((d) => d !== null);
      expect(nonNullDays).toHaveLength(28);
      expect(nonNullDays[0]).toBe('2026-02-01');
      expect(nonNullDays[27]).toBe('2026-02-28');
    });

    it('handles months with 31 days', () => {
      const days = getCalendarDays(2026, 0); // Jan 2026
      const nonNullDays = days.filter((d) => d !== null);
      expect(nonNullDays).toHaveLength(31);
      expect(nonNullDays[30]).toBe('2026-01-31');
    });

    it('handles leap year February', () => {
      // 2024 is a leap year
      const days = getCalendarDays(2024, 1);
      const nonNullDays = days.filter((d) => d !== null);
      expect(nonNullDays).toHaveLength(29);
      expect(nonNullDays[28]).toBe('2024-02-29');
    });

    it('fills trailing nulls to reach 42', () => {
      const days = getCalendarDays(2026, 1); // Feb 2026: 28 days, starts Sunday
      // 28 days + 0 leading nulls = 28, so 14 trailing nulls
      expect(days[28]).toBeNull();
      expect(days[41]).toBeNull();
    });
  });

  describe('getMonthLabel', () => {
    it('returns Korean formatted month label', () => {
      expect(getMonthLabel(2026, 1)).toBe('2026년 2월');
    });

    it('handles January', () => {
      expect(getMonthLabel(2026, 0)).toBe('2026년 1월');
    });

    it('handles December', () => {
      expect(getMonthLabel(2025, 11)).toBe('2025년 12월');
    });
  });

  describe('getDayOfWeekForDate', () => {
    it('returns correct day index for a date string', () => {
      // 2026-02-08 is Sunday
      expect(getDayOfWeekForDate('2026-02-08')).toBe(0);
      // 2026-02-09 is Monday
      expect(getDayOfWeekForDate('2026-02-09')).toBe(1);
      // 2026-02-14 is Saturday
      expect(getDayOfWeekForDate('2026-02-14')).toBe(6);
    });
  });

  describe('isTaskScheduledForDate', () => {
    it('matches by scheduledDate when present', () => {
      expect(isTaskScheduledForDate([0, 1, 2, 3, 4, 5, 6], '2026-03-01', '2026-03-01')).toBe(true);
    });

    it('does not match wrong scheduledDate even if repeatDays matches', () => {
      // 2026-02-09 is Monday (1), repeatDays includes Monday
      expect(isTaskScheduledForDate([1], '2026-03-01', '2026-02-09')).toBe(false);
    });

    it('falls back to repeatDays when scheduledDate is undefined', () => {
      // 2026-02-09 is Monday (1)
      expect(isTaskScheduledForDate([1], undefined, '2026-02-09')).toBe(true);
      expect(isTaskScheduledForDate([2], undefined, '2026-02-09')).toBe(false);
    });

    it('returns false for empty repeatDays and no scheduledDate', () => {
      expect(isTaskScheduledForDate([], undefined, '2026-02-09')).toBe(false);
    });

    it('handles all-days repeatDays', () => {
      expect(isTaskScheduledForDate([0, 1, 2, 3, 4, 5, 6], undefined, '2026-02-09')).toBe(true);
      expect(isTaskScheduledForDate([0, 1, 2, 3, 4, 5, 6], undefined, '2026-02-14')).toBe(true);
    });
  });
});
