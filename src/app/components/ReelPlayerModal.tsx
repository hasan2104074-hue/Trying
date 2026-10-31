import { useEffect, useState } from 'react';
import { X, Heart, MessageCircle, Share2, Bookmark, Pause, Play, ChevronUp, ChevronDown, MapPin } from 'lucide-react';
import { Avatar, cn } from './Primitives';

export interface PlayerItem {
  id: string;
  title: string;
  creator: string;
  avatar: string;
  image: string;
  meta: string;
  likes?: number;
}

export function ReelPlayerModal({ items, start, onClose, onShare }: { items: PlayerItem[] | null; start: number; onClose: () => void; onShare: (t: string) => void }) {
  const [idx, setIdx] = useState(start);
  const [paused, setPaused] = useState(false);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  useEffect(() => { setIdx(start); setPaused(false); }, [start, items]);

  const count = items?.length ?? 0;
  const next = () => (idx < count - 1 ? setIdx(idx + 1) : onClose());
  const prev = () => setIdx(Math.max(0, idx - 1));

  useEffect(() => {
    if (!items) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev();
      if (e.key === ' ') { e.preventDefault(); setPaused((p) => !p); }
    };
    window.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = ''; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, idx]);

  if (!items) return null;
  const it = items[idx];
  const isLiked = liked[it.id];

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#050a07]" role="dialog" aria-modal="true" aria-label={it.title}>
      <img src={it.image} alt="" aria-hidden className="absolute inset-0 size-full object-cover opacity-30 blur-3xl" />
      <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 z-20 flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"><X className="size-5" /></button>

      <div className="relative h-full w-full max-w-[440px] overflow-hidden bg-black sm:h-[92vh] sm:rounded-2xl sm:border sm:border-white/15">
        <img key={it.id} src={it.image} alt={it.title} className={cn('absolute inset-0 size-full object-cover [animation:kenburns_6s_ease-out_forwards]', paused && '[animation-play-state:paused]')} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/85" />

        {/* progress */}
        <div className="absolute inset-x-3 top-3 z-10 flex gap-1">
          {items.map((x, i) => (
            <span key={x.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
              {i < idx && <span className="block h-full w-full bg-white" />}
              {i === idx && (
                <span key={`${x.id}-${idx}`} onAnimationEnd={next} className={cn('block h-full w-full origin-left bg-white [animation:reel-progress_6s_linear_forwards]', paused && '[animation-play-state:paused]')} />
              )}
            </span>
          ))}
        </div>
        <div className="absolute inset-x-3 top-6 z-10 flex items-center gap-2.5 text-white">
          <Avatar src={it.avatar} name={it.creator} size="size-9" ring />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold">{it.creator}</p>
            <p className="flex items-center gap-1 truncate font-mono text-[10.5px] text-white/70"><MapPin className="size-3" />{it.meta}</p>
          </div>
          <button onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play' : 'Pause'} className="flex size-9 items-center justify-center rounded-full bg-black/30">
            {paused ? <Play className="size-4 fill-white" /> : <Pause className="size-4 fill-white" />}
          </button>
        </div>

        {/* tap zones */}
        <button aria-label="Previous" onClick={prev} className="absolute inset-y-20 left-0 z-[5] w-1/3" />
        <button aria-label="Next" onClick={next} className="absolute inset-y-20 right-16 z-[5] w-1/3" />

        <div className="absolute bottom-24 right-2.5 z-10 flex flex-col items-center gap-4 text-white">
          <button onClick={() => setLiked((l) => ({ ...l, [it.id]: !l[it.id] }))} className="flex flex-col items-center gap-0.5" aria-pressed={isLiked}>
            <span className="flex size-11 items-center justify-center rounded-full bg-black/35"><Heart className={cn('size-6', isLiked && 'fill-[#ff3b5c] text-[#ff3b5c]')} /></span>
            <span className="font-mono text-[10.5px]">{(it.likes ?? 0) + (isLiked ? 1 : 0)}</span>
          </button>
          <button className="flex flex-col items-center gap-0.5"><span className="flex size-11 items-center justify-center rounded-full bg-black/35"><MessageCircle className="size-6" /></span><span className="font-mono text-[10.5px]">Comment</span></button>
          <button onClick={() => setSaved((s) => ({ ...s, [it.id]: !s[it.id] }))} className="flex flex-col items-center gap-0.5">
            <span className="flex size-11 items-center justify-center rounded-full bg-black/35"><Bookmark className={cn('size-6', saved[it.id] && 'fill-white')} /></span>
            <span className="font-mono text-[10.5px]">{saved[it.id] ? 'Saved' : 'Save'}</span>
          </button>
          <button onClick={() => onShare(it.title)} className="flex flex-col items-center gap-0.5"><span className="flex size-11 items-center justify-center rounded-full bg-black/35"><Share2 className="size-6" /></span><span className="font-mono text-[10.5px]">Share</span></button>
        </div>

        <div className="absolute inset-x-4 bottom-6 z-10 pr-14 text-white">
          <p className="font-display text-[22px] font-semibold leading-tight">{it.title}</p>
          <p className="mt-1.5 font-mono text-[10.5px] text-white/60">{String(idx + 1).padStart(2, '0')} / {String(count).padStart(2, '0')} · Space to pause · ← → to navigate</p>
        </div>
      </div>

      <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 md:flex">
        <button onClick={prev} disabled={idx === 0} aria-label="Previous reel" className="flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-30"><ChevronUp className="size-5" /></button>
        <button onClick={next} aria-label="Next reel" className="flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"><ChevronDown className="size-5" /></button>
      </div>
    </div>
  );
}
