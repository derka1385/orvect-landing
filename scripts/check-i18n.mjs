// node scripts/check-i18n.mjs — fails if a page string translated in one language is missing in another.
import fs from 'node:fs';

const src = fs.readFileSync(new URL('../v1/i18n.js', import.meta.url), 'utf8');
const body = src.slice(src.indexOf('{') + 1, src.indexOf('const dictionaries'));
const { fr, sv, de } = new Function('document', body + 'return {fr,sv,de};')({ querySelector: () => ({}) });

const pages = ['index.html', 'approche.html', 'prototype.html', 'vision.html', 'beta.html'];
const gaps = [];
for (const page of pages) {
  const html = fs.readFileSync(new URL('../' + page, import.meta.url), 'utf8')
    .replace(/<head[\s\S]*?<\/head>/i, '').replace(/<script[\s\S]*?<\/script>/gi, '');
  const strings = new Set(html.split(/<[^>]*>/).map(t => t.replace(/&amp;/g, '&').trim()));
  for (const m of html.matchAll(/[\s"](?:aria-label|alt|placeholder)="([^"]*)"/g)) strings.add(m[1].trim());
  for (const s of strings) {
    const missing = [['fr', fr], ['sv', sv], ['de', de]].filter(([, d]) => !(s in d));
    if (missing.length && missing.length < 3) gaps.push(`${page}: ${JSON.stringify(s)} missing in ${missing.map(([l]) => l).join(', ')}`);
  }
}
if (gaps.length) { console.error('Incomplete translations:\n' + gaps.join('\n')); process.exit(1); }
console.log(`i18n OK — fr ${Object.keys(fr).length} / sv ${Object.keys(sv).length} / de ${Object.keys(de).length} keys, ${pages.length} pages consistent.`);
