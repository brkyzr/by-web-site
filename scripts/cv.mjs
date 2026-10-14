// Builds the ATS-friendly CV PDFs (single column, real text, standard headings) into public/cv/.
// Run locally after content changes: npm run cv   (needs Chrome; set CHROME=/path/to/chrome elsewhere)
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const esc = (s = '') => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const key = (d) => (d.length === 4 ? d + '-00' : d);
const css = `
@page { size: A4; margin: 11mm 15mm; }
body { font: 9.1pt/1.28 Arial, Helvetica, sans-serif; color: #000; margin: 0; }
h1 { font-size: 20pt; margin: 0; }
.role { font-size: 11pt; margin: 2pt 0 0; }
.contact { margin: 4pt 0 0; }
h2 { font-size: 10.5pt; margin: 8pt 0 3pt; padding-bottom: 2pt; border-bottom: 1px solid #000; text-transform: uppercase; }
.item { margin: 0 0 5pt; break-inside: avoid; }
.item h3 { font-size: 10pt; margin: 0; }
.item .when { margin: 0; font-style: italic; }
.item p { margin: 1pt 0 0; }
.subh { font-size: 10pt; margin: 8pt 0 3pt; }
.grp { font-weight: bold; margin: 6pt 0 2pt; }
.line { margin: 0 0 2pt; }`;

// The theatre CV must fit one page: per-section mode ('featured' works only, 'compact' = titles/dates/roles, 'credits' = subsections only, 'languages').
// Sections not listed are left out. Analist keeps the full CV.
const ONE_PAGE = { sanat: { works: 'featured', companies: 'compact', improvisation: 'compact', production: 'credits', facilitation: 'compact', skills: 'languages' } };

for (const profile of ['sanat', 'analist']) {
  for (const lang of ['tr', 'en']) {
    const d = JSON.parse(readFileSync(`src/content/${profile}/${lang}.json`, 'utf8'));
    const contact = d.sections.find((s) => s.id === 'contact').items[0];
    const links = (contact.links ?? []).map((l) => (l.url.startsWith('mailto:') ? l.url.slice(7) : l.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')));
    const ui = JSON.parse(readFileSync('src/content/ui.json', 'utf8'))[lang];
    const item = (i, compact) => {
      const roles = i.roles?.length ? i.roles.join('; ') : '';
      const head = compact ? [i.meta, roles].filter(Boolean).join(' · ') : i.meta; // compact: date and roles share one line
      return `<div class="item"><h3>${esc(i.title)}</h3>${head ? `<p class="when">${esc(head)}</p>` : ''}${!compact && roles ? `<p>${esc(roles)}</p>` : ''}${
        !compact && i.text ? `<p>${esc(i.text)}</p>` : ''
      }${i.practice ? `<p>${esc(ui.practice)}: ${esc(i.practice)}</p>` : ''}${i.training ? `<p>${esc(ui.trainingLabel)}: ${esc(i.training)}</p>` : ''}</div>`;
    };
    const credits = (sub, short) =>
      short
        ? `<h3 class="subh">${esc(sub.title)}</h3><p class="line">${esc(sub.items.map((i) => `${i.title} (${i.company}${i.roles?.length ? ', ' + i.roles.join(', ') : ''}, ${i.meta})`).join('; '))}</p>`
        :       `<h3 class="subh">${esc(sub.title)}</h3>${sub.text && !short ? `<p>${esc(sub.text)}</p>` : ''}` +
      [[true, ui.ongoing], [false, ui.completed]]
        .map(([flag, label]) => {
          const rows = sub.items.filter((i) => !!i.ongoing === flag);
          return rows.length ? `<p class="grp">${esc(label)}</p>` + rows.map((i) => `<p class="line">${esc(`${i.title} — ${i.company}, ${i.meta}${i.roles?.length ? ` (${i.roles.join(', ')})` : ''}`)}</p>`).join('') : '';
        })
        .join('');
    const body = d.sections
      .filter((s) => s.id !== 'contact')
      .map((s) => {
        const mode = ONE_PAGE[profile] ? ONE_PAGE[profile][s.id] : 'full';
        if (!mode) return '';
        const sub = (s.subsections ?? []).map((x) => credits(x, mode !== 'full')).join('');
        if (mode === 'credits') return `<h2>${esc(s.title)}</h2>${sub}`;
        if (mode === 'languages') { const l = s.items.find((i) => i.id === 'skill-languages'); return `<p class="line" style="margin-top:8pt"><b>${esc(l.title)}:</b> ${esc(l.text)}</p>`; }
        const base = mode === 'featured' ? s.items.filter((i) => i.featured) : mode === 'languages' ? s.items.filter((i) => i.id === 'skill-languages') : s.items;
        const dated = base.filter((i) => i.date);
        const timeline = dated.length >= 2;
        const sorted = timeline ? [...dated].sort((a, b) => key(b.date).localeCompare(key(a.date))) : [];
        const undated = timeline ? base.filter((i) => !i.date) : base;
        const compact = s.id === 'training' || mode === 'compact' || mode === 'featured'; // long lists: titles, dates and roles only
        return `<h2>${esc(s.title)}</h2>${sorted.map((i) => item(i, compact)).join('')}${
          timeline && undated.length && s.undatedTitle ? `<p class="grp">${esc(s.undatedTitle)}</p>` : ''
        }${undated.map((i) => item(i, compact)).join('')}${sub}`;
      })
      .join('');
    const html = `<!doctype html><html lang="${lang}"><meta charset="utf-8"><title>${esc(d.name)} - ${esc(d.title)}</title><style>${css}</style><body>
<h1>${esc(d.name)}</h1><p class="role">${esc(d.title)}</p>
<p class="contact">${esc([contact.title, ...links].join(' | '))}</p>
<h2>${lang === 'tr' ? 'Özet' : 'Summary'}</h2><p>${esc(d.about)}</p>${body}</body></html>`;
    const dir = mkdtempSync(join(tmpdir(), 'cv-'));
    const file = join(dir, 'cv.html');
    writeFileSync(file, html);
    mkdirSync('public/cv', { recursive: true });
    const out = `public/cv/berkay-yazar-cv-${profile}-${lang}.pdf`;
    execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${out}`, `file://${file}`], { stdio: 'ignore' });
    console.log('wrote', out);
  }
}
