# Status

- BRIEF tamam, plan onaylandı (2026-10-13).
- Aşama 1-2 (iskelet + içerik yapısı) bitti: Astro, `/{tr,en}/`, `/{tr,en}/{sanat,analist}/`, placeholder içerik, `npm run build` geçiyor.
- Sıradaki: Aşama 3 (GitHub + Cloudflare Pages), Aşama 4 (gerçek içerik, kullanıcının CV'leri), Aşama 5 (PDF export).
- Tasarım şimdilik minimal (tek CSS bloğu, `src/layouts/Base.astro`).

## İçerik nerede
`src/content/{sanat,analist}/{tr,en}.json` (ad, unvan, hakkında, bölümler/maddeler). UI metinleri: `src/content/ui.json`.
