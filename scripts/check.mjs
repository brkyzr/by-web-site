// Content sanity check: JSON parses, TR/EN stay in step (same sections and item ids), ids unique, dates and categories valid.
// Run: npm run check   (exits 1 on any problem)
import { readFileSync } from 'node:fs';

const errors = [];
const load = (f) => JSON.parse(readFileSync(f, 'utf8'));
const dateRe = /^\d{4}(-(0[1-9]|1[0-2]))?$/;

for (const p of ['sanat', 'analist']) {
  const [tr, en] = ['tr', 'en'].map((l) => load(`src/content/${p}/${l}.json`));
  const ids = (d) => d.sections.map((s) => s.id);
  if (JSON.stringify(ids(tr)) !== JSON.stringify(ids(en))) errors.push(`${p}: section ids differ between tr and en`);
  for (const [l, d] of [['tr', tr], ['en', en]]) {
    const seen = new Set();
    const itemsOf = (s) => [...s.items, ...(s.subsections ?? []).flatMap((x) => x.items)];
    for (const s of d.sections) {
      for (const i of itemsOf(s)) {
        const where = `${p}/${l}/${s.id}/${i.id ?? i.title}`;
        if (p === 'sanat' && s.id !== 'contact' && !i.id) errors.push(`${where}: missing id`);
        if (i.id) {
          if (seen.has(i.id)) errors.push(`${where}: duplicate id ${i.id}`);
          seen.add(i.id);
        }
        if (i.date && !dateRe.test(i.date)) errors.push(`${where}: bad date ${i.date}`);
        for (const c of i.categories ?? []) if (s.filters && c !== 'film' && !s.filters.includes(c)) errors.push(`${where}: category ${c} not in section filters`);
        if (i.ongoing && !/Present|Devam/.test(i.meta ?? '')) errors.push(`${where}: ongoing but period lacks Present/Devam ediyor`);
      }
    }
  }
  // same item ids per section in both languages
  tr.sections.forEach((s, n) => {
    const a = [...s.items, ...(s.subsections ?? []).flatMap((x) => x.items)].map((i) => i.id).join();
    const e = en.sections[n];
    const b = [...e.items, ...(e.subsections ?? []).flatMap((x) => x.items)].map((i) => i.id).join();
    if (a !== b) errors.push(`${p}/${s.id}: item ids differ between tr and en`);
  });
}
const ui = ['tr', 'en'].map((l) => load('src/content/ui.json')[l]);
const keys = (o, pre = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? keys(v, pre + k + '.') : [pre + k]));
const [a, b] = ui.map((u) => keys(u).sort().join());
if (a !== b) errors.push('ui.json: tr and en keys differ');

console.log(errors.length ? errors.join('\n') : 'content ok');
process.exit(errors.length ? 1 : 0);
