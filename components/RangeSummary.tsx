'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { DateRange, SelectionStep } from '@/lib/types';
import { formatRangeLabel, getRangeDayCount, formatCalDate } from '@/lib/dateUtils';

interface RangeSummaryProps {
  range: DateRange;
  selectionStep: SelectionStep;
  onClear: () => void;
}

export default function RangeSummary({ range, selectionStep, onClear }: RangeSummaryProps) {
  const hasStart = !!range.start;
  const hasComplete = !!(range.start && range.end);
  const dayCount = getRangeDayCount(range);
  const label = formatRangeLabel(range);

  return (
    <AnimatePresence>
      {hasStart && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="rounded-xl p-3 mb-3"
          style={{
            background: 'var(--accent-light)',
            border: '1px solid var(--range-border)',
          }}
          role="status"
          aria-live="polite"
          aria-label={label || 'Selecting date range'}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {/* State hint */}
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: 'var(--accent)', opacity: 0.8, letterSpacing: '0.1em' }}
              >
                {selectionStep === 'awaiting-end'
                  ? '⚡ Select end date'
                  : hasComplete
                  ? '✓ Range selected'
                  : '📅 Start selected'}
              </p>

              {/* Date display */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                {range.start && (
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: 'var(--accent)' }}
                    >
                      S
                    </span>
                    <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {formatCalDate(range.start)}
                    </span>
                  </div>
                )}

                {range.end && !hasComplete ? null : range.end && (
                  <>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>→</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: 'var(--accent)' }}
                      >
                        E
                      </span>
                      <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                        {formatCalDate(range.end)}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Day count badge */}
              {hasComplete && dayCount > 0 && (
                <p className="text-xs mt-1.5 font-medium" style={{ color: 'var(--accent)' }}>
                  {dayCount} {dayCount === 1 ? 'day' : 'days'} selected
                </p>
              )}
            </div>

            {/* Clear button */}
            <button
              onClick={onClear}
              aria-label="Clear date range selection"
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90"
              style={{
                background: 'rgba(74, 82, 228, 0.15)',
                color: 'var(--accent)',
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
