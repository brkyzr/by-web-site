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
@page { size: A4; margin: 16mm 18mm; }
body { font: 10pt/1.4 Arial, Helvetica, sans-serif; color: #000; margin: 0; }
h1 { font-size: 20pt; margin: 0; }
.role { font-size: 11pt; margin: 2pt 0 0; }
.contact { margin: 4pt 0 0; }
h2 { font-size: 11pt; margin: 14pt 0 5pt; padding-bottom: 2pt; border-bottom: 1px solid #000; text-transform: uppercase; }
.item { margin: 0 0 7pt; break-inside: avoid; }
.item h3 { font-size: 10pt; margin: 0; }
.item .when { margin: 0; font-style: italic; }
.item p { margin: 1pt 0 0; }`;

for (const profile of ['sanat', 'analist']) {
  for (const lang of ['tr', 'en']) {
    const d = JSON.parse(readFileSync(`src/content/${profile}/${lang}.json`, 'utf8'));
    const contact = d.sections.find((s) => s.id === 'contact').items[0];
    const links = (contact.links ?? []).map((l) => (l.url.startsWith('mailto:') ? l.url.slice(7) : l.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')));
    const body = d.sections
      .filter((s) => s.id !== 'contact')
      .map((s) => {
        const dated = s.items.filter((i) => i.date).length >= 2;
        const items = dated ? [...s.items].sort((a, b) => key(b.date).localeCompare(key(a.date))) : s.items;
        return `<h2>${esc(s.title)}</h2>${items
          .map((i) => `<div class="item"><h3>${esc(i.title)}</h3>${i.meta ? `<p class="when">${esc(i.meta)}</p>` : ''}${i.text ? `<p>${esc(i.text)}</p>` : ''}</div>`)
          .join('')}`;
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
