import { useState } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, Clock, Send, Eye, ArrowRight } from 'lucide-react';
import type { Article } from '../types';
import { ImageGraphic } from './ImageGraphic';
import { Avatar, FEED_CARD, cn } from './Primitives';
import { CURRENT_USER } from '../data/mockData';
import { formatBengaliNumberCompact, toBengaliNumerals } from '../utils/pureLogic';

interface Props {
  article: Article;
  lead?: boolean;
  bookmarked: boolean;
  onOpen: () => void;
  onLike: () => void;
  onBookmark: () => void;
  onComment: (text: string) => void;
  onShare: () => void;
}

export function ArticleCard({ article: a, lead, bookmarked, onOpen, onLike, onBookmark, onComment, onShare }: Props) {
  const [text, setText] = useState('');
  const submit = () => {
    if (!text.trim()) return;
    onComment(text.trim());
    setText('');
  };
  return (
    <article className={cn(FEED_CARD, 'overflow-hidden')}>
      {lead && (
        <div className="flex items-center justify-between border-b border-pine-900 bg-pine-900 px-4 py-1.5 text-canvas">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]">Lead Story · প্রধান প্রতিবেদন</span>
          <span className="font-mono text-[10px] tracking-wider opacity-70">{a.publishedAt}</span>
        </div>
      )}
      <button onClick={onOpen} className="block w-full text-left" aria-label={a.title}>
        <ImageGraphic type={a.imageType} className={lead ? 'aspect-[16/9]' : 'aspect-[2/1]'} plate={`FIG. ${a.id.toUpperCase()}`} />
      </button>
      <div className="px-4 pb-3 pt-4 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-pine-900 bg-pine-100 px-2.5 py-0.5 font-bangla text-[12px] font-semibold text-pine-800">{a.category}</span>
          <span className="flex items-center gap-1 font-mono text-[10.5px] text-pine-600"><Clock className="size-3" />{toBengaliNumerals(a.readTimeMinutes)} মিনিট পড়া</span>
          <span className="flex items-center gap-1 font-mono text-[10.5px] text-pine-600"><Eye className="size-3" />{formatBengaliNumberCompact(a.stats.views)}</span>
        </div>
        <button onClick={onOpen} className="mt-3 block text-left">
          <h2 className={cn('font-display font-bold leading-[1.18] tracking-[-0.01em] text-pine-950 hover:underline decoration-pine-400 decoration-2 underline-offset-4', lead ? 'text-[24px] sm:text-[30px]' : 'text-[20px] sm:text-[22px]')}>
            {a.title}
          </h2>
        </button>
        <p className="mt-2 font-bangla text-[15px] leading-relaxed text-pine-900/75">{a.subtitle}</p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-dashed border-canvas-border pt-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar src={a.author.avatar} name={a.author.name} size="size-9" />
            <span className="min-w-0">
              <span className="block truncate font-bangla text-[13.5px] font-semibold text-pine-900">{a.author.name}</span>
              <span className="block truncate font-mono text-[10.5px] text-pine-600">{a.author.designation} · {a.author.organization}</span>
            </span>
          </div>
          <button onClick={onOpen} className="hidden shrink-0 items-center gap-1 rounded-md border border-pine-900 bg-canvas-card px-2.5 py-1.5 text-[12px] font-semibold text-pine-900 shadow-tactile-xs shadow-tactile-hover sm:inline-flex">
            পড়ুন <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 border-t border-canvas-border px-2 py-1 sm:px-3">
        <button onClick={onLike} aria-pressed={a.userLiked} className={cn('flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[13px] font-semibold transition hover:bg-canvas-subtle', a.userLiked ? 'text-[#e41e3f]' : 'text-pine-900/70')}>
          <Heart className={cn('size-[18px]', a.userLiked && 'fill-current')} /> {formatBengaliNumberCompact(a.stats.likes)}
        </button>
        <button onClick={onOpen} className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[13px] font-semibold text-pine-900/70 transition hover:bg-canvas-subtle">
          <MessageCircle className="size-[18px]" /> {toBengaliNumerals(a.stats.commentsCount)}
        </button>
        <button onClick={onShare} className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[13px] font-semibold text-pine-900/70 transition hover:bg-canvas-subtle">
          <Share2 className="size-[18px]" /> {toBengaliNumerals(a.stats.shares)}
        </button>
        <button onClick={onBookmark} aria-pressed={bookmarked} aria-label="Bookmark" className={cn('ml-auto flex size-9 items-center justify-center rounded-lg transition hover:bg-canvas-subtle', bookmarked ? 'text-pine-600' : 'text-pine-900/70')}>
          <Bookmark className={cn('size-[18px]', bookmarked && 'fill-current')} />
        </button>
      </div>

      {lead && (
        <div className="border-t border-canvas-border bg-canvas-subtle/50 px-4 py-3 sm:px-5">
          {a.comments.slice(0, 2).map((c) => (
            <div key={c.id} className="mb-2.5 flex gap-2">
              <Avatar src={c.avatar} name={c.author} size="size-8" />
              <div className="min-w-0">
                <div className="rounded-2xl bg-canvas-card px-3 py-2 ring-1 ring-canvas-border">
                  <p className="font-bangla text-[12.5px] font-semibold text-pine-900">{c.author} <span className="font-normal text-pine-900/50">· {c.role}</span></p>
                  <p className="font-bangla text-[13.5px] leading-snug text-pine-900/85">{c.text}</p>
                </div>
                <p className="ml-3 mt-0.5 font-mono text-[10px] text-pine-600">{c.timestamp} · Like · Reply</p>
              </div>
            </div>
          ))}
          <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="flex items-center gap-2">
            <Avatar src={CURRENT_USER.avatar} name={CURRENT_USER.name} size="size-8" />
            <div className="flex h-9 flex-1 items-center rounded-full border border-canvas-border bg-canvas-card pl-3.5 pr-1 focus-within:border-pine-600">
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="মতামত লিখুন…" className="flex-1 bg-transparent font-bangla text-[13.5px] text-pine-900 outline-none placeholder:text-pine-900/40" />
              <button type="submit" disabled={!text.trim()} aria-label="Send comment" className="flex size-7 items-center justify-center rounded-full text-pine-600 disabled:opacity-30">
                <Send className="size-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </article>
  );
}
