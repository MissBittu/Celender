'use client';

import Image from 'next/image';
import { MONTH_NAMES } from '@/lib/dateUtils';

interface HeroSectionProps {
  month: number;
  year: number;
}

export default function HeroSection({ month, year }: HeroSectionProps) {
  return (
    <div className="hero-section" style={{ height: '240px', position: 'relative' }}>
      {/* Background image */}
      <Image
        src="/hero.png"
        alt={`${MONTH_NAMES[month]} ${year} — Wall Calendar`}
        fill
        className="hero-image"
        style={{ objectFit: 'cover', objectPosition: 'center' }}
        priority
      />

      {/* Gradient overlay */}
      <div
        className="hero-overlay absolute inset-0"
        aria-hidden="true"
      />

      {/* Text overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end" style={{ zIndex: 2 }}>
        <div className="flex items-end justify-between">
          <div>
            <p
              className="text-white/70 text-sm font-medium tracking-widest uppercase mb-1"
              style={{ letterSpacing: '0.18em', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
            >
              {year}
            </p>
            <h1
              className="text-white font-bold leading-none tracking-tight"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(2rem, 5vw, 2.8rem)',
                textShadow: '0 2px 12px rgba(0,0,0,0.5)',
              }}
            >
              {MONTH_NAMES[month]}
            </h1>
          </div>

          {/* Decorative badge */}
          <div
            className="flex flex-col items-center justify-center rounded-2xl px-4 py-2"
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.25)',
              minWidth: '56px',
            }}
          >
            <span className="text-white/70 text-xs font-medium uppercase tracking-wider">
              {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][month]}
            </span>
            <span className="text-white text-2xl font-bold leading-none mt-0.5">
              {new Date().getMonth() === month && new Date().getFullYear() === year
                ? new Date().getDate()
                : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom paper tear effect */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '16px',
          background: 'var(--bg-calendar)',
          borderRadius: '60% 60% 0 0 / 80% 80% 0 0',
          transform: 'translateY(50%)',
          zIndex: 3,
        }}
        aria-hidden="true"
      />
    </div>
  );
}
