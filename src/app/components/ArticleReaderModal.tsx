import { useState } from 'react';
import { Bookmark, Share2, Clock, FlaskConical, Send, Eye, ExternalLink } from 'lucide-react';
import type { Article, LinkedInReactionType, UserProfile } from '../types';
import { Modal, CloseButton, Avatar, SectionLabel, cn } from './Primitives';
import { ImageGraphic } from './ImageGraphic';
import { LinkedInReactionPickerButton, LinkedInReactionSummary } from './LinkedInReactionBar';
import { formatBengaliNumberCompact, toBengaliNumerals, totalReactions } from '../utils/pureLogic';

interface Props {
  article: Article | null;
  bookmarked: boolean;
  currentUser: UserProfile | null;
  onClose: () => void;
  onReact: (type: LinkedInReactionType) => void;
  onOpenReactionsBreakdown: () => void;
  onBookmark: () => void;
  onComment: (t: string) => void;
  onReactComment?: (commentId: string, type: LinkedInReactionType) => void;
  onShare: () => void;
  onNavigateProfile: (userId: string) => void;
  onOpenPhoto: (src: string, title?: string, subtitle?: string, authorName?: string, authorId?: string) => void;
}

export function ArticleReaderContent({
  article: a,
  bookmarked,
  currentUser,
  isStandalonePage = false,
  onClose,
  onReact,
  onOpenReactionsBreakdown,
  onBookmark,
  onComment,
  onReactComment,
  onShare,
  onNavigateProfile,
  onOpenPhoto,
}: Omit<Props, 'article'> & { article: Article; isStandalonePage?: boolean }) {
  const [text, setText] = useState('');
  const rxTotal = totalReactions(a.reactionCounts, a.stats.likes);

  return (
    <article className="rounded-t-2xl border border-pine-900 bg-canvas shadow-tactile-lg sm:rounded-2xl">
      <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-pine-900 bg-canvas px-4 py-2.5">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-pine-600">
          Plainsyt · {a.categoryEn}
        </span>
        <div className="flex items-center gap-1.5">
          {!isStandalonePage && (
            <a
              href={`/article/${a.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-pine-900/30 bg-canvas-subtle px-2.5 font-mono text-[11px] font-semibold text-pine-900 hover:border-pine-900 hover:bg-pine-100"
              title="Open in separate browser tab"
            >
              Open in New Tab <ExternalLink className="size-3.5" />
            </a>
          )}
          <button
            type="button"
            onClick={onBookmark}
            aria-pressed={bookmarked}
            aria-label="Bookmark"
            className={cn(
              'flex size-9 items-center justify-center rounded-full hover:bg-canvas-subtle',
              bookmarked ? 'text-pine-600' : 'text-pine-900',
            )}
          >
            <Bookmark className={cn('size-[18px]', bookmarked && 'fill-current')} />
          </button>
          {!isStandalonePage && <CloseButton onClick={onClose} />}
        </div>
      </div>

      <ImageGraphic
        type={a.imageType}
        coverImageUrl={a.coverImageUrl}
        title={a.title}
        className="aspect-[2/1]"
        plate={`FIG. ${a.id.toUpperCase()} — ${a.categoryEn.toUpperCase()}`}
        onClickPhoto={
          a.coverImageUrl
            ? (src) => onOpenPhoto(src, a.title, a.subtitle, a.author.name, a.authorId)
            : undefined
        }
      />

      <div className="px-5 pb-8 pt-6 sm:px-10">
        <p className="font-bangla text-[13px] font-semibold text-pine-600">{a.category}</p>
        <h1
          id="reader-title"
          className="mt-2 font-display text-[28px] font-bold leading-[1.15] tracking-[-0.01em] text-pine-950 sm:text-[38px]"
        >
          {a.title}
        </h1>
        <p className="mt-3 font-bangla text-[17px] leading-relaxed text-pine-900/75">{a.subtitle}</p>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-pine-900 py-3">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                if (!isStandalonePage) onClose();
                onNavigateProfile(a.authorId);
              }}
            >
              <Avatar src={a.author.avatar} name={a.author.name} size="size-9" />
            </button>
            <div>
              <button
                type="button"
                onClick={() => {
                  if (!isStandalonePage) onClose();
                  onNavigateProfile(a.authorId);
                }}
                className="block text-left font-bangla text-[14px] font-semibold text-pine-900 hover:underline"
              >
                {a.author.name}
              </button>
              <span className="block font-mono text-[10.5px] text-pine-600">
                {a.author.designation} {a.author.organization ? `· ${a.author.organization}` : ''}
              </span>
            </div>
          </div>
          <span className="ml-auto flex items-center gap-3 font-mono text-[10.5px] text-pine-600">
            <span>{a.publishedAt}</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {toBengaliNumerals(a.readTimeMinutes)} মিনিট
            </span>
            <span className="flex items-center gap-1">
              <Eye className="size-3" />
              {formatBengaliNumberCompact(a.stats.views)}
            </span>
          </span>
        </div>

        {a.takeaways.length > 0 && (
          <aside className="mt-6 rounded-xl border border-pine-900 bg-pine-50 p-4 shadow-tactile-sm">
            <SectionLabel>মূল কথা · Key takeaways</SectionLabel>
            <ol className="mt-2 space-y-1.5">
              {a.takeaways.map((t, i) => (
                <li key={t + i} className="flex gap-2.5 font-bangla text-[14.5px] text-pine-900">
                  <span className="font-mono text-[11px] font-semibold text-pine-600">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {t}
                </li>
              ))}
            </ol>
          </aside>
        )}

        <div className="mt-6 space-y-4 font-bangla text-[17px] leading-[1.85] text-pine-900/90">
          {a.content.map((para, i) => (
            <p
              key={i}
              className={cn(
                i === 0 &&
                  'first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-[52px] first-letter:font-bold first-letter:leading-[0.9] first-letter:text-pine-700',
              )}
            >
              {para}
            </p>
          ))}
        </div>

        {a.externalLink && (
          <div className="mt-5">
            <a
              href={a.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-pine-900 bg-pine-50 px-3.5 py-2 font-mono text-[12px] font-semibold text-pine-900 shadow-tactile-xs"
            >
              External Reference / Source Link <ExternalLink className="size-3.5" />
            </a>
          </div>
        )}

        {a.researchBasis && (
          <div className="mt-7 grid gap-3 rounded-lg border border-dashed border-pine-900/40 p-4 font-mono text-[11.5px] text-pine-900 sm:grid-cols-[auto_1fr_auto] sm:items-center">
            <FlaskConical className="size-5 text-pine-600" />
            <div>
              <p className="uppercase tracking-wider text-pine-600">Research basis</p>
              <p className="mt-0.5">{a.researchBasis.journalOrInst}</p>
              <p className="text-pine-900/60">{a.researchBasis.doiOrSource}</p>
            </div>
            <span className="rounded-md border border-pine-900 bg-canvas-card px-2.5 py-1.5 text-[13px] font-semibold shadow-tactile-xs">
              {a.researchBasis.keyMetric}
            </span>
          </div>
        )}

        <div className="mt-6">
          <LinkedInReactionSummary
            counts={a.reactionCounts}
            fallbackTotal={a.stats.likes}
            userReaction={a.userReaction}
            onOpenBreakdown={onOpenReactionsBreakdown}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="rounded-lg border border-pine-900 bg-canvas-card shadow-tactile-xs">
            <LinkedInReactionPickerButton
              userReaction={a.userReaction}
              onSelect={onReact}
              countLabel={rxTotal > 0 ? formatBengaliNumberCompact(rxTotal) : undefined}
            />
          </div>
          <button
            type="button"
            onClick={onShare}
            className="flex h-10 items-center gap-2 rounded-lg border border-pine-900 bg-canvas-card px-4 text-[14px] font-semibold text-pine-900 shadow-tactile-xs shadow-tactile-hover"
          >
            <Share2 className="size-[18px]" />
            Share
          </button>
        </div>

        <section className="mt-8 border-t border-pine-900 pt-5">
          <h2 className="font-display text-[22px] font-semibold text-pine-900">
            আলোচনা <span className="font-mono text-[13px] text-pine-600">({toBengaliNumerals(a.stats.commentsCount)})</span>
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (text.trim()) {
                onComment(text.trim());
                setText('');
              }
            }}
            className="mt-3 flex items-start gap-2.5"
          >
            <Avatar src={currentUser?.avatar || 'PS'} name={currentUser?.name || 'User'} size="size-9" />
            <div className="flex-1 rounded-xl border border-pine-900/30 bg-canvas-card focus-within:border-pine-900">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={2}
                placeholder="তথ্যভিত্তিক মতামত দিন…"
                className="w-full resize-none bg-transparent px-3 py-2 font-bangla text-[14.5px] text-pine-900 outline-none placeholder:text-pine-900/40"
              />
              <div className="flex justify-end px-2 pb-2">
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="flex h-8 items-center gap-1.5 rounded-md bg-pine-900 px-3 text-[12.5px] font-semibold text-canvas disabled:opacity-40"
                >
                  <Send className="size-3.5" />
                  Post Comment
                </button>
              </div>
            </div>
          </form>
          <ul className="mt-4 space-y-4">
            {a.comments.map((c) => (
              <li key={c.id} className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    if (!isStandalonePage) onClose();
                    onNavigateProfile(c.authorId);
                  }}
                >
                  <Avatar src={c.avatar} name={c.author} size="size-9" />
                </button>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isStandalonePage) onClose();
                      onNavigateProfile(c.authorId);
                    }}
                    className="font-bangla text-[13.5px] font-semibold text-pine-900 hover:underline"
                  >
                    {c.author} <span className="font-normal text-pine-900/50">· {c.role}</span>
                  </button>
                  <p className="font-bangla text-[14.5px] leading-relaxed text-pine-900/85">{c.text}</p>
                  <div className="mt-1 flex items-center gap-2 font-mono text-[10px] text-pine-600">
                    <span>{c.timestamp}</span>
                    {onReactComment && (
                      <LinkedInReactionPickerButton
                        compact
                        userReaction={c.userReaction}
                        onSelect={(type) => onReactComment(c.id, type)}
                        countLabel={c.likes > 0 ? String(c.likes) : undefined}
                      />
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}

export function ArticleReaderModal(props: Props) {
  if (!props.article) return null;
  return (
    <Modal open={!!props.article} onClose={props.onClose} className="max-w-[760px]" labelledBy="reader-title">
      <ArticleReaderContent {...props} article={props.article} />
    </Modal>
  );
}
