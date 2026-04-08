import { CalendarDate, DateRange, Holiday } from './types';

// ============================================================
// Date Utilities
// ============================================================

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

/**
 * US Federal Holidays + Notable dates (fixed-date ones only)
 */
export const HOLIDAYS: Holiday[] = [
  { month: 0,  day: 1,  name: "New Year's Day" },
  { month: 1,  day: 14, name: "Valentine's Day" },
  { month: 2,  day: 17, name: "St. Patrick's Day" },
  { month: 6,  day: 4,  name: "Independence Day" },
  { month: 9,  day: 31, name: "Halloween" },
  { month: 10, day: 11, name: "Veterans Day" },
  { month: 11, day: 24, name: "Christmas Eve" },
  { month: 11, day: 25, name: "Christmas Day" },
  { month: 11, day: 31, name: "New Year's Eve" },
];

export function toCalendarDate(date: Date): CalendarDate {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  };
}

export function toJsDate(cd: CalendarDate): Date {
  return new Date(cd.year, cd.month, cd.day);
}

export function dateToKey(cd: CalendarDate): string {
  return `${cd.year}-${String(cd.month + 1).padStart(2, '0')}-${String(cd.day).padStart(2, '0')}`;
}

export function monthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

export function rangeKey(start: CalendarDate, end: CalendarDate): string {
  return `${dateToKey(start)}__${dateToKey(end)}`;
}

export function compareDates(a: CalendarDate, b: CalendarDate): number {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}

export function isSameDay(a: CalendarDate, b: CalendarDate): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

export function isInRange(date: CalendarDate, range: DateRange): boolean {
  if (!range.start || !range.end) return false;
  const d = compareDates(date, range.start);
  const e = compareDates(date, range.end);
  return d > 0 && e < 0;
}

export function isRangeStart(date: CalendarDate, range: DateRange): boolean {
  if (!range.start) return false;
  return isSameDay(date, range.start);
}

export function isRangeEnd(date: CalendarDate, range: DateRange): boolean {
  if (!range.end) return false;
  return isSameDay(date, range.end);
}

export function normalizeRange(range: DateRange): DateRange {
  if (!range.start || !range.end) return range;
  if (compareDates(range.start, range.end) <= 0) return range;
  return { start: range.end, end: range.start };
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function getHolidayForDay(month: number, day: number): string | undefined {
  return HOLIDAYS.find(h => h.month === month && h.day === day)?.name;
}

export function formatRangeLabel(range: DateRange): string {
  if (!range.start && !range.end) return '';
  if (range.start && !range.end) {
    return `From ${formatCalDate(range.start)}`;
  }
  if (range.start && range.end) {
    return `${formatCalDate(range.start)} → ${formatCalDate(range.end)}`;
  }
  return '';
}

export function formatCalDate(cd: CalendarDate): string {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[cd.month]} ${cd.day}, ${cd.year}`;
}

export function getRangeDayCount(range: DateRange): number {
  if (!range.start || !range.end) return 0;
  const a = toJsDate(range.start);
  const b = toJsDate(range.end);
  return Math.round(Math.abs(b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export function isWeekend(day: number, firstDayOfWeek: number): boolean {
  const dow = (firstDayOfWeek + day - 1) % 7;
  return dow === 0 || dow === 6;
}

export function getDayOfWeek(year: number, month: number, day: number): number {
  return new Date(year, month, day).getDay();
}

export function addMonths(year: number, month: number, delta: number): { year: number; month: number } {
  const d = new Date(year, month + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}
