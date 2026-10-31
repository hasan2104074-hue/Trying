import type { ReactElement } from 'react';
import { Database, PenLine, Sparkles, UserPlus, Video } from 'lucide-react';
import type {
  Article, CommunityPost, LinkedInReactionType, ReactionTargetType, StoryReel, TopicStory, UserProfile,
} from '../types';
import { PostCreatorBar } from './PostCreatorBar';
import { TopicStoriesCarousel } from './TopicStoriesCarousel';
import { ArticleCard } from './ArticleCard';
import { CommunityPostCard } from './CommunityPostCard';
import { IntegratedReelCard } from './IntegratedReelCard';
import { FEED_CARD, cn } from './Primitives';
import { Footer } from './Footer';

export interface FeedApi {
  currentUser: UserProfile | null;
  articles: Article[];
  posts: CommunityPost[];
  stories: TopicStory[];
  reels: StoryReel[];
  savedReelIds: string[];
  followingIds: string[];
  bookmarkIds: string[];
  onWriteArticle: () => void;
  onUploadVideo: () => void;
  onAskAI: () => void;
  onOpenProfileSettings: () => void;
  onOpenSupabaseConsole: () => void;
  onOpenStory: (i: number) => void;
  onCreateStory: () => void;
  onOpenArticlePopup: (id: string) => void;
  onReact: (targetType: ReactionTargetType, targetId: string, type: LinkedInReactionType) => void;
  onOpenReactionsBreakdown: (targetType: ReactionTargetType, targetId: string) => void;
  onBookmarkArticle: (id: string) => void;
  onCommentArticle: (id: string, text: string) => void;
  onSavePost: (id: string) => void;
  onCommentPost: (id: string, text: string) => void;
  onShare: (label: string) => void;
  onPlayReel: (index: number) => void;
  onSaveReel: (id: string) => void;
  onToggleFollow: (userId: string) => void;
  onNavigateProfile: (userId: string) => void;
  onOpenPhoto: (images: string[], index: number, title?: string, subtitle?: string, authorName?: string, authorId?: string) => void;
}

export function CentralFeed(f: FeedApi) {
  const renderArticle = (a: Article, lead = false) => (
    <ArticleCard
      key={a.id}
      article={a}
      lead={lead}
      bookmarked={f.bookmarkIds.includes(a.id)}
      currentUser={f.currentUser}
      onOpenPopup={() => f.onOpenArticlePopup(a.id)}
      onReact={(type) => f.onReact('article', a.id, type)}
      onOpenReactionsBreakdown={() => f.onOpenReactionsBreakdown('article', a.id)}
      onBookmark={() => f.onBookmarkArticle(a.id)}
      onComment={(t) => f.onCommentArticle(a.id, t)}
      onReactComment={(cid, type) => f.onReact('comment', cid, type)}
      onShare={() => f.onShare(a.title)}
      onNavigateProfile={f.onNavigateProfile}
      onOpenPhoto={(src, title, subtitle, authorName, authorId) =>
        f.onOpenPhoto([src], 0, title, subtitle, authorName, authorId)
      }
    />
  );

  const renderPost = (p: CommunityPost) => (
    <CommunityPostCard
      key={p.id}
      post={p}
      currentUser={f.currentUser}
      onReact={(type) => f.onReact('post', p.id, type)}
      onOpenReactionsBreakdown={() => f.onOpenReactionsBreakdown('post', p.id)}
      onSave={() => f.onSavePost(p.id)}
      onComment={(t) => f.onCommentPost(p.id, t)}
      onReactComment={(cid, type) => f.onReact('comment', cid, type)}
      onShare={() => f.onShare(p.author.name)}
      onNavigateProfile={f.onNavigateProfile}
      onOpenPhoto={(imgs, idx, title, authorName, authorId) =>
        f.onOpenPhoto(imgs, idx, title, undefined, authorName, authorId)
      }
    />
  );

  const [leadArticle, ...restArticles] = f.articles;
  const firstReel = f.reels[0];

  // Interleave articles and community posts cleanly
  const stream: ReactElement[] = [];
  if (leadArticle) stream.push(renderArticle(leadArticle, true));
  if (f.posts[0]) stream.push(renderPost(f.posts[0]));
  if (firstReel) {
    stream.push(
      <IntegratedReelCard
        key={firstReel.id}
        reel={firstReel}
        saved={f.savedReelIds.includes(firstReel.id)}
        following={f.followingIds.includes(firstReel.creatorId)}
        onPlay={() => f.onPlayReel(0)}
        onReact={(type) => f.onReact('reel', firstReel.id, type)}
        onSave={() => f.onSaveReel(firstReel.id)}
        onShare={() => f.onShare(firstReel.title)}
        onFollow={() => f.onToggleFollow(firstReel.creatorId)}
        onNavigateProfile={f.onNavigateProfile}
      />,
    );
  }
  const remainingPosts = f.posts.slice(1);
  const maxLen = Math.max(restArticles.length, remainingPosts.length);
  for (let i = 0; i < maxLen; i++) {
    if (remainingPosts[i]) stream.push(renderPost(remainingPosts[i]));
    if (restArticles[i]) stream.push(renderArticle(restArticles[i], false));
  }

  const isEmpty = f.articles.length === 0 && f.posts.length === 0 && f.reels.length === 0;

  return (
    <div className="flex flex-col gap-2 sm:gap-5">
      <PostCreatorBar
        currentUser={f.currentUser}
        onWriteArticle={f.onWriteArticle}
        onUploadVideo={f.onUploadVideo}
        onAskAI={f.onAskAI}
        onNavigateProfile={() =>
          f.currentUser ? f.onNavigateProfile(f.currentUser.id) : f.onOpenProfileSettings()
        }
      />

      <div className="bg-canvas-card py-2.5 sm:bg-transparent sm:py-0">
        <TopicStoriesCarousel
          stories={f.stories}
          currentUser={f.currentUser}
          onOpen={f.onOpenStory}
          onCreate={f.onCreateStory}
          onNavigateProfile={f.onNavigateProfile}
        />
      </div>

      {isEmpty ? (
        <section className={cn(FEED_CARD, 'p-6 text-center sm:p-8')}>
          <span className="mx-auto flex size-12 items-center justify-center rounded-full border border-pine-900 bg-pine-100 text-pine-800">
            <Database className="size-6" />
          </span>
          <h2 className="mt-3 font-display text-[24px] font-bold text-pine-950">
            100% Live Supabase Feed — Zero Fake Data
          </h2>
          <p className="mx-auto mt-1.5 max-w-[460px] font-bangla text-[14.5px] leading-relaxed text-pine-900/70">
            এই প্ল্যাটফর্মে কোনো হার্ডকোডেড বা ফেক ডেটা নেই। আপনার প্রোফাইল তৈরি করুন এবং প্রথম প্রতিবেদন বা ভিডিও রিল প্রকাশ করুন — সব ডেটা সরাসরি Supabase-এ সংরক্ষিত হবে।
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            {!f.currentUser && (
              <button
                type="button"
                onClick={f.onOpenProfileSettings}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-pine-900 bg-pine-900 px-4 text-[13.5px] font-semibold text-canvas shadow-tactile-xs shadow-tactile-hover"
              >
                <UserPlus className="size-4" /> Create Your Profile First
              </button>
            )}
            <button
              type="button"
              onClick={f.onWriteArticle}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-pine-900 bg-canvas-card px-4 text-[13.5px] font-semibold text-pine-900 shadow-tactile-xs shadow-tactile-hover"
            >
              <PenLine className="size-4 text-pine-600" /> Write First Article
            </button>
            <button
              type="button"
              onClick={f.onUploadVideo}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-pine-900 bg-canvas-card px-4 text-[13.5px] font-semibold text-pine-900 shadow-tactile-xs shadow-tactile-hover"
            >
              <Video className="size-4 text-[#e41e3f]" /> Upload Video / Story
            </button>
            <button
              type="button"
              onClick={f.onOpenSupabaseConsole}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-pine-900/35 bg-canvas-subtle px-3.5 font-mono text-[12px] font-semibold text-pine-900 hover:border-pine-900"
            >
              <Sparkles className="size-3.5 text-pine-600" /> Supabase SQL &amp; Status
            </button>
          </div>
        </section>
      ) : (
        stream
      )}

      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <span className="font-display text-[22px] italic text-pine-900/40">— শেষ —</span>
        <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-pine-600">
          Synced with Supabase · fycghkjzodjrqornkton
        </p>
      </div>
      <Footer compact className="pb-8 text-center lg:hidden" />
    </div>
  );
}
