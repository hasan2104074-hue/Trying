import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search, X, Sun, Moon, Bookmark, Bell, Home, Compass, CalendarDays, Store, Lightbulb,
  Clapperboard, Sparkles, FileText, ArrowUpRight, Database, ShoppingBag,
} from 'lucide-react';
import type { Article, CommunityPost, NotificationItem, UserProfile } from '../types';
import type { SupabaseConnectionStatus } from '../lib/db';
import { PlainsytLogo } from './PlainsytLogo';
import { Avatar, cn } from './Primitives';

export type View = 'home' | 'explore' | 'events' | 'store' | 'ideas' | 'notifications' | 'profile';

export const LAYOUT_GRID = 'lg:grid-cols-[15rem_minmax(0,1fr)_15rem] xl:grid-cols-[18rem_minmax(0,1fr)_20rem]';
export const FEED_WIDTH = 'mx-auto w-full max-w-[620px] lg:max-w-[640px] xl:max-w-[660px]';

const DESKTOP_TABS: { key: View; path: string; label: string; icon: typeof Home }[] = [
  { key: 'home', path: '/', label: 'Home', icon: Home },
  { key: 'explore', path: '/explore', label: 'Explore', icon: Compass },
  { key: 'events', path: '/events', label: 'Events', icon: CalendarDays },
  { key: 'store', path: '/store', label: 'Store', icon: Store },
  { key: 'ideas', path: '/ideas', label: 'Ideas', icon: Lightbulb },
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
  supabaseStatus: SupabaseConnectionStatus;
  onOpenSupabaseConsole: () => void;
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
      <div className="absolute left-2 right-2 top-[calc(100%+8px)] z-50 rounded-xl border border-pine-900 bg-canvas-card p-2 shadow-tactile-lg md:left-4 md:right-auto md:w-[390px]">
        <div className="flex items-center gap-2 rounded-lg bg-canvas-subtle px-3">
          <Search className="size-4 text-pine-600" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ধান, ড্রোন, বায়োচার, BRRI…"
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
          {q ? 'Supabase Search Results' : 'Recent Supabase Articles'}
        </p>
        {results.a.length === 0 && results.c.length === 0 && (
          <p className="px-2 py-4 text-center font-bangla text-[13px] text-pine-900/60">
            {q ? `“${q}” — কোনো ফলাফল পাওয়া যায়নি` : 'এখনো কোনো প্রতিবেদন যোগ করা হয়নি'}
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
              Community
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
      <div className="absolute right-2 top-[calc(100%+8px)] z-50 w-[340px] rounded-xl border border-pine-900 bg-canvas-card shadow-tactile-lg">
        <div className="flex items-center justify-between border-b border-canvas-border px-4 py-3">
          <p className="font-display text-[18px] font-semibold text-pine-900">Notifications</p>
          <button
            type="button"
            onClick={p.onReadNotifications}
            className="font-mono text-[10.5px] uppercase tracking-wider text-pine-600 hover:text-pine-900"
          >
            Mark all read
          </button>
        </div>
        {p.notifications.length === 0 ? (
          <p className="px-4 py-6 text-center font-bangla text-[13px] text-pine-900/55">
            কোনো নতুন নোটিফিকেশন নেই।
          </p>
        ) : (
          <ul className="p-1.5">
            {p.notifications.map((n) => (
              <li key={n.id} className="flex gap-3 rounded-lg px-2.5 py-2.5 hover:bg-pine-50">
                <span
                  className={cn(
                    'mt-1.5 size-2 shrink-0 rounded-full',
                    n.unread ? 'bg-pine-500' : 'bg-transparent',
                  )}
                />
                <span>
                  <span className="block font-bangla text-[13.5px] leading-snug text-pine-900">
                    {n.title}
                  </span>
                  <span className="mt-0.5 block font-mono text-[10.5px] text-pine-600">
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
    'relative flex size-10 items-center justify-center rounded-full border border-pine-900 bg-canvas-card text-pine-900 shadow-tactile-xs shadow-tactile-hover';

  return (
    <header className="sticky top-0 z-50 border-b border-pine-900 bg-canvas">
      <div
        className={cn(
          'relative mx-auto grid h-14 max-w-[1440px] grid-cols-[1fr_auto] items-center gap-4 px-3 md:h-16 md:grid-cols-[1fr_minmax(0,560px)_1fr] md:px-4',
          LAYOUT_GRID,
        )}
      >
        <div className="flex items-center gap-2.5">
          <PlainsytLogo showBothWordmarks onNavigateHome={() => p.onNavigate('/')} />
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search (⌘K)"
            className="hidden rounded-full border border-pine-900/20 bg-canvas-subtle p-2.5 text-pine-900 transition hover:border-pine-900 md:inline-flex"
          >
            <Search className="size-4" />
          </button>
          <button
            type="button"
            onClick={p.onOpenSupabaseConsole}
            title="Supabase Database Connection & SQL Schema"
            className={cn(
              'hidden items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold xl:inline-flex',
              p.supabaseStatus === 'connected'
                ? 'border-pine-600 bg-pine-50 text-pine-800'
                : 'border-[#d97706] bg-[#fffbeb] text-[#92400e]',
            )}
          >
            <Database className="size-3" />
            {p.supabaseStatus === 'connected' ? 'Supabase Live' : 'Supabase SQL'}
          </button>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="hidden h-full md:block" aria-label="Primary">
          <ul className={cn('flex h-full', FEED_WIDTH)}>
            {DESKTOP_TABS.map((t) => {
              const active = p.activeView === t.key;
              return (
                <li key={t.key} className="h-full flex-1">
                  <button
                    type="button"
                    onClick={() => p.onNavigate(t.path)}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group relative flex h-full w-full items-center justify-center gap-2 text-[14px] font-semibold transition',
                      active ? 'text-pine-700' : 'text-pine-900/60 hover:text-pine-900',
                    )}
                  >
                    <span
                      className={cn(
                        'flex items-center gap-2 rounded-lg px-3 py-2 transition',
                        !active && 'group-hover:bg-canvas-subtle',
                      )}
                    >
                      <t.icon className="size-[18px]" strokeWidth={active ? 2.4 : 2} />
                      <span className="hidden lg:inline">{t.label}</span>
                    </span>
                    {active && (
                      <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-pine-700" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={p.onOpenSupabaseConsole}
            aria-label="Supabase Console"
            className="flex size-9 items-center justify-center rounded-full bg-canvas-subtle text-pine-900 xl:hidden"
          >
            <Database className="size-[17px]" />
          </button>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="flex size-9 items-center justify-center rounded-full bg-canvas-subtle text-pine-900 md:hidden"
          >
            <Search className="size-[18px]" />
          </button>
          <button
            type="button"
            onClick={p.onOpenAI}
            aria-label="Ask AI"
            className="flex size-9 items-center justify-center rounded-full bg-canvas-subtle text-pine-900 md:hidden"
          >
            <Sparkles className="size-[18px]" />
          </button>
          <button
            type="button"
            onClick={p.onOpenCart}
            aria-label="Store Cart & bKash Checkout"
            className={cn(iconBtn, 'size-9 md:size-10')}
          >
            <ShoppingBag className="size-[18px]" />
            {p.cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border border-canvas bg-[#e2136e] px-1 font-mono text-[10px] font-semibold text-white">
                {p.cartCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={p.onToggleDark}
            aria-label="Toggle theme"
            className={cn(iconBtn, 'hidden md:flex')}
          >
            {p.dark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
          </button>
          <button
            type="button"
            onClick={p.onOpenSaved}
            aria-label="Saved"
            className={cn(iconBtn, 'size-9 md:size-10')}
          >
            <Bookmark className="size-[18px]" />
            {p.savedCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border border-canvas bg-pine-600 px-1 font-mono text-[10px] font-semibold text-canvas">
                {p.savedCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setBellOpen((b) => !b)}
            aria-label="Notifications"
            className={cn(iconBtn, 'hidden md:flex')}
          >
            <Bell className="size-[18px]" />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex size-[18px] items-center justify-center rounded-full border border-canvas bg-[#e41e3f] font-mono text-[10px] font-semibold text-white">
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
            className="hidden md:block"
          >
            <Avatar
              src={p.currentUser?.avatar || 'PS'}
              name={p.currentUser?.name || 'Profile'}
              size="size-10"
              online
            />
          </button>
        </div>
        {searchPanel}
        {bellPanel}
      </div>

      {/* Mobile Icon Nav Bar */}
      <nav className="border-t border-canvas-border md:hidden" aria-label="Mobile">
        <ul className="grid grid-cols-6">
          {(
            [
              { key: 'home', path: '/', label: 'Home', icon: Home },
              { key: 'explore', path: '/explore', label: 'Explore', icon: Compass },
              {
                key: 'reels',
                path: '#reels',
                label: 'Reels',
                icon: Clapperboard,
                badge: p.reelsCount ? String(p.reelsCount) : '',
              },
              { key: 'events', path: '/events', label: 'Events', icon: CalendarDays },
              {
                key: 'notifications',
                path: '/notifications',
                label: 'Notifications',
                icon: Bell,
                badge: unread ? String(unread) : '',
              },
              { key: 'profile', path: '/profile', label: 'Profile', icon: null },
            ] as const
          ).map((t) => {
            const active = t.key !== 'reels' && p.activeView === t.key;
            return (
              <li key={t.key}>
                <button
                  type="button"
                  aria-label={t.label}
                  onClick={() => (t.key === 'reels' ? p.onOpenReels() : p.onNavigate(t.path))}
                  className={cn(
                    'relative flex h-12 w-full items-center justify-center',
                    active ? 'text-pine-700' : 'text-pine-900/55',
                  )}
                >
                  <span className="relative">
                    {t.icon ? (
                      <t.icon className="size-[23px]" strokeWidth={active ? 2.4 : 1.9} />
                    ) : (
                      <Avatar
                        src={p.currentUser?.avatar || 'PS'}
                        name={p.currentUser?.name || ''}
                        size="size-7"
                        online
                        ring={active}
                      />
                    )}
                    {'badge' in t && t.badge && (
                      <span className="absolute -right-3 -top-1.5 rounded-full border-2 border-canvas bg-[#e41e3f] px-1 font-mono text-[9.5px] font-bold leading-[14px] text-white">
                        {t.badge}
                      </span>
                    )}
                  </span>
                  {active && (
                    <span className="absolute inset-x-2 bottom-0 h-[3px] rounded-t-full bg-pine-600" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
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
