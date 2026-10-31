import { useMemo, useState } from 'react';
import {
  ArrowBigUp, ShoppingBag, Lightbulb, Plus, Bell, Settings, ExternalLink, MapPin, Globe2,
  UserPlus, Check, Camera, Palette, Sparkles,
} from 'lucide-react';
import type {
  Article, BkashOrder, CartItem, CommunityIdea, CommunityPost, LinkedInReactionType,
  NotificationItem, ReactionTargetType, ResearchPaper, StoreProduct, UpcomingEvent, UserProfile,
} from '../types';
import { BKASH_RECEIVER_NUMBER } from '../lib/supabase';
import { CARD, FEED_CARD, SectionLabel, Avatar, VerifiedBadge, cn } from './Primitives';
import { PILLAR_DEFS } from './LeftSidebar';
import { EventRow, TrendingList } from './RightSidebar';
import { ImageGraphic } from './ImageGraphic';
import { SavedList } from './SavedArticlesModal';
import { ArticleCard } from './ArticleCard';
import { CommunityPostCard } from './CommunityPostCard';
import { toBengaliNumerals } from '../utils/pureLogic';

function ViewHeader({
  kicker,
  title,
  sub,
  action,
}: {
  kicker: string;
  title: string;
  sub?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 px-3 pb-1 pt-2 sm:px-0">
      <div>
        <SectionLabel>{kicker}</SectionLabel>
        <h1 className="mt-1 font-display text-[30px] font-bold leading-tight tracking-[-0.01em] text-pine-950 sm:text-[38px]">
          {title}
        </h1>
        {sub && <p className="mt-1 font-bangla text-[15px] text-pine-900/65">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function ExploreView({
  articles,
  papers,
  currentUser,
  pillar,
  onPillar,
  onOpenArticlePopup,
  onAddPaper,
  onNavigateProfile,
  onOpenPhoto,
}: {
  articles: Article[];
  papers: ResearchPaper[];
  currentUser: UserProfile | null;
  pillar: string | null;
  onPillar: (k: string | null) => void;
  onOpenArticlePopup: (id: string) => void;
  onAddPaper: (paper: ResearchPaper) => void;
  onNavigateProfile: (userId: string) => void;
  onOpenPhoto: (src: string, title?: string, authorName?: string, authorId?: string) => void;
}) {
  const [addingPaper, setAddingPaper] = useState(false);
  const [instCode, setInstCode] = useState<'BRRI' | 'BAU' | 'BARI' | 'SAU'>('BRRI');
  const [pTitle, setPTitle] = useState('');
  const [pSummary, setPSummary] = useState('');
  const [pImpact, setPImpact] = useState('');
  const [pDoi, setPDoi] = useState('');

  const list = useMemo(() => {
    if (!pillar) return articles;
    const def = PILLAR_DEFS.find((d) => d.key === pillar);
    if (!def) return articles;
    return articles.filter((a) => (def.cats as readonly string[]).includes(a.category));
  }, [articles, pillar]);

  const submitPaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pTitle.trim() || !pSummary.trim()) return;
    const instNames = {
      BRRI: 'Bangladesh Rice Research Institute',
      BAU: 'Bangladesh Agricultural University',
      BARI: 'Bangladesh Agricultural Research Institute',
      SAU: 'Sher-e-Bangla Agricultural University',
    };
    onAddPaper({
      id: `rp-${Date.now().toString(36)}`,
      institution: instNames[instCode],
      institutionCode: instCode,
      title: pTitle.trim(),
      summary: pSummary.trim(),
      practicalImpact: pImpact.trim() || 'মাঠ পর্যায়ে পরীক্ষিত',
      publishedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      researchers: [currentUser?.name || 'Researcher'],
      authorId: currentUser?.id,
      doiLink: pDoi.trim() || undefined,
    });
    setPTitle('');
    setPSummary('');
    setPImpact('');
    setPDoi('');
    setAddingPaper(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <ViewHeader
        kicker="Explore · OpenAlex pillars"
        title="জ্ঞানের মাঠ"
        sub="ছয়টি কৌশলগত স্তম্ভে সাজানো বাংলাদেশের কৃষি গবেষণা ও মাঠের অভিজ্ঞতা।"
      />

      <div className="grid grid-cols-2 gap-2.5 px-3 sm:grid-cols-3 sm:px-0">
        {PILLAR_DEFS.map((p, i) => {
          const Icon = p.icon;
          const active = pillar === p.key;
          const count = articles.filter((a) => (p.cats as readonly string[]).includes(a.category)).length;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => onPillar(active ? null : p.key)}
              aria-pressed={active}
              className={cn(
                'rounded-xl border border-pine-900 p-3.5 text-left shadow-tactile-sm shadow-tactile-hover',
                active ? 'bg-pine-900 text-canvas' : 'bg-canvas-card text-pine-900',
              )}
            >
              <div className="flex items-center justify-between">
                <Icon className="size-5" />
                <span className={cn('font-mono text-[10px]', active ? 'text-canvas/60' : 'text-pine-600')}>
                  0{i + 1}
                </span>
              </div>
              <p className="mt-4 text-[14px] font-semibold leading-tight">{p.label}</p>
              <p className={cn('font-bangla text-[12px]', active ? 'text-canvas/70' : 'text-pine-900/60')}>
                {p.bn} · {toBengaliNumerals(count)}
              </p>
            </button>
          );
        })}
      </div>

      <section className={cn(FEED_CARD, 'p-4 sm:p-5')}>
        <SectionLabel className="mb-3">
          {pillar ? 'Filtered stories' : 'All stories'} · {toBengaliNumerals(list.length)}
        </SectionLabel>
        {list.length === 0 ? (
          <p className="py-6 text-center font-bangla text-[14px] text-pine-900/60">
            এই স্তম্ভে এখনো কোনো প্রতিবেদন নেই।
          </p>
        ) : (
          <ul className="divide-y divide-canvas-border">
            {list.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                <button
                  type="button"
                  onClick={() => onOpenArticlePopup(a.id)}
                  className="group flex min-w-0 flex-1 gap-3.5 text-left"
                >
                  <ImageGraphic
                    type={a.imageType}
                    coverImageUrl={a.coverImageUrl}
                    className="h-20 w-28 shrink-0 rounded-md [&_span]:hidden"
                  />
                  <span className="min-w-0">
                    <span className="font-bangla text-[12px] font-semibold text-pine-600">{a.category}</span>
                    <span className="line-clamp-2 font-display text-[17px] font-semibold leading-snug text-pine-950 group-hover:underline">
                      {a.title}
                    </span>
                    <span className="font-mono text-[10.5px] text-pine-900/50">
                      {a.author.name} · {a.readTimeMinutes} min
                    </span>
                  </span>
                </button>
                <a
                  href={`/article/${a.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-lg border border-pine-900/25 bg-canvas-subtle px-2.5 py-1.5 font-mono text-[10.5px] font-semibold text-pine-900 hover:border-pine-900"
                >
                  New Tab <ExternalLink className="inline size-3" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={cn(FEED_CARD, 'p-4 sm:p-5')}>
        <div className="mb-3 flex items-center justify-between">
          <SectionLabel>Institutional research · সহজ ভাষায় ({papers.length})</SectionLabel>
          <button
            type="button"
            onClick={() => setAddingPaper((s) => !s)}
            className="inline-flex items-center gap-1 rounded-md border border-pine-900 bg-pine-900 px-2.5 py-1 font-mono text-[10.5px] font-semibold text-canvas shadow-tactile-xs"
          >
            <Plus className="size-3" /> Add Paper
          </button>
        </div>

        {addingPaper && (
          <form onSubmit={submitPaper} className="mb-4 space-y-2.5 rounded-xl border border-pine-900 bg-canvas p-3.5">
            <div className="grid grid-cols-2 gap-2">
              <select
                value={instCode}
                onChange={(e) => setInstCode(e.target.value as 'BRRI' | 'BAU' | 'BARI' | 'SAU')}
                className="rounded-lg border border-pine-900/25 bg-canvas-card px-2.5 py-1.5 font-mono text-[12px]"
              >
                <option value="BRRI">BRRI</option>
                <option value="BAU">BAU</option>
                <option value="BARI">BARI</option>
                <option value="SAU">SAU</option>
              </select>
              <input
                value={pDoi}
                onChange={(e) => setPDoi(e.target.value)}
                placeholder="DOI or External Link (Optional)"
                className="rounded-lg border border-pine-900/25 bg-canvas-card px-2.5 py-1.5 font-mono text-[12px]"
              />
            </div>
            <input
              required
              value={pTitle}
              onChange={(e) => setPTitle(e.target.value)}
              placeholder="Research Paper Title *"
              className="w-full rounded-lg border border-pine-900/25 bg-canvas-card px-3 py-1.5 text-[13.5px]"
            />
            <input
              required
              value={pSummary}
              onChange={(e) => setPSummary(e.target.value)}
              placeholder="সহজ বাংলায় সারসংক্ষেপ *"
              className="w-full rounded-lg border border-pine-900/25 bg-canvas-card px-3 py-1.5 font-bangla text-[13.5px]"
            />
            <div className="flex gap-2">
              <input
                value={pImpact}
                onChange={(e) => setPImpact(e.target.value)}
                placeholder="মাঠ পর্যায়ের প্রভাব (যেমন: ফলন ২২% বৃদ্ধি)"
                className="flex-1 rounded-lg border border-pine-900/25 bg-canvas-card px-3 py-1.5 font-bangla text-[13px]"
              />
              <button
                type="submit"
                className="rounded-lg bg-pine-900 px-4 py-1.5 text-[12.5px] font-semibold text-canvas"
              >
                Save to Supabase
              </button>
            </div>
          </form>
        )}

        {papers.length === 0 ? (
          <p className="py-6 text-center font-bangla text-[13.5px] text-pine-900/55">
            এখনো কোনো গবেষণাপত্র যোগ করা হয়নি — উপরের + Add Paper বাটনে ক্লিক করে যোগ করুন।
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {papers.map((r) => (
              <div key={r.id} className="rounded-lg border border-canvas-border bg-canvas p-3.5">
                <div className="flex items-center justify-between">
                  <span className="rounded border border-pine-900 bg-pine-900 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-canvas">
                    {r.institutionCode}
                  </span>
                  <span className="font-mono text-[10px] text-pine-600">{r.publishedDate}</span>
                </div>
                <p className="mt-2 text-[14px] font-semibold leading-snug text-pine-900">{r.title}</p>
                <p className="mt-1 font-bangla text-[13px] text-pine-900/70">{r.summary}</p>
                <p className="mt-2 rounded bg-pine-50 px-2 py-1 font-bangla text-[12.5px] font-medium text-pine-800">
                  → {r.practicalImpact}
                </p>
                <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-pine-900/60">
                  <button
                    type="button"
                    onClick={() => r.authorId && onNavigateProfile(r.authorId)}
                    className="hover:underline"
                  >
                    {r.researchers.join(', ')}
                  </button>
                  {r.doiLink && (
                    <a
                      href={r.doiLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pine-700 hover:underline"
                    >
                      DOI ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={cn(FEED_CARD, 'px-4 pb-1 pt-4 lg:hidden')}>
        <h3 className="font-display text-[19px] font-semibold text-pine-900">Trending Now</h3>
        <TrendingList
          articles={articles}
          onOpenPopup={onOpenArticlePopup}
          onOpenPhoto={onOpenPhoto}
        />
      </section>
    </div>
  );
}

export function EventsView({
  events,
  onToggle,
  onAddEvent,
}: {
  events: UpcomingEvent[];
  onToggle: (id: string) => void;
  onAddEvent: (ev: UpcomingEvent) => void;
}) {
  const [openAdd, setOpenAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [month, setMonth] = useState('JAN');
  const [day, setDay] = useState('18');
  const [loc, setLoc] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !loc.trim()) return;
    onAddEvent({
      id: `ev-${Date.now().toString(36)}`,
      title: title.trim(),
      dateMonth: month.trim().toUpperCase().slice(0, 3) || 'JAN',
      dateDay: day.trim() || '01',
      location: loc.trim(),
      attendeesCount: '১ জন যাচ্ছেন',
      isRegistered: true,
    });
    setTitle('');
    setLoc('');
    setOpenAdd(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <ViewHeader
        kicker="Events · Supabase"
        title="সম্মেলন ও মাঠ দিবস"
        sub="কর্মশালা, সামিট আর হাতে-কলমে প্রশিক্ষণ — এক জায়গায়।"
        action={
          <button
            type="button"
            onClick={() => setOpenAdd((s) => !s)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-pine-900 bg-pine-900 px-3.5 text-[12.5px] font-semibold text-canvas shadow-tactile-xs"
          >
            <Plus className="size-4" /> Add Event
          </button>
        }
      />

      {openAdd && (
        <form onSubmit={submit} className={cn(FEED_CARD, 'space-y-3 p-4')}>
          <SectionLabel>Create New Event in Supabase (public.events)</SectionLabel>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event Title (e.g. AgriTech Innovation Summit 2026) *"
            className="w-full rounded-lg border border-pine-900/25 bg-canvas px-3 py-2 text-[14px]"
          />
          <div className="grid grid-cols-3 gap-2">
            <input
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="Month (JAN)"
              className="rounded-lg border border-pine-900/25 bg-canvas px-3 py-2 font-mono text-[13px] uppercase"
            />
            <input
              value={day}
              onChange={(e) => setDay(e.target.value)}
              placeholder="Day (18)"
              className="rounded-lg border border-pine-900/25 bg-canvas px-3 py-2 font-mono text-[13px]"
            />
            <input
              required
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
              placeholder="Location (ICCB, ঢাকা) *"
              className="rounded-lg border border-pine-900/25 bg-canvas px-3 py-2 font-bangla text-[13px]"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="h-9 rounded-lg bg-pine-900 px-4 text-[13px] font-semibold text-canvas"
            >
              Publish Event to Supabase
            </button>
          </div>
        </form>
      )}

      <section className={cn(FEED_CARD, 'px-4 pb-1 pt-2')}>
        {events.length === 0 ? (
          <p className="py-10 text-center font-bangla text-[14px] text-pine-900/60">
            কোনো ইভেন্ট এখনো যোগ করা হয়নি — উপরের + Add Event বাটনে চাপুন।
          </p>
        ) : (
          <ul className="divide-y divide-canvas-border">
            {events.map((e) => (
              <EventRow key={e.id} e={e} onToggle={() => onToggle(e.id)} />
            ))}
          </ul>
        )}
      </section>
      <p className="px-3 font-mono text-[10.5px] text-pine-600 sm:px-0">
        Registered: {toBengaliNumerals(events.filter((e) => e.isRegistered).length)} /{' '}
        {toBengaliNumerals(events.length)}
      </p>
    </div>
  );
}

export function StoreView({
  products,
  cart,
  ordersCount,
  onAddToCart,
  onOpenCheckout,
  onOpenCreateProduct,
  onNavigateProfile,
  onOpenPhoto,
}: {
  products: StoreProduct[];
  cart: CartItem[];
  ordersCount: number;
  onAddToCart: (product: StoreProduct) => void;
  onOpenCheckout: () => void;
  onOpenCreateProduct: () => void;
  onNavigateProfile: (userId: string) => void;
  onOpenPhoto: (src: string, title?: string, subtitle?: string, authorName?: string, authorId?: string) => void;
}) {
  const totalCartQty = cart.reduce((s, c) => s + c.quantity, 0);

  return (
    <div className="flex flex-col gap-5">
      <ViewHeader
        kicker={`Store · bKash Integrated (${BKASH_RECEIVER_NUMBER})`}
        title="কৃষি বাজার"
        sub={`যাচাইকৃত কৃষি উপকরণ, বীজ ও সেন্সর — বিকাশ পেমেন্ট (${BKASH_RECEIVER_NUMBER}) সহ সরাসরি অর্ডার।`}
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenCreateProduct}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-pine-900 bg-canvas-card px-3.5 text-[13px] font-semibold text-pine-900 shadow-tactile-xs shadow-tactile-hover"
            >
              <Plus className="size-4" /> পণ্য যোগ করুন
            </button>
            <button
              type="button"
              onClick={onOpenCheckout}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-pine-900 bg-[#e2136e] px-4 text-[13.5px] font-bold text-white shadow-tactile-xs shadow-tactile-hover"
            >
              <ShoppingBag className="size-4" />
              Cart ({toBengaliNumerals(totalCartQty)}) · bKash Checkout
            </button>
          </div>
        }
      />

      {products.length === 0 ? (
        <section className={cn(FEED_CARD, 'p-8 text-center')}>
          <ShoppingBag className="mx-auto size-10 text-pine-600/50" />
          <h2 className="mt-2 font-display text-[21px] font-semibold text-pine-900">
            কৃষি বাজারে এখনো কোনো পণ্য তালিকাভুক্ত নেই
          </h2>
          <p className="mx-auto mt-1 max-w-md font-bangla text-[14px] text-pine-900/65">
            কোনো ফেক পণ্য রাখা হয়নি। আপনার প্রথম কৃষি পণ্য, বীজ বা আইওটি সেন্সর যোগ করুন এবং বিকাশ ({BKASH_RECEIVER_NUMBER}) পেমেন্টের মাধ্যমে বিক্রি শুরু করুন।
          </p>
          <div className="mt-4 flex justify-center gap-2.5">
            <button
              type="button"
              onClick={onOpenCreateProduct}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-pine-900 bg-pine-900 px-4 text-[13.5px] font-semibold text-canvas shadow-tactile-xs"
            >
              <Plus className="size-4" /> প্রথম পণ্য যোগ করুন (Supabase)
            </button>
            {ordersCount > 0 && (
              <button
                type="button"
                onClick={onOpenCheckout}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-pine-900 bg-canvas-card px-4 text-[13.5px] font-semibold text-pine-900"
              >
                অর্ডার রশিদ দেখুন ({ordersCount})
              </button>
            )}
          </div>
        </section>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-3 sm:gap-4 sm:px-0">
          {products.map((s) => {
            const inCartQty = cart.find((c) => c.productId === s.id)?.quantity ?? 0;
            return (
              <div key={s.id} className={cn(CARD, 'flex flex-col overflow-hidden')}>
                <div className="relative bg-pine-100">
                  {s.image ? (
                    <button
                      type="button"
                      onClick={() => onOpenPhoto(s.image, s.name, s.description, s.seller, s.sellerId)}
                      className="block w-full cursor-zoom-in"
                    >
                      <img src={s.image} alt={s.name} className="aspect-[4/3] w-full object-cover" />
                    </button>
                  ) : (
                    <div className="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-pine-900 to-pine-600 font-display text-[20px] font-bold text-canvas">
                      {s.name.slice(0, 12)}
                    </div>
                  )}
                  <span className="absolute left-2 top-2 rounded bg-canvas-card/90 px-1.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-wide text-pine-800">
                    {s.tag}
                  </span>
                  <span className="absolute right-2 top-2 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[9.5px] text-white">
                    Stock: {s.stock}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <p className="font-bangla text-[14.5px] font-semibold leading-snug text-pine-900">{s.name}</p>
                  {s.description && (
                    <p className="mt-0.5 line-clamp-2 font-bangla text-[12px] text-pine-900/65">
                      {s.description}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => onNavigateProfile(s.sellerId)}
                    className="mt-1 text-left font-mono text-[10.5px] text-pine-600 hover:underline"
                  >
                    Seller: {s.seller}
                  </button>
                  <div className="mt-auto flex items-end justify-between pt-3">
                    <p className="font-display text-[19px] font-bold text-pine-950">
                      ৳{toBengaliNumerals(s.price.toLocaleString('en-IN'))}
                      <span className="font-bangla text-[11px] font-normal text-pine-900/50">/{s.unit}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => onAddToCart(s)}
                      className={cn(
                        'inline-flex h-8 items-center gap-1 rounded-md border border-pine-900 px-2.5 text-[12px] font-semibold shadow-tactile-xs shadow-tactile-hover',
                        inCartQty > 0 ? 'bg-[#e2136e] text-white' : 'bg-pine-900 text-canvas',
                      )}
                    >
                      <Plus className="size-3.5" />
                      {inCartQty > 0 ? `In Cart (${inCartQty})` : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function IdeasView({
  ideas,
  onSubmitIdea,
  onToggleVote,
  onNavigateProfile,
}: {
  ideas: CommunityIdea[];
  onSubmitIdea: (title: string, body: string, tag: string) => void;
  onToggleVote: (id: string) => void;
  onNavigateProfile: (userId: string) => void;
}) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tag, setTag] = useState('এগ্রি-টেক');
  const sorted = [...ideas].sort((a, b) => b.votes - a.votes);

  return (
    <div className="flex flex-col gap-5">
      <ViewHeader
        kicker="Ideas · কমিউনিটি বোর্ড"
        title="ভাবনার খাতা"
        sub="কৃষির সমস্যা সমাধানে আপনার আইডিয়া দিন, ভোট দিন — সব ডেটা সরাসরি Supabase-এ সংরক্ষিত।"
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          onSubmitIdea(title.trim(), body.trim() || title.trim(), tag.trim() || 'এগ্রি-টেক');
          setTitle('');
          setBody('');
        }}
        className={cn(FEED_CARD, 'space-y-2.5 p-3.5')}
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="ml-1 size-5 shrink-0 text-[#b7791f]" />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="আপনার আইডিয়ার শিরোনাম…"
            className="h-9 flex-1 bg-transparent font-bangla text-[15px] font-semibold text-pine-900 outline-none placeholder:text-pine-900/40"
          />
          <input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="ট্যাগ"
            className="w-24 rounded-md border border-canvas-border bg-canvas px-2 py-1 font-bangla text-[12px] text-pine-900"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="সংক্ষেপে বাস্তবায়ন পরিকল্পনা লিখুন…"
            className="h-9 flex-1 rounded-lg bg-canvas-subtle px-3 font-bangla text-[13.5px] text-pine-900 outline-none placeholder:text-pine-900/40"
          />
          <button
            type="submit"
            disabled={!title.trim()}
            className="h-9 rounded-md border border-pine-900 bg-pine-900 px-3.5 text-[13px] font-semibold text-canvas shadow-tactile-xs disabled:opacity-40"
          >
            Submit to Supabase
          </button>
        </div>
      </form>

      {sorted.length === 0 ? (
        <section className={cn(FEED_CARD, 'p-8 text-center font-bangla text-[14px] text-pine-900/60')}>
          এখনো কোনো আইডিয়া জমা পড়েনি — প্রথম আইডিয়াটি উপরে লিখে জমা দিন।
        </section>
      ) : (
        <ul className="flex flex-col gap-3">
          {sorted.map((i) => (
            <li key={i.id} className={cn(FEED_CARD, 'flex gap-3.5 p-4')}>
              <button
                type="button"
                onClick={() => onToggleVote(i.id)}
                aria-pressed={i.voted}
                className={cn(
                  'flex w-12 shrink-0 flex-col items-center rounded-lg border border-pine-900 py-1.5 shadow-tactile-xs',
                  i.voted ? 'bg-pine-900 text-canvas' : 'bg-canvas-card text-pine-900',
                )}
              >
                <ArrowBigUp className={cn('size-5', i.voted && 'fill-current')} />
                <span className="font-mono text-[12px] font-semibold">{i.votes}</span>
              </button>
              <div className="min-w-0">
                <span className="font-mono text-[10px] uppercase tracking-wider text-pine-600">{i.tag}</span>
                <p className="font-bangla text-[16px] font-semibold leading-snug text-pine-900">{i.title}</p>
                <p className="mt-0.5 font-bangla text-[13.5px] text-pine-900/70">{i.body}</p>
                <button
                  type="button"
                  onClick={() => onNavigateProfile(i.authorId)}
                  className="mt-1.5 text-[11.5px] font-semibold text-pine-900/65 hover:underline"
                >
                  by {i.author}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function NotificationsView({
  items,
  onRead,
}: {
  items: NotificationItem[];
  onRead: () => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between pr-3 sm:pr-0">
        <ViewHeader kicker="Alerts · Supabase" title="Notifications" />
        <button
          type="button"
          onClick={onRead}
          className="mb-3 font-mono text-[10.5px] uppercase tracking-wider text-pine-600"
        >
          Mark all read
        </button>
      </div>
      {items.length === 0 ? (
        <section className={cn(FEED_CARD, 'p-8 text-center font-bangla text-[14px] text-pine-900/60')}>
          কোনো নোটিফিকেশন নেই।
        </section>
      ) : (
        <ul className={cn(FEED_CARD, 'divide-y divide-canvas-border')}>
          {items.map((n) => (
            <li key={n.id} className={cn('flex gap-3 px-4 py-3.5', n.unread && 'bg-pine-50')}>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-pine-900/20 bg-canvas-card text-pine-700">
                <Bell className="size-[18px]" />
              </span>
              <span className="flex-1">
                <span className="block font-bangla text-[14.5px] leading-snug text-pine-900">{n.title}</span>
                <span className="mt-0.5 block font-mono text-[10.5px] text-pine-600">
                  {n.source} · {n.time}
                </span>
              </span>
              {n.unread && <span className="mt-2 size-2.5 rounded-full bg-[#1b74e4]" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ProfileView({
  profile,
  isOwnProfile,
  isFollowing,
  currentUser,
  authorArticles,
  authorPosts,
  savedArticles,
  savedPosts,
  orders,
  bookmarkIds,
  dark,
  onToggleDark,
  onToggleFollow,
  onOpenProfileSettings,
  onOpenArticlePopup,
  onReact,
  onOpenReactionsBreakdown,
  onBookmarkArticle,
  onCommentArticle,
  onSavePost,
  onCommentPost,
  onShare,
  onRemoveSavedArticle,
  onRemoveSavedPost,
  onNavigateProfile,
  onOpenPhoto,
}: {
  profile: UserProfile | null;
  isOwnProfile: boolean;
  isFollowing: boolean;
  currentUser: UserProfile | null;
  authorArticles: Article[];
  authorPosts: CommunityPost[];
  savedArticles: Article[];
  savedPosts: CommunityPost[];
  orders: BkashOrder[];
  bookmarkIds: string[];
  dark: boolean;
  onToggleDark: () => void;
  onToggleFollow: () => void;
  onOpenProfileSettings: () => void;
  onOpenArticlePopup: (id: string) => void;
  onReact: (targetType: ReactionTargetType, targetId: string, type: LinkedInReactionType) => void;
  onOpenReactionsBreakdown: (targetType: ReactionTargetType, targetId: string) => void;
  onBookmarkArticle: (id: string) => void;
  onCommentArticle: (id: string, text: string) => void;
  onSavePost: (id: string) => void;
  onCommentPost: (id: string, text: string) => void;
  onShare: (label: string) => void;
  onRemoveSavedArticle: (id: string) => void;
  onRemoveSavedPost: (id: string) => void;
  onNavigateProfile: (userId: string) => void;
  onOpenPhoto: (images: string[], index: number, title?: string, subtitle?: string, authorName?: string, authorId?: string) => void;
}) {
  const [tab, setTab] = useState<'articles' | 'posts' | 'saved' | 'orders'>('articles');

  if (!profile) {
    return (
      <section className={cn(FEED_CARD, 'p-8 text-center')}>
        <UserPlus className="mx-auto size-10 text-pine-600" />
        <h1 className="mt-2 font-display text-[24px] font-bold text-pine-950">
          Create Your Supabase Profile
        </h1>
        <p className="mx-auto mt-1 max-w-md font-bangla text-[14.5px] text-pine-900/70">
          আপনার প্রোফাইল ছবি (PFP), কভার ব্যাকগ্রাউন্ড গ্র্যাডিয়েন্ট এবং পরিচয়ের তথ্য সেট করুন।
        </p>
        <button
          type="button"
          onClick={onOpenProfileSettings}
          className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-lg border border-pine-900 bg-pine-900 px-5 text-[14px] font-semibold text-canvas shadow-tactile-xs"
        >
          <Sparkles className="size-4" /> Set Up Profile Now
        </button>
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <section className={cn(FEED_CARD, 'overflow-hidden')}>
        {/* Custom Cover Background Gradient */}
        <div
          style={{
            background:
              profile.coverGradient ||
              'linear-gradient(135deg, #04301f 0%, #17754f 55%, #f2c14e 100%)',
          }}
          className="relative h-36 w-full sm:h-44"
        >
          {isOwnProfile && (
            <button
              type="button"
              onClick={onOpenProfileSettings}
              className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-lg border border-white/30 bg-black/45 px-3 py-1.5 font-mono text-[11px] font-semibold text-white backdrop-blur-sm hover:bg-black/65"
            >
              <Palette className="size-3.5" /> Change Cover Gradient &amp; PFP
            </button>
          )}
        </div>

        <div className="-mt-14 px-4 pb-5 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            {/* Clickable PFP -> Opens Photo Lightbox Popup if image URL */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  if (profile.avatar.startsWith('http') || profile.avatar.startsWith('data:')) {
                    onOpenPhoto([profile.avatar], 0, profile.name, `${profile.role} · ${profile.organization}`, profile.name, profile.id);
                  } else if (isOwnProfile) {
                    onOpenProfileSettings();
                  }
                }}
                className="group relative block rounded-full"
                title="Click to view photo or edit PFP"
              >
                <Avatar
                  src={profile.avatar}
                  name={profile.name}
                  size="size-24 sm:size-28"
                  online={isOwnProfile}
                  className="rounded-full border-4 border-canvas-card shadow-md"
                />
              </button>
              {isOwnProfile && (
                <button
                  type="button"
                  onClick={onOpenProfileSettings}
                  aria-label="Change profile picture"
                  className="absolute bottom-1 right-1 flex size-8 items-center justify-center rounded-full border border-pine-900 bg-pine-900 text-canvas shadow hover:bg-pine-700"
                >
                  <Camera className="size-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {isOwnProfile ? (
                <>
                  <button
                    type="button"
                    onClick={onOpenProfileSettings}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-pine-900 bg-pine-900 px-3.5 text-[13px] font-semibold text-canvas shadow-tactile-xs shadow-tactile-hover"
                  >
                    <Settings className="size-4" /> Edit Profile &amp; Gradient
                  </button>
                  <button
                    type="button"
                    onClick={onToggleDark}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-pine-900 bg-canvas-card px-3 text-[12.5px] font-semibold text-pine-900"
                  >
                    {dark ? 'Light Mode' : 'Dark Mode'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={onToggleFollow}
                  aria-pressed={isFollowing}
                  className={cn(
                    'inline-flex h-9 items-center gap-1.5 rounded-full border border-pine-900 px-4 text-[13px] font-semibold shadow-tactile-xs transition',
                    isFollowing ? 'bg-canvas-subtle text-pine-900' : 'bg-pine-900 text-canvas',
                  )}
                >
                  {isFollowing ? (
                    <>
                      <Check className="size-4" /> Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="size-4" /> Follow Author
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="mt-3">
            <h1 className="flex items-center gap-1.5 font-display text-[26px] font-bold text-pine-950">
              {profile.name}
              {profile.isVerified && <VerifiedBadge />}
            </h1>
            {profile.nameBn && profile.nameBn !== profile.name && (
              <p className="font-bangla text-[15px] font-medium text-pine-700">{profile.nameBn}</p>
            )}
            <p className="mt-0.5 font-bangla text-[14px] text-pine-900/75">
              {profile.role} {profile.organization ? `· ${profile.organization}` : ''}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-3 font-mono text-[11px] text-pine-600">
              <span>@{profile.handle}</span>
              {profile.location && (
                <span className="flex items-center gap-1 font-bangla">
                  <MapPin className="size-3" /> {profile.location}
                </span>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-pine-700 hover:underline"
                >
                  <Globe2 className="size-3" /> Website ↗
                </a>
              )}
            </div>
            {profile.bio && (
              <p className="mt-3 font-bangla text-[14.5px] leading-relaxed text-pine-900/85">
                {profile.bio}
              </p>
            )}
          </div>

          <dl className="mt-4 grid grid-cols-4 rounded-lg border border-pine-900 text-center shadow-tactile-xs">
            {[
              ['Articles', authorArticles.length],
              ['Posts', authorPosts.length],
              ['Followers', profile.followersCount + (isFollowing ? 1 : 0)],
              ['Publications', profile.publicationsCount + authorArticles.length],
            ].map(([k, v]) => (
              <div key={String(k)} className="border-r border-canvas-border py-2 last:border-0">
                <dd className="font-display text-[20px] font-bold text-pine-900">
                  {toBengaliNumerals(Number(v))}
                </dd>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-pine-600">{k}</dt>
              </div>
            ))}
          </dl>
        </div>

        {/* Profile Navigation Tabs */}
        <div className="flex border-t border-canvas-border px-4">
          {(
            [
              { key: 'articles', label: `Articles (${authorArticles.length})` },
              { key: 'posts', label: `Activity (${authorPosts.length})` },
              ...(isOwnProfile
                ? [
                    { key: 'saved', label: `Saved (${savedArticles.length + savedPosts.length})` },
                    { key: 'orders', label: `bKash Orders (${orders.length})` },
                  ]
                : []),
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key as typeof tab)}
              className={cn(
                'relative py-3 px-3.5 text-[13.5px] font-semibold transition',
                tab === t.key ? 'text-pine-800' : 'text-pine-900/55 hover:text-pine-900',
              )}
            >
              {t.label}
              {tab === t.key && (
                <span className="absolute inset-x-2 bottom-0 h-[3px] rounded-t-full bg-pine-700" />
              )}
            </button>
          ))}
        </div>
      </section>

      {tab === 'articles' && (
        <div className="space-y-4">
          {authorArticles.length === 0 ? (
            <section className={cn(FEED_CARD, 'p-8 text-center font-bangla text-[14px] text-pine-900/60')}>
              এই লেখকের এখনো কোনো প্রকাশিত প্রতিবেদন নেই।
            </section>
          ) : (
            authorArticles.map((a) => (
              <ArticleCard
                key={a.id}
                article={a}
                bookmarked={bookmarkIds.includes(a.id)}
                currentUser={currentUser}
                onOpenPopup={() => onOpenArticlePopup(a.id)}
                onReact={(type) => onReact('article', a.id, type)}
                onOpenReactionsBreakdown={() => onOpenReactionsBreakdown('article', a.id)}
                onBookmark={() => onBookmarkArticle(a.id)}
                onComment={(t) => onCommentArticle(a.id, t)}
                onReactComment={(cid, type) => onReact('comment', cid, type)}
                onShare={() => onShare(a.title)}
                onNavigateProfile={onNavigateProfile}
                onOpenPhoto={(src, title, subtitle, authorName, authorId) =>
                  onOpenPhoto([src], 0, title, subtitle, authorName, authorId)
                }
              />
            ))
          )}
        </div>
      )}

      {tab === 'posts' && (
        <div className="space-y-4">
          {authorPosts.length === 0 ? (
            <section className={cn(FEED_CARD, 'p-8 text-center font-bangla text-[14px] text-pine-900/60')}>
              এখনো কোনো কমিউনিটি পোস্ট নেই।
            </section>
          ) : (
            authorPosts.map((p) => (
              <CommunityPostCard
                key={p.id}
                post={p}
                currentUser={currentUser}
                onReact={(type) => onReact('post', p.id, type)}
                onOpenReactionsBreakdown={() => onOpenReactionsBreakdown('post', p.id)}
                onSave={() => onSavePost(p.id)}
                onComment={(t) => onCommentPost(p.id, t)}
                onReactComment={(cid, type) => onReact('comment', cid, type)}
                onShare={() => onShare(p.author.name)}
                onNavigateProfile={onNavigateProfile}
                onOpenPhoto={(imgs, idx, title, authorName, authorId) =>
                  onOpenPhoto(imgs, idx, title, undefined, authorName, authorId)
                }
              />
            ))
          )}
        </div>
      )}

      {tab === 'saved' && isOwnProfile && (
        <section className={cn(FEED_CARD, 'p-4')}>
          <SavedList
            articles={savedArticles}
            posts={savedPosts}
            onOpenArticle={onOpenArticlePopup}
            onRemoveArticle={onRemoveSavedArticle}
            onRemovePost={onRemoveSavedPost}
          />
        </section>
      )}

      {tab === 'orders' && isOwnProfile && (
        <section className={cn(FEED_CARD, 'space-y-3 p-4')}>
          <SectionLabel>Your bKash Orders to {BKASH_RECEIVER_NUMBER}</SectionLabel>
          {orders.length === 0 ? (
            <p className="py-6 text-center font-bangla text-[14px] text-pine-900/60">
              আপনার এখনো কোনো বিকাশ অর্ডার নেই।
            </p>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="rounded-xl border border-pine-900 bg-canvas p-3.5 shadow-tactile-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-[13px] font-bold text-pine-900">#{o.orderNumber}</span>
                  <span className="rounded-full bg-[#ffe0ed] px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#e2136e]">
                    bKash TrxID: {o.trxId} → {o.receiverBkash}
                  </span>
                </div>
                <p className="mt-1 font-bangla text-[13px] text-pine-900/80">
                  {o.deliveryAddress}, {o.district} · ৳{toBengaliNumerals(o.totalBdt)}
                </p>
              </div>
            ))
          )}
        </section>
      )}
    </div>
  );
}
