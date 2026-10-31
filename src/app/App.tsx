import { useCallback, useMemo, useState } from 'react';
import { Toaster, toast } from 'sonner';
import type { Article, CommunityPost, FeaturedScientist, UpcomingEvent } from './types';
import {
  INITIAL_ARTICLES, COMMUNITY_POSTS, STORY_REELS, TOPIC_STORIES, UPCOMING_EVENTS, TRENDING_ITEMS,
  FEATURED_SCIENTISTS, RESEARCH_PAPERS, NOTIFICATIONS, REEL_PHOTO,
} from './data/mockData';
import {
  toggleBookmarkId, toggleArticleReaction, appendArticleComment, togglePostReaction, appendPostComment, makeComment, toBengaliNumerals,
} from './utils/pureLogic';
import { Header, LAYOUT_GRID, FEED_WIDTH, type View } from './components/Header';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { CentralFeed } from './components/CentralFeed';
import { FacebookCreatePostModal } from './components/FacebookCreatePostModal';
import { AskAIModal } from './components/AskAIModal';
import { ArticleReaderModal } from './components/ArticleReaderModal';
import { ReelPlayerModal, type PlayerItem } from './components/ReelPlayerModal';
import { SavedArticlesModal } from './components/SavedArticlesModal';
import { CreatePostModal } from './components/CreatePostModal';
import { ExploreView, EventsView, StoreView, IdeasView, NotificationsView, ProfileView } from './components/Views';
import { cn } from './components/Primitives';

const REEL_ITEMS: PlayerItem[] = STORY_REELS.map((r) => ({
  id: r.id, title: r.title, creator: r.creator, avatar: r.creatorAvatar, image: REEL_PHOTO[r.videoType], meta: `${r.location} · ${r.duration}`, likes: r.likes,
}));
const STORY_ITEMS: PlayerItem[] = TOPIC_STORIES.map((s) => ({
  id: s.id, title: s.title, creator: s.authorName ?? 'Plainsyt', avatar: s.authorAvatar ?? 'PS', image: s.imageUrl.replace('w=360&h=640', 'w=720&h=1280'), meta: `${s.category} · ${s.readsCount} reads`, likes: 0,
}));
const TRENDING_TO_ARTICLE: Record<string, string> = { t1: 'a1', t2: 'a2', t3: 'a3', t4: 'a4' };

export default function App() {
  const [view, setView] = useState<View>('home');
  const [dark, setDark] = useState(false);
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [posts, setPosts] = useState<CommunityPost[]>(COMMUNITY_POSTS);
  const [bookmarkIds, setBookmarkIds] = useState<string[]>(['a3']);
  const [events, setEvents] = useState<UpcomingEvent[]>(UPCOMING_EVENTS);
  const [scientists, setScientists] = useState<FeaturedScientist[]>(FEATURED_SCIENTISTS);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [pillar, setPillar] = useState<string | null>(null);
  const [reelState, setReelState] = useState({ liked: false, saved: false, following: false });

  const [fbOpen, setFbOpen] = useState<false | 'post' | 'video'>(false);
  const [writeOpen, setWriteOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [readerId, setReaderId] = useState<string | null>(null);
  const [player, setPlayer] = useState<{ items: PlayerItem[]; start: number } | null>(null);

  const goView = useCallback((v: View) => { setView(v); window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);
  const toggleDark = () => setDark((d) => { document.documentElement.classList.toggle('dark', !d); return !d; });

  const updateArticle = (id: string, fn: (a: Article) => Article) => setArticles((s) => s.map((a) => (a.id === id ? fn(a) : a)));
  const updatePost = (id: string, fn: (p: CommunityPost) => CommunityPost) => setPosts((s) => s.map((p) => (p.id === id ? fn(p) : p)));

  const bookmark = (id: string) => {
    const was = bookmarkIds.includes(id);
    setBookmarkIds((s) => toggleBookmarkId(s, id));
    toast(was ? 'সংরক্ষিত তালিকা থেকে সরানো হয়েছে' : 'সংরক্ষিত তালিকায় যোগ হয়েছে', { description: articles.find((a) => a.id === id)?.title });
  };
  const share = (label: string) => {
    navigator.clipboard?.writeText(`https://plainsyt.com/s/${encodeURIComponent(label.slice(0, 24))}`).catch(() => {});
    toast.success('লিংক কপি হয়েছে', { description: label });
  };

  const savedArticles = useMemo(() => articles.filter((a) => bookmarkIds.includes(a.id)), [articles, bookmarkIds]);
  const savedPosts = useMemo(() => posts.filter((p) => p.userSaved), [posts]);
  const savedCount = savedArticles.length + savedPosts.length;
  const reader = articles.find((a) => a.id === readerId) ?? null;

  const openTrending = (id: string) => {
    const aid = TRENDING_TO_ARTICLE[id];
    if (aid) setReaderId(aid);
    else setAiOpen(true);
  };

  const mainContent = (() => {
    switch (view) {
      case 'explore':
        return <ExploreView articles={articles} papers={RESEARCH_PAPERS} trending={TRENDING_ITEMS} pillar={pillar} onPillar={setPillar} onOpenArticle={setReaderId} onOpenTrending={openTrending} />;
      case 'events':
        return <EventsView events={events} onToggle={toggleEvent} />;
      case 'store':
        return <StoreView onAdd={(n) => toast.success('কার্টে যোগ হয়েছে', { description: n })} />;
      case 'ideas':
        return <IdeasView />;
      case 'notifications':
        return <NotificationsView items={notifications} onRead={readAll} />;
      case 'profile':
        return (
          <ProfileView savedArticles={savedArticles} savedPosts={savedPosts} myPosts={posts.filter((p) => p.id.startsWith('user-')).length}
            onOpenArticle={setReaderId} onRemoveArticle={(id) => setBookmarkIds((s) => toggleBookmarkId(s, id))}
            onRemovePost={(id) => updatePost(id, (p) => ({ ...p, userSaved: false }))} dark={dark} onToggleDark={toggleDark} />
        );
      default:
        return (
          <CentralFeed
            articles={articles}
            posts={posts}
            stories={TOPIC_STORIES}
            reel={STORY_REELS[0]}
            reelLiked={reelState.liked}
            reelSaved={reelState.saved}
            reelFollowing={reelState.following}
            bookmarkIds={bookmarkIds}
            onOpenCreatePost={() => setFbOpen('post')}
            onWriteArticle={() => setWriteOpen(true)}
            onUploadVideo={() => setFbOpen('video')}
            onAskAI={() => setAiOpen(true)}
            onOpenStory={(i) => setPlayer({ items: STORY_ITEMS, start: i })}
            onCreateStory={() => setFbOpen('post')}
            onOpenArticle={setReaderId}
            onLikeArticle={(id) => updateArticle(id, toggleArticleReaction)}
            onBookmarkArticle={bookmark}
            onCommentArticle={(id, t) => updateArticle(id, (a) => appendArticleComment(a, makeComment(t)))}
            onLikePost={(id) => updatePost(id, togglePostReaction)}
            onSavePost={(id) => {
              const p = posts.find((x) => x.id === id);
              updatePost(id, (x) => ({ ...x, userSaved: !x.userSaved }));
              toast(p?.userSaved ? 'পোস্ট সরানো হয়েছে' : 'পোস্ট সংরক্ষিত হয়েছে');
            }}
            onCommentPost={(id, t) => updatePost(id, (p) => appendPostComment(p, makeComment(t)))}
            onShare={share}
            onPlayReel={() => setPlayer({ items: REEL_ITEMS, start: 0 })}
            onLikeReel={() => setReelState((s) => ({ ...s, liked: !s.liked }))}
            onSaveReel={() => setReelState((s) => ({ ...s, saved: !s.saved }))}
            onFollowReel={() => setReelState((s) => ({ ...s, following: !s.following }))}
            onApplyIRCB={() => toast.success('IRCB Open Call 2026', { description: 'গাইডলাইন PDF ডাউনলোড শুরু হয়েছে · ডেডলাইন ৩১ জানুয়ারি ২০২৬' })}
          />
        );
    }
  })();

  function toggleEvent(id: string) {
    const e = events.find((x) => x.id === id);
    setEvents((s) => s.map((x) => (x.id === id ? { ...x, isRegistered: !x.isRegistered } : x)));
    if (e && !e.isRegistered) toast.success('রেজিস্ট্রেশন সম্পন্ন', { description: `${e.title} · ${e.dateMonth} ${e.dateDay}` });
  }
  function readAll() {
    setNotifications((s) => s.map((n) => ({ ...n, unread: false })));
  }

  return (
    <div className={cn('min-h-screen bg-canvas text-pine-900', dark && 'dark')}>
      <Header
        view={view}
        onView={goView}
        dark={dark}
        onToggleDark={toggleDark}
        savedCount={savedCount}
        onOpenSaved={() => setSavedOpen(true)}
        onOpenReels={() => setPlayer({ items: REEL_ITEMS, start: 0 })}
        onOpenAI={() => setAiOpen(true)}
        notifications={notifications}
        onReadNotifications={readAll}
        articles={articles}
        posts={posts}
        onOpenArticle={setReaderId}
      />

      <div className={cn('mx-auto grid max-w-[1440px] grid-cols-1 gap-6 sm:px-4 sm:pt-5 pt-2', LAYOUT_GRID)}>
        <LeftSidebar
          savedCount={savedCount}
          onOpenSaved={() => setSavedOpen(true)}
          onOpenReels={() => setPlayer({ items: REEL_ITEMS, start: 0 })}
          onOpenAI={() => setAiOpen(true)}
          onView={goView}
          activePillar={pillar}
          onPillar={setPillar}
        />
        <main className={cn(FEED_WIDTH, 'min-w-0 pb-10')}>{mainContent}</main>
        <RightSidebar
          trending={TRENDING_ITEMS}
          events={events}
          scientists={scientists}
          onToggleEvent={toggleEvent}
          onToggleFollow={(id) => {
            const s = scientists.find((x) => x.id === id);
            setScientists((all) => all.map((x) => (x.id === id ? { ...x, isFollowing: !x.isFollowing } : x)));
            if (s && !s.isFollowing) toast(`${s.name}-কে ফলো করছেন`);
          }}
          onOpenTrending={openTrending}
          onView={goView}
        />
      </div>

      <FacebookCreatePostModal
        open={!!fbOpen}
        videoHint={fbOpen === 'video'}
        onClose={() => setFbOpen(false)}
        onSubmit={(p) => {
          setPosts((s) => [p, ...s]);
          goView('home');
          toast.success('পোস্ট প্রকাশিত হয়েছে', { description: 'আপনার পোস্ট এখন কমিউনিটি ফিডের শীর্ষে।' });
        }}
      />
      <CreatePostModal
        open={writeOpen}
        onClose={() => setWriteOpen(false)}
        onPublish={(a) => {
          setArticles((s) => [a, ...s]);
          goView('home');
          toast.success('প্রতিবেদন প্রকাশিত', { description: `${toBengaliNumerals(a.readTimeMinutes)} মিনিট পড়া · ${a.category}` });
        }}
      />
      <AskAIModal open={aiOpen} onClose={() => setAiOpen(false)} />
      <SavedArticlesModal
        open={savedOpen}
        onClose={() => setSavedOpen(false)}
        articles={savedArticles}
        posts={savedPosts}
        onOpenArticle={setReaderId}
        onRemoveArticle={(id) => setBookmarkIds((s) => toggleBookmarkId(s, id))}
        onRemovePost={(id) => updatePost(id, (p) => ({ ...p, userSaved: false }))}
      />
      <ArticleReaderModal
        article={reader}
        bookmarked={!!reader && bookmarkIds.includes(reader.id)}
        onClose={() => setReaderId(null)}
        onLike={() => reader && updateArticle(reader.id, toggleArticleReaction)}
        onBookmark={() => reader && bookmark(reader.id)}
        onComment={(t) => reader && updateArticle(reader.id, (a) => appendArticleComment(a, makeComment(t)))}
        onShare={() => reader && share(reader.title)}
      />
      <ReelPlayerModal items={player?.items ?? null} start={player?.start ?? 0} onClose={() => setPlayer(null)} onShare={share} />
      <Toaster position="bottom-center" toastOptions={{ className: 'font-bangla !rounded-xl !border !border-[#04301f] !shadow-[3px_3px_0_#04301f] !bg-[#fdfaf5] !text-[#04301f]' }} />
    </div>
  );
}
