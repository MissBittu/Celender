'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDate, DateRange, SelectionStep } from '@/lib/types';
import {
  DAY_NAMES,
  getDaysInMonth,
  getFirstDayOfMonth,
  getHolidayForDay,
  getDayOfWeek,
  isSameDay,
  isInRange,
  isRangeStart,
  isRangeEnd,
  compareDates,
} from '@/lib/dateUtils';

interface CalendarGridProps {
  year: number;
  month: number;
  today: CalendarDate;
  range: DateRange;
  hoverRange: DateRange;
  selectionStep: SelectionStep;
  animDir: 'next' | 'prev';
  onDayClick: (date: CalendarDate) => void;
  onDayHover: (date: CalendarDate | null) => void;
}

// ── Compute CSS class names for a single day cell ──────────────────────────

function getDayCellClasses(
  date: CalendarDate,
  today: CalendarDate,
  range: DateRange,
  hoverRange: DateRange,
  selectionStep: SelectionStep,
): string {
  const cls: string[] = ['day-cell'];

  // Weekend
  const dow = getDayOfWeek(date.year, date.month, date.day);
  if (dow === 0 || dow === 6) cls.push('day-weekend');

  // Today
  if (isSameDay(date, today)) cls.push('day-today');

  const hasCompleteRange = !!(range.start && range.end);
  const isSingle = hasCompleteRange && isSameDay(range.start!, range.end!);
  const start = isRangeStart(date, range);
  const end = isRangeEnd(date, range);
  const inRange = hasCompleteRange && isInRange(date, range);

  if (start && end && isSingle) {
    cls.push('day-selected');
  } else if (start) {
    cls.push('day-range-start');
  } else if (end) {
    cls.push('day-range-end');
  } else if (inRange) {
    cls.push('day-in-range');
  } else if (selectionStep === 'awaiting-end') {
    // Hover preview logic
    const hStart = hoverRange.start && isSameDay(date, hoverRange.start);
    const hEnd = hoverRange.end && isSameDay(date, hoverRange.end);
    const hSingle = hStart && hEnd;
    const hIn = hoverRange.start && hoverRange.end && isInRange(date, hoverRange);

    if (hSingle) cls.push('day-hover-single');
    else if (hStart) cls.push('day-hover-start');
    else if (hEnd) cls.push('day-hover-end');
    else if (hIn) cls.push('day-hover-preview');
  }

  return cls.join(' ');
}

// ── Page flip variants ─────────────────────────────────────────────────────

const pageVariants = {
  enter: (dir: 'next' | 'prev') => ({
    x: dir === 'next' ? 48 : -48,
    opacity: 0,
    rotateY: dir === 'next' ? 6 : -6,
  }),
  center: { x: 0, opacity: 1, rotateY: 0 },
  exit: (dir: 'next' | 'prev') => ({
    x: dir === 'next' ? -48 : 48,
    opacity: 0,
    rotateY: dir === 'next' ? -6 : 6,
  }),
};

const pageTransition = { duration: 0.3, ease: [0.4, 0, 0.2, 1] };

// ── Component ──────────────────────────────────────────────────────────────

export default function CalendarGrid({
  year, month, today, range, hoverRange, selectionStep, animDir,
  onDayClick, onDayHover,
}: CalendarGridProps) {

  // Build grid: leading nulls + day dates + trailing nulls
  const days = useMemo<(CalendarDate | null)[]>(() => {
    const first = getFirstDayOfMonth(year, month);
    const total = getDaysInMonth(year, month);
    const grid: (CalendarDate | null)[] = [];
    for (let i = 0; i < first; i++) grid.push(null);
    for (let d = 1; d <= total; d++) grid.push({ year, month, day: d });
    while (grid.length % 7 !== 0) grid.push(null);
    return grid;
  }, [year, month]);

  return (
    <div>
      {/* ── Day-of-week headers ── */}
      <div className="grid grid-cols-7 mb-1.5" role="row">
        {DAY_NAMES.map((name, i) => (
          <div
            key={name}
            role="columnheader"
            aria-label={name}
            className="text-center py-1.5 select-none"
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.09em',
              textTransform: 'uppercase',
              color: i === 0 || i === 6 ? 'var(--weekend)' : 'var(--text-muted)',
            }}
          >
            {name}
          </div>
        ))}
      </div>

      {/* ── Animated date grid ── */}
      <AnimatePresence mode="wait" custom={animDir}>
        <motion.div
          key={`${year}-${month}`}
          custom={animDir}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={pageTransition}
          className="grid grid-cols-7 gap-y-0.5"
          role="grid"
          aria-label={`Calendar — ${month + 1} / ${year}`}
          style={{ transformOrigin: 'center top' }}
        >
          {days.map((date, idx) => {
            if (!date) {
              return (
                <div
                  key={`empty-${idx}`}
                  role="gridcell"
                  aria-hidden="true"
                  className="day-cell"
                  style={{ cursor: 'default' }}
                />
              );
            }

            const holiday = getHolidayForDay(date.month, date.day);
            const cellClass = getDayCellClasses(date, today, range, hoverRange, selectionStep);
            const isSelectedStyle =
              cellClass.includes('day-range-start') ||
              cellClass.includes('day-range-end') ||
              cellClass.includes('day-selected') ||
              cellClass.includes('day-hover-start') ||
              cellClass.includes('day-hover-end') ||
              cellClass.includes('day-hover-single');
            const dow = getDayOfWeek(date.year, date.month, date.day);
            const isToday = isSameDay(date, today);

            return (
              <div
                key={`${date.year}-${date.month}-${date.day}`}
                role="gridcell"
                aria-label={[
                  `${date.day}`,
                  holiday ? ` — ${holiday}` : '',
                  isToday ? ' (today)' : '',
                ].join('')}
                aria-selected={isSelectedStyle}
                className={cellClass}
                onClick={() => onDayClick(date)}
                onMouseEnter={() => onDayHover(date)}
                onMouseLeave={() => onDayHover(null)}
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onDayClick(date);
                  }
                }}
              >
                {/* Day number */}
                <span
                  className="day-number text-sm leading-none select-none"
                  style={{
                    fontWeight: isToday ? 700 : 500,
                    color: isSelectedStyle ? 'white' : undefined,
                    fontSize: 'clamp(0.68rem, 2vw, 0.875rem)',
                  }}
                >
                  {date.day}
                </span>

                {/* Holiday dot + tooltip */}
                {holiday && (
                  <>
                    {!isSelectedStyle && <span className="holiday-dot" aria-hidden="true" />}
                    <span className="holiday-tooltip" role="tooltip">{holiday}</span>
                  </>
                )}
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
