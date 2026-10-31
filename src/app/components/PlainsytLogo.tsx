import { cn } from './Primitives';

export function PlainsytMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn('shrink-0', className)} aria-hidden>
      <rect x="1" y="1" width="36" height="36" rx="9" fill="var(--tactile)" />
      <rect x="0" y="0" width="36" height="36" rx="9" fill="var(--pine-900)" stroke="var(--pine-900)" />
      <circle cx="18" cy="17" r="6.2" fill="#f2c14e" />
      <path d="M3 21.5h30" stroke="var(--canvas)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M6 26.5c4-1.6 8-2.2 12-2.2s8 .6 12 2.2M9 31c3-1 6-1.4 9-1.4s6 .4 9 1.4" stroke="var(--pine-400)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function PlainsytLogo({ compact, className }: { compact?: boolean; className?: string }) {
  return (
    <a href="#" className={cn('flex items-center gap-2.5 text-pine-900', className)} aria-label="Plainsyt home">
      <PlainsytMark className="size-9" />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[22px] font-semibold italic tracking-[-0.02em]">Plainsyt</span>
          <span className="mt-0.5 font-mono text-[9px] tracking-[0.18em] text-pine-600">প্লেইনসাইট · AGRI</span>
        </span>
      )}
    </a>
  );
}
