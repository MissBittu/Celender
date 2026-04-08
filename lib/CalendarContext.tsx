'use client';

import {
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { useCalendar } from '@/lib/useCalendar';

type CalendarContextType = ReturnType<typeof useCalendar>;

const CalendarContext = createContext<CalendarContextType | null>(null);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const calendarState = useCalendar();
  return (
    <CalendarContext.Provider value={calendarState}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendarContext(): CalendarContextType {
  const ctx = useContext(CalendarContext);
  if (!ctx) {
    throw new Error('useCalendarContext must be used within CalendarProvider');
  }
  return ctx;
}
