// ============================================================
// Calendar Types
// ============================================================

export interface CalendarDate {
  year: number;
  month: number; // 0-indexed (0 = January)
  day: number;
}

export interface DateRange {
  start: CalendarDate | null;
  end: CalendarDate | null;
}

export interface CalendarNotes {
  monthly: Record<string, string>; // key: "YYYY-MM"
  range: Record<string, string>;   // key: "YYYY-MM-DD__YYYY-MM-DD"
}

export interface CalendarState {
  currentYear: number;
  currentMonth: number; // 0-indexed
  range: DateRange;
  notes: CalendarNotes;
  theme: 'light' | 'dark';
}

export interface DayInfo {
  date: CalendarDate;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  holiday?: string;
  selectionState:
    | 'none'
    | 'start'
    | 'end'
    | 'in-range'
    | 'single'
    | 'hover-preview';
}

export type SelectionStep = 'idle' | 'awaiting-end';

export interface Holiday {
  month: number; // 0-indexed
  day: number;
  name: string;
}
