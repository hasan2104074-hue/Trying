import { Image as ImageIcon, PenLine, Video, Sparkles } from 'lucide-react';
import type { UserProfile } from '../types';
import { Avatar, CARD, cn } from './Primitives';

interface Props {
  currentUser: UserProfile | null;
  onWriteArticle: () => void;
  onUploadVideo: () => void;
  onAskAI: () => void;
  onNavigateProfile: () => void;
}

export function PostCreatorBar(p: Props) {
  const firstName = p.currentUser ? p.currentUser.name.split(' ')[0] : 'Researcher';
  // "Create Post" option removed per specification
  const actions = [
    { label: 'Write Article', icon: PenLine, onClick: p.onWriteArticle, tone: 'text-pine-600' },
    { label: 'Upload Video', icon: Video, onClick: p.onUploadVideo, tone: 'text-[#e41e3f]' },
    { label: 'Ask AI', icon: Sparkles, onClick: p.onAskAI, tone: 'text-[#b7791f]' },
  ];
  return (
    <section className={cn(CARD, 'rounded-none border-x-0 shadow-none sm:rounded-xl sm:border-x sm:shadow-tactile')}>
      <div className="flex items-center gap-2.5 px-3 pb-2.5 pt-3 sm:px-4">
        <button type="button" onClick={p.onNavigateProfile} aria-label="Go to your profile">
          <Avatar
            src={p.currentUser?.avatar || 'PS'}
            name={p.currentUser?.name || 'User'}
            size="size-10"
            online
          />
        </button>
        <button
          type="button"
          onClick={p.onWriteArticle}
          className="flex h-10 flex-1 items-center rounded-full border border-canvas-border bg-canvas-subtle px-4 text-left text-[14.5px] text-pine-900/55 transition hover:bg-pine-50"
        >
          What&apos;s on your mind, {firstName}?
        </button>
        <button
          type="button"
          onClick={p.onWriteArticle}
          aria-label="Add photo to article"
          className="flex size-10 items-center justify-center rounded-full text-[#45bd62] transition hover:bg-canvas-subtle"
        >
          <ImageIcon className="size-6" />
        </button>
      </div>
      <div className="grid grid-cols-3 border-t border-canvas-border px-1.5 py-1">
        {actions.map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={a.onClick}
            className="flex flex-col items-center justify-center gap-1 rounded-lg px-1 py-1.5 text-[11px] font-semibold text-pine-900/75 transition hover:bg-canvas-subtle sm:flex-row sm:gap-1.5 sm:py-2 sm:text-[13px]"
          >
            <a.icon className={cn('size-[18px] shrink-0', a.tone)} />
            <span className="truncate">{a.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
