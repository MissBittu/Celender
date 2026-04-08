'use client';

import { CalendarProvider } from '@/lib/CalendarContext';
import WallCalendarInner from '@/components/WallCalendarInner';
import ThemeToggle from '@/components/ThemeToggle';
import { useCalendarContext } from '@/lib/CalendarContext';

function FloatingThemeToggle() {
  const { theme, toggleTheme } = useCalendarContext();
  return <ThemeToggle theme={theme} onToggle={toggleTheme} />;
}

export default function HomePage() {
  return (
    <CalendarProvider>
      <FloatingThemeToggle />
      <WallCalendarInner />
    </CalendarProvider>
  );
}
