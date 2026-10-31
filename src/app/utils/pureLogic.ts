import type { Article, Comment, CommunityPost } from '../types';

export const toBengaliNumerals = (num: number | string): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .split('')
    .map((char) => {
      const parsed = parseInt(char, 10);
      return !isNaN(parsed) ? bengaliDigits[parsed] : char;
    })
    .join('');
};

export const formatBengaliNumberCompact = (num: number): string => {
  if (num >= 1000000) {
    return `${toBengaliNumerals((num / 1000000).toFixed(1))}M`;
  }
  if (num >= 1000) {
    return `${toBengaliNumerals((num / 1000).toFixed(1))}k`;
  }
  return toBengaliNumerals(num);
};

export const toggleBookmarkId = (existingIds: string[], targetId: string): string[] => {
  return existingIds.includes(targetId)
    ? existingIds.filter((id) => id !== targetId)
    : [...existingIds, targetId];
};

export const toggleArticleReaction = (article: Article): Article => {
  const nextUserLiked = !article.userLiked;
  const nextLikesCount = nextUserLiked ? article.stats.likes + 1 : Math.max(0, article.stats.likes - 1);
  return {
    ...article,
    userLiked: nextUserLiked,
    stats: { ...article.stats, likes: nextLikesCount },
  };
};

export const appendArticleComment = (article: Article, newComment: Comment): Article => {
  return {
    ...article,
    comments: [newComment, ...article.comments],
    stats: { ...article.stats, commentsCount: article.stats.commentsCount + 1 },
  };
};

export const togglePostReaction = (post: CommunityPost): CommunityPost => {
  const next = !post.userLiked;
  return {
    ...post,
    userLiked: next,
    stats: { ...post.stats, likes: next ? post.stats.likes + 1 : Math.max(0, post.stats.likes - 1) },
  };
};

export const appendPostComment = (post: CommunityPost, c: Comment): CommunityPost => ({
  ...post,
  comments: [...post.comments, c],
  stats: { ...post.stats, commentsCount: post.stats.commentsCount + 1 },
});

export const makeComment = (text: string, author = 'Hasan Zubair', avatar = 'HZ', role = 'কৃষি প্রকৌশলী'): Comment => ({
  id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  author,
  avatar,
  role,
  text,
  timestamp: 'এইমাত্র',
  likes: 0,
});
