'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MONTH_NAMES } from '@/lib/dateUtils';

interface MonthNavigatorProps {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onJumpTo?: (year: number, month: number) => void;
}

export default function MonthNavigator({
  year, month, onPrev, onNext, onToday, onJumpTo,
}: MonthNavigatorProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(year);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker on outside click
  useEffect(() => {
    if (!pickerOpen) return;
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [pickerOpen]);

  // Sync picker year when parent changes
  useEffect(() => { setPickerYear(year); }, [year]);

  const handleMonthPick = (m: number) => {
    onJumpTo?.(pickerYear, m);
    setPickerOpen(false);
  };

  return (
    <div className="flex items-center justify-between select-none">
      {/* ── Month / Year Title (clickable to open picker) ── */}
      <div className="relative" ref={pickerRef}>
        <button
          onClick={() => setPickerOpen(v => !v)}
          aria-label="Open month picker"
          aria-expanded={pickerOpen}
          className="flex flex-col items-start gap-0 group"
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={`month-${year}-${month}`}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.25 }}
              className="text-xl font-bold leading-tight tracking-tight flex items-center gap-1.5"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'var(--text-primary)' }}
            >
              {MONTH_NAMES[month]}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  color: 'var(--text-muted)',
                  transform: pickerOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s ease',
                  marginTop: 2,
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </motion.span>
          </AnimatePresence>
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{year}</span>
        </button>

        {/* Month picker dropdown */}
        <AnimatePresence>
          {pickerOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 z-50 mt-2 rounded-xl overflow-hidden"
              style={{
                background: 'var(--bg-calendar)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
                minWidth: '240px',
              }}
            >
              {/* Year row */}
              <div
                className="flex items-center justify-between px-3 py-2.5"
                style={{ borderBottom: '1px solid var(--border-color)' }}
              >
                <button
                  onClick={() => setPickerYear(y => y - 1)}
                  className="nav-btn"
                  aria-label="Previous year"
                  style={{ width: 28, height: 28 }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {pickerYear}
                </span>
                <button
                  onClick={() => setPickerYear(y => y + 1)}
                  className="nav-btn"
                  aria-label="Next year"
                  style={{ width: 28, height: 28 }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </div>

              {/* Month grid */}
              <div className="grid grid-cols-4 gap-1 p-2">
                {MONTH_NAMES.map((name, i) => {
                  const isCurrent = i === month && pickerYear === year;
                  return (
                    <button
                      key={name}
                      onClick={() => handleMonthPick(i)}
                      className="py-1.5 rounded-lg text-xs font-medium transition-all duration-150 hover:scale-105 active:scale-95"
                      style={{
                        background: isCurrent ? 'var(--accent)' : 'transparent',
                        color: isCurrent ? 'white' : 'var(--text-secondary)',
                        border: isCurrent ? 'none' : '1px solid var(--border-color)',
                      }}
                    >
                      {name.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Controls ── */}
      <div className="flex items-center gap-2">
        {/* Today */}
        <button
          onClick={onToday}
          aria-label="Go to today"
          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: 'var(--accent-light)',
            color: 'var(--accent)',
            border: '1px solid var(--range-border)',
          }}
        >
          Today
        </button>

        {/* Prev */}
        <button onClick={onPrev} aria-label="Previous month" className="nav-btn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>

        {/* Next */}
        <button onClick={onNext} aria-label="Next month" className="nav-btn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>
    </div>
  );
}
