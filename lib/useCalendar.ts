'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CalendarDate,
  CalendarNotes,
  CalendarState,
  DateRange,
  SelectionStep,
} from '@/lib/types';
import {
  addMonths,
  compareDates,
  isSameDay,
  monthKey,
  normalizeRange,
  rangeKey,
  toCalendarDate,
} from '@/lib/dateUtils';

// ─── LocalStorage helpers ────────────────────────────────────────────────────

const LS_KEY = 'wall-calendar-state';

function loadState(): Partial<CalendarState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<CalendarState>;
  } catch {
    return {};
  }
}

function saveState(state: CalendarState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    // quota exceeded or SSR
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useCalendar() {
  const now = new Date();
  const todayDate = toCalendarDate(now);

  const [loaded, setLoaded] = useState(false);
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [selectionStep, setSelectionStep] = useState<SelectionStep>('idle');
  const [hoverDate, setHoverDate] = useState<CalendarDate | null>(null);
  const [notes, setNotes] = useState<CalendarNotes>({ monthly: {}, range: {} });
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [animDir, setAnimDir] = useState<'next' | 'prev'>('next');

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = loadState();
    if (saved.currentYear) setCurrentYear(saved.currentYear);
    if (saved.currentMonth !== undefined) setCurrentMonth(saved.currentMonth);
    if (saved.range) setRange(saved.range);
    if (saved.notes) setNotes(saved.notes);
    if (saved.theme) {
      setTheme(saved.theme);
      document.documentElement.classList.toggle('dark', saved.theme === 'dark');
    }
    setLoaded(true);
  }, []);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    if (!loaded) return;
    saveState({ currentYear, currentMonth, range, notes, theme });
  }, [loaded, currentYear, currentMonth, range, notes, theme]);

  // Theme toggle
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', next === 'dark');
      return next;
    });
  }, []);

  // Month navigation
  const goToMonth = useCallback((dir: 'next' | 'prev') => {
    setAnimDir(dir);
    const delta = dir === 'next' ? 1 : -1;
    setCurrentYear(y => {
      const { year } = addMonths(y, currentMonth, delta);
      return year;
    });
    setCurrentMonth(m => {
      const { month } = addMonths(currentYear, m, delta);
      return month;
    });
  }, [currentMonth, currentYear]);

  const goToToday = useCallback(() => {
    const todayDir = currentYear < now.getFullYear() ||
      (currentYear === now.getFullYear() && currentMonth < now.getMonth())
      ? 'next' : 'prev';
    setAnimDir(todayDir);
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
  }, [currentMonth, currentYear, now]);

  const jumpToMonth = useCallback((year: number, month: number) => {
    const targetAfter = year > currentYear || (year === currentYear && month > currentMonth);
    setAnimDir(targetAfter ? 'next' : 'prev');
    setCurrentYear(year);
    setCurrentMonth(month);
  }, [currentYear, currentMonth]);

  // Day click — range selection state machine
  const handleDayClick = useCallback((date: CalendarDate) => {
    if (selectionStep === 'idle') {
      // First click → start
      setRange({ start: date, end: null });
      setSelectionStep('awaiting-end');
    } else {
      // Second click → end (or reset if same date)
      if (range.start && isSameDay(date, range.start)) {
        // clicking same day → single-day range
        setRange({ start: date, end: date });
        setSelectionStep('idle');
        setHoverDate(null);
        return;
      }
      const newRange = normalizeRange({ start: range.start, end: date });
      setRange(newRange);
      setSelectionStep('idle');
      setHoverDate(null);
    }
  }, [selectionStep, range.start]);

  const handleDayHover = useCallback((date: CalendarDate | null) => {
    if (selectionStep === 'awaiting-end') {
      setHoverDate(date);
    }
  }, [selectionStep]);

  const clearRange = useCallback(() => {
    setRange({ start: null, end: null });
    setSelectionStep('idle');
    setHoverDate(null);
  }, []);

  // Notes helpers
  const currentMonthKey = useMemo(() => monthKey(currentYear, currentMonth), [currentYear, currentMonth]);

  const currentRangeKey = useMemo(() => {
    if (!range.start || !range.end) return null;
    return rangeKey(range.start, range.end);
  }, [range]);

  const monthlyNote = notes.monthly[currentMonthKey] ?? '';
  const rangeNote = currentRangeKey ? (notes.range[currentRangeKey] ?? '') : '';

  const setMonthlyNote = useCallback((text: string) => {
    setNotes(prev => ({
      ...prev,
      monthly: { ...prev.monthly, [currentMonthKey]: text },
    }));
  }, [currentMonthKey]);

  const setRangeNote = useCallback((text: string) => {
    if (!currentRangeKey) return;
    setNotes(prev => ({
      ...prev,
      range: { ...prev.range, [currentRangeKey]: text },
    }));
  }, [currentRangeKey]);

  // Hover range preview for ghost highlighting
  const hoverRange = useMemo<DateRange>(() => {
    if (selectionStep !== 'awaiting-end' || !range.start || !hoverDate) {
      return { start: null, end: null };
    }
    return normalizeRange({ start: range.start, end: hoverDate });
  }, [selectionStep, range.start, hoverDate]);

  return {
    // View state
    currentYear,
    currentMonth,
    animDir,
    today: todayDate,
    loaded,
    theme,

    // Selection state
    range,
    hoverRange,
    selectionStep,
    hoverDate,

    // Notes
    monthlyNote,
    rangeNote,

    // Actions
    toggleTheme,
    goToMonth,
    goToToday,
    jumpToMonth,
    handleDayClick,
    handleDayHover,
    clearRange,
    setMonthlyNote,
    setRangeNote,
  };
}
