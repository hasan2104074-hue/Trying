export type ArticleCategory =
  | 'সকল'
  | 'শস্য ও কৃষিবিজ্ঞান'
  | 'এগ্রি-টেক ও ড্রোন'
  | 'গবেষণা সহজ ভাষায়'
  | 'খাদ্য ও কোল্ড চেইন'
  | 'জলবায়ু ও স্থায়িত্ব'
  | 'স্টার্টআপ ও উদ্ভাবন'
  | 'মৎস্য ও প্রাণিসম্পদ';

export type FeedFilter = 'trending' | 'latest' | 'research' | 'field-stories';

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  role: string;
  text: string;
  timestamp: string;
  likes: number;
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  category: ArticleCategory;
  categoryEn: string;
  imageType: 'drone' | 'lab' | 'solar' | 'floating' | 'biotech' | 'sensor' | 'water' | 'fisheries';
  author: {
    name: string;
    designation: string;
    organization: string;
    avatar: string;
  };
  publishedAt: string;
  readTimeMinutes: number;
  featured?: boolean;
  content: string[];
  takeaways: string[];
  researchBasis?: {
    journalOrInst: string;
    doiOrSource: string;
    keyMetric: string;
  };
  stats: {
    views: number;
    likes: number;
    commentsCount: number;
    shares: number;
  };
  comments: Comment[];
  userLiked?: boolean;
  userBookmarked?: boolean;
}

export interface StoryReel {
  id: string;
  title: string;
  creator: string;
  creatorAvatar: string;
  location: string;
  duration: string;
  views: number;
  gradientTheme: string;
  videoType: 'soil-ph' | 'drone-tips' | 'solar-onion' | 'hydroponic-berry' | 'greenhouse-iot';
  likes: number;
}

export interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    isVerified?: boolean;
  };
  timestamp: string;
  content: string;
  images?: string[];
  sharedPost?: {
    authorName: string;
    authorAvatar: string;
    timestamp: string;
    text: string;
  };
  stats: {
    likes: number;
    commentsCount: number;
    shares: number;
  };
  reactionsSummary?: string;
  comments: Comment[];
  userLiked?: boolean;
  userSaved?: boolean;
  textTheme?: string;
  aiLabel?: boolean;
}

export interface TopicStory {
  id: string;
  title: string;
  category: ArticleCategory;
  imageUrl: string;
  iconName: 'drone' | 'seedling' | 'climate' | 'food' | 'rural' | 'policy' | 'soil' | 'tech';
  readsCount?: string;
  authorName?: string;
  authorAvatar?: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  dateMonth: string;
  dateDay: string;
  location: string;
  attendeesCount: string;
  isRegistered?: boolean;
}

export interface TrendingRankedItem {
  id: string;
  rank: string;
  title: string;
  reads: string;
  comments: number;
  imageUrl: string;
  category: ArticleCategory;
}

export interface FeaturedScientist {
  id: string;
  name: string;
  role: string;
  organization: string;
  focusArea: string;
  publicationsCount: number;
  isFollowing?: boolean;
}

export interface ResearchPaper {
  id: string;
  institution: string;
  institutionCode: 'BAU' | 'BRRI' | 'BARI' | 'SAU';
  title: string;
  summary: string;
  practicalImpact: string;
  publishedDate: string;
  researchers: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  source: string;
  time: string;
  unread: boolean;
}

export type DesktopTab = 'home' | 'explore' | 'events' | 'store' | 'ideas';
export type MobileTab = 'home' | 'explore' | 'reels' | 'events' | 'notifications' | 'profile';
