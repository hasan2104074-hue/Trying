import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Toaster, toast } from 'sonner';
import { ArrowLeft, PenLine } from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  readSnapshot, writeSnapshot, fetchFromSupabase, syncLocalToSupabase, mutateSnapshotReaction,
  dbUpsertProfile, dbUpsertArticle, dbUpsertPost, dbInsertComment, dbSetReaction,
  dbUpsertReel, dbUpsertStory, dbUpsertProduct, dbInsertOrder, dbUpsertEvent,
  dbUpsertResearchPaper, dbUpsertIdea,
  type DatabaseSnapshot, type SupabaseConnectionStatus,
} from '../lib/db';
import type {
  Article, BkashOrder, CommunityPost, LightboxPayload, LinkedInReactionType,
  ReactionTargetType, ResearchPaper, StoryReel, StoreProduct, TopicStory, UpcomingEvent, UserProfile,
} from '../types';
import {
  toggleBookmarkId, appendArticleComment, appendPostComment, makeComment, toBengaliNumerals,
} from '../utils/pureLogic';
import { Header, LAYOUT_GRID, FEED_WIDTH, type View } from './Header';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { CentralFeed } from './CentralFeed';
import { FacebookCreatePostModal } from './FacebookCreatePostModal';
import { AskAIModal } from './AskAIModal';
import { ArticleReaderModal, ArticleReaderContent } from './ArticleReaderModal';
import { ReelPlayerModal, type PlayerItem } from './ReelPlayerModal';
import { SavedArticlesModal } from './SavedArticlesModal';
import { CreatePostModal } from './CreatePostModal';
import { ExploreView, EventsView, StoreView, IdeasView, NotificationsView, ProfileView } from './Views';
import { PhotoLightboxModal } from './PhotoLightboxModal';
import { ProfileSettingsModal } from './ProfileSettingsModal';
import { BkashCheckoutModal, CreateProductModal } from './BkashCheckoutModal';
import { ReactionBreakdownModal } from './LinkedInReactionBar';
import { SiteLoader } from './SiteLoader';
import { EventRegistrationModal } from './EventRegistrationModal';
import { EventDetailPage } from './EventDetailPage';
import { Footer } from './Footer';
import { FEED_CARD, cn } from './Primitives';

export function RootShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ userId?: string; articleId?: string; eventId?: string }>();

  const [snap, setSnap] = useState<DatabaseSnapshot>(() => readSnapshot());
  const [supaStatus, setSupaStatus] = useState<SupabaseConnectionStatus>('checking');
  const [supaError, setSupaError] = useState<string | undefined>();
  const [dark, setDark] = useState(false);

  // Active modals/popups
  const [writeOpen, setWriteOpen] = useState(false);
  const [reelUploadOpen, setReelUploadOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [profileSettingsOpen, setProfileSettingsOpen] = useState(false);
  const [createProductOpen, setCreateProductOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [registrationEvent, setRegistrationEvent] = useState<UpcomingEvent | null>(null);
  const [readerId, setReaderId] = useState<string | null>(null);
  const [player, setPlayer] = useState<{ items: PlayerItem[]; start: number } | null>(null);
  const [lightbox, setLightbox] = useState<LightboxPayload | null>(null);
  const [rxBreakdown, setRxBreakdown] = useState<{ targetType: ReactionTargetType; targetId: string } | null>(null);
  const [pillar, setPillar] = useState<string | null>(null);
  const [savedReelIds, setSavedReelIds] = useState<string[]>([]);

  const commit = useCallback((updater: (prev: DatabaseSnapshot) => DatabaseSnapshot) => {
    setSnap((prev) => {
      const next = updater(prev);
      writeSnapshot(next);
      return next;
    });
  }, []);

  const refreshFromSupabase = useCallback(async () => {
    const res = await fetchFromSupabase(60);
    setSupaStatus(res.status);
    setSupaError(res.errorMessage);
    if (res.snapshot) {
      setSnap(res.snapshot);
    }
  }, []);

  useEffect(() => {
    refreshFromSupabase();
    const channel = supabase
      .channel('plainsyt-realtime-sync')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        refreshFromSupabase();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshFromSupabase]);

  const currentUser = useMemo(
    () => snap.profiles.find((p) => p.id === snap.currentUserId) ?? snap.profiles[0] ?? null,
    [snap.profiles, snap.currentUserId],
  );

  // Ensure a profile exists when an action requires an author/actor
  const ensureActor = useCallback((): UserProfile => {
    if (currentUser) return currentUser;
    const autoProfile: UserProfile = {
      id: `u-${Date.now().toString(36)}`,
      name: 'Plainsyt Member',
      nameBn: 'প্লেইনসাইট সদস্য',
      handle: `member.${Date.now().toString(36).slice(-4)}`,
      role: 'Agri-Tech Researcher',
      organization: 'Plainsyt',
      location: 'Bangladesh',
      bio: '',
      avatar: 'PM',
      coverGradient: 'linear-gradient(135deg, #04301f 0%, #17754f 55%, #f2c14e 100%)',
      isVerified: true,
      focusArea: 'Agri-Tech & Agronomy',
      publicationsCount: 0,
      followersCount: 0,
      followingCount: 0,
      createdAt: new Date().toISOString(),
    };
    commit((prev) => ({
      ...prev,
      profiles: [autoProfile, ...prev.profiles],
      currentUserId: autoProfile.id,
    }));
    dbUpsertProfile(autoProfile);
    return autoProfile;
  }, [currentUser, commit]);

  const activeView: View = useMemo(() => {
    const p = location.pathname;
    if (p.startsWith('/explore')) return 'explore';
    if (p.startsWith('/events')) return 'events';
    if (p.startsWith('/store')) return 'store';
    if (p.startsWith('/ideas')) return 'ideas';
    if (p.startsWith('/notifications')) return 'notifications';
    if (p.startsWith('/profile')) return 'profile';
    return 'home';
  }, [location.pathname]);

  const goNavigate = useCallback(
    (path: string) => {
      setReaderId(null);
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [navigate],
  );

  const navigateToProfile = useCallback(
    (userId: string) => {
      if (!userId) return;
      setReaderId(null);
      navigate(`/profile/${userId}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [navigate],
  );

  const toggleDark = () =>
    setDark((d) => {
      document.documentElement.classList.toggle('dark', !d);
      return !d;
    });

  // LinkedIn Reaction Handler (persists to Supabase)
  const handleReact = useCallback(
    (targetType: ReactionTargetType, targetId: string, chosen: LinkedInReactionType) => {
      const actor = ensureActor();
      let result: ReturnType<typeof mutateSnapshotReaction> | null = null;
      commit((prev) => {
        result = mutateSnapshotReaction(prev, targetType, targetId, actor, chosen);
        return result.next;
      });
      if (result) {
        const { finalReaction, counts, total } = result;
        dbSetReaction(targetType, targetId, actor, finalReaction, counts, total);
      }
    },
    [commit, ensureActor],
  );

  const handleBookmarkArticle = useCallback(
    (articleId: string) => {
      const was = snap.bookmarkedArticleIds.includes(articleId);
      commit((prev) => ({
        ...prev,
        bookmarkedArticleIds: toggleBookmarkId(prev.bookmarkedArticleIds, articleId),
      }));
      toast(was ? 'সংরক্ষিত তালিকা থেকে সরানো হয়েছে' : 'সংরক্ষিত তালিকায় যোগ হয়েছে');
    },
    [snap.bookmarkedArticleIds, commit],
  );

  const handleCommentArticle = useCallback(
    (articleId: string, text: string) => {
      const actor = ensureActor();
      const newComment = makeComment(text, actor, 'article', articleId);
      let updatedArticle: Article | undefined;
      commit((prev) => {
        const articles = prev.articles.map((a) => {
          if (a.id !== articleId) return a;
          updatedArticle = appendArticleComment(a, newComment);
          return updatedArticle;
        });
        return {
          ...prev,
          comments: [newComment, ...prev.comments],
          articles,
        };
      });
      dbInsertComment(newComment);
      if (updatedArticle) dbUpsertArticle(updatedArticle);
    },
    [commit, ensureActor],
  );

  const handleCommentPost = useCallback(
    (postId: string, text: string) => {
      const actor = ensureActor();
      const newComment = makeComment(text, actor, 'post', postId);
      let updatedPost: CommunityPost | undefined;
      commit((prev) => {
        const posts = prev.posts.map((p) => {
          if (p.id !== postId) return p;
          updatedPost = appendPostComment(p, newComment);
          return updatedPost;
        });
        return {
          ...prev,
          comments: [newComment, ...prev.comments],
          posts,
        };
      });
      dbInsertComment(newComment);
      if (updatedPost) dbUpsertPost(updatedPost);
    },
    [commit, ensureActor],
  );

  const handleSavePost = useCallback(
    (postId: string) => {
      commit((prev) => ({
        ...prev,
        posts: prev.posts.map((p) => (p.id === postId ? { ...p, userSaved: !p.userSaved } : p)),
      }));
      toast('পোস্ট সংরক্ষণ আপডেট হয়েছে');
    },
    [commit],
  );

  const handleShare = useCallback((label: string) => {
    const shareUrl = window.location.href;
    navigator.clipboard?.writeText(shareUrl).catch(() => {});
    toast.success('লিংক কপি হয়েছে', { description: label });
  }, []);

  const handleOpenArticlePopup = useCallback(
    (articleId: string) => {
      // Increment article view count in Supabase
      let target: Article | undefined;
      commit((prev) => ({
        ...prev,
        articles: prev.articles.map((a) => {
          if (a.id !== articleId) return a;
          target = { ...a, stats: { ...a.stats, views: a.stats.views + 1 } };
          return target;
        }),
      }));
      if (target) dbUpsertArticle(target);
      setReaderId(articleId);
    },
    [commit],
  );

  const handleSaveProfile = useCallback(
    (profile: UserProfile) => {
      commit((prev) => {
        const exists = prev.profiles.some((p) => p.id === profile.id);
        const profiles = exists
          ? prev.profiles.map((p) => (p.id === profile.id ? profile : p))
          : [profile, ...prev.profiles];
        // Also propagate updated author name/avatar to their authored articles & posts
        const articles = prev.articles.map((a) =>
          a.authorId === profile.id
            ? {
                ...a,
                author: {
                  id: profile.id,
                  name: profile.nameBn || profile.name,
                  designation: profile.role,
                  organization: profile.organization,
                  avatar: profile.avatar,
                },
              }
            : a,
        );
        const posts = prev.posts.map((po) =>
          po.authorId === profile.id
            ? {
                ...po,
                author: {
                  id: profile.id,
                  name: profile.name,
                  avatar: profile.avatar,
                  role: `${profile.role}${profile.organization ? ` · ${profile.organization}` : ''}`,
                  isVerified: profile.isVerified,
                },
              }
            : po,
        );
        return {
          ...prev,
          profiles,
          currentUserId: profile.id,
          articles,
          posts,
        };
      });
      dbUpsertProfile(profile);
      toast.success('প্রোফাইল Supabase-এ সংরক্ষিত হয়েছে', { description: profile.name });
    },
    [commit],
  );

  const handlePublishArticle = useCallback(
    (article: Article) => {
      const actor = currentUser ?? ensureActor();
      const enriched: Article = {
        ...article,
        authorId: actor.id,
        author: {
          id: actor.id,
          name: actor.nameBn || actor.name,
          designation: actor.role,
          organization: actor.organization,
          avatar: actor.avatar,
        },
      };
      commit((prev) => ({
        ...prev,
        articles: [enriched, ...prev.articles],
      }));
      dbUpsertArticle(enriched);
      goNavigate('/');
      toast.success('প্রতিবেদন Supabase-এ প্রকাশিত হয়েছে', {
        description: `${toBengaliNumerals(enriched.readTimeMinutes)} মিনিট পড়া · ${enriched.category}`,
      });
    },
    [currentUser, ensureActor, commit, goNavigate],
  );

  const handlePublishReel = useCallback(
    (reel: StoryReel, story?: TopicStory, feedPost?: CommunityPost) => {
      const actor = currentUser ?? ensureActor();
      const enrichedReel: StoryReel = {
        ...reel,
        creatorId: actor.id,
        creator: actor.name,
        creatorAvatar: actor.avatar,
      };
      commit((prev) => ({
        ...prev,
        reels: [enrichedReel, ...prev.reels],
        stories: story ? [{ ...story, authorId: actor.id, authorName: actor.name, authorAvatar: actor.avatar }, ...prev.stories] : prev.stories,
        posts: feedPost ? [{ ...feedPost, authorId: actor.id, author: { ...feedPost.author, id: actor.id, name: actor.name, avatar: actor.avatar } }, ...prev.posts] : prev.posts,
      }));
      dbUpsertReel(enrichedReel);
      if (story) dbUpsertStory({ ...story, authorId: actor.id, authorName: actor.name, authorAvatar: actor.avatar });
      if (feedPost) dbUpsertPost({ ...feedPost, authorId: actor.id });
      toast.success('রিল ও স্টোরি Supabase-এ সংরক্ষিত হয়েছে');
    },
    [currentUser, ensureActor, commit],
  );

  const handleToggleFollow = useCallback(
    (targetUserId: string) => {
      if (!targetUserId) return;
      const was = snap.followingIds.includes(targetUserId);
      commit((prev) => ({
        ...prev,
        followingIds: toggleBookmarkId(prev.followingIds, targetUserId),
      }));
      const targetProfile = snap.profiles.find((p) => p.id === targetUserId);
      toast(was ? 'আনফলো করা হয়েছে' : `${targetProfile?.name || 'গবেষক'}-কে ফলো করছেন`);
    },
    [snap.followingIds, snap.profiles, commit],
  );

  // Store & Cart handlers
  const handleAddToCart = useCallback(
    (product: StoreProduct) => {
      commit((prev) => {
        const existing = prev.cart.find((c) => c.productId === product.id);
        const nextCart = existing
          ? prev.cart.map((c) => (c.productId === product.id ? { ...c, quantity: c.quantity + 1 } : c))
          : [...prev.cart, { productId: product.id, quantity: 1 }];
        return { ...prev, cart: nextCart };
      });
      toast.success('কার্টে যোগ হয়েছে', { description: product.name });
    },
    [commit],
  );

  const handleUpdateCartQty = useCallback(
    (productId: string, qty: number) => {
      commit((prev) => ({
        ...prev,
        cart:
          qty <= 0
            ? prev.cart.filter((c) => c.productId !== productId)
            : prev.cart.map((c) => (c.productId === productId ? { ...c, quantity: qty } : c)),
      }));
    },
    [commit],
  );

  const handleCompleteOrder = useCallback(
    (order: BkashOrder) => {
      commit((prev) => {
        const updatedProducts = prev.storeProducts.map((p) => {
          const ordered = order.items.find((i) => i.productId === p.id);
          if (!ordered) return p;
          const nextStock = Math.max(0, p.stock - ordered.quantity);
          dbUpsertProduct({ ...p, stock: nextStock });
          return { ...p, stock: nextStock };
        });
        return {
          ...prev,
          orders: [order, ...prev.orders],
          storeProducts: updatedProducts,
          cart: [],
        };
      });
      dbInsertOrder(order);
      toast.success(`বিকাশ পেমেন্ট (${order.receiverBkash}) ও অর্ডার সম্পন্ন!`, {
        description: `Order #${order.orderNumber} · TrxID: ${order.trxId}`,
      });
    },
    [commit],
  );

  const reelPlayerItems: PlayerItem[] = useMemo(
    () =>
      snap.reels.map((r) => ({
        id: r.id,
        title: r.title,
        creator: r.creator,
        avatar: r.creatorAvatar,
        image: r.mediaUrl,
        meta: `${r.location} · ${r.duration}`,
        likes: r.likes,
      })),
    [snap.reels],
  );

  const storyPlayerItems: PlayerItem[] = useMemo(
    () =>
      snap.stories.map((s) => ({
        id: s.id,
        title: s.title,
        creator: s.authorName ?? 'Plainsyt',
        avatar: s.authorAvatar ?? 'PS',
        image: s.imageUrl,
        meta: `${s.category} · ${s.readsCount ?? 0} reads`,
        likes: 0,
      })),
    [snap.stories],
  );

  const savedArticles = useMemo(
    () => snap.articles.filter((a) => snap.bookmarkedArticleIds.includes(a.id)),
    [snap.articles, snap.bookmarkedArticleIds],
  );
  const savedPosts = useMemo(() => snap.posts.filter((p) => p.userSaved), [snap.posts]);
  const savedCount = savedArticles.length + savedPosts.length;
  const cartCount = useMemo(() => snap.cart.reduce((s, c) => s + c.quantity, 0), [snap.cart]);
  const readerArticle = useMemo(
    () => snap.articles.find((a) => a.id === readerId) ?? null,
    [snap.articles, readerId],
  );

  // Determine profile target for /profile or /profile/:userId
  const viewedProfile = useMemo(() => {
    const targetId = params.userId || currentUser?.id;
    if (!targetId) return null;
    const found = snap.profiles.find((p) => p.id === targetId);
    if (found) return found;
    // Synthesize profile from authored articles/posts if not yet in profiles array
    const fromArt = snap.articles.find((a) => a.authorId === targetId);
    if (fromArt) {
      return {
        id: targetId,
        name: fromArt.author.name,
        nameBn: fromArt.author.name,
        handle: targetId.toLowerCase(),
        role: fromArt.author.designation,
        organization: fromArt.author.organization,
        location: 'Bangladesh',
        bio: '',
        avatar: fromArt.author.avatar,
        coverGradient: 'linear-gradient(135deg, #04301f 0%, #17754f 55%, #f2c14e 100%)',
        isVerified: true,
        focusArea: fromArt.category,
        publicationsCount: 1,
        followersCount: 0,
        followingCount: 0,
        createdAt: new Date().toISOString(),
      };
    }
    return null;
  }, [params.userId, currentUser, snap.profiles, snap.articles]);

  // Standalone /article/:articleId route (for opening in a separate browser tab!)
  const standaloneArticle = useMemo(() => {
    if (!params.articleId) return null;
    return snap.articles.find((a) => a.id === params.articleId) ?? null;
  }, [params.articleId, snap.articles]);

  const openPhotoPopup = useCallback(
    (
      images: string[],
      index = 0,
      title?: string,
      subtitle?: string,
      authorName?: string,
      authorId?: string,
    ) => {
      const valid = images.filter(Boolean);
      if (valid.length === 0) return;
      setLightbox({ images: valid, index, title, subtitle, authorName, authorId });
    },
    [],
  );

  const mainContent = (() => {
    if (location.pathname.startsWith('/article/')) {
      if (!standaloneArticle) {
        return (
          <section className={cn(FEED_CARD, 'p-8 text-center')}>
            <h1 className="font-display text-[24px] font-bold text-pine-950">
              প্রতিবেদনটি পাওয়া যায়নি
            </h1>
            <p className="mt-1 font-bangla text-[14px] text-pine-900/65">
              এই প্রতিবেদনটি এখনো Supabase-এ যোগ করা হয়নি বা মুছে ফেলা হয়েছে।
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => goNavigate('/')}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-pine-900 bg-pine-900 px-4 text-[13.5px] font-semibold text-canvas"
              >
                <ArrowLeft className="size-4" /> হোম পেজে ফিরুন
              </button>
              <button
                type="button"
                onClick={() => setWriteOpen(true)}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-pine-900 bg-canvas-card px-4 text-[13.5px] font-semibold text-pine-900"
              >
                <PenLine className="size-4" /> নতুন প্রতিবেদন লিখুন
              </button>
            </div>
          </section>
        );
      }
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 sm:px-0">
            <button
              type="button"
              onClick={() => goNavigate('/')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-pine-900 bg-canvas-card px-3 py-1.5 text-[13px] font-semibold text-pine-900 shadow-tactile-xs"
            >
              <ArrowLeft className="size-4" /> Back to Home Feed
            </button>
            <span className="font-mono text-[11px] text-pine-600">
              Standalone Article Route · /article/{standaloneArticle.id}
            </span>
          </div>
          <ArticleReaderContent
            article={standaloneArticle}
            bookmarked={snap.bookmarkedArticleIds.includes(standaloneArticle.id)}
            currentUser={currentUser}
            isStandalonePage
            onClose={() => goNavigate('/')}
            onReact={(type) => handleReact('article', standaloneArticle.id, type)}
            onOpenReactionsBreakdown={() =>
              setRxBreakdown({ targetType: 'article', targetId: standaloneArticle.id })
            }
            onBookmark={() => handleBookmarkArticle(standaloneArticle.id)}
            onComment={(t) => handleCommentArticle(standaloneArticle.id, t)}
            onReactComment={(cid, type) => handleReact('comment', cid, type)}
            onShare={() => handleShare(standaloneArticle.title)}
            onNavigateProfile={navigateToProfile}
            onOpenPhoto={(src, title, subtitle, authorName, authorId) =>
              openPhotoPopup([src], 0, title, subtitle, authorName, authorId)
            }
          />
        </div>
      );
    }

    if (location.pathname.startsWith('/events/') && location.pathname !== '/events') {
      const eventId = location.pathname.replace('/events/', '');
      return (
        <EventDetailPage
          eventId={eventId}
          onNavigate={goNavigate}
          onOpenRegister={(ev) => setRegistrationEvent(ev)}
        />
      );
    }

    switch (activeView) {
      case 'explore':
        return (
          <ExploreView
            articles={snap.articles}
            currentUser={currentUser}
            pillar={pillar}
            onPillar={setPillar}
            onOpenArticlePopup={handleOpenArticlePopup}
            onNavigateProfile={navigateToProfile}
            onOpenPhoto={(src, title, authorName, authorId) =>
              openPhotoPopup([src], 0, title, undefined, authorName, authorId)
            }
          />
        );
      case 'events':
        return (
          <EventsView
            events={snap.events}
            onNavigate={goNavigate}
            onOpenRegister={(ev) => setRegistrationEvent(ev)}
          />
        );
      case 'store':
        return (
          <StoreView
            products={snap.storeProducts}
            cart={snap.cart}
            ordersCount={snap.orders.length}
            onAddToCart={handleAddToCart}
            onOpenCheckout={() => setCheckoutOpen(true)}
            onOpenCreateProduct={() => setCreateProductOpen(true)}
            onNavigateProfile={navigateToProfile}
            onOpenPhoto={(src, title, subtitle, authorName, authorId) =>
              openPhotoPopup([src], 0, title, subtitle, authorName, authorId)
            }
          />
        );
      case 'ideas':
        return (
          <IdeasView
            ideas={snap.ideas}
            onSubmitIdea={(title, body, tag) => {
              const actor = ensureActor();
              const idea = {
                id: `idea-${Date.now().toString(36)}`,
                title,
                body,
                authorId: actor.id,
                author: actor.name,
                authorAvatar: actor.avatar,
                votes: 1,
                tag,
                voted: true,
                createdAt: new Date().toISOString(),
              };
              commit((prev) => ({
                ...prev,
                ideas: [idea, ...prev.ideas],
                votedIdeaIds: [...prev.votedIdeaIds, idea.id],
              }));
              dbUpsertIdea(idea);
              toast.success('আইডিয়া Supabase-এ জমা হয়েছে');
            }}
            onToggleVote={(id) => {
              commit((prev) => {
                const voted = prev.votedIdeaIds.includes(id);
                const nextVoted = toggleBookmarkId(prev.votedIdeaIds, id);
                const nextIdeas = prev.ideas.map((i) => {
                  if (i.id !== id) return i;
                  const updated = { ...i, voted: !voted, votes: Math.max(0, i.votes + (voted ? -1 : 1)) };
                  dbUpsertIdea(updated);
                  return updated;
                });
                return { ...prev, votedIdeaIds: nextVoted, ideas: nextIdeas };
              });
            }}
            onNavigateProfile={navigateToProfile}
          />
        );
      case 'notifications':
        return (
          <NotificationsView
            items={snap.notifications}
            onRead={() =>
              commit((prev) => ({
                ...prev,
                notifications: prev.notifications.map((n) => ({ ...n, unread: false })),
              }))
            }
          />
        );
      case 'profile': {
        const isOwn = !params.userId || params.userId === currentUser?.id;
        const targetId = viewedProfile?.id || '';
        const authorArticles = snap.articles.filter((a) => a.authorId === targetId);
        const authorPosts = snap.posts.filter((p) => p.authorId === targetId);
        const userOrders = snap.orders.filter((o) => !currentUser || o.buyerId === currentUser.id);
        return (
          <ProfileView
            profile={viewedProfile}
            isOwnProfile={isOwn}
            isFollowing={snap.followingIds.includes(targetId)}
            currentUser={currentUser}
            authorArticles={authorArticles}
            authorPosts={authorPosts}
            savedArticles={savedArticles}
            savedPosts={savedPosts}
            orders={userOrders}
            bookmarkIds={snap.bookmarkedArticleIds}
            dark={dark}
            onToggleDark={toggleDark}
            onToggleFollow={() => handleToggleFollow(targetId)}
            onOpenProfileSettings={() => setProfileSettingsOpen(true)}
            onOpenArticlePopup={handleOpenArticlePopup}
            onReact={handleReact}
            onOpenReactionsBreakdown={(targetType, tId) => setRxBreakdown({ targetType, targetId: tId })}
            onBookmarkArticle={handleBookmarkArticle}
            onCommentArticle={handleCommentArticle}
            onSavePost={handleSavePost}
            onCommentPost={handleCommentPost}
            onShare={handleShare}
            onRemoveSavedArticle={handleBookmarkArticle}
            onRemoveSavedPost={handleSavePost}
            onNavigateProfile={navigateToProfile}
            onOpenPhoto={openPhotoPopup}
          />
        );
      }
      default:
        return (
          <CentralFeed
            currentUser={currentUser}
            articles={snap.articles}
            posts={snap.posts}
            stories={snap.stories}
            reels={snap.reels}
            savedReelIds={savedReelIds}
            followingIds={snap.followingIds}
            bookmarkIds={snap.bookmarkedArticleIds}
            onWriteArticle={() => setWriteOpen(true)}
            onUploadVideo={() => setReelUploadOpen(true)}
            onAskAI={() => setAiOpen(true)}
            onOpenProfileSettings={() => setProfileSettingsOpen(true)}
            onOpenSupabaseConsole={() => setSupaConsoleOpen(true)}
            onOpenStory={(i) => {
              if (storyPlayerItems.length > 0) setPlayer({ items: storyPlayerItems, start: i });
            }}
            onCreateStory={() => setReelUploadOpen(true)}
            onOpenArticlePopup={handleOpenArticlePopup}
            onReact={handleReact}
            onOpenReactionsBreakdown={(targetType, tId) => setRxBreakdown({ targetType, targetId: tId })}
            onBookmarkArticle={handleBookmarkArticle}
            onCommentArticle={handleCommentArticle}
            onSavePost={handleSavePost}
            onCommentPost={handleCommentPost}
            onShare={handleShare}
            onPlayReel={(i) => {
              if (reelPlayerItems.length > 0) setPlayer({ items: reelPlayerItems, start: i });
            }}
            onSaveReel={(id) => setSavedReelIds((s) => toggleBookmarkId(s, id))}
            onToggleFollow={handleToggleFollow}
            onNavigateProfile={navigateToProfile}
            onOpenPhoto={openPhotoPopup}
          />
        );
    }
  })();

  const breakdownRecords = useMemo(() => {
    if (!rxBreakdown) return [];
    return snap.reactions.filter(
      (r) => r.targetType === rxBreakdown.targetType && r.targetId === rxBreakdown.targetId,
    );
  }, [rxBreakdown, snap.reactions]);

  const breakdownCounts = useMemo(() => {
    if (!rxBreakdown) return undefined;
    if (rxBreakdown.targetType === 'article') {
      return snap.articles.find((a) => a.id === rxBreakdown.targetId)?.reactionCounts;
    }
    if (rxBreakdown.targetType === 'post') {
      return snap.posts.find((p) => p.id === rxBreakdown.targetId)?.reactionCounts;
    }
    return undefined;
  }, [rxBreakdown, snap.articles, snap.posts]);

  const isHomePage = activeView === 'home' && location.pathname === '/';

  return (
    <div className={cn('min-h-screen bg-canvas text-slate-900 flex flex-col justify-between', dark && 'dark')}>
      <SiteLoader />
      <Header
        activeView={activeView}
        onNavigate={goNavigate}
        currentUser={currentUser}
        dark={dark}
        onToggleDark={toggleDark}
        savedCount={savedCount}
        cartCount={cartCount}
        reelsCount={snap.reels.length}
        onOpenCart={() => setCheckoutOpen(true)}
        onOpenSaved={() => setSavedOpen(true)}
        onOpenReels={() => {
          if (reelPlayerItems.length > 0) {
            setPlayer({ items: reelPlayerItems, start: 0 });
          } else {
            setReelUploadOpen(true);
          }
        }}
        onOpenAI={() => setAiOpen(true)}
        notifications={snap.notifications}
        onReadNotifications={() =>
          commit((prev) => ({
            ...prev,
            notifications: prev.notifications.map((n) => ({ ...n, unread: false })),
          }))
        }
        articles={snap.articles}
        posts={snap.posts}
        onOpenArticle={handleOpenArticlePopup}
        onNavigateProfile={navigateToProfile}
      />

      {isHomePage ? (
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 lg:grid-cols-[210px_minmax(0,1fr)_260px] gap-5 pt-2 sm:px-4 sm:pt-4">
          <LeftSidebar
            currentUser={currentUser}
            articles={snap.articles}
            reels={snap.reels}
            savedCount={savedCount}
            onOpenSaved={() => setSavedOpen(true)}
            onOpenReels={() => {
              if (reelPlayerItems.length > 0) setPlayer({ items: reelPlayerItems, start: 0 });
              else setReelUploadOpen(true);
            }}
            onOpenAI={() => setAiOpen(true)}
            onOpenProfileSettings={() => setProfileSettingsOpen(true)}
            onNavigate={goNavigate}
            activePillar={pillar}
            onPillar={setPillar}
          />

          <main className="min-w-0 pb-10">{mainContent}</main>

          <RightSidebar
            articles={snap.articles}
            events={snap.events}
            profiles={snap.profiles}
            currentUserId={currentUser?.id || ''}
            followingIds={snap.followingIds}
            onToggleEvent={(id) => {
              commit((prev) => {
                const nextReg = toggleBookmarkId(prev.eventRegistrations, id);
                return {
                  ...prev,
                  eventRegistrations: nextReg,
                  events: prev.events.map((e) =>
                    e.id === id ? { ...e, isRegistered: nextReg.includes(id) } : e,
                  ),
                };
              });
            }}
            onOpenRegister={(ev) => setRegistrationEvent(ev)}
            onToggleFollow={handleToggleFollow}
            onOpenArticlePopup={handleOpenArticlePopup}
            onNavigateProfile={navigateToProfile}
            onNavigate={goNavigate}
            onOpenPhoto={(src, title, authorName, authorId) =>
              openPhotoPopup([src], 0, title, undefined, authorName, authorId)
            }
          />
        </div>
      ) : (
        <div className="mx-auto max-w-4xl px-4 pt-4 pb-12 min-w-0 flex-1">
          <main className="min-w-0">{mainContent}</main>
        </div>
      )}

      <Footer />

      {/* Modals & Popups */}
      <CreatePostModal
        open={writeOpen}
        onClose={() => setWriteOpen(false)}
        currentUser={currentUser}
        onPublish={handlePublishArticle}
      />

      <FacebookCreatePostModal
        open={reelUploadOpen}
        onClose={() => setReelUploadOpen(false)}
        currentUser={currentUser}
        onSubmitReel={handlePublishReel}
      />

      <AskAIModal open={aiOpen} onClose={() => setAiOpen(false)} currentUser={currentUser} />

      <SavedArticlesModal
        open={savedOpen}
        onClose={() => setSavedOpen(false)}
        articles={savedArticles}
        posts={savedPosts}
        onOpenArticle={handleOpenArticlePopup}
        onRemoveArticle={handleBookmarkArticle}
        onRemovePost={handleSavePost}
      />

      <ArticleReaderModal
        article={readerArticle}
        bookmarked={!!readerArticle && snap.bookmarkedArticleIds.includes(readerArticle.id)}
        currentUser={currentUser}
        onClose={() => setReaderId(null)}
        onReact={(type) => readerArticle && handleReact('article', readerArticle.id, type)}
        onOpenReactionsBreakdown={() =>
          readerArticle && setRxBreakdown({ targetType: 'article', targetId: readerArticle.id })
        }
        onBookmark={() => readerArticle && handleBookmarkArticle(readerArticle.id)}
        onComment={(t) => readerArticle && handleCommentArticle(readerArticle.id, t)}
        onReactComment={(cid, type) => handleReact('comment', cid, type)}
        onShare={() => readerArticle && handleShare(readerArticle.title)}
        onNavigateProfile={navigateToProfile}
        onOpenPhoto={(src, title, subtitle, authorName, authorId) =>
          openPhotoPopup([src], 0, title, subtitle, authorName, authorId)
        }
      />

      <ReelPlayerModal
        items={player?.items ?? null}
        start={player?.start ?? 0}
        onClose={() => setPlayer(null)}
        onShare={handleShare}
      />

      <PhotoLightboxModal
        payload={lightbox}
        onClose={() => setLightbox(null)}
        onNavigateProfile={navigateToProfile}
      />

      <ReactionBreakdownModal
        open={!!rxBreakdown}
        onClose={() => setRxBreakdown(null)}
        records={breakdownRecords}
        counts={breakdownCounts}
        onNavigateProfile={navigateToProfile}
      />

      <ProfileSettingsModal
        open={profileSettingsOpen}
        onClose={() => setProfileSettingsOpen(false)}
        currentUser={currentUser}
        allProfiles={snap.profiles}
        onSaveProfile={handleSaveProfile}
        onSwitchUser={(userId) => {
          commit((prev) => ({ ...prev, currentUserId: userId }));
          toast.success('অ্যাক্টিভ প্রোফাইল পরিবর্তন হয়েছে');
        }}
      />

      <CreateProductModal
        open={createProductOpen}
        onClose={() => setCreateProductOpen(false)}
        currentUser={currentUser}
        onCreateProduct={(product) => {
          commit((prev) => ({
            ...prev,
            storeProducts: [product, ...prev.storeProducts],
          }));
          dbUpsertProduct(product);
          toast.success('পণ্যটি Supabase Store-এ যুক্ত হয়েছে', { description: product.name });
        }}
      />

      <BkashCheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={snap.cart}
        products={snap.storeProducts}
        currentUser={currentUser}
        orders={snap.orders}
        onUpdateQty={handleUpdateCartQty}
        onClearCart={() => commit((prev) => ({ ...prev, cart: [] }))}
        onCompleteOrder={handleCompleteOrder}
      />

      <EventRegistrationModal
        open={!!registrationEvent}
        event={registrationEvent}
        onClose={() => setRegistrationEvent(null)}
        onRegistered={(reg) => {
          commit((prev) => ({
            ...prev,
            eventRegistrations: [...prev.eventRegistrations, reg.eventId],
            events: prev.events.map((e) =>
              e.id === reg.eventId ? { ...e, isRegistered: true } : e,
            ),
          }));
          toast.success('রেজিস্ট্রেশন সম্পন্ন হয়েছে! আপনার আসন নিশ্চিত।');
        }}
      />

      <Toaster
        position="bottom-center"
        toastOptions={{
          className:
            'font-bangla !rounded-xl !border !border-[#04301f] !shadow-[3px_3px_0_#04301f] !bg-[#fdfaf5] !text-[#04301f]',
        }}
      />
    </div>
  );
}
