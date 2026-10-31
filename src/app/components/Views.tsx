import { useMemo, useState } from 'react';
import { ArrowBigUp, ShoppingBag, Plane, Wheat, BookOpenText, CloudSun, Snowflake, Rocket, Lightbulb, Plus, Bell, LogOut, Settings } from 'lucide-react';
import type { Article, CommunityPost, NotificationItem, ResearchPaper, TrendingRankedItem, UpcomingEvent } from '../types';
import { CARD, FEED_CARD, SectionLabel, Avatar, cn } from './Primitives';
import { PILLARS, STORE_ITEMS, IDEAS, CURRENT_USER } from '../data/mockData';
import { EventRow, TrendingList } from './RightSidebar';
import { ImageGraphic } from './ImageGraphic';
import { SavedList } from './SavedArticlesModal';
import { toBengaliNumerals } from '../utils/pureLogic';

const PILLAR_ICONS = { drone: Plane, crops: Wheat, research: BookOpenText, climate: CloudSun, cold: Snowflake, startup: Rocket } as const;
const PILLAR_CAT: Record<string, string[]> = {
  drone: ['এগ্রি-টেক ও ড্রোন'], crops: ['শস্য ও কৃষিবিজ্ঞান'], research: ['গবেষণা সহজ ভাষায়'],
  climate: ['জলবায়ু ও স্থায়িত্ব', 'মৎস্য ও প্রাণিসম্পদ'], cold: ['খাদ্য ও কোল্ড চেইন'], startup: ['স্টার্টআপ ও উদ্ভাবন'],
};

function ViewHeader({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="px-3 pb-1 pt-2 sm:px-0">
      <SectionLabel>{kicker}</SectionLabel>
      <h1 className="mt-1 font-display text-[32px] font-bold leading-tight tracking-[-0.01em] text-pine-950 sm:text-[40px]">{title}</h1>
      {sub && <p className="mt-1 font-bangla text-[15px] text-pine-900/65">{sub}</p>}
    </div>
  );
}

export function ExploreView({ articles, papers, trending, pillar, onPillar, onOpenArticle, onOpenTrending }: {
  articles: Article[]; papers: ResearchPaper[]; trending: TrendingRankedItem[]; pillar: string | null;
  onPillar: (k: string | null) => void; onOpenArticle: (id: string) => void; onOpenTrending: (id: string) => void;
}) {
  const list = useMemo(() => (pillar ? articles.filter((a) => PILLAR_CAT[pillar]?.includes(a.category)) : articles), [articles, pillar]);
  return (
    <div className="flex flex-col gap-5">
      <ViewHeader kicker="Explore · OpenAlex pillars" title="জ্ঞানের মাঠ" sub="ছয়টি কৌশলগত স্তম্ভে সাজানো বাংলাদেশের কৃষি গবেষণা ও মাঠের অভিজ্ঞতা।" />
      <div className="grid grid-cols-2 gap-2.5 px-3 sm:grid-cols-3 sm:px-0">
        {PILLARS.map((p, i) => {
          const Icon = PILLAR_ICONS[p.key];
          const active = pillar === p.key;
          return (
            <button key={p.key} onClick={() => onPillar(active ? null : p.key)} aria-pressed={active}
              className={cn('rounded-xl border border-pine-900 p-3.5 text-left shadow-tactile-sm shadow-tactile-hover', active ? 'bg-pine-900 text-canvas' : 'bg-canvas-card text-pine-900')}>
              <div className="flex items-center justify-between">
                <Icon className="size-5" />
                <span className={cn('font-mono text-[10px]', active ? 'text-canvas/60' : 'text-pine-600')}>0{i + 1}</span>
              </div>
              <p className="mt-4 text-[14px] font-semibold leading-tight">{p.label}</p>
              <p className={cn('font-bangla text-[12px]', active ? 'text-canvas/70' : 'text-pine-900/60')}>{p.bn} · {p.count}</p>
            </button>
          );
        })}
      </div>
      <section className={cn(FEED_CARD, 'p-4 sm:p-5')}>
        <SectionLabel className="mb-3">{pillar ? 'Filtered stories' : 'All stories'} · {toBengaliNumerals(list.length)}</SectionLabel>
        {list.length === 0 && <p className="py-6 text-center font-bangla text-[14px] text-pine-900/60">এই স্তম্ভে এখনো কোনো প্রতিবেদন নেই।</p>}
        <ul className="divide-y divide-canvas-border">
          {list.map((a) => (
            <li key={a.id}>
              <button onClick={() => onOpenArticle(a.id)} className="group flex w-full gap-3.5 py-3 text-left">
                <ImageGraphic type={a.imageType} className="h-20 w-28 shrink-0 rounded-md [&_span]:hidden" />
                <span className="min-w-0">
                  <span className="font-bangla text-[12px] font-semibold text-pine-600">{a.category}</span>
                  <span className="line-clamp-2 font-display text-[17px] font-semibold leading-snug text-pine-950 group-hover:underline">{a.title}</span>
                  <span className="font-mono text-[10.5px] text-pine-900/50">{a.author.organization} · {a.readTimeMinutes} min</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className={cn(FEED_CARD, 'p-4 sm:p-5')}>
        <SectionLabel className="mb-3">Institutional research · সহজ ভাষায়</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          {papers.map((r) => (
            <div key={r.id} className="rounded-lg border border-canvas-border bg-canvas p-3.5">
              <div className="flex items-center justify-between">
                <span className="rounded border border-pine-900 bg-pine-900 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-canvas">{r.institutionCode}</span>
                <span className="font-mono text-[10px] text-pine-600">{r.publishedDate}</span>
              </div>
              <p className="mt-2 text-[14px] font-semibold leading-snug text-pine-900">{r.title}</p>
              <p className="mt-1 font-bangla text-[13px] text-pine-900/70">{r.summary}</p>
              <p className="mt-2 rounded bg-pine-50 px-2 py-1 font-bangla text-[12.5px] font-medium text-pine-800">→ {r.practicalImpact}</p>
              <p className="mt-2 font-mono text-[10px] text-pine-900/50">{r.researchers.join(', ')}</p>
            </div>
          ))}
        </div>
      </section>
      <section className={cn(FEED_CARD, 'px-4 pb-1 pt-4 lg:hidden')}>
        <h3 className="font-display text-[19px] font-semibold text-pine-900">Trending Now</h3>
        <TrendingList items={trending} onOpen={onOpenTrending} />
      </section>
    </div>
  );
}

export function EventsView({ events, onToggle }: { events: UpcomingEvent[]; onToggle: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <ViewHeader kicker="Events · ২০২৫–২৬" title="সম্মেলন ও মাঠ দিবস" sub="কর্মশালা, সামিট আর হাতে-কলমে প্রশিক্ষণ — এক জায়গায়।" />
      <section className={cn(FEED_CARD, 'px-4 pb-1 pt-2')}>
        <ul className="divide-y divide-canvas-border">
          {events.map((e) => <EventRow key={e.id} e={e} onToggle={() => onToggle(e.id)} />)}
        </ul>
      </section>
      <p className="px-3 font-mono text-[10.5px] text-pine-600 sm:px-0">Registered: {toBengaliNumerals(events.filter((e) => e.isRegistered).length)} / {toBengaliNumerals(events.length)}</p>
    </div>
  );
}

export function StoreView({ onAdd }: { onAdd: (name: string) => void }) {
  const [cart, setCart] = useState<string[]>([]);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-between pr-3 sm:pr-0">
        <ViewHeader kicker="Store · যাচাইকৃত বিক্রেতা" title="কৃষি বাজার" />
        <span className="mb-2 flex items-center gap-1.5 rounded-full border border-pine-900 bg-canvas-card px-3 py-1.5 font-mono text-[12px] font-semibold text-pine-900 shadow-tactile-xs">
          <ShoppingBag className="size-4" />{toBengaliNumerals(cart.length)}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 px-3 sm:gap-4 sm:px-0">
        {STORE_ITEMS.map((s) => {
          const inCart = cart.includes(s.id);
          return (
            <div key={s.id} className={cn(CARD, 'flex flex-col overflow-hidden')}>
              <div className="relative bg-pine-100">
                <img src={s.image} alt={s.name} className="aspect-[4/3] w-full object-cover" />
                <span className="absolute left-2 top-2 rounded bg-canvas-card/90 px-1.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-wide text-pine-800">{s.tag}</span>
              </div>
              <div className="flex flex-1 flex-col p-3">
                <p className="font-bangla text-[14px] font-semibold leading-snug text-pine-900">{s.name}</p>
                <p className="font-mono text-[10.5px] text-pine-600">{s.seller}</p>
                <div className="mt-auto flex items-end justify-between pt-3">
                  <p className="font-display text-[19px] font-bold text-pine-950">৳{toBengaliNumerals(s.price.toLocaleString('en-IN'))}<span className="font-bangla text-[11px] font-normal text-pine-900/50">/{s.unit}</span></p>
                  <button onClick={() => { if (!inCart) { setCart((c) => [...c, s.id]); onAdd(s.name); } else setCart((c) => c.filter((x) => x !== s.id)); }}
                    aria-pressed={inCart} aria-label={inCart ? 'Remove from cart' : 'Add to cart'}
                    className={cn('flex size-8 items-center justify-center rounded-md border border-pine-900 shadow-tactile-xs shadow-tactile-hover', inCart ? 'bg-pine-100 text-pine-800' : 'bg-pine-900 text-canvas')}>
                    {inCart ? '✓' : <Plus className="size-4" />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function IdeasView() {
  const [ideas, setIdeas] = useState(IDEAS.map((i) => ({ ...i, voted: false })));
  const [draft, setDraft] = useState('');
  const sorted = [...ideas].sort((a, b) => b.votes - a.votes);
  return (
    <div className="flex flex-col gap-5">
      <ViewHeader kicker="Ideas · কমিউনিটি বোর্ড" title="ভাবনার খাতা" sub="কৃষির সমস্যা সমাধানে আপনার আইডিয়া দিন, ভোট দিন — সেরাগুলো যাবে IRCB পাইলট তহবিলে।" />
      <form onSubmit={(e) => { e.preventDefault(); if (!draft.trim()) return; setIdeas((s) => [{ id: `i${Date.now()}`, title: draft.trim(), body: 'নতুন প্রস্তাব — আলোচনা চলছে।', author: CURRENT_USER.name, votes: 1, tag: 'নতুন', voted: true }, ...s]); setDraft(''); }}
        className={cn(FEED_CARD, 'flex items-center gap-2 p-3')}>
        <Lightbulb className="ml-1 size-5 text-[#b7791f]" />
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="আপনার আইডিয়া এক লাইনে…" className="h-10 flex-1 bg-transparent font-bangla text-[15px] text-pine-900 outline-none placeholder:text-pine-900/40" />
        <button type="submit" className="h-9 rounded-md border border-pine-900 bg-pine-900 px-3.5 text-[13px] font-semibold text-canvas shadow-tactile-xs">Submit</button>
      </form>
      <ul className="flex flex-col gap-3">
        {sorted.map((i) => (
          <li key={i.id} className={cn(FEED_CARD, 'flex gap-3.5 p-4')}>
            <button onClick={() => setIdeas((s) => s.map((x) => (x.id === i.id ? { ...x, voted: !x.voted, votes: x.votes + (x.voted ? -1 : 1) } : x)))} aria-pressed={i.voted}
              className={cn('flex w-12 shrink-0 flex-col items-center rounded-lg border border-pine-900 py-1.5 shadow-tactile-xs', i.voted ? 'bg-pine-900 text-canvas' : 'bg-canvas-card text-pine-900')}>
              <ArrowBigUp className={cn('size-5', i.voted && 'fill-current')} />
              <span className="font-mono text-[12px] font-semibold">{i.votes}</span>
            </button>
            <div className="min-w-0">
              <span className="font-mono text-[10px] uppercase tracking-wider text-pine-600">{i.tag}</span>
              <p className="font-bangla text-[16px] font-semibold leading-snug text-pine-900">{i.title}</p>
              <p className="mt-0.5 font-bangla text-[13.5px] text-pine-900/70">{i.body}</p>
              <p className="mt-1.5 text-[11.5px] text-pine-900/50">by {i.author}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function NotificationsView({ items, onRead }: { items: NotificationItem[]; onRead: () => void }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between pr-3 sm:pr-0">
        <ViewHeader kicker="Alerts" title="Notifications" />
        <button onClick={onRead} className="mb-3 font-mono text-[10.5px] uppercase tracking-wider text-pine-600">Mark all read</button>
      </div>
      <ul className={cn(FEED_CARD, 'divide-y divide-canvas-border')}>
        {items.map((n) => (
          <li key={n.id} className={cn('flex gap-3 px-4 py-3.5', n.unread && 'bg-pine-50')}>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-pine-900/20 bg-canvas-card text-pine-700"><Bell className="size-[18px]" /></span>
            <span className="flex-1">
              <span className="block font-bangla text-[14.5px] leading-snug text-pine-900">{n.title}</span>
              <span className="mt-0.5 block font-mono text-[10.5px] text-pine-600">{n.source} · {n.time}</span>
            </span>
            {n.unread && <span className="mt-2 size-2.5 rounded-full bg-[#1b74e4]" />}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProfileView({ savedArticles, savedPosts, myPosts, onOpenArticle, onRemoveArticle, onRemovePost, dark, onToggleDark }: {
  savedArticles: Article[]; savedPosts: CommunityPost[]; myPosts: number; dark: boolean; onToggleDark: () => void;
  onOpenArticle: (id: string) => void; onRemoveArticle: (id: string) => void; onRemovePost: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <section className={cn(FEED_CARD, 'overflow-hidden')}>
        <div className="h-28 bg-gradient-to-br from-[#04301f] via-[#17754f] to-[#f2c14e]" />
        <div className="-mt-12 px-4 pb-4">
          <Avatar src={CURRENT_USER.avatar} name={CURRENT_USER.name} size="size-24" online className="rounded-full border-4 border-canvas-card" />
          <h1 className="mt-2 font-display text-[26px] font-bold text-pine-950">{CURRENT_USER.name}</h1>
          <p className="font-bangla text-[14px] text-pine-900/65">{CURRENT_USER.role} · ময়মনসিংহ</p>
          <dl className="mt-4 grid grid-cols-3 rounded-lg border border-pine-900 text-center shadow-tactile-xs">
            {[['Posts', myPosts + 12], ['Followers', 1840], ['Saved', savedArticles.length + savedPosts.length]].map(([k, v]) => (
              <div key={k} className="border-r border-canvas-border py-2 last:border-0">
                <dd className="font-display text-[20px] font-bold text-pine-900">{toBengaliNumerals(v)}</dd>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-pine-600">{k}</dt>
              </div>
            ))}
          </dl>
          <div className="mt-3 flex gap-2">
            <button onClick={onToggleDark} className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md border border-pine-900 bg-canvas-card text-[13px] font-semibold text-pine-900"><Settings className="size-4" />{dark ? 'Light mode' : 'Dark mode'}</button>
            <button className="flex h-9 items-center justify-center gap-1.5 rounded-md border border-canvas-border px-3 text-[13px] font-semibold text-pine-900/70"><LogOut className="size-4" />Log out</button>
          </div>
        </div>
      </section>
      <section className={cn(FEED_CARD, 'p-4')}>
        <h2 className="mb-3 font-display text-[20px] font-semibold text-pine-900">সংরক্ষিত তালিকা</h2>
        <SavedList articles={savedArticles} posts={savedPosts} onOpenArticle={onOpenArticle} onRemoveArticle={onRemoveArticle} onRemovePost={onRemovePost} />
      </section>
    </div>
  );
}
