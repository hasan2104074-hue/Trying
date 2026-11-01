import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fycghkjzodjrqornkton.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_csbbXPJ3o30zq68_RK-ldw_OVfArrSY';

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testAuth() {
  console.log('Testing Supabase Auth...');
  const { data, error } = await supabase.auth.getSession();
  console.log('Get session:', data, error);
}

testAuth().catch(console.error);
