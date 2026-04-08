'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalendarContext } from '@/lib/CalendarContext';
import HeroSection from './HeroSection';
import MonthNavigator from './MonthNavigator';
import CalendarGrid from './CalendarGrid';
import NotesPanel from './NotesPanel';
import RangeSummary from './RangeSummary';

export default function WallCalendarInner() {
  const cal = useCalendarContext();
  const [mobileNotesOpen, setMobileNotesOpen] = useState(false);

  // Loading spinner
  if (!cal.loaded) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: 'var(--bg-app)' }}
        aria-label="Loading calendar…"
      >
        <div className="flex flex-col items-center gap-3">
          <div
            style={{
              width: 36, height: 36, borderRadius: '50%',
              borderColor: 'var(--accent-light)',
              borderTopColor: 'var(--accent)',
              borderWidth: '3px', borderStyle: 'solid',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            Loading…
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    );
  }

  const handleJumpTo = (year: number, month: number) => {
    cal.jumpToMonth(year, month);
  };

  return (
    <div
      className="calendar-container min-h-screen flex items-start justify-center px-3 pt-5 pb-12 sm:px-6 sm:py-10"
      style={{ background: 'var(--bg-app)' }}
    >
      <div className="w-full" style={{ maxWidth: '880px' }}>

        {/* ── Hanging Binding ── */}
        <div
          className="calendar-binding relative"
          style={{ height: '40px', borderRadius: '14px 14px 0 0' }}
          aria-hidden="true"
        >
          <div
            className="hook-pin absolute"
            style={{ left: '50%', transform: 'translateX(-50%)', top: 0 }}
          />
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="binding-coil" />
          ))}
        </div>

        {/* ── Calendar Card ── */}
        <article
          className="calendar-card"
          style={{ borderRadius: '0 0 20px 20px' }}
          aria-label="Interactive Wall Calendar"
        >
          {/* Hero */}
          <HeroSection month={cal.currentMonth} year={cal.currentYear} />

          {/* Body */}
          <div className="flex flex-col lg:flex-row">

            {/* ── Notes Panel (desktop: left sidebar) ── */}
            <div
              className="hidden lg:block paper-texture"
              style={{
                flex: '0 0 282px',
                borderRight: '1px solid var(--border-color)',
              }}
            >
              <div className="p-6">
                <NotesPanel
                  currentYear={cal.currentYear}
                  currentMonth={cal.currentMonth}
                  range={cal.range}
                  monthlyNote={cal.monthlyNote}
                  rangeNote={cal.rangeNote}
                  onMonthlyNoteChange={cal.setMonthlyNote}
                  onRangeNoteChange={cal.setRangeNote}
                />
              </div>
            </div>

            {/* ── Right: Calendar Grid ── */}
            <div
              className="flex-1 flex flex-col p-4 sm:p-6"
              style={{ background: 'var(--bg-calendar)' }}
            >
              {/* Month Navigator */}
              <MonthNavigator
                year={cal.currentYear}
                month={cal.currentMonth}
                onPrev={() => cal.goToMonth('prev')}
                onNext={() => cal.goToMonth('next')}
                onToday={cal.goToToday}
                onJumpTo={handleJumpTo}
              />

              <div className="mt-4" />

              {/* Range Summary */}
              <RangeSummary
                range={cal.range}
                selectionStep={cal.selectionStep}
                onClear={cal.clearRange}
              />

              {/* Calendar Grid */}
              <CalendarGrid
                year={cal.currentYear}
                month={cal.currentMonth}
                today={cal.today}
                range={cal.range}
                hoverRange={cal.hoverRange}
                selectionStep={cal.selectionStep}
                animDir={cal.animDir}
                onDayClick={cal.handleDayClick}
                onDayHover={cal.handleDayHover}
              />

              {/* Legend */}
              <div
                className="mt-5 pt-4 flex flex-wrap items-center gap-x-4 gap-y-2"
                style={{ borderTop: '1px solid var(--border-color)' }}
                aria-label="Calendar legend"
              >
                <LegendItem color="var(--accent)" label="Selected" shape="circle" />
                <LegendItem color="var(--range-bg)" label="In Range" shape="rect" border="var(--range-border)" />
                <LegendItem color="var(--today-ring)" label="Today" shape="ring" />
                <LegendItem color="var(--holiday-dot)" label="Holiday" shape="dot" />
                <LegendItem color="var(--weekend)" label="Weekend" shape="text" />
              </div>

              {/* ── Mobile Notes Toggle ── */}
              <div className="lg:hidden mt-5 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => setMobileNotesOpen(v => !v)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200"
                  style={{
                    background: 'var(--accent-light)',
                    border: '1px solid var(--range-border)',
                    color: 'var(--accent)',
                  }}
                  aria-expanded={mobileNotesOpen}
                  aria-controls="mobile-notes-panel"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">📋</span>
                    <span className="text-sm font-semibold">Notes & Memos</span>
                  </div>
                  <motion.div
                    animate={{ rotate: mobileNotesOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </motion.div>
                </button>

                <AnimatePresence>
                  {mobileNotesOpen && (
                    <motion.div
                      id="mobile-notes-panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div
                        className="mt-3 rounded-xl paper-texture p-4"
                        style={{ border: '1px solid var(--border-color)' }}
                      >
                        <NotesPanel
                          currentYear={cal.currentYear}
                          currentMonth={cal.currentMonth}
                          range={cal.range}
                          monthlyNote={cal.monthlyNote}
                          rangeNote={cal.rangeNote}
                          onMonthlyNoteChange={cal.setMonthlyNote}
                          onRangeNoteChange={cal.setRangeNote}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </article>

        {/* Depth shadows */}
        <div aria-hidden="true">
          <div style={{
            height: '16px', marginInline: '10px',
            background: 'rgba(0,0,0,0.12)', filter: 'blur(8px)',
            transform: 'translateY(-5px)', borderRadius: '0 0 12px 12px',
          }} />
          <div style={{
            height: '10px', marginInline: '26px',
            background: 'rgba(0,0,0,0.06)', filter: 'blur(5px)',
            transform: 'translateY(-11px)', borderRadius: '0 0 12px 12px',
          }} />
        </div>
      </div>
    </div>
  );
}

// ── Legend Item ────────────────────────────────────────────────────────────

interface LegendItemProps {
  color: string;
  label: string;
  shape: 'circle' | 'rect' | 'ring' | 'dot' | 'text';
  border?: string;
}

function LegendItem({ color, label, shape, border }: LegendItemProps) {
  let indicator: React.ReactNode;
  switch (shape) {
    case 'circle':
      indicator = <span style={{ width: 13, height: 13, borderRadius: '50%', background: color, display: 'block', flexShrink: 0 }} />;
      break;
    case 'rect':
      indicator = <span style={{ width: 17, height: 11, borderRadius: 3, background: color, border: border ? `1px solid ${border}` : undefined, display: 'block', flexShrink: 0 }} />;
      break;
    case 'ring':
      indicator = <span style={{ width: 13, height: 13, borderRadius: '50%', border: `2px solid ${color}`, display: 'block', flexShrink: 0 }} />;
      break;
    case 'dot':
      indicator = <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'block', flexShrink: 0 }} />;
      break;
    case 'text':
      indicator = <span style={{ fontSize: '0.72rem', fontWeight: 700, color, lineHeight: 1 }}>Sa</span>;
      break;
  }
  return (
    <div className="flex items-center gap-1.5" aria-label={label}>
      {indicator}
      <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{label}</span>
    </div>
  );
}
