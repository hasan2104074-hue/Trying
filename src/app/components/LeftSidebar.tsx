import { Newspaper, Clapperboard, Bookmark, Bot, Plane, Wheat, BookOpenText, CloudSun, Snowflake, Rocket, Settings } from 'lucide-react';
import type { Article, ResearchPaper, StoryReel, UserProfile } from '../types';
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

export const INSTITUTION_DEFS = [
  { code: 'BRRI' as const, name: 'ধান গবেষণা ইনস্টিটিউট' },
  { code: 'BAU' as const, name: 'কৃষি বিশ্ববিদ্যালয়' },
  { code: 'BARI' as const, name: 'কৃষি গবেষণা ইনস্টিটিউট' },
  { code: 'SAU' as const, name: 'শেরেবাংলা কৃষি বিশ্ববিদ্যালয়' },
];

interface Props {
  currentUser: UserProfile | null;
  articles: Article[];
  reels: StoryReel[];
  papers: ResearchPaper[];
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
    { label: 'নিউজফিড ও পোস্ট', icon: Newspaper, onClick: () => p.onNavigate('/'), badge: p.articles.length ? toBengaliNumerals(p.articles.length) : null, tone: 'bg-pine-100 text-pine-700' },
    { label: 'ভিডিও রিলস ও মাঠের দৃশ্য', icon: Clapperboard, onClick: p.onOpenReels, badge: p.reels.length ? toBengaliNumerals(p.reels.length) : null, tone: 'bg-[#fde3e3] text-[#b42318]' },
    { label: 'সংরক্ষিত তালিকা', icon: Bookmark, onClick: p.onOpenSaved, badge: p.savedCount ? toBengaliNumerals(p.savedCount) : null, tone: 'bg-[#efe4fb] text-[#6b3fa0]' },
    { label: 'Plainsyt AI কৃষি সহকারী', icon: Bot, onClick: p.onOpenAI, badge: '24/7', tone: 'bg-[#fdf0d2] text-[#8a5a00]' },
  ];

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-[80px] flex max-h-[calc(100vh-96px)] flex-col gap-5 overflow-y-auto no-scrollbar pb-6 pr-1">
        {p.currentUser ? (
          <div className="flex items-center gap-2 rounded-xl border border-canvas-border bg-canvas-card p-2">
            <button
              type="button"
              onClick={() => p.onNavigate(`/profile/${p.currentUser!.id}`)}
              className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
            >
              <Avatar src={p.currentUser.avatar} name={p.currentUser.name} size="size-10" online />
              <span className="min-w-0">
                <span className="block truncate text-[14.5px] font-semibold text-pine-900">
                  {p.currentUser.name}
                </span>
                <span className="block truncate font-mono text-[10.5px] text-pine-600">
                  {p.currentUser.role} {p.currentUser.organization ? `· ${p.currentUser.organization}` : ''}
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={p.onOpenProfileSettings}
              aria-label="Profile settings"
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-pine-900/60 hover:bg-canvas-subtle hover:text-pine-900"
            >
              <Settings className="size-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={p.onOpenProfileSettings}
            className="flex items-center justify-between rounded-xl border border-dashed border-pine-900 bg-canvas-card px-3 py-2.5 text-left shadow-tactile-xs hover:bg-pine-50"
          >
            <div>
              <span className="block text-[13.5px] font-semibold text-pine-900">Create Your Profile</span>
              <span className="block font-mono text-[10px] text-pine-600">Set PFP &amp; Cover Gradient</span>
            </div>
            <Settings className="size-4 text-pine-600" />
          </button>
        )}

        <nav className="-mt-2 flex flex-col">
          {shortcuts.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={s.onClick}
              className="group flex items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-canvas-subtle"
            >
              <span className={cn('flex size-9 items-center justify-center rounded-lg border border-pine-900/10', s.tone)}>
                <s.icon className="size-[18px]" />
              </span>
              <span className="flex-1 font-bangla text-[14.5px] font-medium text-pine-900">{s.label}</span>
              {s.badge && (
                <span className="rounded-full bg-pine-900 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-canvas">
                  {s.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="border-t border-canvas-border pt-4">
          <div className="mb-2 flex items-baseline justify-between px-2">
            <SectionLabel>OpenAlex · 6 Pillars</SectionLabel>
            {p.activePillar && (
              <button
                type="button"
                onClick={() => p.onPillar(null)}
                className="font-mono text-[10px] text-pine-600 underline"
              >
                clear
              </button>
            )}
          </div>
          <ul className="flex flex-col">
            {PILLAR_DEFS.map((pl, i) => {
              const Icon = pl.icon;
              const active = p.activePillar === pl.key;
              const count = p.articles.filter((a) => (pl.cats as readonly string[]).includes(a.category)).length;
              return (
                <li key={pl.key}>
                  <button
                    type="button"
                    onClick={() => {
                      p.onPillar(active ? null : pl.key);
                      p.onNavigate('/explore');
                    }}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition',
                      active ? 'bg-pine-900 text-canvas' : 'text-pine-900 hover:bg-canvas-subtle',
                    )}
                  >
                    <span className={cn('font-mono text-[10px]', active ? 'text-canvas/60' : 'text-pine-900/40')}>
                      0{i + 1}
                    </span>
                    <Icon className="size-4" />
                    <span className="flex-1 text-[13.5px] font-medium">{pl.label}</span>
                    <span className={cn('font-mono text-[10.5px]', active ? 'text-canvas/70' : 'text-pine-600')}>
                      {count}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="border-t border-canvas-border pt-4">
          <SectionLabel className="mb-2.5 px-2">Institutional Research Network</SectionLabel>
          <div className="grid grid-cols-2 gap-2 px-1">
            {INSTITUTION_DEFS.map((ins) => {
              const paperCount = p.papers.filter((r) => r.institutionCode === ins.code).length;
              return (
                <button
                  key={ins.code}
                  type="button"
                  onClick={() => p.onNavigate('/explore')}
                  className="rounded-lg border border-pine-900 bg-canvas-card p-2.5 text-left shadow-tactile-xs shadow-tactile-hover"
                >
                  <span className="font-display text-[17px] font-bold leading-none text-pine-900">{ins.code}</span>
                  <span className="mt-1 block truncate font-bangla text-[11px] text-pine-900/70">{ins.name}</span>
                  <span className="mt-1.5 block font-mono text-[10px] text-pine-600">
                    {paperCount} papers
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Footer compact />
      </div>
    </aside>
  );
}
