import { useState } from 'react';
import { Globe2, MoreHorizontal, ThumbsUp, MessageCircle, Share2, Send, Bookmark, Bot } from 'lucide-react';
import type { CommunityPost } from '../types';
import { Avatar, FEED_CARD, VerifiedBadge, cn } from './Primitives';
import { CURRENT_USER } from '../data/mockData';
import { toBengaliNumerals } from '../utils/pureLogic';

export const TEXT_THEMES = [
  '',
  'bg-gradient-to-br from-[#0f5e3e] to-[#38b17e]',
  'bg-gradient-to-br from-[#f2994a] to-[#f2c94c]',
  'bg-gradient-to-br from-[#7b2ff7] to-[#f107a3]',
  'bg-gradient-to-br from-[#04301f] to-[#1b3a6b]',
  'bg-gradient-to-br from-[#e41e3f] to-[#ff8a00]',
];

interface Props {
  post: CommunityPost;
  onLike: () => void;
  onSave: () => void;
  onComment: (text: string) => void;
  onShare: () => void;
  onOpenImage?: (src: string) => void;
}

export function CommunityPostCard({ post, onLike, onSave, onComment, onShare }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [text, setText] = useState('');
  const long = post.content.length > 260;
  const shown = long && !expanded ? post.content.slice(0, 240).trimEnd() + '…' : post.content;
  const themed = post.textTheme && post.content.length < 140 && !post.images?.length;
  const imgs = post.images ?? [];
  const extra = imgs.length - 3;

  const submit = () => {
    if (!text.trim()) return;
    onComment(text.trim());
    setText('');
    setShowComments(true);
  };

  return (
    <article className={FEED_CARD}>
      <header className="flex items-start gap-2.5 px-3 pt-3 sm:px-4">
        <Avatar src={post.author.avatar} name={post.author.name} size="size-10" online />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 text-[14.5px] font-semibold text-pine-900">
            <span className="truncate">{post.author.name}</span>
            {post.author.isVerified && <VerifiedBadge />}
          </p>
          <p className="flex items-center gap-1 text-[12px] text-pine-900/55">
            <span className="truncate">{post.author.role}</span>
            <span>·</span>
            <span className="shrink-0 font-bangla">{post.timestamp}</span>
            <span>·</span>
            <Globe2 className="size-3 shrink-0" aria-label="Public" />
          </p>
        </div>
        <button aria-label="More" className="flex size-8 items-center justify-center rounded-full text-pine-900/60 hover:bg-canvas-subtle"><MoreHorizontal className="size-5" /></button>
      </header>

      {themed ? (
        <div className={cn('mx-0 mt-3 flex min-h-[260px] items-center justify-center px-8 py-10 text-center', post.textTheme)}>
          <p className="font-bangla text-[24px] font-bold leading-snug text-white">{post.content}</p>
        </div>
      ) : (
        <div className="whitespace-pre-line px-3 pt-2.5 font-bangla text-[15px] leading-[1.6] text-pine-900 sm:px-4">
          {shown}
          {long && (
            <button onClick={() => setExpanded((e) => !e)} className="ml-1 font-sans text-[14px] font-semibold text-pine-900/60 hover:underline">
              {expanded ? 'See less' : 'See more'}
            </button>
          )}
        </div>
      )}

      {post.aiLabel && (
        <p className="mx-3 mt-2 inline-flex items-center gap-1 rounded-md bg-canvas-subtle px-2 py-0.5 font-mono text-[10px] text-pine-600 sm:mx-4"><Bot className="size-3" />AI info · Made with AI</p>
      )}

      {post.sharedPost && (
        <div className="mx-3 mt-3 rounded-xl border border-canvas-border bg-canvas-subtle/60 p-3.5 sm:mx-4">
          <div className="flex items-center gap-2">
            <Avatar src={post.sharedPost.authorAvatar} name={post.sharedPost.authorName} size="size-8" />
            <span>
              <span className="block text-[13.5px] font-semibold text-pine-900">{post.sharedPost.authorName}</span>
              <span className="flex items-center gap-1 font-bangla text-[11.5px] text-pine-900/55">{post.sharedPost.timestamp} · <Globe2 className="size-3" /></span>
            </span>
          </div>
          <blockquote className="relative mt-2.5 border-l-[3px] border-pine-500 pl-3 font-bangla text-[14.5px] leading-[1.65] text-pine-900/90">
            <span className="absolute -left-1 -top-4 font-display text-[40px] leading-none text-pine-400/40">“</span>
            {post.sharedPost.text}
          </blockquote>
        </div>
      )}

      {imgs.length === 1 && (
        <div className="mt-3 bg-pine-100">
          <img src={imgs[0]} alt="Post attachment" className="max-h-[520px] w-full object-cover" />
        </div>
      )}
      {imgs.length === 2 && (
        <div className="mt-3 grid grid-cols-2 gap-0.5 bg-pine-100">
          {imgs.map((s) => <img key={s} src={s} alt="" className="aspect-square w-full object-cover" />)}
        </div>
      )}
      {imgs.length >= 3 && (
        <div className="mt-3 grid aspect-[4/3] grid-cols-[1.5fr_1fr] grid-rows-2 gap-0.5 bg-pine-100">
          <img src={imgs[0]} alt="Field visit" className="row-span-2 size-full object-cover" />
          <img src={imgs[1]} alt="" className="size-full object-cover" />
          <div className="relative">
            <img src={imgs[2]} alt="" className="size-full object-cover" />
            {extra > 0 && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-[30px] font-semibold text-white">+{extra}</span>
            )}
          </div>
        </div>
      )}

      {/* reaction summary */}
      <div className="flex items-center justify-between px-3 pb-2 pt-2.5 text-[13px] text-pine-900/60 sm:px-4">
        <span className="flex items-center gap-1.5">
          <span className="flex -space-x-1 text-[13px]">
            <span className="flex size-[18px] items-center justify-center rounded-full bg-[#f33e58] ring-2 ring-canvas-card">❤️</span>
            <span className="flex size-[18px] items-center justify-center rounded-full bg-[#1b74e4] ring-2 ring-canvas-card">👍</span>
            <span className="flex size-[18px] items-center justify-center rounded-full bg-[#f7b125] ring-2 ring-canvas-card">😮</span>
          </span>
          <span>{post.userLiked ? `You and ${post.stats.likes - 1} others` : post.reactionsSummary ?? `${post.stats.likes}`}</span>
        </span>
        <span className="flex gap-3">
          <button onClick={() => setShowComments((s) => !s)} className="hover:underline">{toBengaliNumerals(post.stats.commentsCount)} comments</button>
          <span>{toBengaliNumerals(post.stats.shares)} shares</span>
        </span>
      </div>

      <div className="mx-3 grid grid-cols-[1fr_1fr_1fr_auto] border-t border-canvas-border py-1 sm:mx-4">
        <button onClick={onLike} aria-pressed={post.userLiked} className={cn('flex items-center justify-center gap-1.5 rounded-lg py-2 text-[14px] font-semibold transition hover:bg-canvas-subtle', post.userLiked ? 'text-[#1b74e4]' : 'text-pine-900/65')}>
          <ThumbsUp className={cn('size-[19px]', post.userLiked && 'fill-current')} /> Like
        </button>
        <button onClick={() => setShowComments(true)} className="flex items-center justify-center gap-1.5 rounded-lg py-2 text-[14px] font-semibold text-pine-900/65 transition hover:bg-canvas-subtle">
          <MessageCircle className="size-[19px]" /> Comment
        </button>
        <button onClick={onShare} className="flex items-center justify-center gap-1.5 rounded-lg py-2 text-[14px] font-semibold text-pine-900/65 transition hover:bg-canvas-subtle">
          <Share2 className="size-[19px]" /> Share
        </button>
        <button onClick={onSave} aria-pressed={post.userSaved} aria-label="Save post" className={cn('flex w-10 items-center justify-center rounded-lg transition hover:bg-canvas-subtle', post.userSaved ? 'text-pine-600' : 'text-pine-900/50')}>
          <Bookmark className={cn('size-[18px]', post.userSaved && 'fill-current')} />
        </button>
      </div>

      {showComments && (
        <div className="border-t border-canvas-border px-3 pb-1 pt-3 sm:px-4">
          {post.comments.length === 0 && <p className="pb-2 text-center text-[12.5px] text-pine-900/50">প্রথম মন্তব্যটি আপনিই করুন।</p>}
          {post.comments.map((c) => (
            <div key={c.id} className="mb-2.5 flex gap-2">
              <Avatar src={c.avatar} name={c.author} size="size-8" />
              <div className="min-w-0">
                <div className="rounded-2xl bg-canvas-subtle px-3 py-2">
                  <p className="text-[12.5px] font-semibold text-pine-900">{c.author}</p>
                  <p className="font-bangla text-[13.5px] leading-snug text-pine-900/85">{c.text}</p>
                </div>
                <p className="ml-3 mt-0.5 font-mono text-[10px] text-pine-600">{c.timestamp} · Like · Reply</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={(e) => { e.preventDefault(); submit(); }} className={cn('flex items-center gap-2 px-3 pb-3 sm:px-4', !showComments && 'pt-1')}>
        <Avatar src={CURRENT_USER.avatar} name={CURRENT_USER.name} size="size-8" />
        <div className="flex h-9 flex-1 items-center rounded-full bg-canvas-subtle pl-3.5 pr-1 ring-1 ring-transparent focus-within:ring-pine-500">
          <input value={text} onChange={(e) => setText(e.target.value)} onFocus={() => setShowComments(true)} placeholder="Write a comment…" className="flex-1 bg-transparent font-bangla text-[13.5px] text-pine-900 outline-none placeholder:text-pine-900/40" />
          <button type="submit" disabled={!text.trim()} aria-label="Send" className="flex size-7 items-center justify-center rounded-full text-pine-600 disabled:opacity-30">
            <Send className="size-4" />
          </button>
        </div>
      </form>
    </article>
  );
}
