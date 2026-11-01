import React, { useRef, useState } from 'react';
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
        'inline-flex shrink-0 items-center justify-center rounded-full text-white select-none shadow-xs transition-transform duration-150',
        size,
        className,
      )}
    >
      {type === 'like' && (
        <svg viewBox="0 0 16 16" className="size-[60%] fill-current drop-shadow-xs">
          <path d="M9.5 2.5c0-.8-.7-1.5-1.5-1.5-.6 0-1.1.3-1.4.9L4.8 6H2.5C1.7 6 1 6.7 1 7.5v5c0 .8.7 1.5 1.5 1.5h8.8c.7 0 1.3-.5 1.5-1.2l1.1-4.5c.2-.9-.5-1.8-1.5-1.8H9.5V2.5z" />
        </svg>
      )}
      {type === 'celebrate' && (
        <svg viewBox="0 0 16 16" className="size-[62%] fill-current drop-shadow-xs">
          <path d="M5.2 2.2 6.4 1l4.8 4.8-1.2 1.2L5.2 2.2zm-2.4 2.4L4 3.4l4.8 4.8-1.2 1.2-4.8-4.8zm.5 4.9 2.3-2.3 3.9 3.9c.8.8.8 2 0 2.8-.8.8-2 .8-2.8 0L3.3 9.5zm8.9-6.5 1.2-1.2 1.4 1.4-1.2 1.2-1.4-1.4z" />
        </svg>
      )}
      {type === 'support' && (
        <svg viewBox="0 0 16 16" className="size-[62%] fill-current drop-shadow-xs">
          <path d="M8 2.4c1.3-1.4 3.5-1.4 4.8 0 1.3 1.3 1.3 3.5 0 4.8L8 12 3.2 7.2c-1.3-1.3-1.3-3.5 0-4.8 1.3-1.4 3.5-1.4 4.8 0z" />
        </svg>
      )}
      {type === 'love' && (
        <svg viewBox="0 0 16 16" className="size-[62%] fill-current drop-shadow-xs">
          <path d="M8 13.7 2.5 8.3C1 6.8 1 4.3 2.5 2.8c1.5-1.5 3.9-1.5 5.5 0 1.6-1.5 4-1.5 5.5 0 1.5 1.5 1.5 4 0 5.5L8 13.7z" />
        </svg>
      )}
      {type === 'insightful' && (
        <svg viewBox="0 0 16 16" className="size-[62%] fill-current drop-shadow-xs">
          <path d="M8 1.5a4.5 4.5 0 0 0-2.6 8.2c.4.3.6.7.6 1.2v.6h4v-.6c0-.5.2-.9.6-1.2A4.5 4.5 0 0 0 8 1.5zM6.5 13h3v1.2h-3V13z" />
        </svg>
      )}
      {type === 'curious' && (
        <svg viewBox="0 0 16 16" className="size-[64%] fill-current drop-shadow-xs">
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
    <div className={cn('flex items-center justify-between text-[12px] font-bangla text-slate-500 dark:text-slate-400', className)}>
      {total > 0 ? (
        <button
          type="button"
          onClick={onOpenBreakdown}
          className="group inline-flex items-center gap-1.5 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
        >
          <span className="flex -space-x-1">
            {topTypes.map((t) => (
              <LinkedInReactionBadge
                key={t}
                type={t}
                size="size-[17px]"
                className="ring-1.5 ring-white dark:ring-[#071f2d]"
              />
            ))}
          </span>
          <span className="font-medium text-slate-600 dark:text-slate-300">
            {userReaction
              ? total > 1
                ? `আপনি এবং আরও ${toBengaliNumerals(total - 1)} জন`
                : 'আপনি প্রতিক্রিয়া জানিয়েছেন'
              : `${toBengaliNumerals(total)}টি প্রতিক্রিয়া`}
          </span>
        </button>
      ) : (
        <span className="font-bangla text-[11px] text-slate-400">প্রথম প্রতিক্রিয়া দিন</span>
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
    }, 220);
  };

  const activeMeta = userReaction ? getReactionMeta(userReaction) : null;

  const touchTimer = useRef<number>();

  const handleTouchStart = () => {
    touchTimer.current = window.setTimeout(() => {
      openMenu();
    }, 280);
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
      {/* Super Ultra Thin Floating Pill Reaction Bar */}
      {open && (
        <div
          onMouseEnter={openMenu}
          onMouseLeave={scheduleClose}
          className="absolute bottom-[calc(100%+8px)] left-0 z-40 flex items-center gap-1 sm:gap-1.5 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#071f2d]/95 backdrop-blur-xl px-1.5 py-1 shadow-[0_8px_30px_rgb(0,0,0,0.12)] ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150"
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
                  'group relative flex flex-col items-center p-1 transition-all duration-200 hover:scale-130 hover:-translate-y-2 focus:outline-none rounded-full',
                  isCurrent && 'ring-2 ring-emerald-500/80',
                )}
                aria-label={`${r.label} (${r.labelBn})`}
              >
                {hovered === r.type && (
                  <span className="pointer-events-none absolute -top-8 whitespace-nowrap rounded-full bg-[#061621] px-2.5 py-0.5 font-bangla text-[10.5px] font-semibold text-white shadow-lg animate-in fade-in zoom-in-90 duration-100 z-50">
                    {r.labelBn} · {r.label}
                  </span>
                )}
                <LinkedInReactionBadge type={r.type} size="size-7 sm:size-8" />
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
          'flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 font-sans font-semibold transition-all hover:bg-slate-100 dark:hover:bg-white/5 active:scale-95 select-none',
          compact ? 'text-[11.5px] px-2 py-0.5' : 'text-[13px]',
          !activeMeta && 'text-slate-600 dark:text-slate-300',
          className,
        )}
      >
        {activeMeta ? (
          <LinkedInReactionBadge type={activeMeta.type} size={compact ? 'size-3.5' : 'size-[18px]'} />
        ) : (
          <LinkedInReactionBadge
            type="like"
            size={compact ? 'size-3.5' : 'size-[18px]'}
            className="!bg-slate-200 dark:!bg-white/10 !text-slate-600 dark:!text-slate-300"
          />
        )}
        <span>{activeMeta ? activeMeta.labelBn : 'লাইক'}</span>
        {countLabel && <span className="font-mono text-[11px] opacity-75">({countLabel})</span>}
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
    <Modal open={open} onClose={onClose} className="max-w-[460px]" labelledBy="rx-modal-title">
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/10 bg-canvas-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-canvas-border px-5 py-4">
          <h3 id="rx-modal-title" className="font-display text-[18px] font-bold text-slate-900 dark:text-white">
            প্রতিক্রিয়া তালিকা (Reactions)
          </h3>
          <CloseButton onClick={onClose} />
        </div>

        <div className="no-scrollbar flex gap-1.5 overflow-x-auto border-b border-canvas-border px-4 py-2.5 bg-slate-50/50 dark:bg-white/5">
          <button
            type="button"
            onClick={() => setTab('all')}
            className={cn(
              'rounded-full px-3 py-1 text-[12px] font-semibold transition',
              tab === 'all'
                ? 'bg-[#061621] text-white shadow-xs'
                : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900',
            )}
          >
            সকল ({toBengaliNumerals(records.length || totalReactions(counts))})
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
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold transition',
                  tab === r.type
                    ? 'bg-[#061621] text-white shadow-xs'
                    : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300',
                )}
              >
                <LinkedInReactionBadge type={r.type} size="size-3.5" />
                <span>{toBengaliNumerals(c)}</span>
              </button>
            );
          })}
        </div>

        <div className="max-h-[360px] overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <p className="py-8 text-center font-bangla text-[13px] text-slate-400">
              এই বিভাগে এখনো কোনো প্রতিক্রিয়া রেকর্ড নেই।
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-white/5">
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
                    <Avatar src={r.userAvatar || 'US'} name={r.userName} size="size-9" />
                    <LinkedInReactionBadge
                      type={r.type}
                      size="size-3.5"
                      className="absolute -bottom-0.5 -right-0.5 ring-2 ring-white dark:ring-[#071f2d]"
                    />
                  </button>
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateProfile(r.userId);
                      }}
                      className="block truncate text-left font-bangla text-[13.5px] font-semibold text-slate-900 dark:text-white hover:underline"
                    >
                      {r.userName}
                    </button>
                    <p className="truncate font-sans text-[11px] text-slate-500">{r.userRole}</p>
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
