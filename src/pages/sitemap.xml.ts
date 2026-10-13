import type { APIRoute } from 'astro';

// ponytail: hand-rolled sitemap for 6 fixed URLs instead of @astrojs/sitemap, add the integration if routes multiply.
const modes = ['', 'sanat/', 'analist/'];
export const GET: APIRoute = ({ site }) => {
  const abs = (l: string, m: string) => new URL(`/${l}/${m}`, site).href;
  const urls = ['tr', 'en'].flatMap((l) =>
    modes.map((m) => {
      const alt = ['tr', 'en'].map((a) => `<xhtml:link rel="alternate" hreflang="${a}" href="${abs(a, m)}"/>`).join('');
      return `<url><loc>${abs(l, m)}</loc>${alt}</url>`;
    }),
  );
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
};
