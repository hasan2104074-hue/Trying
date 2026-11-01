import React from 'react';
import { MapPin, Users, Check, MessageCircle, Eye, ExternalLink, Calendar } from 'lucide-react';
import type { Article, UpcomingEvent, UserProfile } from '../types';
import { Avatar, CARD, SectionLabel, cn } from './Primitives';
import { SeeAllLink } from './Header';
import { formatBengaliNumberCompact, toBengaliNumerals, totalReactions } from '../utils/pureLogic';

interface Props {
  articles: Article[];
  events: UpcomingEvent[];
  profiles: UserProfile[];
  currentUserId: string;
  followingIds: string[];
  onToggleEvent: (id: string) => void;
  onOpenRegister?: (event: UpcomingEvent) => void;
  onToggleFollow: (id: string) => void;
  onOpenArticlePopup: (id: string) => void;
  onNavigateProfile: (userId: string) => void;
  onNavigate: (path: string) => void;
  onOpenPhoto?: (src: string, title?: string, authorName?: string, authorId?: string) => void;
}

export function TrendingList({
  articles,
  onOpenPopup,
  onOpenPhoto,
}: {
  articles: Article[];
  onOpenPopup: (id: string) => void;
  onOpenPhoto?: (src: string, title?: string, authorName?: string, authorId?: string) => void;
}) {
  const ranked = [...articles]
    .sort(
      (a, b) =>
        b.stats.views +
        totalReactions(b.reactionCounts, b.stats.likes) * 5 -
        (a.stats.views + totalReactions(a.reactionCounts, a.stats.likes) * 5),
    )
    .slice(0, 4);

  if (ranked.length === 0) {
    return (
      <p className="py-4 text-center font-sans text-xs text-slate-400">
        কোনো ট্রেন্ডিং প্রতিবেদন পাওয়া যায়নি।
      </p>
    );
  }

  return (
    <ol className="divide-y divide-slate-100">
      {ranked.map((a, idx) => (
        <li key={a.id} className="group flex items-start gap-2 py-2.5">
          <button
            type="button"
            onClick={() => onOpenPopup(a.id)}
            className="flex min-w-0 flex-1 items-start gap-2 text-left"
          >
            <span className="w-5 shrink-0 font-display text-lg font-bold text-slate-300 group-hover:text-emerald-500 transition-colors">
              {String(idx + 1).padStart(2, '0')}
            </span>
            <span className="min-w-0 flex-1">
              <span className="line-clamp-2 font-sans text-xs font-semibold leading-snug text-slate-900 group-hover:text-emerald-700">
                {a.title}
              </span>
              <span className="mt-1 flex items-center gap-2 font-mono text-[10px] text-slate-400">
                <span className="flex items-center gap-0.5">
                  <Eye className="size-2.5" />
                  {formatBengaliNumberCompact(a.stats.views)}
                </span>
                <span className="flex items-center gap-0.5">
                  <MessageCircle className="size-2.5" />
                  {toBengaliNumerals(a.stats.commentsCount)}
                </span>
              </span>
            </span>
          </button>

          <div className="flex shrink-0 flex-col items-end gap-1">
            <a
              href={`/article/${a.id}`}
              target="_blank"
              rel="noopener noreferrer"
              title="নতুন ট্যাবে খুলুন"
              className="inline-flex items-center gap-0.5 rounded border border-slate-200 bg-slate-50 px-1 py-0.5 font-mono text-[9px] font-medium text-slate-600 hover:bg-slate-100"
            >
              Tab <ExternalLink className="size-2" />
            </a>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function EventRow({
  e,
  onNavigate,
  onOpenRegister,
}: {
  e: UpcomingEvent;
  onNavigate: (path: string) => void;
  onOpenRegister?: (event: UpcomingEvent) => void;
}) {
  return (
    <li className="flex gap-2.5 py-2.5">
      <button
        type="button"
        onClick={() => onNavigate(`/events/${e.id}`)}
        className="flex w-10 shrink-0 self-start flex-col items-center overflow-hidden rounded-md border border-slate-200 bg-white text-center shadow-xs hover:border-[#00ED64] transition"
      >
        <span className="w-full bg-[#061621] py-0.5 font-mono text-[8.5px] font-bold text-[#00ED64]">
          {e.dateMonth}
        </span>
        <span className="py-0.5 font-display text-base font-bold leading-none text-slate-800">
          {e.dateDay}
        </span>
      </button>
      <span className="min-w-0 flex-1">
        <button
          type="button"
          onClick={() => onNavigate(`/events/${e.id}`)}
          className="block text-left text-xs font-semibold leading-snug text-slate-900 hover:text-emerald-700 hover:underline"
        >
          {e.title}
        </button>
        <span className="mt-0.5 flex items-center gap-1 text-[10.5px] text-slate-500">
          <MapPin className="size-2.5 shrink-0" />
          <span className="truncate">{e.location}</span>
        </span>
        <span className="mt-0.5 flex items-center gap-1 font-mono text-[10px] text-slate-400">
          <Users className="size-2.5" />
          {e.attendeesCount} নিবন্ধিত
        </span>
        <div className="mt-1.5 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onOpenRegister ? onOpenRegister(e) : onNavigate(`/events/${e.id}`)}
            className={cn(
              'inline-flex h-6 items-center gap-1 rounded-md px-2 text-[11px] font-semibold transition',
              e.isRegistered
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-[#00ED64] text-[#061621] hover:bg-[#00d859] font-bold',
            )}
          >
            {e.isRegistered ? (
              <>
                <Check className="size-3" />
                নিবন্ধিত
              </>
            ) : (
              'নিবন্ধন করুন'
            )}
          </button>
          <button
            type="button"
            onClick={() => onNavigate(`/events/${e.id}`)}
            className="text-[10px] text-slate-500 hover:text-slate-900 hover:underline px-1"
          >
            বিস্তারিত
          </button>
        </div>
      </span>
    </li>
  );
}

export function RightSidebar(p: Props) {
  // Only display real backend profiles if available; do not show fake mock users
  const otherProfiles = p.profiles.filter((u) => u.id !== p.currentUserId && !u.id.startsWith('mock_')).slice(0, 4);

  return (
    <aside className="hidden lg:block w-60 shrink-0">
      <div className="sticky top-[76px] flex max-h-[calc(100vh-90px)] flex-col gap-3.5 overflow-y-auto no-scrollbar pb-6 pl-1 pr-1">
        <section className={cn(CARD, 'p-3')}>
          <div className="flex items-baseline justify-between mb-1">
            <h3 className="font-sans text-sm font-bold text-slate-900">ট্রেন্ডিং</h3>
            <SectionLabel className="text-[10px]">জনপ্রিয়</SectionLabel>
          </div>
          <TrendingList
            articles={p.articles}
            onOpenPopup={p.onOpenArticlePopup}
            onOpenPhoto={p.onOpenPhoto}
          />
        </section>

        <section className={cn(CARD, 'p-3')}>
          <div className="flex items-baseline justify-between mb-1">
            <h3 className="font-sans text-sm font-bold text-slate-900">আসন্ন ইভেন্ট</h3>
            <SeeAllLink onClick={() => p.onNavigate('/events')}>সব দেখুন</SeeAllLink>
          </div>
          {p.events.length === 0 ? (
            <p className="py-4 text-center font-sans text-xs text-slate-400">
              কোনো আসন্ন ইভেন্ট নেই।
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {p.events.slice(0, 3).map((e) => (
                <EventRow
                  key={e.id}
                  e={e}
                  onNavigate={p.onNavigate}
                  onOpenRegister={p.onOpenRegister}
                />
              ))}
            </ul>
          )}
        </section>

        {otherProfiles.length > 0 && (
          <section className={cn(CARD, 'p-3')}>
            <h3 className="font-sans text-sm font-bold text-slate-900 mb-2">অনুসরণ করুন</h3>
            <ul className="divide-y divide-slate-100">
              {otherProfiles.map((s) => {
                const isFollowing = p.followingIds.includes(s.id);
                return (
                  <li key={s.id} className="flex items-center gap-2 py-2">
                    <button
                      type="button"
                      onClick={() => p.onNavigateProfile(s.id)}
                      className="shrink-0"
                    >
                      <Avatar src={s.avatar || 'PS'} name={s.name} size="size-7" />
                    </button>
                    <span className="min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => p.onNavigateProfile(s.id)}
                        className="block truncate text-left text-xs font-semibold text-slate-900 hover:underline"
                      >
                        {s.name}
                      </button>
                      <span className="block truncate text-[10px] text-slate-400">
                        {s.focusArea || s.role || 'লেখক'}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => p.onToggleFollow(s.id)}
                      aria-pressed={isFollowing}
                      className={cn(
                        'h-6 shrink-0 rounded-full px-2.5 text-[10px] font-semibold transition',
                        isFollowing
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-[#00ED64] text-[#061621] hover:bg-[#00d859]',
                      )}
                    >
                      {isFollowing ? 'যুক্ত' : 'ফলো'}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </aside>
  );
}
