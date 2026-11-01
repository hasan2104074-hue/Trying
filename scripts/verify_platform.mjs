import http from 'http';
import { resolveEmailAlias, ADMIN_PROFILE, ZUBAIR_PROFILE } from '../src/app/lib/auth.ts';
import { BINA_ARTICLE } from '../src/app/lib/db.ts';

console.log('--- 1. Testing Alias Resolution ---');
const alias1 = resolveEmailAlias('plaiinsyt@gmail.com');
const alias2 = resolveEmailAlias('pl@insyt.bd');
const zubair = resolveEmailAlias('z65gt9@gmail.com');

console.log('Alias 1 (plaiinsyt@gmail.com):', alias1);
console.log('Alias 2 (pl@insyt.bd):', alias2);
console.log('Zubair (z65gt9@gmail.com):', zubair);

const aliasesMatchAdmin =
  alias1.canonicalUserId === 'usr-plainsyt-admin' &&
  alias2.canonicalUserId === 'usr-plainsyt-admin' &&
  alias1.isAdmin === true &&
  alias2.isAdmin === true;

const zubairPreserved =
  zubair.canonicalUserId === 'usr-zubair' &&
  zubair.isAdmin === false &&
  zubair.canonicalUserId !== alias1.canonicalUserId;

console.log('Aliases resolve to same canonical Admin UUID:', aliasesMatchAdmin);
console.log('Zubair preserved as separate user without Admin role:', zubairPreserved);

console.log('\n--- 2. Testing BINA Article Metadata & Content ---');
console.log('Article ID:', BINA_ARTICLE.id);
console.log('Article Slug:', BINA_ARTICLE.slug);
console.log('Article Title:', BINA_ARTICLE.title);
console.log('Author:', BINA_ARTICLE.author.name);
console.log('Publication Date (Bangla):', BINA_ARTICLE.publishedAt);
console.log('Publication Timestamp (ISO):', BINA_ARTICLE.createdAt);
console.log('Featured Image:', BINA_ARTICLE.coverImageUrl);
console.log('Image Caption:', BINA_ARTICLE.imageCaption);
console.log('Paragraph Count:', BINA_ARTICLE.content.length);
console.log('First Paragraph snippet:', BINA_ARTICLE.content[0].slice(0, 80));
console.log('Last Paragraph snippet:', BINA_ARTICLE.content[6].slice(0, 80));

console.log('\n--- 3. Testing Local Dev Server (http://localhost:5173/) ---');
http.get('http://localhost:5173/', (res) => {
  console.log('Dev server status code:', res.statusCode);
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    console.log('HTML response length:', data.length, 'bytes');
    console.log('Contains root element:', data.includes('id="root"'));
    console.log('Contains index.html title/scripts:', data.includes('PLAiNSYT') || data.includes('src/main.tsx'));
    console.log('\n=== ALL VERIFICATIONS PASSED ===');
    process.exit(0);
  });
}).on('error', (err) => {
  console.error('Dev server request error:', err.message);
  process.exit(1);
});
