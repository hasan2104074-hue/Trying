import { Play, Heart, Bookmark, Share2, Clapperboard, MapPin, Volume2 } from 'lucide-react';
import type { StoryReel } from '../types';
import { REEL_PHOTO } from '../data/mockData';
import { Avatar, FEED_CARD, VerifiedBadge, cn } from './Primitives';
import { formatBengaliNumberCompact } from '../utils/pureLogic';

interface Props {
  reel: StoryReel;
  liked: boolean;
  saved: boolean;
  following: boolean;
  onPlay: () => void;
  onLike: () => void;
  onSave: () => void;
  onShare: () => void;
  onFollow: () => void;
}

export function IntegratedReelCard({ reel, liked, saved, following, onPlay, onLike, onSave, onShare, onFollow }: Props) {
  const photo = REEL_PHOTO[reel.videoType];
  const counters = [
    { icon: Heart, label: formatBengaliNumberCompact(reel.likes + (liked ? 1 : 0)), onClick: onLike, active: liked, activeTone: 'text-[#ff3b5c] fill-current' },
    { icon: Bookmark, label: saved ? 'Saved' : 'Save', onClick: onSave, active: saved, activeTone: 'text-[#bbf0d8] fill-current' },
    { icon: Share2, label: 'Share', onClick: onShare, active: false, activeTone: '' },
  ];
  return (
    <article className={cn(FEED_CARD, 'overflow-hidden')}>
      <header className="flex items-center gap-2.5 px-3 py-3 sm:px-4">
        <Avatar src={reel.creatorAvatar} name={reel.creator} size="size-10" online />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 text-[14.5px] font-semibold text-pine-900">
            {reel.creator} <VerifiedBadge />
            <span className="text-pine-900/40">·</span>
            <button onClick={onFollow} className={cn('text-[13.5px] font-semibold', following ? 'text-pine-900/50' : 'text-pine-600 hover:underline')}>
              {following ? 'Following' : 'Follow'}
            </button>
          </p>
          <p className="flex items-center gap-1 text-[12px] text-pine-900/55"><Clapperboard className="size-3" />Reel · <MapPin className="size-3" />{reel.location}</p>
        </div>
      </header>
      <div className="relative bg-[#021a11]">
        <img src={photo} alt="" aria-hidden className="absolute inset-0 size-full scale-110 object-cover opacity-50 blur-2xl" />
        <div className="relative mx-auto aspect-[9/16] max-h-[600px] w-full max-w-[330px] overflow-hidden">
          <button onClick={onPlay} className="group absolute inset-0" aria-label={`Play ${reel.title}`}>
            <img src={photo} alt={reel.title} className="size-full object-cover" />
            <span className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/85" />
            <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/80 bg-black/30 text-white backdrop-blur-sm transition group-hover:scale-110">
              <Play className="ml-1 size-7 fill-white" />
            </span>
            <span className="absolute left-3 top-3 rounded bg-black/50 px-1.5 py-0.5 font-mono text-[10.5px] text-white">{reel.duration}</span>
            <Volume2 className="absolute right-3 top-3 size-5 text-white/80" />
            <span className="absolute bottom-4 left-3 right-16 text-left">
              <span className="block font-display text-[19px] font-semibold leading-tight text-white">{reel.title}</span>
              <span className="mt-1 block font-mono text-[10.5px] text-white/70">{formatBengaliNumberCompact(reel.views)} views</span>
            </span>
          </button>
          <div className="absolute bottom-4 right-2 flex flex-col items-center gap-3.5">
            {counters.map((c) => (
              <button key={c.label} onClick={c.onClick} className="flex flex-col items-center gap-0.5 text-white">
                <span className="flex size-11 items-center justify-center rounded-full bg-black/35 backdrop-blur-sm transition hover:bg-black/55">
                  <c.icon className={cn('size-[22px]', c.active && c.activeTone)} />
                </span>
                <span className="font-mono text-[10.5px] font-medium">{c.label}</span>
              </button>
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/20"><div className="h-full w-1/3 bg-[#38b17e]" /></div>
        </div>
      </div>
    </article>
  );
}
