# 🗓️ Interactive Wall Calendar

A **production-quality, frontend-only Interactive Wall Calendar** built with **Next.js 14 (App Router), React 18, TypeScript, and Tailwind CSS**. Submitted as a frontend engineering challenge response.

**[🌟 View Live Demo on Vercel](https://celender-beta.vercel.app)**

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ and **npm** v8+

### Run Locally
```bash
# Clone / navigate to the project
cd wall-calendar

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm start
```

---

## ✨ Features

### 🖼 Wall Calendar Aesthetic
- **Spiral binding** — dark navy header with 3D metallo coils and a center hook pin
- **Hero image** — full-width cinematic mountain landscape with gradient overlay
- **Month name** (Playfair Display serif) and year overlaid on the image
- **Glassmorphic date badge** (APR 8) in the hero corner
- **Paper-tear curve** separating the hero from the main body
- **Layered paper shadow depth** — two shadow layers below the card for physical depth

### 📅 Interactive Day Range Selector
| Click | Action |
|-------|--------|
| 1st | Sets the **start date** (range opens) |
| 2nd | Sets the **end date** (range closes, auto-normalizes if end < start) |
| 3rd | **Clears** the range and resets |

- **Live hover preview** — as you move towards end date, the range is shown in real-time
- **Visual states:** start/end = filled dark-blue with shadow; in-range = softer blue; today = ring highlight
- **Pill-shaped range** — start is left-rounded, end is right-rounded, matching modern calendar conventions

### 📝 Integrated Notes Section
- **Monthly Memo** — free-text notes for the current month, auto-labeled with month/year
- **Range Notes** — notes attached specifically to the selected date range (unlocks after selection)
- **Auto-save** — all notes persist to `localStorage` instantly; no save button needed
- Character counter on each note card
- Ruled-line paper aesthetic

### 🗓 Month Navigation
- **Prev / Next** month buttons with smooth **Framer Motion page-flip animation** (3D rotateY)
- **Today button** — instantly jumps to the current month
- **Month Picker dropdown** — click the month name to open a 4×3 month grid with year selector; jump to any month in any year

### 🌙 Light / Dark Theme
- **Floating toggle** (top-right) — switches between light and dark modes
- **CSS custom properties** — theme switches instantly without re-render via `:root` / `.dark` vars  
- **Dark mode** uses deep navy + indigo tones with brighter accent shades
- Theme persists in `localStorage`

### 📱 Fully Responsive
| Viewport | Layout |
|----------|--------|
| Desktop (≥1024px) | Notes sidebar (left) + Calendar grid (right) — side-by-side |
| Mobile (<1024px) | Hero → Calendar grid → Collapsible Notes accordion |

- Mobile notes accordion with animated expand/collapse (Framer Motion)
- Touch-friendly date cells (44px+ tap targets, `touch-action: manipulation`)

### 🎁 Bonus Features
- **Holiday markers** — amber dot below date + tooltip-on-hover for 9 US holidays/notable dates
- **Weekend highlighting** — Sunday and Saturday text in red throughout
- **Keyboard accessibility** — full `Tab` + `Enter`/`Space` navigation on all date cells
- **ARIA** — `role="grid"`, `aria-selected`, `aria-label`, `aria-live` for screen readers
- **`prefers-reduced-motion`** — animations gracefully disabled for accessibility
- **`useMemo` optimization** — calendar grid computation cached per month
- **No re-render thrash** — React Context shares a single hook instance across all components

---

## 📁 Project Structure

```
wall-calendar/
├── app/
│   ├── globals.css          # Design tokens (CSS vars), global styles
│   ├── layout.tsx           # Root layout, metadata, Google Fonts
│   └── page.tsx             # Entry: CalendarProvider wrapping all UI
│
├── components/
│   ├── WallCalendarInner.tsx   # Main layout (binding, hero, notes, grid)
│   ├── HeroSection.tsx         # Hero image + overlay text + paper-tear
│   ├── CalendarGrid.tsx        # Animated date grid, selection states
│   ├── MonthNavigator.tsx      # Month title + dropdown picker + controls
│   ├── NotesPanel.tsx          # Monthly memo + range notes cards
│   ├── RangeSummary.tsx        # Active selection badge + clear button
│   └── ThemeToggle.tsx         # Fixed floating theme switch button
│
├── lib/
│   ├── types.ts             # TypeScript interfaces & enums
│   ├── dateUtils.ts         # Pure date utilities, holidays, formatters
│   ├── useCalendar.ts       # State machine hook + localStorage sync
│   └── CalendarContext.tsx  # React context for shared state
│
├── public/
│   └── hero.png             # Landscape hero image
│
├── tailwind.config.js       # Custom design tokens, keyframes
├── postcss.config.js        # PostCSS for Tailwind v3
└── next.config.js           # Next.js config
```

---

## 🧩 Architecture Decisions

### 1. Single Hook + React Context
All state lives in `useCalendar()` and is shared via `CalendarContext`. No prop drilling — each component reads exactly what it needs. This keeps components focused and makes the state logic easy to test in isolation.

### 2. Selection State Machine
```
[idle]
  │ click → set start
  ▼
[awaiting-end]  ← hover updates hoverRange live
  │ click → set end + normalize
  ▼
[idle] ← click again → clear
```
The `selectionStep` enum drives all UI states cleanly. The hover preview computes a `hoverRange` via `useMemo` that's separate from the committed `range`.

### 3. CSS Custom Properties for Theming
Light/dark theming uses only CSS `--vars`, making theme switching instantaneous (no JS re-render cycle, just a class toggle on `<html>`). All component styles reference semantic tokens like `--accent`, `--bg-paper`, etc.

### 4. localStorage Schema
```json
{
  "currentYear": 2026,
  "currentMonth": 3,
  "range": { "start": {...}, "end": {...} },
  "notes": {
    "monthly": { "2026-04": "Sprint planning..." },
    "range":   { "2026-04-10__2026-04-18": "Conference week" }
  },
  "theme": "dark"
}
```
Notes are keyed by `YYYY-MM` for monthly and `YYYY-MM-DD__YYYY-MM-DD` for range notes, making them portable and readable.

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 14 | App Router, SSR, `<Image>` optimization |
| React | 18 | Hooks, Context, Server Components |
| TypeScript | 5 | Type safety throughout |
| Tailwind CSS | 3 | Utility classes + custom design system |
| Framer Motion | 11 | Month-flip animation, accordion, dropdown |

---

## ♿ Accessibility

- Semantic `<article>`, `role="grid"`, `role="gridcell"`, `role="columnheader"`
- `aria-label` on every interactive element
- `aria-selected` state on date cells
- `aria-live="polite"` on the range summary badge
- `aria-expanded` on collapsible elements
- `tabIndex={0}` + `onKeyDown` for full keyboard navigation
- `prefers-reduced-motion` media query disables all animations

---

*Submitted for frontend engineering challenge evaluation.*
