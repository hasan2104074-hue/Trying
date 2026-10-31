import { Newspaper, Clapperboard, Bookmark, Bot, Plane, Wheat, BookOpenText, CloudSun, Snowflake, Rocket, ShieldCheck, ChevronRight } from 'lucide-react';
import { CURRENT_USER, PILLARS, INSTITUTIONS } from '../data/mockData';
import { Avatar, SectionLabel, cn } from './Primitives';
import { toBengaliNumerals } from '../utils/pureLogic';
import { Footer } from './Footer';
import type { View } from './Header';

const PILLAR_ICONS = { drone: Plane, crops: Wheat, research: BookOpenText, climate: CloudSun, cold: Snowflake, startup: Rocket } as const;

interface Props {
  savedCount: number;
  onOpenSaved: () => void;
  onOpenReels: () => void;
  onOpenAI: () => void;
  onView: (v: View) => void;
  activePillar: string | null;
  onPillar: (k: string | null) => void;
}

export function LeftSidebar(p: Props) {
  const shortcuts = [
    { label: 'নিউজফিড ও পোস্ট', icon: Newspaper, onClick: () => p.onView('home'), badge: null as string | null, tone: 'bg-pine-100 text-pine-700' },
    { label: 'ভিডিও রিলস ও মাঠের দৃশ্য', icon: Clapperboard, onClick: p.onOpenReels, badge: '15+', tone: 'bg-[#fde3e3] text-[#b42318]' },
    { label: 'সংরক্ষিত তালিকা', icon: Bookmark, onClick: p.onOpenSaved, badge: p.savedCount ? toBengaliNumerals(p.savedCount) : null, tone: 'bg-[#efe4fb] text-[#6b3fa0]' },
    { label: 'Plainsyt AI কৃষি সহকারী', icon: Bot, onClick: p.onOpenAI, badge: '24/7', tone: 'bg-[#fdf0d2] text-[#8a5a00]' },
  ];
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-[80px] flex max-h-[calc(100vh-96px)] flex-col gap-5 overflow-y-auto no-scrollbar pb-6 pr-1">
        <button onClick={() => p.onView('profile')} className="flex items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-canvas-subtle">
          <Avatar src={CURRENT_USER.avatar} name={CURRENT_USER.name} size="size-10" online />
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-semibold text-pine-900">{CURRENT_USER.name}</span>
            <span className="block truncate font-mono text-[10.5px] text-pine-600">{CURRENT_USER.role}</span>
          </span>
        </button>

        <nav className="-mt-2 flex flex-col">
          {shortcuts.map((s) => (
            <button key={s.label} onClick={s.onClick} className="group flex items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-canvas-subtle">
              <span className={cn('flex size-9 items-center justify-center rounded-lg border border-pine-900/10', s.tone)}>
                <s.icon className="size-[18px]" />
              </span>
              <span className="flex-1 font-bangla text-[14.5px] font-medium text-pine-900">{s.label}</span>
              {s.badge && <span className="rounded-full bg-pine-900 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-canvas">{s.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="border-t border-canvas-border pt-4">
          <div className="mb-2 flex items-baseline justify-between px-2">
            <SectionLabel>OpenAlex · 6 Pillars</SectionLabel>
            {p.activePillar && <button onClick={() => p.onPillar(null)} className="font-mono text-[10px] text-pine-600 underline">clear</button>}
          </div>
          <ul className="flex flex-col">
            {PILLARS.map((pl, i) => {
              const Icon = PILLAR_ICONS[pl.key];
              const active = p.activePillar === pl.key;
              return (
                <li key={pl.key}>
                  <button
                    onClick={() => { p.onPillar(active ? null : pl.key); p.onView('explore'); }}
                    className={cn('flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition', active ? 'bg-pine-900 text-canvas' : 'text-pine-900 hover:bg-canvas-subtle')}
                  >
                    <span className={cn('font-mono text-[10px]', active ? 'text-canvas/60' : 'text-pine-900/40')}>0{i + 1}</span>
                    <Icon className="size-4" />
                    <span className="flex-1 text-[13.5px] font-medium">{pl.label}</span>
                    <span className={cn('font-mono text-[10.5px]', active ? 'text-canvas/70' : 'text-pine-600')}>{pl.count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="border-t border-canvas-border pt-4">
          <SectionLabel className="mb-2.5 px-2">Institutional Research Network</SectionLabel>
          <div className="grid grid-cols-2 gap-2 px-1">
            {INSTITUTIONS.map((ins) => (
              <button key={ins.code} onClick={() => p.onView('explore')} className="rounded-lg border border-pine-900 bg-canvas-card p-2.5 text-left shadow-tactile-xs shadow-tactile-hover">
                <span className="font-display text-[17px] font-bold leading-none text-pine-900">{ins.code}</span>
                <span className="mt-1 block truncate font-bangla text-[11px] text-pine-900/70">{ins.name}</span>
                <span className="mt-1.5 block font-mono text-[10px] text-pine-600">{ins.papers} papers</span>
              </button>
            ))}
          </div>
        </div>

        <a href="#" className="mx-1 flex items-center gap-2.5 rounded-lg border border-dashed border-pine-900/30 px-3 py-2.5 text-pine-900 transition hover:border-pine-900">
          <ShieldCheck className="size-4 text-pine-600" />
          <span className="flex-1 text-[12.5px] font-medium">সম্পাদকীয় নীতি ও নৈতিকতা</span>
          <ChevronRight className="size-4 text-pine-600" />
        </a>

        <Footer compact />
      </div>
    </aside>
  );
}
