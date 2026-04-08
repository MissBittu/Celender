'use client';

import { motion } from 'framer-motion';
import { DateRange } from '@/lib/types';
import { monthKey, MONTH_NAMES, rangeKey } from '@/lib/dateUtils';

interface NotesPanelProps {
  currentYear: number;
  currentMonth: number;
  range: DateRange;
  monthlyNote: string;
  rangeNote: string;
  onMonthlyNoteChange: (value: string) => void;
  onRangeNoteChange: (value: string) => void;
}

interface NoteCardProps {
  icon: string;
  label: string;
  sublabel?: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  minHeight?: string;
  delay?: number;
}

function NoteCard({ icon, label, sublabel, value, placeholder, onChange, minHeight = '90px', delay = 0 }: NoteCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      className="rounded-xl p-4"
      style={{
        background: 'var(--bg-paper)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-section)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg leading-none" aria-hidden="true">{icon}</span>
        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-semibold uppercase tracking-wider leading-none"
            style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}
          >
            {label}
          </p>
          {sublabel && (
            <p
              className="text-xs font-medium mt-0.5 truncate"
              style={{ color: 'var(--accent)', opacity: 0.85 }}
            >
              {sublabel}
            </p>
          )}
        </div>
        {/* Character count */}
        <span
          className="text-xs tabular-nums"
          style={{ color: 'var(--text-muted)', opacity: 0.7 }}
        >
          {value.length}
        </span>
      </div>

      {/* Divider */}
      <div className="divider mb-3" />

      {/* Textarea */}
      <textarea
        className="notes-textarea"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ minHeight }}
        aria-label={label}
        spellCheck
      />

      {/* Ruled lines decoration */}
      <div className="mt-2 flex flex-col gap-2.5" aria-hidden="true">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            style={{
              height: '1px',
              background: 'var(--border-color)',
              opacity: 0.5,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function NotesPanel({
  currentYear,
  currentMonth,
  range,
  monthlyNote,
  rangeNote,
  onMonthlyNoteChange,
  onRangeNoteChange,
}: NotesPanelProps) {
  const hasRange = !!(range.start && range.end);

  const rangeLabel = hasRange && range.start && range.end
    ? (() => {
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const s = range.start;
        const e = range.end;
        if (s.month === e.month && s.year === e.year) {
          return `${months[s.month]} ${s.day}–${e.day}`;
        }
        return `${months[s.month]} ${s.day} – ${months[e.month]} ${e.day}`;
      })()
    : null;

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Section title */}
      <div className="flex items-center gap-2">
        <div
          className="w-1 rounded-full"
          style={{ height: '20px', background: 'var(--accent)', opacity: 0.8 }}
          aria-hidden="true"
        />
        <h2
          className="text-sm font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-muted)', letterSpacing: '0.12em' }}
        >
          Notes
        </h2>
      </div>

      {/* Monthly memo */}
      <NoteCard
        icon="📋"
        label="Monthly Memo"
        sublabel={`${MONTH_NAMES[currentMonth]} ${currentYear}`}
        value={monthlyNote}
        placeholder={`Jot down highlights for ${MONTH_NAMES[currentMonth]}…`}
        onChange={onMonthlyNoteChange}
        minHeight="100px"
        delay={0}
      />

      {/* Range note */}
      <NoteCard
        key={rangeLabel || 'no-range'}
        icon="📌"
        label="Range Notes"
        sublabel={rangeLabel ?? 'Select a date range first'}
        value={rangeNote}
        placeholder={
          hasRange
            ? 'Add notes for this date range…'
            : 'Select a start & end date to unlock range notes…'
        }
        onChange={onRangeNoteChange}
        minHeight="80px"
        delay={0.08}
      />

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="rounded-xl p-3 flex gap-2.5 items-start"
        style={{
          background: 'var(--accent-light)',
          border: '1px solid var(--range-border)',
        }}
      >
        <span className="text-sm flex-shrink-0" aria-hidden="true">💡</span>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <strong>Tips:</strong> Click a day to set start date, click another to set end date.
          Click a third time to reset. Notes auto-save.
        </p>
      </motion.div>
    </div>
  );
}
