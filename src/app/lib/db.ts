import { supabase, BKASH_RECEIVER_NUMBER } from './supabase';
import type {
  Article, BkashOrder, CartItem, Comment, CommunityIdea, CommunityPost, LinkedInReactionType,
  NotificationItem, ReactionRecord, ReactionTargetType, ResearchPaper, StoryReel,
  StoreProduct, TopicStory, UpcomingEvent, UserProfile,
} from '../types';
import { applyReactionChange } from '../utils/pureLogic';

export type SupabaseConnectionStatus = 'checking' | 'connected' | 'schema_missing' | 'offline';

export interface DatabaseSnapshot {
  profiles: UserProfile[];
  currentUserId: string;
  articles: Article[];
  posts: CommunityPost[];
  comments: Comment[];
  reactions: ReactionRecord[];
  reels: StoryReel[];
  stories: TopicStory[];
  events: UpcomingEvent[];
  eventRegistrations: string[];
  researchPapers: ResearchPaper[];
  storeProducts: StoreProduct[];
  cart: CartItem[];
  orders: BkashOrder[];
  ideas: CommunityIdea[];
  votedIdeaIds: string[];
  bookmarkedArticleIds: string[];
  savedPostIds: string[];
  followingIds: string[];
  notifications: NotificationItem[];
}

const STORAGE_KEY = 'plainsyt_supabase_mirror_fycghkjzodjrqornkton_v1';

const EMPTY_SNAPSHOT: DatabaseSnapshot = {
  profiles: [],
  currentUserId: '',
  articles: [],
  posts: [],
  comments: [],
  reactions: [],
  reels: [],
  stories: [],
  events: [],
  eventRegistrations: [],
  researchPapers: [],
  storeProducts: [],
  cart: [],
  orders: [],
  ideas: [],
  votedIdeaIds: [],
  bookmarkedArticleIds: [],
  savedPostIds: [],
  followingIds: [],
  notifications: [],
};

let memoryCache: DatabaseSnapshot | null = null;

export function readSnapshot(): DatabaseSnapshot {
  if (memoryCache) return memoryCache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<DatabaseSnapshot>;
      memoryCache = { ...EMPTY_SNAPSHOT, ...parsed };
      return memoryCache;
    }
  } catch {
    // ignore storage errors
  }
  memoryCache = { ...EMPTY_SNAPSHOT };
  return memoryCache;
}

export function writeSnapshot(next: DatabaseSnapshot): DatabaseSnapshot {
  memoryCache = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore quota errors
  }
  return next;
}

// Row mappers between camelCase TypeScript models and snake_case Postgres columns
const toProfileRow = (p: UserProfile) => ({
  id: p.id,
  name: p.name,
  name_bn: p.nameBn,
  handle: p.handle,
  role: p.role,
  organization: p.organization,
  location: p.location,
  bio: p.bio,
  avatar: p.avatar,
  cover_gradient: p.coverGradient,
  is_verified: p.isVerified,
  focus_area: p.focusArea,
  website: p.website ?? '',
  email: p.email ?? '',
  publications_count: p.publicationsCount,
  followers_count: p.followersCount,
  following_count: p.followingCount,
  created_at: p.createdAt,
});

const fromProfileRow = (r: Record<string, unknown>): UserProfile => ({
  id: String(r.id),
  name: String(r.name ?? ''),
  nameBn: String(r.name_bn ?? ''),
  handle: String(r.handle ?? ''),
  role: String(r.role ?? ''),
  organization: String(r.organization ?? ''),
  location: String(r.location ?? ''),
  bio: String(r.bio ?? ''),
  avatar: String(r.avatar ?? ''),
  coverGradient: String(r.cover_gradient ?? 'linear-gradient(135deg, #04301f 0%, #17754f 55%, #f2c14e 100%)'),
  isVerified: Boolean(r.is_verified),
  focusArea: String(r.focus_area ?? ''),
  website: r.website ? String(r.website) : undefined,
  email: r.email ? String(r.email) : undefined,
  publicationsCount: Number(r.publications_count ?? 0),
  followersCount: Number(r.followers_count ?? 0),
  followingCount: Number(r.following_count ?? 0),
  createdAt: String(r.created_at ?? new Date().toISOString()),
});

const toArticleRow = (a: Article) => ({
  id: a.id,
  title: a.title,
  subtitle: a.subtitle,
  category: a.category,
  category_en: a.categoryEn,
  image_type: a.imageType,
  cover_image_url: a.coverImageUrl ?? '',
  author_id: a.authorId,
  author_json: a.author,
  published_at: a.publishedAt,
  read_time_minutes: a.readTimeMinutes,
  featured: Boolean(a.featured),
  content: a.content,
  takeaways: a.takeaways,
  external_link: a.externalLink ?? '',
  research_basis: a.researchBasis ?? null,
  stats: a.stats,
  reaction_counts: a.reactionCounts ?? {},
  created_at: a.createdAt ?? new Date().toISOString(),
});

const fromArticleRow = (r: Record<string, unknown>, comments: Comment[], reactions: ReactionRecord[], currentUserId: string): Article => {
  const id = String(r.id);
  const artComments = comments.filter((c) => c.targetType === 'article' && c.targetId === id);
  const artReacts = reactions.filter((rx) => rx.targetType === 'article' && rx.targetId === id);
  const counts = { ...((r.reaction_counts as Record<string, number>) ?? {}) };
  for (const rx of artReacts) {
    counts[rx.type] = Math.max(counts[rx.type] || 0, artReacts.filter((x) => x.type === rx.type).length);
  }
  const userRx = artReacts.find((rx) => rx.userId === currentUserId)?.type ?? null;
  const rawStats = (r.stats as Article['stats']) ?? { views: 0, likes: 0, commentsCount: 0, shares: 0 };
  const totalRx = Object.values(counts).reduce((s, v) => s + (v || 0), 0);
  const authorObj = (r.author_json as Article['author']) ?? { name: 'Author', designation: '', organization: '', avatar: 'AU' };
  return {
    id,
    title: String(r.title ?? ''),
    subtitle: String(r.subtitle ?? ''),
    category: (r.category as Article['category']) ?? 'সকল',
    categoryEn: String(r.category_en ?? ''),
    imageType: (r.image_type as Article['imageType']) ?? 'floating',
    coverImageUrl: r.cover_image_url ? String(r.cover_image_url) : undefined,
    authorId: String(r.author_id ?? authorObj.id ?? ''),
    author: { ...authorObj, id: String(r.author_id ?? authorObj.id ?? '') },
    publishedAt: String(r.published_at ?? ''),
    createdAt: String(r.created_at ?? ''),
    readTimeMinutes: Number(r.read_time_minutes ?? 5),
    featured: Boolean(r.featured),
    content: Array.isArray(r.content) ? (r.content as string[]) : [],
    takeaways: Array.isArray(r.takeaways) ? (r.takeaways as string[]) : [],
    externalLink: r.external_link ? String(r.external_link) : undefined,
    researchBasis: (r.research_basis as Article['researchBasis']) ?? undefined,
    stats: {
      views: Number(rawStats.views ?? 0),
      likes: Math.max(Number(rawStats.likes ?? 0), totalRx),
      commentsCount: Math.max(Number(rawStats.commentsCount ?? 0), artComments.length),
      shares: Number(rawStats.shares ?? 0),
    },
    reactionCounts: counts,
    userReaction: userRx,
    userLiked: !!userRx,
    comments: artComments,
  };
};

const toPostRow = (p: CommunityPost) => ({
  id: p.id,
  author_id: p.authorId,
  author_json: p.author,
  timestamp_label: p.timestamp,
  content: p.content,
  images: p.images ?? [],
  external_link: p.externalLink ?? '',
  shared_post: p.sharedPost ?? null,
  stats: p.stats,
  reaction_counts: p.reactionCounts ?? {},
  text_theme: p.textTheme ?? '',
  ai_label: Boolean(p.aiLabel),
  created_at: p.createdAt ?? new Date().toISOString(),
});

const fromPostRow = (r: Record<string, unknown>, comments: Comment[], reactions: ReactionRecord[], currentUserId: string): CommunityPost => {
  const id = String(r.id);
  const postComments = comments.filter((c) => c.targetType === 'post' && c.targetId === id);
  const postReacts = reactions.filter((rx) => rx.targetType === 'post' && rx.targetId === id);
  const counts = { ...((r.reaction_counts as Record<string, number>) ?? {}) };
  for (const rx of postReacts) {
    counts[rx.type] = Math.max(counts[rx.type] || 0, postReacts.filter((x) => x.type === rx.type).length);
  }
  const userRx = postReacts.find((rx) => rx.userId === currentUserId)?.type ?? null;
  const rawStats = (r.stats as CommunityPost['stats']) ?? { likes: 0, commentsCount: 0, shares: 0 };
  const totalRx = Object.values(counts).reduce((s, v) => s + (v || 0), 0);
  const authorObj = (r.author_json as CommunityPost['author']) ?? { name: 'Author', avatar: 'AU', role: '' };
  return {
    id,
    authorId: String(r.author_id ?? authorObj.id ?? ''),
    author: { ...authorObj, id: String(r.author_id ?? authorObj.id ?? '') },
    timestamp: String(r.timestamp_label ?? ''),
    createdAt: String(r.created_at ?? ''),
    content: String(r.content ?? ''),
    images: Array.isArray(r.images) ? (r.images as string[]) : [],
    externalLink: r.external_link ? String(r.external_link) : undefined,
    sharedPost: (r.shared_post as CommunityPost['sharedPost']) ?? undefined,
    stats: {
      likes: Math.max(Number(rawStats.likes ?? 0), totalRx),
      commentsCount: Math.max(Number(rawStats.commentsCount ?? 0), postComments.length),
      shares: Number(rawStats.shares ?? 0),
    },
    reactionCounts: counts,
    userReaction: userRx,
    userLiked: !!userRx,
    comments: postComments,
    textTheme: r.text_theme ? String(r.text_theme) : undefined,
    aiLabel: Boolean(r.ai_label),
  };
};

// Synchronize entire local cache to Supabase tables when schema is ready
export async function syncLocalToSupabase(snap: DatabaseSnapshot): Promise<{ ok: boolean; error?: string }> {
  try {
    if (snap.profiles.length > 0) {
      const { error } = await supabase.from('profiles').upsert(snap.profiles.map(toProfileRow));
      if (error) return { ok: false, error: error.message };
    }
    if (snap.articles.length > 0) {
      await supabase.from('articles').upsert(snap.articles.map(toArticleRow));
    }
    if (snap.posts.length > 0) {
      await supabase.from('posts').upsert(snap.posts.map(toPostRow));
    }
    if (snap.comments.length > 0) {
      await supabase.from('comments').upsert(
        snap.comments.map((c) => ({
          id: c.id,
          target_type: c.targetType ?? 'article',
          target_id: c.targetId ?? '',
          author_id: c.authorId,
          author: c.author,
          avatar: c.avatar,
          role: c.role,
          text: c.text,
          timestamp_label: c.timestamp,
          likes: c.likes,
          reaction_counts: c.reactionCounts ?? {},
        })),
      );
    }
    if (snap.reactions.length > 0) {
      await supabase.from('reactions').upsert(
        snap.reactions.map((rx) => ({
          id: rx.id,
          target_type: rx.targetType,
          target_id: rx.targetId,
          user_id: rx.userId,
          user_name: rx.userName,
          user_avatar: rx.userAvatar,
          user_role: rx.userRole,
          type: rx.type,
          created_at: rx.createdAt,
        })),
        { onConflict: 'target_type,target_id,user_id' },
      );
    }
    if (snap.storeProducts.length > 0) {
      await supabase.from('store_products').upsert(
        snap.storeProducts.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          unit: p.unit,
          tag: p.tag,
          image: p.image,
          seller_id: p.sellerId,
          seller: p.seller,
          stock: p.stock,
          created_at: p.createdAt,
        })),
      );
    }
    if (snap.orders.length > 0) {
      await supabase.from('orders').upsert(
        snap.orders.map((o) => ({
          id: o.id,
          order_number: o.orderNumber,
          buyer_id: o.buyerId,
          buyer_name: o.buyerName,
          buyer_phone: o.buyerPhone,
          district: o.district,
          delivery_address: o.deliveryAddress,
          delivery_zone: o.deliveryZone,
          notes: o.notes ?? '',
          items: o.items,
          subtotal_bdt: o.subtotalBdt,
          delivery_fee_bdt: o.deliveryFeeBdt,
          total_bdt: o.totalBdt,
          receiver_bkash: BKASH_RECEIVER_NUMBER,
          sender_bkash: o.senderBkash,
          trx_id: o.trxId,
          payment_method: o.paymentMethod,
          payment_screenshot: o.paymentScreenshot ?? '',
          status: o.status,
          created_at: o.createdAt,
        })),
      );
    }
    if (snap.events.length > 0) {
      await supabase.from('events').upsert(
        snap.events.map((e) => ({
          id: e.id,
          title: e.title,
          date_month: e.dateMonth,
          date_day: e.dateDay,
          location: e.location,
          attendees_count: e.attendeesCount,
          organizer_id: e.organizerId ?? '',
          organizer_name: e.organizerName ?? '',
          description: e.description ?? '',
          external_link: e.externalLink ?? '',
        })),
      );
    }
    if (snap.reels.length > 0) {
      await supabase.from('reels').upsert(
        snap.reels.map((r) => ({
          id: r.id,
          title: r.title,
          creator_id: r.creatorId,
          creator: r.creator,
          creator_avatar: r.creatorAvatar,
          location: r.location,
          duration: r.duration,
          views: r.views,
          gradient_theme: r.gradientTheme,
          video_type: r.videoType,
          media_url: r.mediaUrl,
          video_url: r.videoUrl ?? '',
          likes: r.likes,
          reaction_counts: r.reactionCounts ?? {},
        })),
      );
    }
    if (snap.stories.length > 0) {
      await supabase.from('stories').upsert(
        snap.stories.map((s) => ({
          id: s.id,
          title: s.title,
          category: s.category,
          image_url: s.imageUrl,
          icon_name: s.iconName,
          reads_count: s.readsCount ?? '0',
          author_id: s.authorId ?? '',
          author_name: s.authorName ?? '',
          author_avatar: s.authorAvatar ?? '',
          article_id: s.articleId ?? null,
        })),
      );
    }
    if (snap.researchPapers.length > 0) {
      await supabase.from('research_papers').upsert(
        snap.researchPapers.map((rp) => ({
          id: rp.id,
          institution: rp.institution,
          institution_code: rp.institutionCode,
          title: rp.title,
          summary: rp.summary,
          practical_impact: rp.practicalImpact,
          published_date: rp.publishedDate,
          researchers: rp.researchers,
          author_id: rp.authorId ?? '',
          doi_link: rp.doiLink ?? '',
        })),
      );
    }
    if (snap.ideas.length > 0) {
      await supabase.from('ideas').upsert(
        snap.ideas.map((i) => ({
          id: i.id,
          title: i.title,
          body: i.body,
          author_id: i.authorId,
          author: i.author,
          author_avatar: i.authorAvatar ?? '',
          votes: i.votes,
          tag: i.tag,
          created_at: i.createdAt,
        })),
      );
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// Fetch all live data from Supabase with keyset/range pagination for high speed
export async function fetchFromSupabase(limit = 50): Promise<{
  status: SupabaseConnectionStatus;
  snapshot?: DatabaseSnapshot;
  errorMessage?: string;
}> {
  const local = readSnapshot();
  try {
    const probe = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).range(0, limit - 1);
    if (probe.error) {
      if (probe.error.code === 'PGRST205' || probe.error.message?.includes('schema cache')) {
        return { status: 'schema_missing', errorMessage: probe.error.message };
      }
      return { status: 'offline', errorMessage: probe.error.message };
    }

    // Parallel indexed queries across all tables
    const [
      articlesRes,
      postsRes,
      commentsRes,
      reactionsRes,
      reelsRes,
      storiesRes,
      eventsRes,
      papersRes,
      productsRes,
      ordersRes,
      ideasRes,
      notifsRes,
    ] = await Promise.all([
      supabase.from('articles').select('*').order('created_at', { ascending: false }).range(0, limit - 1),
      supabase.from('posts').select('*').order('created_at', { ascending: false }).range(0, limit - 1),
      supabase.from('comments').select('*').order('created_at', { ascending: false }).range(0, 200),
      supabase.from('reactions').select('*').order('created_at', { ascending: false }).range(0, 500),
      supabase.from('reels').select('*').order('created_at', { ascending: false }).range(0, 30),
      supabase.from('stories').select('*').order('created_at', { ascending: false }).range(0, 30),
      supabase.from('events').select('*').order('created_at', { ascending: false }).range(0, 30),
      supabase.from('research_papers').select('*').order('created_at', { ascending: false }).range(0, 30),
      supabase.from('store_products').select('*').order('created_at', { ascending: false }).range(0, 60),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).range(0, 50),
      supabase.from('ideas').select('*').order('votes', { ascending: false }).range(0, 50),
      supabase.from('notifications').select('*').order('created_at', { ascending: false }).range(0, 30),
    ]);

    const profiles = (probe.data ?? []).map((r) => fromProfileRow(r as Record<string, unknown>));
    const currentUserId = local.currentUserId && profiles.some((p) => p.id === local.currentUserId)
      ? local.currentUserId
      : profiles[0]?.id ?? local.currentUserId;

    const comments: Comment[] = (commentsRes.data ?? []).map((r: Record<string, unknown>) => ({
      id: String(r.id),
      targetType: (r.target_type as Comment['targetType']) ?? 'article',
      targetId: String(r.target_id ?? ''),
      authorId: String(r.author_id ?? ''),
      author: String(r.author ?? ''),
      avatar: String(r.avatar ?? ''),
      role: String(r.role ?? ''),
      text: String(r.text ?? ''),
      timestamp: String(r.timestamp_label ?? ''),
      likes: Number(r.likes ?? 0),
      reactionCounts: (r.reaction_counts as Comment['reactionCounts']) ?? {},
    }));

    const reactions: ReactionRecord[] = (reactionsRes.data ?? []).map((r: Record<string, unknown>) => ({
      id: String(r.id),
      targetType: (r.target_type as ReactionTargetType) ?? 'article',
      targetId: String(r.target_id ?? ''),
      userId: String(r.user_id ?? ''),
      userName: String(r.user_name ?? ''),
      userAvatar: String(r.user_avatar ?? ''),
      userRole: String(r.user_role ?? ''),
      type: (r.type as LinkedInReactionType) ?? 'like',
      createdAt: String(r.created_at ?? ''),
    }));

    const articles = (articlesRes.data ?? []).map((r) =>
      fromArticleRow(r as Record<string, unknown>, comments, reactions, currentUserId),
    );
    const posts = (postsRes.data ?? []).map((r) =>
      fromPostRow(r as Record<string, unknown>, comments, reactions, currentUserId),
    );
    const reels: StoryReel[] = (reelsRes.data ?? []).map((r: Record<string, unknown>) => ({
      id: String(r.id),
      title: String(r.title ?? ''),
      creatorId: String(r.creator_id ?? ''),
      creator: String(r.creator ?? ''),
      creatorAvatar: String(r.creator_avatar ?? ''),
      location: String(r.location ?? ''),
      duration: String(r.duration ?? '1:00'),
      views: Number(r.views ?? 0),
      gradientTheme: String(r.gradient_theme ?? 'from-emerald-900 to-lime-700'),
      videoType: (r.video_type as StoryReel['videoType']) ?? 'greenhouse-iot',
      mediaUrl: String(r.media_url ?? ''),
      videoUrl: r.video_url ? String(r.video_url) : undefined,
      likes: Number(r.likes ?? 0),
      reactionCounts: (r.reaction_counts as StoryReel['reactionCounts']) ?? {},
      createdAt: String(r.created_at ?? ''),
    }));
    const stories: TopicStory[] = (storiesRes.data ?? []).map((r: Record<string, unknown>) => ({
      id: String(r.id),
      title: String(r.title ?? ''),
      category: (r.category as TopicStory['category']) ?? 'সকল',
      imageUrl: String(r.image_url ?? ''),
      iconName: (r.icon_name as TopicStory['iconName']) ?? 'seedling',
      readsCount: String(r.reads_count ?? '0'),
      authorId: String(r.author_id ?? ''),
      authorName: String(r.author_name ?? ''),
      authorAvatar: String(r.author_avatar ?? ''),
      articleId: r.article_id ? String(r.article_id) : undefined,
    }));
    const events: UpcomingEvent[] = (eventsRes.data ?? []).map((r: Record<string, unknown>) => ({
      id: String(r.id),
      title: String(r.title ?? ''),
      dateMonth: String(r.date_month ?? 'JAN'),
      dateDay: String(r.date_day ?? '01'),
      location: String(r.location ?? ''),
      attendeesCount: String(r.attendees_count ?? '0'),
      organizerId: String(r.organizer_id ?? ''),
      organizerName: String(r.organizer_name ?? ''),
      description: String(r.description ?? ''),
      externalLink: String(r.external_link ?? ''),
      isRegistered: local.eventRegistrations.includes(String(r.id)),
    }));
    const researchPapers: ResearchPaper[] = (papersRes.data ?? []).map((r: Record<string, unknown>) => ({
      id: String(r.id),
      institution: String(r.institution ?? ''),
      institutionCode: (r.institution_code as ResearchPaper['institutionCode']) ?? 'BRRI',
      title: String(r.title ?? ''),
      summary: String(r.summary ?? ''),
      practicalImpact: String(r.practical_impact ?? ''),
      publishedDate: String(r.published_date ?? ''),
      researchers: Array.isArray(r.researchers) ? (r.researchers as string[]) : [],
      authorId: String(r.author_id ?? ''),
      doiLink: String(r.doi_link ?? ''),
    }));
    const storeProducts: StoreProduct[] = (productsRes.data ?? []).map((r: Record<string, unknown>) => ({
      id: String(r.id),
      name: String(r.name ?? ''),
      description: String(r.description ?? ''),
      price: Number(r.price ?? 0),
      unit: String(r.unit ?? 'পিস'),
      tag: String(r.tag ?? 'Agri-Tech'),
      image: String(r.image ?? ''),
      sellerId: String(r.seller_id ?? ''),
      seller: String(r.seller ?? ''),
      stock: Number(r.stock ?? 0),
      createdAt: String(r.created_at ?? ''),
    }));
    const orders: BkashOrder[] = (ordersRes.data ?? []).map((r: Record<string, unknown>) => ({
      id: String(r.id),
      orderNumber: String(r.order_number ?? ''),
      buyerId: String(r.buyer_id ?? ''),
      buyerName: String(r.buyer_name ?? ''),
      buyerPhone: String(r.buyer_phone ?? ''),
      district: String(r.district ?? ''),
      deliveryAddress: String(r.delivery_address ?? ''),
      deliveryZone: (r.delivery_zone as BkashOrder['deliveryZone']) ?? 'inside_dhaka',
      notes: String(r.notes ?? ''),
      items: Array.isArray(r.items) ? (r.items as BkashOrder['items']) : [],
      subtotalBdt: Number(r.subtotal_bdt ?? 0),
      deliveryFeeBdt: Number(r.delivery_fee_bdt ?? 0),
      totalBdt: Number(r.total_bdt ?? 0),
      receiverBkash: BKASH_RECEIVER_NUMBER,
      senderBkash: String(r.sender_bkash ?? ''),
      trxId: String(r.trx_id ?? ''),
      paymentMethod: (r.payment_method as BkashOrder['paymentMethod']) ?? 'bkash_send_money',
      paymentScreenshot: r.payment_screenshot ? String(r.payment_screenshot) : undefined,
      status: (r.status as BkashOrder['status']) ?? 'paid_verifying',
      createdAt: String(r.created_at ?? ''),
    }));
    const ideas: CommunityIdea[] = (ideasRes.data ?? []).map((r: Record<string, unknown>) => ({
      id: String(r.id),
      title: String(r.title ?? ''),
      body: String(r.body ?? ''),
      authorId: String(r.author_id ?? ''),
      author: String(r.author ?? ''),
      authorAvatar: String(r.author_avatar ?? ''),
      votes: Number(r.votes ?? 1),
      tag: String(r.tag ?? 'এগ্রি-টেক'),
      voted: local.votedIdeaIds.includes(String(r.id)),
      createdAt: String(r.created_at ?? ''),
    }));
    const notifications: NotificationItem[] = (notifsRes.data ?? []).map((r: Record<string, unknown>) => ({
      id: String(r.id),
      userId: String(r.user_id ?? ''),
      title: String(r.title ?? ''),
      source: String(r.source ?? ''),
      time: String(r.time_label ?? ''),
      unread: Boolean(r.unread),
      targetRoute: String(r.target_route ?? '/'),
    }));

    // If remote tables are empty but user created local items before running migration, push them up
    if (
      profiles.length === 0 &&
      articles.length === 0 &&
      (local.profiles.length > 0 || local.articles.length > 0 || local.storeProducts.length > 0)
    ) {
      await syncLocalToSupabase(local);
      return { status: 'connected', snapshot: local };
    }

    const merged: DatabaseSnapshot = {
      ...local,
      profiles,
      currentUserId,
      articles,
      posts,
      comments,
      reactions,
      reels,
      stories,
      events,
      researchPapers,
      storeProducts,
      orders,
      ideas,
      notifications,
    };
    writeSnapshot(merged);
    return { status: 'connected', snapshot: merged };
  } catch (err) {
    return {
      status: 'offline',
      errorMessage: err instanceof Error ? err.message : 'Network error',
    };
  }
}

// Individual high-speed Supabase write helpers (optimistic + background persistence)
export async function dbUpsertProfile(profile: UserProfile) {
  await supabase.from('profiles').upsert(toProfileRow(profile));
}

export async function dbUpsertArticle(article: Article) {
  await supabase.from('articles').upsert(toArticleRow(article));
}

export async function dbUpsertPost(post: CommunityPost) {
  await supabase.from('posts').upsert(toPostRow(post));
}

export async function dbInsertComment(comment: Comment) {
  await supabase.from('comments').upsert({
    id: comment.id,
    target_type: comment.targetType ?? 'article',
    target_id: comment.targetId ?? '',
    author_id: comment.authorId,
    author: comment.author,
    avatar: comment.avatar,
    role: comment.role,
    text: comment.text,
    timestamp_label: comment.timestamp,
    likes: comment.likes,
    reaction_counts: comment.reactionCounts ?? {},
  });
}

export async function dbSetReaction(
  targetType: ReactionTargetType,
  targetId: string,
  user: UserProfile,
  reactionType: LinkedInReactionType | null,
  updatedCounts: Partial<Record<LinkedInReactionType, number>>,
  updatedTotal: number,
) {
  if (!reactionType) {
    await supabase
      .from('reactions')
      .delete()
      .match({ target_type: targetType, target_id: targetId, user_id: user.id });
  } else {
    await supabase.from('reactions').upsert(
      {
        id: `rx-${targetType}-${targetId}-${user.id}`,
        target_type: targetType,
        target_id: targetId,
        user_id: user.id,
        user_name: user.name,
        user_avatar: user.avatar,
        user_role: `${user.role}${user.organization ? ` · ${user.organization}` : ''}`,
        type: reactionType,
        created_at: new Date().toISOString(),
      },
      { onConflict: 'target_type,target_id,user_id' },
    );
  }
  if (targetType === 'article') {
    await supabase
      .from('articles')
      .update({ reaction_counts: updatedCounts })
      .eq('id', targetId);
  } else if (targetType === 'post') {
    await supabase
      .from('posts')
      .update({ reaction_counts: updatedCounts })
      .eq('id', targetId);
  } else if (targetType === 'reel') {
    await supabase
      .from('reels')
      .update({ reaction_counts: updatedCounts, likes: updatedTotal })
      .eq('id', targetId);
  } else if (targetType === 'comment') {
    await supabase
      .from('comments')
      .update({ reaction_counts: updatedCounts, likes: updatedTotal })
      .eq('id', targetId);
  }
}

export async function dbUpsertReel(reel: StoryReel) {
  await supabase.from('reels').upsert({
    id: reel.id,
    title: reel.title,
    creator_id: reel.creatorId,
    creator: reel.creator,
    creator_avatar: reel.creatorAvatar,
    location: reel.location,
    duration: reel.duration,
    views: reel.views,
    gradient_theme: reel.gradientTheme,
    video_type: reel.videoType,
    media_url: reel.mediaUrl,
    video_url: reel.videoUrl ?? '',
    likes: reel.likes,
    reaction_counts: reel.reactionCounts ?? {},
  });
}

export async function dbUpsertStory(story: TopicStory) {
  await supabase.from('stories').upsert({
    id: story.id,
    title: story.title,
    category: story.category,
    image_url: story.imageUrl,
    icon_name: story.iconName,
    reads_count: story.readsCount ?? '0',
    author_id: story.authorId ?? '',
    author_name: story.authorName ?? '',
    author_avatar: story.authorAvatar ?? '',
    article_id: story.articleId ?? null,
  });
}

export async function dbUpsertProduct(product: StoreProduct) {
  await supabase.from('store_products').upsert({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    unit: product.unit,
    tag: product.tag,
    image: product.image,
    seller_id: product.sellerId,
    seller: product.seller,
    stock: product.stock,
    created_at: product.createdAt,
  });
}

export async function dbInsertOrder(order: BkashOrder) {
  await supabase.from('orders').upsert({
    id: order.id,
    order_number: order.orderNumber,
    buyer_id: order.buyerId,
    buyer_name: order.buyerName,
    buyer_phone: order.buyerPhone,
    district: order.district,
    delivery_address: order.deliveryAddress,
    delivery_zone: order.deliveryZone,
    notes: order.notes ?? '',
    items: order.items,
    subtotal_bdt: order.subtotalBdt,
    delivery_fee_bdt: order.deliveryFeeBdt,
    total_bdt: order.totalBdt,
    receiver_bkash: BKASH_RECEIVER_NUMBER,
    sender_bkash: order.senderBkash,
    trx_id: order.trxId,
    payment_method: order.paymentMethod,
    payment_screenshot: order.paymentScreenshot ?? '',
    status: order.status,
    created_at: order.createdAt,
  });
}

export async function dbUpsertEvent(event: UpcomingEvent) {
  await supabase.from('events').upsert({
    id: event.id,
    title: event.title,
    date_month: event.dateMonth,
    date_day: event.dateDay,
    location: event.location,
    attendees_count: event.attendeesCount,
    organizer_id: event.organizerId ?? '',
    organizer_name: event.organizerName ?? '',
    description: event.description ?? '',
    external_link: event.externalLink ?? '',
  });
}

export async function dbUpsertResearchPaper(paper: ResearchPaper) {
  await supabase.from('research_papers').upsert({
    id: paper.id,
    institution: paper.institution,
    institution_code: paper.institutionCode,
    title: paper.title,
    summary: paper.summary,
    practical_impact: paper.practicalImpact,
    published_date: paper.publishedDate,
    researchers: paper.researchers,
    author_id: paper.authorId ?? '',
    doi_link: paper.doiLink ?? '',
  });
}

export async function dbUpsertIdea(idea: CommunityIdea) {
  await supabase.from('ideas').upsert({
    id: idea.id,
    title: idea.title,
    body: idea.body,
    author_id: idea.authorId,
    author: idea.author,
    author_avatar: idea.authorAvatar ?? '',
    votes: idea.votes,
    tag: idea.tag,
    created_at: idea.createdAt,
  });
}

export async function dbInsertNotification(notif: NotificationItem) {
  await supabase.from('notifications').upsert({
    id: notif.id,
    user_id: notif.userId ?? '',
    title: notif.title,
    source: notif.source,
    time_label: notif.time,
    unread: notif.unread,
    target_route: notif.targetRoute ?? '/',
  });
}

// Helper to compute updated reaction state in snapshot
export function mutateSnapshotReaction(
  snap: DatabaseSnapshot,
  targetType: ReactionTargetType,
  targetId: string,
  user: UserProfile,
  chosen: LinkedInReactionType,
): { next: DatabaseSnapshot; finalReaction: LinkedInReactionType | null; counts: Partial<Record<LinkedInReactionType, number>>; total: number } {
  const existing = snap.reactions.find(
    (r) => r.targetType === targetType && r.targetId === targetId && r.userId === user.id,
  );
  const finalReaction: LinkedInReactionType | null = existing?.type === chosen ? null : chosen;
  const filtered = snap.reactions.filter(
    (r) => !(r.targetType === targetType && r.targetId === targetId && r.userId === user.id),
  );
  const nextReactions: ReactionRecord[] = finalReaction
    ? [
        {
          id: `rx-${targetType}-${targetId}-${user.id}`,
          targetType,
          targetId,
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar,
          userRole: `${user.role}${user.organization ? ` · ${user.organization}` : ''}`,
          type: finalReaction,
          createdAt: new Date().toISOString(),
        },
        ...filtered,
      ]
    : filtered;

  let counts: Partial<Record<LinkedInReactionType, number>> = {};
  let total = 0;

  const nextArticles = snap.articles.map((a) => {
    if (targetType !== 'article' || a.id !== targetId) return a;
    counts = applyReactionChange(a.reactionCounts, existing?.type ?? a.userReaction, finalReaction);
    const delta = (finalReaction ? 1 : 0) - (existing?.type || a.userReaction ? 1 : 0);
    total = Math.max(0, a.stats.likes + delta);
    return {
      ...a,
      reactionCounts: counts,
      userReaction: finalReaction,
      userLiked: !!finalReaction,
      stats: { ...a.stats, likes: total },
    };
  });

  const nextPosts = snap.posts.map((p) => {
    if (targetType !== 'post' || p.id !== targetId) return p;
    counts = applyReactionChange(p.reactionCounts, existing?.type ?? p.userReaction, finalReaction);
    const delta = (finalReaction ? 1 : 0) - (existing?.type || p.userReaction ? 1 : 0);
    total = Math.max(0, p.stats.likes + delta);
    return {
      ...p,
      reactionCounts: counts,
      userReaction: finalReaction,
      userLiked: !!finalReaction,
      stats: { ...p.stats, likes: total },
    };
  });

  const nextReels = snap.reels.map((r) => {
    if (targetType !== 'reel' || r.id !== targetId) return r;
    counts = applyReactionChange(r.reactionCounts, existing?.type ?? r.userReaction, finalReaction);
    const delta = (finalReaction ? 1 : 0) - (existing?.type || r.userReaction ? 1 : 0);
    total = Math.max(0, r.likes + delta);
    return {
      ...r,
      reactionCounts: counts,
      userReaction: finalReaction,
      likes: total,
    };
  });

  const nextComments = snap.comments.map((c) => {
    if (targetType !== 'comment' || c.id !== targetId) return c;
    counts = applyReactionChange(c.reactionCounts, existing?.type ?? c.userReaction, finalReaction);
    const delta = (finalReaction ? 1 : 0) - (existing?.type || c.userReaction ? 1 : 0);
    total = Math.max(0, c.likes + delta);
    return {
      ...c,
      reactionCounts: counts,
      userReaction: finalReaction,
      likes: total,
    };
  });

  const next: DatabaseSnapshot = {
    ...snap,
    reactions: nextReactions,
    articles: nextArticles.map((a) => ({
      ...a,
      comments: nextComments.filter((c) => c.targetType === 'article' && c.targetId === a.id),
    })),
    posts: nextPosts.map((p) => ({
      ...p,
      comments: nextComments.filter((c) => c.targetType === 'post' && c.targetId === p.id),
    })),
    reels: nextReels,
    comments: nextComments,
  };

  return { next, finalReaction, counts, total };
}
