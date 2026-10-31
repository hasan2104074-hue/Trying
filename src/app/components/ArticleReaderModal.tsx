import { useState } from 'react';
import { Heart, Bookmark, Share2, Clock, FlaskConical, Send, Eye } from 'lucide-react';
import type { Article } from '../types';
import { Modal, CloseButton, Avatar, SectionLabel, cn } from './Primitives';
import { ImageGraphic } from './ImageGraphic';
import { CURRENT_USER } from '../data/mockData';
import { formatBengaliNumberCompact, toBengaliNumerals } from '../utils/pureLogic';

interface Props {
  article: Article | null;
  bookmarked: boolean;
  onClose: () => void;
  onLike: () => void;
  onBookmark: () => void;
  onComment: (t: string) => void;
  onShare: () => void;
}

export function ArticleReaderModal({ article: a, bookmarked, onClose, onLike, onBookmark, onComment, onShare }: Props) {
  const [text, setText] = useState('');
  if (!a) return null;
  return (
    <Modal open={!!a} onClose={onClose} className="max-w-[760px]" labelledBy="reader-title">
      <article className="rounded-t-2xl border border-pine-900 bg-canvas shadow-tactile-lg sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-pine-900 bg-canvas px-4 py-2.5">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-pine-600">Plainsyt · {a.categoryEn}</span>
          <div className="flex items-center gap-1.5">
            <button onClick={onBookmark} aria-pressed={bookmarked} aria-label="Bookmark" className={cn('flex size-9 items-center justify-center rounded-full hover:bg-canvas-subtle', bookmarked ? 'text-pine-600' : 'text-pine-900')}>
              <Bookmark className={cn('size-[18px]', bookmarked && 'fill-current')} />
            </button>
            <CloseButton onClick={onClose} />
          </div>
        </div>
        <ImageGraphic type={a.imageType} className="aspect-[2/1]" plate={`FIG. ${a.id.toUpperCase()} — ${a.categoryEn.toUpperCase()}`} />
        <div className="px-5 pb-8 pt-6 sm:px-10">
          <p className="font-bangla text-[13px] font-semibold text-pine-600">{a.category}</p>
          <h1 id="reader-title" className="mt-2 font-display text-[28px] font-bold leading-[1.15] tracking-[-0.01em] text-pine-950 sm:text-[38px]">{a.title}</h1>
          <p className="mt-3 font-bangla text-[17px] leading-relaxed text-pine-900/75">{a.subtitle}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-pine-900 py-3">
            <span className="flex items-center gap-2.5">
              <Avatar src={a.author.avatar} name={a.author.name} size="size-9" />
              <span>
                <span className="block font-bangla text-[14px] font-semibold text-pine-900">{a.author.name}</span>
                <span className="block font-mono text-[10.5px] text-pine-600">{a.author.designation} · {a.author.organization}</span>
              </span>
            </span>
            <span className="ml-auto flex items-center gap-3 font-mono text-[10.5px] text-pine-600">
              <span>{a.publishedAt}</span>
              <span className="flex items-center gap-1"><Clock className="size-3" />{toBengaliNumerals(a.readTimeMinutes)} মিনিট</span>
              <span className="flex items-center gap-1"><Eye className="size-3" />{formatBengaliNumberCompact(a.stats.views)}</span>
            </span>
          </div>

          <aside className="mt-6 rounded-xl border border-pine-900 bg-pine-50 p-4 shadow-tactile-sm">
            <SectionLabel>মূল কথা · Key takeaways</SectionLabel>
            <ol className="mt-2 space-y-1.5">
              {a.takeaways.map((t, i) => (
                <li key={t} className="flex gap-2.5 font-bangla text-[14.5px] text-pine-900">
                  <span className="font-mono text-[11px] font-semibold text-pine-600">{String(i + 1).padStart(2, '0')}</span>{t}
                </li>
              ))}
            </ol>
          </aside>

          <div className="mt-6 space-y-4 font-bangla text-[17px] leading-[1.85] text-pine-900/90">
            {a.content.map((para, i) => (
              <p key={i} className={cn(i === 0 && 'first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-[52px] first-letter:font-bold first-letter:leading-[0.9] first-letter:text-pine-700')}>{para}</p>
            ))}
          </div>

          {a.researchBasis && (
            <div className="mt-7 grid gap-3 rounded-lg border border-dashed border-pine-900/40 p-4 font-mono text-[11.5px] text-pine-900 sm:grid-cols-[auto_1fr_auto] sm:items-center">
              <FlaskConical className="size-5 text-pine-600" />
              <div>
                <p className="uppercase tracking-wider text-pine-600">Research basis</p>
                <p className="mt-0.5">{a.researchBasis.journalOrInst}</p>
                <p className="text-pine-900/60">{a.researchBasis.doiOrSource}</p>
              </div>
              <span className="rounded-md border border-pine-900 bg-canvas-card px-2.5 py-1.5 text-[13px] font-semibold shadow-tactile-xs">{a.researchBasis.keyMetric}</span>
            </div>
          )}

          <div className="mt-7 flex items-center gap-2">
            <button onClick={onLike} aria-pressed={a.userLiked} className={cn('flex h-10 items-center gap-2 rounded-lg border border-pine-900 px-4 text-[14px] font-semibold shadow-tactile-xs shadow-tactile-hover', a.userLiked ? 'bg-[#ffe4e8] text-[#c01048]' : 'bg-canvas-card text-pine-900')}>
              <Heart className={cn('size-[18px]', a.userLiked && 'fill-current')} />{formatBengaliNumberCompact(a.stats.likes)}
            </button>
            <button onClick={onShare} className="flex h-10 items-center gap-2 rounded-lg border border-pine-900 bg-canvas-card px-4 text-[14px] font-semibold text-pine-900 shadow-tactile-xs shadow-tactile-hover">
              <Share2 className="size-[18px]" />Share
            </button>
          </div>

          <section className="mt-8 border-t border-pine-900 pt-5">
            <h2 className="font-display text-[22px] font-semibold text-pine-900">আলোচনা <span className="font-mono text-[13px] text-pine-600">({toBengaliNumerals(a.stats.commentsCount)})</span></h2>
            <form onSubmit={(e) => { e.preventDefault(); if (text.trim()) { onComment(text.trim()); setText(''); } }} className="mt-3 flex items-start gap-2.5">
              <Avatar src={CURRENT_USER.avatar} name={CURRENT_USER.name} size="size-9" />
              <div className="flex-1 rounded-xl border border-pine-900/30 bg-canvas-card focus-within:border-pine-900">
                <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} placeholder="তথ্যভিত্তিক মতামত দিন…" className="w-full resize-none bg-transparent px-3 py-2 font-bangla text-[14.5px] text-pine-900 outline-none placeholder:text-pine-900/40" />
                <div className="flex justify-end px-2 pb-2">
                  <button type="submit" disabled={!text.trim()} className="flex h-8 items-center gap-1.5 rounded-md bg-pine-900 px-3 text-[12.5px] font-semibold text-canvas disabled:opacity-40"><Send className="size-3.5" />Post</button>
                </div>
              </div>
            </form>
            <ul className="mt-4 space-y-4">
              {a.comments.map((c) => (
                <li key={c.id} className="flex gap-2.5">
                  <Avatar src={c.avatar} name={c.author} size="size-9" />
                  <div>
                    <p className="font-bangla text-[13.5px] font-semibold text-pine-900">{c.author} <span className="font-normal text-pine-900/50">· {c.role}</span></p>
                    <p className="font-bangla text-[14.5px] leading-relaxed text-pine-900/85">{c.text}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-pine-600">{c.timestamp} · ♥ {toBengaliNumerals(c.likes)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </article>
    </Modal>
  );
}
