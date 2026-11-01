import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search, X, Sun, Moon, Bookmark, Bell, Home, Compass, CalendarDays, Store, Lightbulb,
  Clapperboard, Sparkles, FileText, ArrowUpRight, ShoppingBag,
} from 'lucide-react';
import type { Article, CommunityPost, NotificationItem, UserProfile } from '../types';
import { PlainsytLogo } from './PlainsytLogo';
import { Avatar, cn } from './Primitives';

export type View = 'home' | 'explore' | 'events' | 'store' | 'ideas' | 'notifications' | 'profile';

export const LAYOUT_GRID = 'lg:grid-cols-[13rem_minmax(0,1fr)_14rem] xl:grid-cols-[14rem_minmax(0,1fr)_15rem]';
export const FEED_WIDTH = 'mx-auto w-full max-w-[760px] flex-1';

const DESKTOP_TABS: { key: View; path: string; label: string; icon: typeof Home }[] = [
  { key: 'home', path: '/', label: 'হোম ফিড · Home', icon: Home },
  { key: 'explore', path: '/explore', label: 'এক্সপ্লোর · Explore', icon: Compass },
  { key: 'events', path: '/events', label: 'ইভেন্টস · Events', icon: CalendarDays },
  { key: 'store', path: '/store', label: 'কৃষি বাজার · Store', icon: Store },
  { key: 'ideas', path: '/ideas', label: 'আইডিয়া বোর্ড · Ideas', icon: Lightbulb },
];

interface Props {
  activeView: View;
  onNavigate: (path: string) => void;
  currentUser: UserProfile | null;
  dark: boolean;
  onToggleDark: () => void;
  savedCount: number;
  cartCount: number;
  reelsCount: number;
  onOpenCart: () => void;
  onOpenSaved: () => void;
  onOpenReels: () => void;
  onOpenAI: () => void;
  notifications: NotificationItem[];
  onReadNotifications: () => void;
  articles: Article[];
  posts: CommunityPost[];
  onOpenArticle: (id: string) => void;
  onNavigateProfile: (userId: string) => void;
}

export function Header(p: Props) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState('');
  const [bellOpen, setBellOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const unread = p.notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((s) => !s);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setBellOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 20);
  }, [searchOpen]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return { a: p.articles.slice(0, 5), c: [] as CommunityPost[] };
    return {
      a: p.articles.filter((x) =>
        (x.title + x.subtitle + x.categoryEn + x.author.name).toLowerCase().includes(term),
      ),
      c: p.posts.filter((x) => (x.content + x.author.name).toLowerCase().includes(term)).slice(0, 3),
    };
  }, [q, p.articles, p.posts]);

  const searchPanel = searchOpen && (
    <>
      <button
        type="button"
        aria-label="Close search"
        className="fixed inset-0 z-40 cursor-default"
        onClick={() => setSearchOpen(false)}
      />
      <div className="absolute left-2 right-2 top-[calc(100%+8px)] z-50 rounded-xl border border-[#061621] bg-canvas-card p-2 shadow-tactile-lg md:left-4 md:right-auto md:w-[420px]">
        <div className="flex items-center gap-2 rounded-lg bg-canvas-subtle px-3">
          <Search className="size-4 text-pine-600" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="আর্টিকেল, পোস্ট বা গবেষক খুঁজুন…"
            className="h-10 flex-1 bg-transparent text-[14px] text-pine-900 outline-none placeholder:text-pine-900/40"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ('')}
              aria-label="Clear search"
              className="flex size-6 items-center justify-center rounded-full bg-pine-900/10 text-pine-900 hover:bg-pine-900/20"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
        <p className="px-2 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-pine-600">
          {q ? 'Search Results' : 'Recent Articles'}
        </p>
        {results.a.length === 0 && results.c.length === 0 && (
          <p className="px-2 py-4 text-center font-bangla text-[13px] text-pine-900/60">
            {q ? `“${q}” — কোনো ফলাফল পাওয়া যায়নি` : 'কোনো ফলাফল নেই'}
          </p>
        )}
        {results.a.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => {
              p.onOpenArticle(a.id);
              setSearchOpen(false);
            }}
            className="flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-pine-50"
          >
            <FileText className="mt-0.5 size-4 shrink-0 text-pine-600" />
            <span className="min-w-0">
              <span className="line-clamp-1 font-bangla text-[13.5px] font-semibold text-pine-900">
                {a.title}
              </span>
              <span className="font-mono text-[10.5px] text-pine-600">
                {a.categoryEn} · {a.readTimeMinutes} min
              </span>
            </span>
          </button>
        ))}
        {results.c.length > 0 && (
          <>
            <p className="px-2 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-pine-600">
              Community Posts
            </p>
            {results.c.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  p.onNavigateProfile(c.authorId);
                  setSearchOpen(false);
                }}
                className="flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-pine-50"
              >
                <Avatar src={c.author.avatar} name={c.author.name} size="size-6" />
                <span className="line-clamp-2 text-[13px] text-pine-900/80">
                  <b className="font-semibold text-pine-900">{c.author.name}</b> — {c.content}
                </span>
              </button>
            ))}
          </>
        )}
      </div>
    </>
  );

  const bellPanel = bellOpen && (
    <>
      <button
        type="button"
        aria-label="Close notifications"
        className="fixed inset-0 z-40 cursor-default"
        onClick={() => setBellOpen(false)}
      />
      <div className="absolute right-2 top-[calc(100%+8px)] z-50 w-[calc(100vw-1rem)] max-w-[340px] rounded-xl border border-[#061621] bg-canvas-card shadow-tactile-lg">
        <div className="flex items-center justify-between border-b border-canvas-border px-4 py-3">
          <p className="font-display text-[17px] font-bold text-pine-900">Notifications</p>
          <button
            type="button"
            onClick={p.onReadNotifications}
            className="font-mono text-[10px] uppercase tracking-wider text-pine-600 hover:text-pine-900"
          >
            সব পড়া হয়েছে
          </button>
        </div>
        {p.notifications.length === 0 ? (
          <p className="px-4 py-6 text-center font-bangla text-[13px] text-pine-900/55">
            কোনো নতুন নোটিফিকেশন নেই।
          </p>
        ) : (
          <ul className="p-1.5 max-h-[70vh] overflow-y-auto">
            {p.notifications.map((n) => (
              <li key={n.id} className="flex gap-3 rounded-lg px-2.5 py-2.5 hover:bg-pine-50 transition-colors">
                <span
                  className={cn(
                    'mt-1.5 size-2 shrink-0 rounded-full',
                    n.unread ? 'bg-[#00ED64] ring-2 ring-[#00ED64]/30' : 'bg-transparent',
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-bangla text-[13px] leading-snug text-pine-900 font-medium">
                    {n.title}
                  </span>
                  <span className="mt-0.5 block font-mono text-[10px] text-pine-600">
                    {n.source} · {n.time}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );

  const iconBtn =
    'relative flex size-9 sm:size-10 items-center justify-center rounded-xl bg-[#061621]/10 text-[#061621] transition hover:bg-[#061621]/20 active:scale-90';

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#061621]/15 bg-[#00ED64] text-[#061621] shadow-xs backdrop-blur-sm">
        <div className="mx-auto flex h-13 max-w-[1440px] items-center justify-between gap-3 px-3 md:h-16 md:px-6">
          {/* Left: Brand Logo (Desktop: Bangla logo NO background; Mobile: Green BD icon) */}
          <div className="flex items-center gap-3">
            <PlainsytLogo onNavigateHome={() => p.onNavigate('/')} />
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search (⌘K)"
              className="hidden items-center gap-2 rounded-xl bg-[#061621]/10 px-3 py-1.5 text-[13px] font-semibold text-[#061621] transition hover:bg-[#061621]/20 lg:inline-flex"
            >
              <Search className="size-4" />
              <span className="font-mono text-[11px] opacity-80">Search (⌘K)</span>
            </button>
          </div>

          {/* Center: Desktop Navigation Tabs (NO text labels, hovering shows tooltip!) */}
          <nav className="hidden h-full md:flex items-center" aria-label="Primary Navigation">
            <ul className="flex h-full items-center gap-1.5 lg:gap-2">
              {DESKTOP_TABS.map((t) => {
                const active = p.activeView === t.key;
                const isHovered = hoveredTab === t.key;
                return (
                  <li key={t.key} className="relative h-full flex items-center">
                    <button
                      type="button"
                      onClick={() => p.onNavigate(t.path)}
                      onMouseEnter={() => setHoveredTab(t.key)}
                      onMouseLeave={() => setHoveredTab(null)}
                      aria-current={active ? 'page' : undefined}
                      aria-label={t.label}
                      className={cn(
                        'group relative flex size-10 lg:size-11 items-center justify-center rounded-xl transition duration-150',
                        active
                          ? 'bg-[#061621] text-[#00ED64] shadow-md scale-105'
                          : 'text-[#061621] hover:bg-[#061621]/15 hover:scale-105 active:scale-95',
                      )}
                    >
                      <t.icon className="size-[19px] lg:size-5" strokeWidth={active ? 2.5 : 2} />
                    </button>

                    {/* Hover Floating Tooltip */}
                    {isHovered && (
                      <div className="pointer-events-none absolute left-1/2 top-[calc(100%+6px)] -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#061621] px-2.5 py-1 font-bangla text-[12px] font-medium text-white shadow-xl animate-in fade-in zoom-in-95 duration-150 z-50">
                        {t.label}
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-[#061621]" />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="flex size-9 items-center justify-center rounded-xl bg-[#061621]/10 text-[#061621] hover:bg-[#061621]/20 active:scale-90 lg:hidden"
            >
              <Search className="size-[18px]" />
            </button>
            <button
              type="button"
              onClick={p.onOpenAI}
              aria-label="Ask AI Assistant"
              title="Plainsyt AI সহকারী"
              className={iconBtn}
            >
              <Sparkles className="size-[18px]" />
            </button>
            <button
              type="button"
              onClick={p.onOpenCart}
              aria-label="Cart Drawer"
              title="Shopping Cart & Checkout"
              className={iconBtn}
            >
              <ShoppingBag className="size-[18px]" />
              {p.cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#061621] px-1 font-mono text-[10px] font-bold text-[#00ED64] ring-2 ring-[#00ED64]">
                  {p.cartCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={p.onToggleDark}
              aria-label="Toggle theme"
              className={cn(iconBtn, 'hidden sm:flex')}
            >
              {p.dark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
            </button>
            <button
              type="button"
              onClick={p.onOpenSaved}
              aria-label="Saved articles"
              title="সংরক্ষিত তালিকা"
              className={cn(iconBtn, 'hidden sm:flex')}
            >
              <Bookmark className="size-[18px]" />
              {p.savedCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#061621] px-1 font-mono text-[10px] font-bold text-[#00ED64] ring-2 ring-[#00ED64]">
                  {p.savedCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setBellOpen((b) => !b)}
              aria-label="Notifications"
              className={iconBtn}
            >
              <Bell className="size-[18px]" />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 flex size-[18px] items-center justify-center rounded-full bg-[#e41e3f] font-mono text-[10px] font-bold text-white ring-2 ring-[#00ED64]">
                  {unread}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() =>
                p.currentUser
                  ? p.onNavigate(`/profile/${p.currentUser.id}`)
                  : p.onNavigate('/profile')
              }
              aria-label="Profile"
              className="flex items-center rounded-full ring-2 ring-[#061621]/20 transition hover:ring-[#061621] active:scale-90"
            >
              <Avatar
                src={p.currentUser?.avatar || 'PS'}
                name={p.currentUser?.name || 'Profile'}
                size="size-8 sm:size-9"
                online
              />
            </button>
          </div>

          {searchPanel}
          {bellPanel}
        </div>
      </header>

      {/* Mobile Fixed Bottom Ergonomic Navigation Bar */}
      <nav
        className="fixed bottom-0 inset-x-0 z-50 border-t border-[#061621]/15 bg-[#00ED64]/95 backdrop-blur-md shadow-[0_-4px_24px_rgba(0,0,0,0.08)] md:hidden pb-[max(0.4rem,env(safe-area-inset-bottom))]"
        aria-label="Mobile Bottom Navigation"
      >
        <ul className="grid grid-cols-6 h-13 items-center px-1">
          {(
            [
              { key: 'home', path: '/', label: 'হোম', icon: Home },
              { key: 'explore', path: '/explore', label: 'এক্সপ্লোর', icon: Compass },
              {
                key: 'reels',
                path: '#reels',
                label: 'রিলস',
                icon: Clapperboard,
                badge: p.reelsCount ? String(p.reelsCount) : '',
              },
              { key: 'events', path: '/events', label: 'ইভেন্ট', icon: CalendarDays },
              {
                key: 'notifications',
                path: '/notifications',
                label: 'বিজ্ঞপ্তি',
                icon: Bell,
                badge: unread ? String(unread) : '',
              },
              { key: 'profile', path: '/profile', label: 'প্রোফাইল', icon: null },
            ] as const
          ).map((t) => {
            const active = t.key !== 'reels' && p.activeView === t.key;
            return (
              <li key={t.key} className="flex justify-center">
                <button
                  type="button"
                  aria-label={t.label}
                  onClick={() => (t.key === 'reels' ? p.onOpenReels() : p.onNavigate(t.path))}
                  className={cn(
                    'relative flex size-10 items-center justify-center rounded-xl transition duration-150 active:scale-85',
                    active ? 'bg-[#061621] text-[#00ED64] shadow-md' : 'text-[#061621] hover:bg-[#061621]/10',
                  )}
                >
                  <span className="relative flex items-center justify-center">
                    {t.icon ? (
                      <t.icon className="size-5" strokeWidth={active ? 2.5 : 2} />
                    ) : (
                      <Avatar
                        src={p.currentUser?.avatar || 'PS'}
                        name={p.currentUser?.name || ''}
                        size="size-6"
                        online
                        ring={active}
                      />
                    )}
                    {'badge' in t && t.badge && (
                      <span className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e41e3f] px-1 font-mono text-[9px] font-bold text-white shadow-xs">
                        {t.badge}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

export function SeeAllLink({ children, onClick }: { children: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-0.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-pine-600 hover:text-pine-900"
    >
      {children} <ArrowUpRight className="size-3" />
    </button>
  );
}
