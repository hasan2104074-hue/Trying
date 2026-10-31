import { MapPin, Users, Check, MessageCircle, Eye, ExternalLink, Plus } from 'lucide-react';
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
  onToggleFollow: (id: string) => void;
  onOpenArticlePopup: (id: string) => void;
  onNavigateProfile: (userId: string) => void;
  onNavigate: (path: string) => void;
  onOpenPhoto?: (src: string, title?: string, authorName?: string, authorId?: string) => void;
  onOpenAddEvent?: () => void;
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
    .slice(0, 5);

  if (ranked.length === 0) {
    return (
      <p className="py-5 text-center font-bangla text-[13px] text-pine-900/55">
        এখনো কোনো ট্রেন্ডিং প্রতিবেদন নেই — প্রথম প্রতিবেদনটি প্রকাশ করুন।
      </p>
    );
  }

  return (
    <ol className="divide-y divide-canvas-border">
      {ranked.map((a, idx) => (
        <li key={a.id} className="group flex items-start gap-2.5 py-3">
          <button
            type="button"
            onClick={() => onOpenPopup(a.id)}
            className="flex min-w-0 flex-1 items-start gap-2.5 text-left"
          >
            <span className="w-6 shrink-0 font-display text-[23px] font-semibold italic leading-none text-pine-900/25 transition group-hover:text-pine-500">
              {String(idx + 1).padStart(2, '0')}
            </span>
            <span className="min-w-0 flex-1">
              <span className="line-clamp-2 font-bangla text-[13.5px] font-semibold leading-snug text-pine-900 group-hover:underline">
                {a.title}
              </span>
              <span className="mt-1 flex items-center gap-2.5 font-mono text-[10.5px] text-pine-600">
                <span className="flex items-center gap-1">
                  <Eye className="size-3" />
                  {formatBengaliNumberCompact(a.stats.views)}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="size-3" />
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
              title="Open in separate tab"
              className="inline-flex items-center gap-1 rounded border border-pine-900/25 bg-canvas-subtle px-1.5 py-0.5 font-mono text-[9.5px] font-semibold text-pine-800 hover:border-pine-900 hover:bg-pine-100"
            >
              Tab <ExternalLink className="size-2.5" />
            </a>
            {a.coverImageUrl && (
              <button
                type="button"
                onClick={() => onOpenPhoto?.(a.coverImageUrl!, a.title, a.author.name, a.authorId)}
                className="overflow-hidden rounded-md border border-pine-900/15"
              >
                <img
                  src={a.coverImageUrl}
                  alt={a.title}
                  className="size-10 object-cover transition hover:scale-105"
                />
              </button>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function EventRow({ e, onToggle }: { e: UpcomingEvent; onToggle: () => void }) {
  return (
    <li className="flex gap-3 py-3">
      <span className="flex w-12 shrink-0 self-start flex-col items-center overflow-hidden rounded-md border border-pine-900 bg-canvas-card text-center shadow-tactile-xs">
        <span className="w-full bg-pine-900 py-0.5 font-mono text-[9.5px] font-semibold tracking-widest text-canvas">
          {e.dateMonth}
        </span>
        <span className="py-1 font-display text-[20px] font-bold leading-none text-pine-900">{e.dateDay}</span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-semibold leading-snug text-pine-900">{e.title}</span>
        <span className="mt-1 flex items-center gap-1 text-[11.5px] text-pine-900/60">
          <MapPin className="size-3" />
          {e.location}
        </span>
        <span className="mt-0.5 flex items-center gap-1 font-mono text-[10.5px] text-pine-600">
          <Users className="size-3" />
          {e.attendeesCount}
        </span>
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={e.isRegistered}
          className={cn(
            'mt-2 inline-flex h-7 items-center gap-1 rounded-md border border-pine-900 px-2.5 text-[12px] font-semibold shadow-tactile-xs shadow-tactile-hover',
            e.isRegistered ? 'bg-pine-100 text-pine-800' : 'bg-pine-900 text-canvas',
          )}
        >
          {e.isRegistered ? (
            <>
              <Check className="size-3.5" />
              Registered
            </>
          ) : (
            'Register'
          )}
        </button>
      </span>
    </li>
  );
}

export function RightSidebar(p: Props) {
  const otherProfiles = p.profiles.filter((u) => u.id !== p.currentUserId).slice(0, 5);

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-[80px] flex max-h-[calc(100vh-96px)] flex-col gap-5 overflow-y-auto no-scrollbar pb-6 pl-1 pr-1">
        <section className={cn(CARD, 'px-4 pb-1 pt-4')}>
          <div className="flex items-baseline justify-between">
            <h3 className="font-display text-[19px] font-semibold text-pine-900">Trending Now</h3>
            <SectionLabel>Popup · New Tab</SectionLabel>
          </div>
          <TrendingList
            articles={p.articles}
            onOpenPopup={p.onOpenArticlePopup}
            onOpenPhoto={p.onOpenPhoto}
          />
        </section>

        <section className={cn(CARD, 'px-4 pb-2 pt-4')}>
          <div className="flex items-baseline justify-between">
            <h3 className="font-display text-[19px] font-semibold text-pine-900">Upcoming Events</h3>
            <div className="flex items-center gap-2">
              {p.onOpenAddEvent && (
                <button
                  type="button"
                  onClick={p.onOpenAddEvent}
                  className="inline-flex items-center gap-0.5 font-mono text-[10px] font-semibold uppercase text-pine-700 hover:underline"
                >
                  <Plus className="size-3" /> Add
                </button>
              )}
              <SeeAllLink onClick={() => p.onNavigate('/events')}>All</SeeAllLink>
            </div>
          </div>
          {p.events.length === 0 ? (
            <p className="py-5 text-center font-bangla text-[13px] text-pine-900/55">
              কোনো ইভেন্ট তালিকাভুক্ত নেই।
            </p>
          ) : (
            <ul className="divide-y divide-canvas-border">
              {p.events.slice(0, 4).map((e) => (
                <EventRow key={e.id} e={e} onToggle={() => p.onToggleEvent(e.id)} />
              ))}
            </ul>
          )}
        </section>

        <section className={cn(CARD, 'px-4 pb-2 pt-4')}>
          <h3 className="font-display text-[19px] font-semibold text-pine-900">Who to Follow</h3>
          {otherProfiles.length === 0 ? (
            <p className="py-5 text-center font-bangla text-[13px] text-pine-900/55">
              নতুন গবেষক প্রোফাইল তৈরি হলে এখানে দেখা যাবে।
            </p>
          ) : (
            <ul className="mt-1 divide-y divide-canvas-border">
              {otherProfiles.map((s) => {
                const isFollowing = p.followingIds.includes(s.id);
                return (
                  <li key={s.id} className="flex items-center gap-3 py-3">
                    <button
                      type="button"
                      onClick={() => p.onNavigateProfile(s.id)}
                      className="shrink-0"
                    >
                      <Avatar src={s.avatar || 'PS'} name={s.name} size="size-10" />
                    </button>
                    <span className="min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => p.onNavigateProfile(s.id)}
                        className="block truncate text-left text-[13.5px] font-semibold text-pine-900 hover:underline"
                      >
                        {s.name}
                      </button>
                      <span className="block truncate text-[11.5px] text-pine-900/60">
                        {s.focusArea || s.role}
                      </span>
                      <span className="block font-mono text-[10px] text-pine-600">
                        {s.organization} · {s.publicationsCount} pubs
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => p.onToggleFollow(s.id)}
                      aria-pressed={isFollowing}
                      className={cn(
                        'h-7 shrink-0 rounded-full border border-pine-900 px-3 text-[12px] font-semibold transition',
                        isFollowing
                          ? 'bg-canvas-subtle text-pine-900'
                          : 'bg-pine-900 text-canvas hover:bg-pine-700',
                      )}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </aside>
  );
}
