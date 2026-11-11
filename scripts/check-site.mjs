// ارسانه — اعتبارسنجی ایستای وب‌سایت بدون نیاز به بستهٔ خارجی.
import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = (path) => fs.readFileSync(path, 'utf8');
const escapeHTML = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const source = read('assets/arsaneh-poems-data.js');
assert(source.startsWith('window.ARSANEH_POEMS='), 'Poem data prefix missing');
const poems = JSON.parse(source.slice('window.ARSANEH_POEMS='.length).replace(/;\s*$/, ''));
assert(poems.length > 0, 'No published poems');
const book = read('poems.html');
const text = read('poems-text.html');
const home = read('index.html');

for (const [idx, poem] of poems.entries()) {
  const n = idx + 1;
  assert.equal(poem.n, n, `Poem number mismatch at ${n}`);
  assert(poem.title && poem.verses, `Empty poem ${n}`);
  assert(text.includes(`<article id="poem-${n}"><h2>${escapeHTML(poem.title)}</h2><p>${escapeHTML(poem.verses)}</p>`),
    `Full-text page does not match approved poem ${n}`);
  assert(text.includes(`href="#poem-${n}"`), `Poem ${n} missing from navigation`);
}
function checkStructuredList(html, path) {
  const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert(m, `No JSON-LD in ${path}`);
  const j = JSON.parse(m[1]);
  assert.equal(j.mainEntity.numberOfItems, poems.length, `Wrong structured count in ${path}`);
  assert.equal(j.mainEntity.itemListElement.length, poems.length, `Wrong item list in ${path}`);
}
checkStructuredList(book, 'poems.html');
checkStructuredList(text, 'poems-text.html');
assert(book.includes('src="assets/arsaneh-poems-data.js"'), 'Illustrated book is not reading the approved poem data');
assert(home.includes('href="privacy.html"'), 'Home privacy link missing');

for (const page of ['index.html', 'poems-text.html', 'poems.html', 'sayings-text.html', 'sayings-book.html', 'book-preview.html']) {
  const body = read(page);
  assert.equal((body.match(/assets\/arsaneh-analytics\.js/g) || []).length, 1,
    `Analytics loader missing or duplicated: ${page}`);
}
const sitemap = read('sitemap.xml');
for (const path of ['/', '/poems.html', '/poems-text.html', '/sayings-book.html', '/sayings-text.html', '/privacy.html']) {
  assert(sitemap.includes(`<loc>https://esmaeilfarahmandp-sys.github.io${path}</loc>`),
    `Sitemap missing ${path}`);
}
const feed = read('feed.xml');
assert(feed.includes(`#poem-${poems.length}`), 'RSS latest poem is stale');
assert(read('book-preview.html').includes('اسماعیل فرحمند'), 'Author name typo in preview');
console.log(`PASS: ${poems.length} poems, SEO index, accessible text, analytics hook, and sitemap validated.`);
