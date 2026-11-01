import React from 'react';
import { Newspaper, Clapperboard, Bookmark, Bot, Settings, Compass, Sparkles, Plane, Wheat, BookOpenText, CloudSun, Snowflake, Rocket } from 'lucide-react';
import type { Article, StoryReel, UserProfile } from '../types';
import { Avatar, SectionLabel, cn } from './Primitives';
import { toBengaliNumerals } from '../utils/pureLogic';
import { Footer } from './Footer';

export const PILLAR_DEFS = [
  { key: 'drone', label: 'Agri-Tech & Drones', bn: 'এগ্রি-টেক ও ড্রোন', cats: ['এগ্রি-টেক ও ড্রোন'], icon: Plane },
  { key: 'crops', label: 'Crops & Agronomy', bn: 'শস্য ও কৃষিবিজ্ঞান', cats: ['শস্য ও কৃষিবিজ্ঞান'], icon: Wheat },
  { key: 'research', label: 'Research Explained', bn: 'গবেষণা সহজ ভাষায়', cats: ['গবেষণা সহজ ভাষায়'], icon: BookOpenText },
  { key: 'climate', label: 'Climate & Salinity', bn: 'জলবায়ু ও স্থায়িত্ব', cats: ['জলবায়ু ও স্থায়িত্ব', 'মৎস্য ও প্রাণিসম্পদ'], icon: CloudSun },
  { key: 'cold', label: 'Food Cold Chain', bn: 'খাদ্য ও কোল্ড চেইন', cats: ['খাদ্য ও কোল্ড চেইন'], icon: Snowflake },
  { key: 'startup', label: 'Startups & IoT', bn: 'স্টার্টআপ ও উদ্ভাবন', cats: ['স্টার্টআপ ও উদ্ভাবন'], icon: Rocket },
] as const;

interface Props {
  currentUser: UserProfile | null;
  articles: Article[];
  reels: StoryReel[];
  savedCount: number;
  onOpenSaved: () => void;
  onOpenReels: () => void;
  onOpenAI: () => void;
  onOpenProfileSettings: () => void;
  onNavigate: (path: string) => void;
  activePillar: string | null;
  onPillar: (k: string | null) => void;
}

export function LeftSidebar(p: Props) {
  const shortcuts = [
    {
      label: 'নিউজফিড',
      icon: Newspaper,
      onClick: () => p.onNavigate('/'),
      badge: p.articles.length ? toBengaliNumerals(p.articles.length) : null,
      tone: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'এক্সপ্লোর',
      icon: Compass,
      onClick: () => p.onNavigate('/explore'),
      badge: null,
      tone: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'ভিডিও রিলস',
      icon: Clapperboard,
      onClick: p.onOpenReels,
      badge: p.reels.length ? toBengaliNumerals(p.reels.length) : null,
      tone: 'bg-rose-50 text-rose-700',
    },
    {
      label: 'সংরক্ষিত পোস্ট',
      icon: Bookmark,
      onClick: p.onOpenSaved,
      badge: p.savedCount ? toBengaliNumerals(p.savedCount) : null,
      tone: 'bg-purple-50 text-purple-700',
    },
    {
      label: 'AI সহকারী',
      icon: Bot,
      onClick: p.onOpenAI,
      badge: '24/7',
      tone: 'bg-amber-50 text-amber-700',
    },
  ];

  return (
    <aside className="hidden lg:block w-52 shrink-0">
      <div className="sticky top-[76px] flex max-h-[calc(100vh-90px)] flex-col gap-3.5 overflow-y-auto no-scrollbar pb-6 pr-1">
        {p.currentUser ? (
          <div className="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white p-2 shadow-sm">
            <button
              type="button"
              onClick={() => p.onNavigate(`/profile/${p.currentUser!.id}`)}
              className="flex min-w-0 flex-1 items-center gap-2 text-left"
            >
              <Avatar src={p.currentUser.avatar} name={p.currentUser.name} size="size-8" online />
              <span className="min-w-0">
                <span className="block truncate text-xs font-semibold text-slate-900">
                  {p.currentUser.name}
                </span>
                <span className="block truncate font-mono text-[10px] text-slate-500">
                  {p.currentUser.role || 'লেখক'}
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={p.onOpenProfileSettings}
              aria-label="Profile settings"
              className="flex size-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <Settings className="size-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={p.onOpenProfileSettings}
            className="flex items-center justify-between rounded-xl border border-dashed border-slate-300 bg-white px-2.5 py-2 text-left shadow-sm hover:border-[#00ED64] transition"
          >
            <div>
              <span className="block text-xs font-semibold text-slate-800">প্রোফাইল সাজান</span>
              <span className="block text-[10px] text-slate-500">ছবি ও বিবরণ যোগ করুন</span>
            </div>
            <Settings className="size-3.5 text-slate-400" />
          </button>
        )}

        <nav className="flex flex-col gap-0.5">
          {shortcuts.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={s.onClick}
              className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition hover:bg-slate-100/80"
            >
              <span className={cn('flex size-7 items-center justify-center rounded-md border border-slate-200/60', s.tone)}>
                <s.icon className="size-3.5" />
              </span>
              <span className="flex-1 text-xs font-medium text-slate-800 group-hover:text-slate-950 font-sans">
                {s.label}
              </span>
              {s.badge && (
                <span className="rounded-full bg-slate-900 px-1.5 py-0.2 font-mono text-[9px] font-semibold text-white">
                  {s.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Quick Topics */}
        <div className="border-t border-slate-200/80 pt-3">
          <SectionLabel className="mb-2 px-1 text-[10px]">জনপ্রিয় বিষয়সমূহ</SectionLabel>
          <div className="flex flex-col gap-1">
            {[
              { name: 'বিজ্ঞান ও প্রযুক্তি', cat: 'টেকনোলজি' },
              { name: 'কৃষি ও খাদ্য নিরাপত্তা', cat: 'কৃষি' },
              { name: 'পরিবেশ ও জলবায়ু', cat: 'পরিবেশ' },
              { name: 'অর্থনীতি ও ব্যবসা', cat: 'অর্থনীতি' },
              { name: 'সাহিত্য ও শিল্প', cat: 'সংস্কৃতি' },
            ].map((topic) => (
              <button
                key={topic.name}
                type="button"
                onClick={() => p.onNavigate('/explore')}
                className="flex items-center justify-between rounded-lg px-2 py-1 text-left text-xs text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 transition"
              >
                <span className="truncate">{topic.name}</span>
                <Sparkles className="size-2.5 text-slate-400" />
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Footer compact />
        </div>
      </div>
    </aside>
  );
}
