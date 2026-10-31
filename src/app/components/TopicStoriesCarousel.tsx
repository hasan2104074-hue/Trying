import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus, Plane, Sprout, CloudSun, Wheat, Home, Landmark, Layers, Cpu } from 'lucide-react';
import type { TopicStory } from '../types';
import { CURRENT_USER } from '../data/mockData';
import { Avatar } from './Primitives';

const ICONS = { drone: Plane, seedling: Sprout, climate: CloudSun, food: Wheat, rural: Home, policy: Landmark, soil: Layers, tech: Cpu } as const;

export function TopicStoriesCarousel({ stories, onOpen, onCreate }: { stories: TopicStory[]; onOpen: (i: number) => void; onCreate: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: number) => ref.current?.scrollBy({ left: d * 320, behavior: 'smooth' });
  return (
    <section className="group/car relative" aria-label="Topic stories">
      <div ref={ref} className="no-scrollbar flex snap-x gap-2 overflow-x-auto px-3 py-1 sm:px-0.5 md:gap-3 md:pb-2">
        {/* Create story — mobile */}
        <button onClick={onCreate} className="relative flex aspect-[9/16] w-[104px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-canvas-border bg-canvas-card md:hidden">
          <img src={CURRENT_USER.avatar.replace('h=160', 'h=320').replace('w=160', 'w=220')} alt="" className="h-[68%] w-full object-cover" />
          <span className="absolute left-1/2 top-[68%] flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-canvas-card bg-pine-600 text-white">
            <Plus className="size-5" strokeWidth={3} />
          </span>
          <span className="flex flex-1 items-end justify-center pb-2 text-[12px] font-semibold text-pine-900">Create story</span>
        </button>

        {stories.map((s, i) => {
          const Icon = ICONS[s.iconName];
          return (
            <button
              key={s.id}
              onClick={() => onOpen(i)}
              className="group relative aspect-[9/16] w-[104px] shrink-0 snap-start overflow-hidden rounded-xl bg-pine-800 text-left md:aspect-[3/4.4] md:w-[138px] md:border md:border-pine-900 md:shadow-tactile-sm"
            >
              <img src={s.imageUrl} alt={s.title} className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105" />
              <span className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
              <Avatar src={s.authorAvatar ?? 'PS'} name={s.authorName} size="size-9" ring className="absolute left-2 top-2 md:hidden" />
              <span className="absolute left-2 top-2 hidden size-8 items-center justify-center rounded-lg border border-white/50 bg-black/30 text-white backdrop-blur-sm md:flex">
                <Icon className="size-4" />
              </span>
              <span className="absolute inset-x-2 bottom-2">
                <span className="mb-1 hidden truncate font-mono text-[9px] uppercase tracking-wider text-[#bbf0d8] md:block">{s.category}</span>
                <span className="line-clamp-3 text-[12px] font-semibold leading-tight text-white md:text-[12.5px]">{s.title}</span>
                {s.readsCount && <span className="mt-1 hidden font-mono text-[10px] text-white/70 md:block">{s.readsCount} reads</span>}
              </span>
            </button>
          );
        })}
      </div>
      <button onClick={() => scroll(-1)} aria-label="Previous" className="absolute left-1 top-1/2 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border border-pine-900 bg-canvas-card text-pine-900 opacity-0 shadow-tactile-sm transition group-hover/car:opacity-100 md:flex">
        <ChevronLeft className="size-5" />
      </button>
      <button onClick={() => scroll(1)} aria-label="Next" className="absolute right-1 top-1/2 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border border-pine-900 bg-canvas-card text-pine-900 opacity-0 shadow-tactile-sm transition group-hover/car:opacity-100 md:flex">
        <ChevronRight className="size-5" />
      </button>
    </section>
  );
}
