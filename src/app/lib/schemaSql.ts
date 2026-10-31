export const PLAINSYT_SCHEMA_SQL = `-- ============================================================================
-- PLAINSYT (প্লেইনসাইট) — PRODUCTION SUPABASE SCHEMA (PETABYTE-SCALE INDEXED)
-- Project Ref: fycghkjzodjrqornkton
-- Run this script in: https://supabase.com/dashboard/project/fycghkjzodjrqornkton/sql/new
-- ============================================================================

create extension if not exists pg_trgm;

-- 1. PROFILES
create table if not exists public.profiles (
  id text primary key,
  name text not null,
  name_bn text not null default '',
  handle text unique not null,
  role text not null default '',
  organization text not null default '',
  location text not null default '',
  bio text not null default '',
  avatar text not null default '',
  cover_gradient text not null default 'linear-gradient(135deg, #04301f 0%, #17754f 55%, #f2c14e 100%)',
  is_verified boolean not null default false,
  focus_area text not null default '',
  website text default '',
  email text default '',
  publications_count integer not null default 0,
  followers_count integer not null default 0,
  following_count integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_profiles_handle on public.profiles (handle);
create index if not exists idx_profiles_created_brin on public.profiles using brin (created_at);

-- 2. ARTICLES
create table if not exists public.articles (
  id text primary key,
  title text not null,
  subtitle text not null default '',
  category text not null,
  category_en text not null default '',
  image_type text not null default 'floating',
  cover_image_url text default '',
  author_id text not null references public.profiles(id) on delete cascade,
  author_json jsonb not null default '{}'::jsonb,
  published_at text not null default '',
  read_time_minutes integer not null default 5,
  featured boolean not null default false,
  content jsonb not null default '[]'::jsonb,
  takeaways jsonb not null default '[]'::jsonb,
  external_link text default '',
  research_basis jsonb default null,
  stats jsonb not null default '{"views":0,"likes":0,"commentsCount":0,"shares":0}'::jsonb,
  reaction_counts jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_articles_created_keyset on public.articles (created_at desc, id desc);
create index if not exists idx_articles_author on public.articles (author_id, created_at desc);
create index if not exists idx_articles_category on public.articles (category, created_at desc);
create index if not exists idx_articles_title_trgm on public.articles using gin (title gin_trgm_ops);

-- 3. COMMUNITY POSTS
create table if not exists public.posts (
  id text primary key,
  author_id text not null references public.profiles(id) on delete cascade,
  author_json jsonb not null default '{}'::jsonb,
  timestamp_label text not null default '',
  content text not null,
  images jsonb not null default '[]'::jsonb,
  external_link text default '',
  shared_post jsonb default null,
  stats jsonb not null default '{"likes":0,"commentsCount":0,"shares":0}'::jsonb,
  reaction_counts jsonb not null default '{}'::jsonb,
  text_theme text default '',
  ai_label boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_posts_created_keyset on public.posts (created_at desc, id desc);
create index if not exists idx_posts_author on public.posts (author_id, created_at desc);

-- 4. COMMENTS (Articles, Posts, Reels)
create table if not exists public.comments (
  id text primary key,
  target_type text not null check (target_type in ('article', 'post', 'reel')),
  target_id text not null,
  author_id text not null,
  author text not null,
  avatar text not null default '',
  role text not null default '',
  text text not null,
  timestamp_label text not null default '',
  likes integer not null default 0,
  reaction_counts jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_comments_target on public.comments (target_type, target_id, created_at desc);
create index if not exists idx_comments_brin on public.comments using brin (created_at);

-- 5. LINKEDIN REACTIONS
create table if not exists public.reactions (
  id text primary key,
  target_type text not null check (target_type in ('article', 'post', 'comment', 'reel')),
  target_id text not null,
  user_id text not null,
  user_name text not null,
  user_avatar text not null default '',
  user_role text not null default '',
  type text not null check (type in ('like', 'celebrate', 'support', 'love', 'insightful', 'curious')),
  created_at timestamptz not null default now(),
  unique (target_type, target_id, user_id)
);
create index if not exists idx_reactions_target on public.reactions (target_type, target_id, type);
create index if not exists idx_reactions_user on public.reactions (user_id, created_at desc);
create index if not exists idx_reactions_brin on public.reactions using brin (created_at);

-- 6. REELS & STORIES
create table if not exists public.reels (
  id text primary key,
  title text not null,
  creator_id text not null,
  creator text not null,
  creator_avatar text not null default '',
  location text not null default '',
  duration text not null default '1:00',
  views integer not null default 0,
  gradient_theme text not null default 'from-emerald-900 to-lime-700',
  video_type text not null default 'greenhouse-iot',
  media_url text not null,
  video_url text default '',
  likes integer not null default 0,
  reaction_counts jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_reels_created on public.reels (created_at desc);

create table if not exists public.stories (
  id text primary key,
  title text not null,
  category text not null,
  image_url text not null,
  icon_name text not null default 'seedling',
  reads_count text not null default '0',
  author_id text not null,
  author_name text not null,
  author_avatar text not null default '',
  article_id text default null,
  created_at timestamptz not null default now()
);

-- 7. EVENTS & REGISTRATIONS
create table if not exists public.events (
  id text primary key,
  title text not null,
  date_month text not null,
  date_day text not null,
  location text not null,
  attendees_count text not null default '0',
  organizer_id text default '',
  organizer_name text default '',
  description text default '',
  external_link text default '',
  created_at timestamptz not null default now()
);

create table if not exists public.event_registrations (
  event_id text not null references public.events(id) on delete cascade,
  user_id text not null,
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

-- 8. RESEARCH PAPERS
create table if not exists public.research_papers (
  id text primary key,
  institution text not null,
  institution_code text not null,
  title text not null,
  summary text not null,
  practical_impact text not null,
  published_date text not null,
  researchers jsonb not null default '[]'::jsonb,
  author_id text default '',
  doi_link text default '',
  created_at timestamptz not null default now()
);

-- 9. STORE PRODUCTS, CART & BKASH ORDERS (01771047033)
create table if not exists public.store_products (
  id text primary key,
  name text not null,
  description text not null default '',
  price numeric(12,2) not null,
  unit text not null default 'পিস',
  tag text not null default 'Agri-Tech',
  image text not null,
  seller_id text not null,
  seller text not null,
  stock integer not null default 50,
  created_at timestamptz not null default now()
);
create index if not exists idx_store_products_created on public.store_products (created_at desc);

create table if not exists public.orders (
  id text primary key,
  order_number text unique not null,
  buyer_id text not null,
  buyer_name text not null,
  buyer_phone text not null,
  district text not null,
  delivery_address text not null,
  delivery_zone text not null default 'inside_dhaka',
  notes text default '',
  items jsonb not null default '[]'::jsonb,
  subtotal_bdt numeric(12,2) not null,
  delivery_fee_bdt numeric(12,2) not null,
  total_bdt numeric(12,2) not null,
  receiver_bkash text not null default '01771047033',
  sender_bkash text not null,
  trx_id text unique not null,
  payment_method text not null default 'bkash_send_money',
  payment_screenshot text default '',
  status text not null default 'paid_verifying',
  created_at timestamptz not null default now()
);
create index if not exists idx_orders_buyer on public.orders (buyer_id, created_at desc);
create index if not exists idx_orders_trx on public.orders (trx_id);

-- 10. IDEAS, BOOKMARKS, FOLLOWS, NOTIFICATIONS
create table if not exists public.ideas (
  id text primary key,
  title text not null,
  body text not null,
  author_id text not null,
  author text not null,
  author_avatar text default '',
  votes integer not null default 1,
  tag text not null default 'এগ্রি-টেক',
  created_at timestamptz not null default now()
);

create table if not exists public.bookmarks (
  user_id text not null,
  target_type text not null check (target_type in ('article', 'post', 'reel')),
  target_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, target_type, target_id)
);

create table if not exists public.follows (
  follower_id text not null,
  following_id text not null,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id)
);

create table if not exists public.notifications (
  id text primary key,
  user_id text default '',
  title text not null,
  source text not null,
  time_label text not null,
  unread boolean not null default true,
  target_route text default '/',
  created_at timestamptz not null default now()
);

-- Enable RLS with open public access policies for publishable key
do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles','articles','posts','comments','reactions','reels','stories',
    'events','event_registrations','research_papers','store_products','orders',
    'ideas','bookmarks','follows','notifications'
  ] loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists "Public read %I" on public.%I;', t, t);
    execute format('create policy "Public read %I" on public.%I for select using (true);', t, t);
    execute format('drop policy if exists "Public write %I" on public.%I;', t, t);
    execute format('create policy "Public write %I" on public.%I for all using (true) with check (true);', t, t);
  end loop;
end $$;
`;
