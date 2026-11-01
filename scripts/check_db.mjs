import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fycghkjzodjrqornkton.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_csbbXPJ3o30zq68_RK-ldw_OVfArrSY';

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function check() {
  console.log('Checking Supabase connection...');
  
  // Check profiles
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('*');
  console.log('Profiles count:', profiles?.length, pErr ? 'Error: ' + JSON.stringify(pErr) : '');
  if (profiles) {
    profiles.forEach(p => console.log(' Profile:', p.id, p.name, p.handle, p.role, p.email));
  }

  // Check articles
  const { data: articles, error: aErr } = await supabase.from('articles').select('id, title, published_at');
  console.log('Articles count:', articles?.length, aErr ? 'Error: ' + JSON.stringify(aErr) : '');
  if (articles) {
    articles.slice(0, 5).forEach(a => console.log(' Article:', a.id, a.title));
  }

  // Check notifications
  const { data: notifs, error: nErr } = await supabase.from('notifications').select('*');
  console.log('Notifications count:', notifs?.length, nErr ? 'Error: ' + JSON.stringify(nErr) : '');
  if (notifs) {
    notifs.forEach(n => console.log(' Notif:', n));
  }

  // Check posts
  const { data: posts, error: postErr } = await supabase.from('posts').select('id, author_id, content');
  console.log('Posts count:', posts?.length, postErr ? 'Error: ' + JSON.stringify(postErr) : '');

  // Check stories
  const { data: stories, error: sErr } = await supabase.from('stories').select('id, title');
  console.log('Stories count:', stories?.length, sErr ? 'Error: ' + JSON.stringify(sErr) : '');

  // Check profile_login_aliases
  const { data: aliases, error: alErr } = await supabase.from('profile_login_aliases').select('*');
  console.log('Aliases table:', aliases ? aliases.length : 'none', alErr ? 'Error: ' + JSON.stringify(alErr) : '');
}

check().catch(console.error);
