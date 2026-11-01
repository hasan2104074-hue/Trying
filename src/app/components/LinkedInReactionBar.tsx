import { useRef, useState } from 'react';
import type { LinkedInReactionType, ReactionCounts, ReactionRecord } from '../types';
import { LINKEDIN_REACTIONS, getReactionMeta, topReactionTypes, totalReactions, toBengaliNumerals } from '../utils/pureLogic';
import { Avatar, CloseButton, Modal, cn } from './Primitives';

export function LinkedInReactionBadge({
  type,
  size = 'size-5',
  className,
}: {
  type: LinkedInReactionType;
  size?: string;
  className?: string;
}) {
  const meta = getReactionMeta(type);
  return (
    <span
      title={meta.label}
      style={{ backgroundColor: meta.bg }}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full text-white select-none shadow-xs',
        size,
        className,
      )}
    >
      {type === 'like' && (
        <svg viewBox="0 0 16 16" className="size-[62%] fill-current">
          <path d="M9.5 2.5c0-.8-.7-1.5-1.5-1.5-.6 0-1.1.3-1.4.9L4.8 6H2.5C1.7 6 1 6.7 1 7.5v5c0 .8.7 1.5 1.5 1.5h8.8c.7 0 1.3-.5 1.5-1.2l1.1-4.5c.2-.9-.5-1.8-1.5-1.8H9.5V2.5z" />
        </svg>
      )}
      {type === 'celebrate' && (
        <svg viewBox="0 0 16 16" className="size-[64%] fill-current">
          <path d="M5.2 2.2 6.4 1l4.8 4.8-1.2 1.2L5.2 2.2zm-2.4 2.4L4 3.4l4.8 4.8-1.2 1.2-4.8-4.8zm.5 4.9 2.3-2.3 3.9 3.9c.8.8.8 2 0 2.8-.8.8-2 .8-2.8 0L3.3 9.5zm8.9-6.5 1.2-1.2 1.4 1.4-1.2 1.2-1.4-1.4z" />
        </svg>
      )}
      {type === 'support' && (
        <svg viewBox="0 0 16 16" className="size-[64%] fill-current">
          <path d="M8 2.4c1.3-1.4 3.5-1.4 4.8 0 1.3 1.3 1.3 3.5 0 4.8L8 12 3.2 7.2c-1.3-1.3-1.3-3.5 0-4.8 1.3-1.4 3.5-1.4 4.8 0z" />
        </svg>
      )}
      {type === 'love' && (
        <svg viewBox="0 0 16 16" className="size-[64%] fill-current">
          <path d="M8 13.7 2.5 8.3C1 6.8 1 4.3 2.5 2.8c1.5-1.5 3.9-1.5 5.5 0 1.6-1.5 4-1.5 5.5 0 1.5 1.5 1.5 4 0 5.5L8 13.7z" />
        </svg>
      )}
      {type === 'insightful' && (
        <svg viewBox="0 0 16 16" className="size-[64%] fill-current">
          <path d="M8 1.5a4.5 4.5 0 0 0-2.6 8.2c.4.3.6.7.6 1.2v.6h4v-.6c0-.5.2-.9.6-1.2A4.5 4.5 0 0 0 8 1.5zM6.5 13h3v1.2h-3V13z" />
        </svg>
      )}
      {type === 'curious' && (
        <svg viewBox="0 0 16 16" className="size-[66%] fill-current">
          <path d="M8 2a4 4 0 0 0-3.8 2.8l1.7.6A2.2 2.2 0 0 1 8 3.8c1.2 0 2.1.8 2.1 1.8 0 .8-.5 1.3-1.3 1.7-.9.5-1.6 1.1-1.6 2.4v.3h1.8v-.2c0-.7.4-1.1 1.2-1.5 1-.5 1.8-1.3 1.8-2.7C12 3.5 10.2 2 8 2zm-.9 9.8v2h2v-2h-2z" />
        </svg>
      )}
    </span>
  );
}

export function LinkedInReactionSummary({
  counts,
  fallbackTotal = 0,
  userReaction,
  onOpenBreakdown,
  rightSlot,
  className,
}: {
  counts?: ReactionCounts;
  fallbackTotal?: number;
  userReaction?: LinkedInReactionType | null;
  onOpenBreakdown?: () => void;
  rightSlot?: React.ReactNode;
  className?: string;
}) {
  const total = totalReactions(counts, fallbackTotal);
  const topTypes = topReactionTypes(counts);

  if (total === 0 && !rightSlot) return null;

  return (
    <div className={cn('flex items-center justify-between text-[12.5px] text-pine-900/65', className)}>
      {total > 0 ? (
        <button
          type="button"
          onClick={onOpenBreakdown}
          className="group inline-flex items-center gap-1.5 hover:text-pine-900 hover:underline"
        >
          <span className="flex -space-x-1">
            {topTypes.map((t) => (
              <LinkedInReactionBadge
                key={t}
                type={t}
                size="size-[19px]"
                className="ring-2 ring-canvas-card"
              />
            ))}
          </span>
          <span>
            {userReaction
              ? total > 1
                ? `You and ${toBengaliNumerals(total - 1)} others`
                : 'You reacted'
              : `${toBengaliNumerals(total)} reactions`}
          </span>
        </button>
      ) : (
        <span className="font-mono text-[11px] text-pine-900/45">Be the first to react</span>
      )}
      {rightSlot}
    </div>
  );
}

export function LinkedInReactionPickerButton({
  userReaction,
  onSelect,
  countLabel,
  compact,
  className,
}: {
  userReaction?: LinkedInReactionType | null;
  onSelect: (type: LinkedInReactionType) => void;
  countLabel?: string;
  compact?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<LinkedInReactionType | null>(null);
  const closeTimer = useRef<number>();

  const openMenu = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
      setHovered(null);
    }, 240);
  };

  const activeMeta = userReaction ? getReactionMeta(userReaction) : null;

  const touchTimer = useRef<number>();

  const handleTouchStart = () => {
    touchTimer.current = window.setTimeout(() => {
      openMenu();
    }, 320);
  };

  const handleTouchEnd = () => {
    window.clearTimeout(touchTimer.current);
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      {open && (
        <div
          onMouseEnter={openMenu}
          onMouseLeave={scheduleClose}
          className="absolute bottom-[calc(100%+6px)] left-0 z-40 flex items-center gap-1.5 rounded-full border border-pine-900 bg-canvas-card px-2.5 py-1.5 shadow-tactile-lg"
          role="toolbar"
          aria-label="LinkedIn Reactions"
        >
          {LINKEDIN_REACTIONS.map((r) => {
            const isCurrent = userReaction === r.type;
            return (
              <button
                key={r.type}
                type="button"
                onMouseEnter={() => setHovered(r.type)}
                onMouseLeave={() => setHovered(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(r.type);
                  setOpen(false);
                }}
                className={cn(
                  'group relative flex flex-col items-center transition-transform duration-150 hover:-translate-y-1.5 hover:scale-125 focus:outline-none',
                  isCurrent && 'ring-2 ring-pine-900 rounded-full',
                )}
                aria-label={`${r.label} (${r.labelBn})`}
              >
                {hovered === r.type && (
                  <span className="pointer-events-none absolute -top-7 whitespace-nowrap rounded-full bg-pine-950 px-2 py-0.5 font-sans text-[10.5px] font-semibold text-canvas shadow">
                    {r.label} · {r.labelBn}
                  </span>
                )}
                <LinkedInReactionBadge type={r.type} size="size-8 sm:size-9" />
              </button>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onClick={() => onSelect(userReaction ?? 'like')}
        aria-pressed={!!userReaction}
        style={activeMeta ? { color: activeMeta.color } : undefined}
        className={cn(
          'flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 font-semibold transition hover:bg-canvas-subtle select-none',
          compact ? 'text-[12px] px-2 py-1' : 'text-[13.5px]',
          !activeMeta && 'text-pine-900/70',
          className,
        )}
      >
        {activeMeta ? (
          <LinkedInReactionBadge type={activeMeta.type} size={compact ? 'size-4' : 'size-[19px]'} />
        ) : (
          <LinkedInReactionBadge
            type="like"
            size={compact ? 'size-4' : 'size-[19px]'}
            className="!bg-pine-900/15 !text-pine-900/75"
          />
        )}
        <span>{activeMeta ? activeMeta.label : 'Like'}</span>
        {countLabel && <span className="font-mono text-[11.5px] opacity-80">({countLabel})</span>}
      </button>
    </div>
  );
}

export function ReactionBreakdownModal({
  open,
  onClose,
  records,
  counts,
  onNavigateProfile,
}: {
  open: boolean;
  onClose: () => void;
  records: ReactionRecord[];
  counts?: ReactionCounts;
  onNavigateProfile: (userId: string) => void;
}) {
  const [tab, setTab] = useState<'all' | LinkedInReactionType>('all');
  const filtered = tab === 'all' ? records : records.filter((r) => r.type === tab);

  return (
    <Modal open={open} onClose={onClose} className="max-w-[480px]" labelledBy="rx-modal-title">
      <div className="rounded-t-2xl border border-pine-900 bg-canvas-card shadow-tactile-lg sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-canvas-border px-4 py-3">
          <h3 id="rx-modal-title" className="font-display text-[19px] font-semibold text-pine-900">
            Reactions · প্রতিক্রিয়া
          </h3>
          <CloseButton onClick={onClose} />
        </div>

        <div className="no-scrollbar flex gap-1.5 overflow-x-auto border-b border-canvas-border px-4 py-2">
          <button
            type="button"
            onClick={() => setTab('all')}
            className={cn(
              'rounded-full px-3 py-1 text-[12.5px] font-semibold transition',
              tab === 'all' ? 'bg-pine-900 text-canvas' : 'bg-canvas-subtle text-pine-900/70 hover:text-pine-900',
            )}
          >
            All ({records.length || totalReactions(counts)})
          </button>
          {LINKEDIN_REACTIONS.map((r) => {
            const c = counts?.[r.type] || records.filter((x) => x.type === r.type).length;
            if (!c) return null;
            return (
              <button
                key={r.type}
                type="button"
                onClick={() => setTab(r.type)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold transition',
                  tab === r.type ? 'bg-pine-900 text-canvas' : 'bg-canvas-subtle text-pine-900/75',
                )}
              >
                <LinkedInReactionBadge type={r.type} size="size-4" />
                <span>{c}</span>
              </button>
            );
          })}
        </div>

        <div className="max-h-[360px] overflow-y-auto p-3">
          {filtered.length === 0 ? (
            <p className="py-8 text-center font-bangla text-[13.5px] text-pine-900/60">
              এই বিভাগে এখনো কোনো প্রতিক্রিয়া রেকর্ড নেই।
            </p>
          ) : (
            <ul className="divide-y divide-canvas-border">
              {filtered.map((r) => (
                <li key={r.id} className="flex items-center gap-3 py-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateProfile(r.userId);
                    }}
                    className="relative shrink-0"
                  >
                    <Avatar src={r.userAvatar || 'US'} name={r.userName} size="size-10" />
                    <LinkedInReactionBadge
                      type={r.type}
                      size="size-4"
                      className="absolute -bottom-0.5 -right-0.5 ring-2 ring-canvas-card"
                    />
                  </button>
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateProfile(r.userId);
                      }}
                      className="block truncate text-left text-[14px] font-semibold text-pine-900 hover:underline"
                    >
                      {r.userName}
                    </button>
                    <p className="truncate font-mono text-[11px] text-pine-600">{r.userRole}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
}
