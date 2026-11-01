import { useMemo, useState } from 'react';
import {
  ArrowBigUp, ShoppingBag, Lightbulb, Plus, Bell, Settings, ExternalLink, MapPin, Globe2,
  UserPlus, Check, Camera, Palette, Sparkles, Calendar, Users,
} from 'lucide-react';
import type {
  Article, BkashOrder, CartItem, CommunityIdea, CommunityPost, LinkedInReactionType,
  NotificationItem, ReactionTargetType, StoreProduct, UpcomingEvent, UserProfile,
} from '../types';
import { CARD, FEED_CARD, SectionLabel, Avatar, VerifiedBadge, cn } from './Primitives';
import { PILLAR_DEFS } from './LeftSidebar';
import { TrendingList } from './RightSidebar';
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
        <h1 className="mt-1 font-display text-[28px] font-bold leading-tight tracking-[-0.01em] text-slate-900 sm:text-[36px]">
          {title}
        </h1>
        {sub && <p className="mt-1 font-sans text-sm text-slate-600">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function ExploreView({
  articles,
  pillar,
  onPillar,
  onOpenArticlePopup,
  onOpenPhoto,
}: {
  articles: Article[];
  currentUser: UserProfile | null;
  pillar: string | null;
  onPillar: (k: string | null) => void;
  onOpenArticlePopup: (id: string) => void;
  onNavigateProfile: (userId: string) => void;
  onOpenPhoto: (src: string, title?: string, authorName?: string, authorId?: string) => void;
}) {
  const list = useMemo(() => {
    if (!pillar) return articles;
    const def = PILLAR_DEFS.find((d) => d.key === pillar);
    if (!def) return articles;
    return articles.filter((a) => (def.cats as readonly string[]).includes(a.category));
  }, [articles, pillar]);

  return (
    <div className="flex flex-col gap-5">
      <ViewHeader
        kicker="বিষয়ভিত্তিক অন্বেষণ"
        title="এক্সপ্লোর ও অনুসন্ধান"
        sub="ছয়টি প্রধান বিষয়ে সাজানো চিন্তাশীল প্রবন্ধ, বিশ্লেষণ ও নিবন্ধের সংগ্রহশালা।"
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
                'rounded-xl border p-3.5 text-left transition-all',
                active
                  ? 'border-[#061621] bg-[#061621] text-white shadow-md'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 shadow-xs',
              )}
            >
              <div className="flex items-center justify-between">
                <Icon className={cn('size-5', active ? 'text-[#00ED64]' : 'text-slate-700')} />
                <span className={cn('font-mono text-[10px]', active ? 'text-white/60' : 'text-slate-400')}>
                  0{i + 1}
                </span>
              </div>
              <p className="mt-4 text-sm font-semibold leading-tight">{p.label}</p>
              <p className={cn('font-sans text-xs mt-0.5', active ? 'text-white/70' : 'text-slate-500')}>
                {p.bn} · {toBengaliNumerals(count)}
              </p>
            </button>
          );
        })}
      </div>

      <section className={cn(FEED_CARD, 'p-4 sm:p-5')}>
        <SectionLabel className="mb-3">
          {pillar ? 'ফিল্টার করা প্রবন্ধসমূহ' : 'সকল প্রতিবেদন'} · {toBengaliNumerals(list.length)}
        </SectionLabel>
        {list.length === 0 ? (
          <p className="py-8 text-center font-sans text-sm text-slate-500">
            এই বিষয়ে এখনো কোনো প্রতিবেদন প্রকাশিত হয়নি।
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
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
                    className="h-18 w-24 shrink-0 rounded-md [&_span]:hidden object-cover"
                  />
                  <span className="min-w-0">
                    <span className="font-sans text-xs font-semibold text-emerald-600">{a.category}</span>
                    <span className="line-clamp-2 font-sans text-sm font-semibold leading-snug text-slate-900 group-hover:text-emerald-700">
                      {a.title}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {a.author.name} · {a.readTimeMinutes} মিনিট পড়ার সময়
                    </span>
                  </span>
                </button>
                <a
                  href={`/article/${a.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono text-[10px] font-medium text-slate-700 hover:bg-slate-100"
                >
                  New Tab <ExternalLink className="inline size-3" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={cn(FEED_CARD, 'px-4 pb-2 pt-4 lg:hidden')}>
        <h3 className="font-sans text-base font-bold text-slate-900 mb-2">ট্রেন্ডিং প্রতিবেদন</h3>
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
  onNavigate,
  onOpenRegister,
}: {
  events: UpcomingEvent[];
  onNavigate: (path: string) => void;
  onOpenRegister: (ev: UpcomingEvent) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <ViewHeader
        kicker="ইভেন্ট ও সম্মেলন"
        title="আসন্ন ইভেন্ট ও সেমিনার"
        sub="আলোচনা সভা, কর্মশালা ও চিন্তাশীল সমাবেশ — বিস্তারিত দেখুন ও আসন নিশ্চিত করতে নিবন্ধন করুন।"
      />

      <section className={cn(FEED_CARD, 'p-4 sm:p-6')}>
        {events.length === 0 ? (
          <p className="py-12 text-center font-sans text-sm text-slate-500">
            বর্তমানে কোনো আসন্ন ইভেন্ট তালিকাভুক্ত নেই। নতুন ইভেন্টের ঘোষণা শীঘ্রই আসবে।
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {events.map((e) => (
              <div
                key={e.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs hover:border-[#00ED64] transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="flex flex-col items-center justify-center rounded-lg bg-[#061621] px-2.5 py-1.5 text-center text-white">
                        <span className="font-mono text-[9px] font-bold text-[#00ED64]">{e.dateMonth}</span>
                        <span className="font-display text-lg font-bold leading-tight">{e.dateDay}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                        <Calendar className="size-3" />
                        {e.dateMonth} {e.dateDay}, ২০২৬
                      </span>
                    </div>
                    {e.isRegistered && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                        <Check className="size-3" /> নিবন্ধিত
                      </span>
                    )}
                  </div>

                  <h3
                    onClick={() => onNavigate(`/events/${e.id}`)}
                    className="mt-3 font-sans text-base font-bold text-slate-900 cursor-pointer hover:text-emerald-700 hover:underline leading-snug"
                  >
                    {e.title}
                  </h3>

                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="size-3.5 shrink-0 text-slate-400" />
                    <span>{e.location}</span>
                  </p>

                  <p className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                    <Users className="size-3.5" />
                    <span>{e.attendeesCount} জন অংশ নিচ্ছেন</span>
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onOpenRegister(e)}
                    className={cn(
                      'inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-4 text-xs font-bold transition shadow-xs flex-1',
                      e.isRegistered
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-[#00ED64] text-[#061621] hover:bg-[#00d859]',
                    )}
                  >
                    {e.isRegistered ? 'টিকিট ও তথ্য দেখুন' : 'নিবন্ধন করুন'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate(`/events/${e.id}`)}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    বিস্তারিত বিবরণ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
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
        kicker="বই ও প্রকাশনা"
        title="প্লেইনসাইট প্রকাশনী ও স্টোর"
        sub="বিশেষ মুদ্রিত বই, জার্নাল, গবেষণাপত্র ও সংকলন — সহজ অর্ডারে ঘরে বসেই সংগ্রহ করুন।"
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenCheckout}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#00ED64] px-4 text-xs font-bold text-[#061621] hover:bg-[#00d859] shadow-xs transition"
            >
              <ShoppingBag className="size-4" />
              কার্ট ({toBengaliNumerals(totalCartQty)})
            </button>
          </div>
        }
      />

      {products.length === 0 ? (
        <section className={cn(FEED_CARD, 'p-8 text-center')}>
          <ShoppingBag className="mx-auto size-10 text-slate-300" />
          <h2 className="mt-3 font-sans text-lg font-bold text-slate-900">
            স্টোরে বর্তমানে কোনো পণ্য তালিকাভুক্ত নেই
          </h2>
          <p className="mx-auto mt-1 max-w-md font-sans text-xs text-slate-500">
            নতুন বই ও প্রকাশনা শীঘ্রই স্টোরে যুক্ত করা হবে।
          </p>
          {ordersCount > 0 && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={onOpenCheckout}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                পূর্ববর্তী অর্ডার রশিদ ({ordersCount})
              </button>
            </div>
          )}
        </section>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-3 sm:gap-4 sm:px-0 md:grid-cols-3">
          {products.map((s) => {
            const inCartQty = cart.find((c) => c.productId === s.id)?.quantity ?? 0;
            return (
              <div key={s.id} className={cn(CARD, 'flex flex-col overflow-hidden border border-slate-200')}>
                <div className="relative bg-slate-100">
                  {s.image ? (
                    <button
                      type="button"
                      onClick={() => onOpenPhoto(s.image, s.name, s.description, s.seller, s.sellerId)}
                      className="block w-full cursor-zoom-in"
                    >
                      <img src={s.image} alt={s.name} className="aspect-[4/3] w-full object-cover" />
                    </button>
                  ) : (
                    <div className="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-[#061621] to-slate-800 font-display text-lg font-bold text-white">
                      {s.name.slice(0, 10)}
                    </div>
                  )}
                  <span className="absolute left-2 top-2 rounded bg-white/90 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wide text-slate-800">
                    {s.tag}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <p className="font-sans text-sm font-semibold leading-snug text-slate-900">{s.name}</p>
                  {s.description && (
                    <p className="mt-1 line-clamp-2 font-sans text-xs text-slate-500">
                      {s.description}
                    </p>
                  )}
                  <div className="mt-auto flex items-end justify-between pt-3">
                    <p className="font-sans text-base font-bold text-slate-900">
                      ৳{toBengaliNumerals(s.price.toLocaleString('en-IN'))}
                    </p>
                    <button
                      type="button"
                      onClick={() => onAddToCart(s)}
                      className={cn(
                        'inline-flex h-7 items-center gap-1 rounded-md px-2.5 text-xs font-semibold transition shadow-xs',
                        inCartQty > 0
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#00ED64] text-[#061621] hover:bg-[#00d859]',
                      )}
                    >
                      <Plus className="size-3" />
                      {inCartQty > 0 ? `কার্টে (${inCartQty})` : 'যোগ করুন'}
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
  const [tag, setTag] = useState('সাধারণ');
  const sorted = [...ideas].sort((a, b) => b.votes - a.votes);

  return (
    <div className="flex flex-col gap-5">
      <ViewHeader
        kicker="কমিউনিটি আইডিয়া বোর্ড"
        title="ভাবনার খাতা"
        sub="নতুন আইডিয়া, গবেষণার প্রস্তাবনা বা বিষয়ের পরামর্শ দিন এবং সবার মতামত জানুন।"
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          onSubmitIdea(title.trim(), body.trim() || title.trim(), tag.trim() || 'সাধারণ');
          setTitle('');
          setBody('');
        }}
        className={cn(FEED_CARD, 'space-y-2.5 p-4')}
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="ml-1 size-5 shrink-0 text-amber-500" />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="আপনার আইডিয়ার শিরোনাম…"
            className="h-9 flex-1 bg-transparent font-sans text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
          />
          <input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="ট্যাগ"
            className="w-24 rounded-md border border-slate-200 bg-white px-2 py-1 font-sans text-xs text-slate-700"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="সংক্ষেপে বিস্তারিত পরিকল্পনা লিখুন…"
            className="h-9 flex-1 rounded-lg bg-slate-50 px-3 font-sans text-xs text-slate-800 outline-none placeholder:text-slate-400 border border-slate-200"
          />
          <button
            type="submit"
            disabled={!title.trim()}
            className="h-9 rounded-md bg-[#00ED64] px-4 text-xs font-bold text-[#061621] hover:bg-[#00d859] disabled:opacity-40 transition"
          >
            আইডিয়া প্রকাশ করুন
          </button>
        </div>
      </form>

      {sorted.length === 0 ? (
        <section className={cn(FEED_CARD, 'p-8 text-center font-sans text-sm text-slate-500')}>
          এখনো কোনো আইডিয়া জমা পড়েনি — আপনার আইডিয়াটি উপরে লিখে প্রথম জমা দিন।
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
                  'flex w-12 shrink-0 flex-col items-center rounded-lg border py-1.5 shadow-xs transition',
                  i.voted
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
                )}
              >
                <ArrowBigUp className={cn('size-5', i.voted && 'fill-current text-emerald-600')} />
                <span className="font-mono text-xs font-semibold">{i.votes}</span>
              </button>
              <div className="min-w-0">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">{i.tag}</span>
                <p className="font-sans text-base font-semibold leading-snug text-slate-900">{i.title}</p>
                <p className="mt-0.5 font-sans text-xs text-slate-600">{i.body}</p>
                <button
                  type="button"
                  onClick={() => onNavigateProfile(i.authorId)}
                  className="mt-1.5 text-[11px] font-semibold text-slate-500 hover:underline"
                >
                  লেখক: {i.author}
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
        <ViewHeader kicker="বিজ্ঞপ্তি ও আপডেট" title="নোটিফিকেশন" />
        <button
          type="button"
          onClick={onRead}
          className="mb-3 font-mono text-[10px] uppercase tracking-wider text-slate-500 hover:text-slate-900"
        >
          সব পড়া হয়েছে চিহ্নিত করুন
        </button>
      </div>
      {items.length === 0 ? (
        <section className={cn(FEED_CARD, 'p-8 text-center font-sans text-sm text-slate-500')}>
          কোনো নতুন নোটিফিকেশন নেই।
        </section>
      ) : (
        <ul className={cn(FEED_CARD, 'divide-y divide-slate-100')}>
          {items.map((n) => (
            <li key={n.id} className={cn('flex gap-3 px-4 py-3.5', n.unread && 'bg-emerald-50/50')}>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700">
                <Bell className="size-4" />
              </span>
              <span className="flex-1">
                <span className="block font-sans text-sm leading-snug text-slate-900">{n.title}</span>
                <span className="mt-0.5 block font-mono text-[10px] text-slate-400">
                  {n.source} · {n.time}
                </span>
              </span>
              {n.unread && <span className="mt-2 size-2 rounded-full bg-[#00ED64]" />}
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
        <UserPlus className="mx-auto size-10 text-slate-400" />
        <h1 className="mt-3 font-sans text-xl font-bold text-slate-900">
          আপনার প্রোফাইল সেট আপ করুন
        </h1>
        <p className="mx-auto mt-1 max-w-md font-sans text-xs text-slate-500">
          আপনার নাম, ছবি ও বিবরণ যুক্ত করে পাঠকদের সাথে যুক্ত হোন।
        </p>
        <button
          type="button"
          onClick={onOpenProfileSettings}
          className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#00ED64] px-4 text-xs font-bold text-[#061621] hover:bg-[#00d859]"
        >
          <Sparkles className="size-3.5" /> প্রোফাইল তৈরি করুন
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
              'linear-gradient(135deg, #061621 0%, #0d2b3e 55%, #00ED64 100%)',
          }}
          className="relative h-32 w-full sm:h-40"
        >
          {isOwnProfile && (
            <button
              type="button"
              onClick={onOpenProfileSettings}
              className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm hover:bg-black/60"
            >
              <Palette className="size-3" /> কভার পরিবর্তন
            </button>
          )}
        </div>

        <div className="-mt-12 px-4 pb-5 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
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
                title="প্রোফাইল ছবি"
              >
                <Avatar
                  src={profile.avatar}
                  name={profile.name}
                  size="size-20 sm:size-24"
                  online={isOwnProfile}
                  className="rounded-full border-4 border-white shadow-sm"
                />
              </button>
              {isOwnProfile && (
                <button
                  type="button"
                  onClick={onOpenProfileSettings}
                  aria-label="Change profile picture"
                  className="absolute bottom-1 right-1 flex size-7 items-center justify-center rounded-full bg-[#061621] text-white shadow hover:bg-slate-800"
                >
                  <Camera className="size-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {isOwnProfile ? (
                <>
                  <button
                    type="button"
                    onClick={onOpenProfileSettings}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    <Settings className="size-3.5" /> সেটিংস
                  </button>
                  <button
                    type="button"
                    onClick={onToggleDark}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-800 hover:bg-slate-50"
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
                    'inline-flex h-8 items-center gap-1.5 rounded-full px-4 text-xs font-bold transition shadow-xs',
                    isFollowing
                      ? 'bg-slate-100 text-slate-700'
                      : 'bg-[#00ED64] text-[#061621] hover:bg-[#00d859]',
                  )}
                >
                  {isFollowing ? (
                    <>
                      <Check className="size-3.5" /> ফলো করছেন
                    </>
                  ) : (
                    <>
                      <UserPlus className="size-3.5" /> ফলো করুন
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="mt-3">
            <h1 className="flex items-center gap-1.5 font-sans text-xl font-bold text-slate-900">
              {profile.name}
              {profile.isVerified && <VerifiedBadge />}
            </h1>
            {profile.nameBn && profile.nameBn !== profile.name && (
              <p className="font-sans text-sm font-medium text-slate-600">{profile.nameBn}</p>
            )}
            <p className="mt-0.5 font-sans text-xs text-slate-500">
              {profile.role} {profile.organization ? `· ${profile.organization}` : ''}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-3 font-mono text-[10.5px] text-slate-400">
              <span>@{profile.handle}</span>
              {profile.location && (
                <span className="flex items-center gap-1 font-sans">
                  <MapPin className="size-2.5" /> {profile.location}
                </span>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-emerald-600 hover:underline"
                >
                  <Globe2 className="size-2.5" /> Website ↗
                </a>
              )}
            </div>
            {profile.bio && (
              <p className="mt-2.5 font-sans text-sm leading-relaxed text-slate-700">
                {profile.bio}
              </p>
            )}
          </div>

          <dl className="mt-4 grid grid-cols-4 rounded-lg border border-slate-200 text-center">
            {[
              ['প্রতিবেদন', authorArticles.length],
              ['পোস্ট', authorPosts.length],
              ['অনুসারী', profile.followersCount + (isFollowing ? 1 : 0)],
              ['মোট প্রকাশনা', profile.publicationsCount + authorArticles.length],
            ].map(([k, v]) => (
              <div key={String(k)} className="border-r border-slate-200 py-2 last:border-0">
                <dd className="font-sans text-lg font-bold text-slate-900">
                  {toBengaliNumerals(Number(v))}
                </dd>
                <dt className="font-sans text-[10px] text-slate-400">{k}</dt>
              </div>
            ))}
          </dl>
        </div>

        {/* Profile Navigation Tabs */}
        <div className="flex border-t border-slate-200 px-4">
          {(
            [
              { key: 'articles', label: `প্রতিবেদন (${authorArticles.length})` },
              { key: 'posts', label: `পোস্ট (${authorPosts.length})` },
              ...(isOwnProfile
                ? [
                    { key: 'saved', label: `সংরক্ষিত (${savedArticles.length + savedPosts.length})` },
                    { key: 'orders', label: `অর্ডারসমূহ (${orders.length})` },
                  ]
                : []),
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key as typeof tab)}
              className={cn(
                'relative py-2.5 px-3 text-xs font-semibold transition',
                tab === t.key ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800',
              )}
            >
              {t.label}
              {tab === t.key && (
                <span className="absolute inset-x-2 bottom-0 h-[2.5px] rounded-t-full bg-[#00ED64]" />
              )}
            </button>
          ))}
        </div>
      </section>

      {tab === 'articles' && (
        <div className="space-y-4">
          {authorArticles.length === 0 ? (
            <section className={cn(FEED_CARD, 'p-8 text-center font-sans text-sm text-slate-500')}>
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
            <section className={cn(FEED_CARD, 'p-8 text-center font-sans text-sm text-slate-500')}>
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
          <SectionLabel>আপনার পূর্ববর্তী বিকাশ অর্ডারসমূহ</SectionLabel>
          {orders.length === 0 ? (
            <p className="py-6 text-center font-sans text-sm text-slate-500">
              আপনার এখনো কোনো বিকাশ অর্ডার নেই।
            </p>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900">#{o.orderNumber}</span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-mono text-[11px] font-bold text-emerald-700">
                    TrxID: {o.trxId}
                  </span>
                </div>
                <p className="mt-1 font-sans text-xs text-slate-700">
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
