import { MapPin, Users, Check, MessageCircle, Eye } from 'lucide-react';
import type { FeaturedScientist, TrendingRankedItem, UpcomingEvent } from '../types';
import { Avatar, CARD, SectionLabel, cn } from './Primitives';
import { SeeAllLink, type View } from './Header';
import { AVATARS } from '../data/mockData';
import { toBengaliNumerals } from '../utils/pureLogic';

interface Props {
  trending: TrendingRankedItem[];
  events: UpcomingEvent[];
  scientists: FeaturedScientist[];
  onToggleEvent: (id: string) => void;
  onToggleFollow: (id: string) => void;
  onOpenTrending: (id: string) => void;
  onView: (v: View) => void;
}

export function TrendingList({ items, onOpen }: { items: TrendingRankedItem[]; onOpen: (id: string) => void }) {
  return (
    <ol className="divide-y divide-canvas-border">
      {items.map((t) => (
        <li key={t.id}>
          <button onClick={() => onOpen(t.id)} className="group flex w-full gap-3 py-3 text-left">
            <span className="w-7 shrink-0 font-display text-[26px] font-semibold italic leading-none text-pine-900/25 transition group-hover:text-pine-500">{t.rank}</span>
            <span className="min-w-0 flex-1">
              <span className="line-clamp-2 font-bangla text-[13.5px] font-semibold leading-snug text-pine-900 group-hover:underline">{t.title}</span>
              <span className="mt-1 flex items-center gap-2.5 font-mono text-[10.5px] text-pine-600">
                <span className="flex items-center gap-1"><Eye className="size-3" />{t.reads}</span>
                <span className="flex items-center gap-1"><MessageCircle className="size-3" />{toBengaliNumerals(t.comments)}</span>
              </span>
            </span>
            <img src={t.imageUrl} alt="" className="size-12 shrink-0 rounded-md border border-pine-900/15 bg-pine-100 object-cover" />
          </button>
        </li>
      ))}
    </ol>
  );
}

export function EventRow({ e, onToggle }: { e: UpcomingEvent; onToggle: () => void }) {
  return (
    <li className="flex gap-3 py-3">
      <span className="flex w-12 shrink-0 self-start flex-col items-center overflow-hidden rounded-md border border-pine-900 bg-canvas-card text-center shadow-tactile-xs">
        <span className="w-full bg-pine-900 py-0.5 font-mono text-[9.5px] font-semibold tracking-widest text-canvas">{e.dateMonth}</span>
        <span className="py-1 font-display text-[20px] font-bold leading-none text-pine-900">{e.dateDay}</span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-semibold leading-snug text-pine-900">{e.title}</span>
        <span className="mt-1 flex items-center gap-1 text-[11.5px] text-pine-900/60"><MapPin className="size-3" />{e.location}</span>
        <span className="mt-0.5 flex items-center gap-1 font-mono text-[10.5px] text-pine-600"><Users className="size-3" />{e.attendeesCount}</span>
        <button
          onClick={onToggle}
          aria-pressed={e.isRegistered}
          className={cn(
            'mt-2 inline-flex h-7 items-center gap-1 rounded-md border border-pine-900 px-2.5 text-[12px] font-semibold shadow-tactile-xs shadow-tactile-hover',
            e.isRegistered ? 'bg-pine-100 text-pine-800' : 'bg-pine-900 text-canvas',
          )}
        >
          {e.isRegistered ? (<><Check className="size-3.5" />Registered</>) : 'Register'}
        </button>
      </span>
    </li>
  );
}

const SCI_AV: Record<string, string> = { f1: AVATARS.nusrat, f2: 'FY', f3: 'TA' };

export function RightSidebar(p: Props) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-[80px] flex max-h-[calc(100vh-96px)] flex-col gap-5 overflow-y-auto no-scrollbar pb-6 pl-1 pr-1">
        <section className={cn(CARD, 'px-4 pb-1 pt-4')}>
          <div className="flex items-baseline justify-between">
            <h3 className="font-display text-[19px] font-semibold text-pine-900">Trending Now</h3>
            <SectionLabel>Live · ২৪ঘ</SectionLabel>
          </div>
          <TrendingList items={p.trending} onOpen={p.onOpenTrending} />
        </section>

        <section className={cn(CARD, 'px-4 pb-1 pt-4')}>
          <div className="flex items-baseline justify-between">
            <h3 className="font-display text-[19px] font-semibold text-pine-900">Upcoming Events</h3>
            <SeeAllLink onClick={() => p.onView('events')}>All</SeeAllLink>
          </div>
          <ul className="divide-y divide-canvas-border">
            {p.events.map((e) => <EventRow key={e.id} e={e} onToggle={() => p.onToggleEvent(e.id)} />)}
          </ul>
        </section>

        <section className={cn(CARD, 'px-4 pb-2 pt-4')}>
          <h3 className="font-display text-[19px] font-semibold text-pine-900">Who to Follow</h3>
          <ul className="mt-1 divide-y divide-canvas-border">
            {p.scientists.map((s) => (
              <li key={s.id} className="flex items-center gap-3 py-3">
                <Avatar src={SCI_AV[s.id] ?? 'PS'} name={s.name} size="size-10" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-semibold text-pine-900">{s.name}</span>
                  <span className="block truncate text-[11.5px] text-pine-900/60">{s.focusArea}</span>
                  <span className="block font-mono text-[10px] text-pine-600">{s.organization} · {s.publicationsCount} pubs</span>
                </span>
                <button
                  onClick={() => p.onToggleFollow(s.id)}
                  aria-pressed={s.isFollowing}
                  className={cn('h-7 shrink-0 rounded-full border border-pine-900 px-3 text-[12px] font-semibold transition', s.isFollowing ? 'bg-canvas-subtle text-pine-900' : 'bg-pine-900 text-canvas hover:bg-pine-700')}
                >
                  {s.isFollowing ? 'Following' : 'Follow'}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  );
}
