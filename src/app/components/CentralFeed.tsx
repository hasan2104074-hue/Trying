import type { ReactElement } from 'react';
import type { Article, CommunityPost, StoryReel, TopicStory } from '../types';
import { PostCreatorBar } from './PostCreatorBar';
import { TopicStoriesCarousel } from './TopicStoriesCarousel';
import { ArticleCard } from './ArticleCard';
import { CommunityPostCard } from './CommunityPostCard';
import { IntegratedReelCard } from './IntegratedReelCard';
import { ResearchDiscoveryCard } from './ResearchDiscoveryCard';
import { Footer } from './Footer';

export interface FeedApi {
  articles: Article[];
  posts: CommunityPost[];
  stories: TopicStory[];
  reel: StoryReel;
  reelLiked: boolean;
  reelSaved: boolean;
  reelFollowing: boolean;
  bookmarkIds: string[];
  onOpenCreatePost: () => void;
  onWriteArticle: () => void;
  onUploadVideo: () => void;
  onAskAI: () => void;
  onOpenStory: (i: number) => void;
  onCreateStory: () => void;
  onOpenArticle: (id: string) => void;
  onLikeArticle: (id: string) => void;
  onBookmarkArticle: (id: string) => void;
  onCommentArticle: (id: string, text: string) => void;
  onLikePost: (id: string) => void;
  onSavePost: (id: string) => void;
  onCommentPost: (id: string, text: string) => void;
  onShare: (label: string) => void;
  onPlayReel: () => void;
  onLikeReel: () => void;
  onSaveReel: () => void;
  onFollowReel: () => void;
  onApplyIRCB: () => void;
}

export function CentralFeed(f: FeedApi) {
  const art = (a: Article, lead = false) => (
    <ArticleCard
      key={a.id}
      article={a}
      lead={lead}
      bookmarked={f.bookmarkIds.includes(a.id)}
      onOpen={() => f.onOpenArticle(a.id)}
      onLike={() => f.onLikeArticle(a.id)}
      onBookmark={() => f.onBookmarkArticle(a.id)}
      onComment={(t) => f.onCommentArticle(a.id, t)}
      onShare={() => f.onShare(a.title)}
    />
  );
  const post = (p: CommunityPost) => (
    <CommunityPostCard
      key={p.id}
      post={p}
      onLike={() => f.onLikePost(p.id)}
      onSave={() => f.onSavePost(p.id)}
      onComment={(t) => f.onCommentPost(p.id, t)}
      onShare={() => f.onShare(p.author.name)}
    />
  );

  const userPosts = f.posts.filter((p) => p.id.startsWith('user-'));
  const byId = (id: string) => f.posts.find((p) => p.id === id);
  const [lead, ...restArticles] = f.articles;
  const fixed = new Set(['p1', 'p2']);
  const otherPosts = f.posts.filter((p) => !p.id.startsWith('user-') && !fixed.has(p.id));

  // interleave remaining articles and posts
  const tail: ReactElement[] = [];
  const max = Math.max(restArticles.length, otherPosts.length);
  for (let i = 0; i < max; i++) {
    if (otherPosts[i]) tail.push(post(otherPosts[i]));
    if (restArticles[i]) tail.push(art(restArticles[i]));
  }

  const p1 = byId('p1');
  const p2 = byId('p2');

  return (
    <div className="flex flex-col gap-2 sm:gap-5">
      <PostCreatorBar onOpenCreatePost={f.onOpenCreatePost} onWriteArticle={f.onWriteArticle} onUploadVideo={f.onUploadVideo} onAskAI={f.onAskAI} />
      <div className="bg-canvas-card py-2.5 sm:bg-transparent sm:py-0">
        <TopicStoriesCarousel stories={f.stories} onOpen={f.onOpenStory} onCreate={f.onCreateStory} />
      </div>
      {userPosts.map(post)}
      {lead && art(lead, true)}
      {p1 && post(p1)}
      <IntegratedReelCard
        reel={f.reel}
        liked={f.reelLiked}
        saved={f.reelSaved}
        following={f.reelFollowing}
        onPlay={f.onPlayReel}
        onLike={f.onLikeReel}
        onSave={f.onSaveReel}
        onShare={() => f.onShare(f.reel.title)}
        onFollow={f.onFollowReel}
      />
      {p2 && post(p2)}
      <ResearchDiscoveryCard onApply={f.onApplyIRCB} />
      {tail}
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <span className="font-display text-[22px] italic text-pine-900/40">— শেষ —</span>
        <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-pine-600">You&apos;re all caught up</p>
      </div>
      <Footer compact className="pb-8 text-center lg:hidden" />
    </div>
  );
}
