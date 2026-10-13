# Status

- BRIEF tamam, plan onaylandı (2026-10-13).
- Aşama 1-2 (iskelet + içerik yapısı) bitti: Astro, `/{tr,en}/`, `/{tr,en}/{sanat,analist}/`, placeholder içerik, `npm run build` geçiyor.
- Aşama 3 bitti: GitHub `brkyzr/by-web-site` (public), canlı: https://byazar.mr-brkyzr.workers.dev/tr/ (push ile deploy).
- Aşama 4 başladı: 4 JSON (sanat/analist × tr/en) gerçek içerikle dolduruldu (kaynak: kaynak/ klasörü, gitignore'da). E-posta, telefon, referanslar, doğum tarihi YAYINLANMADI. LinkedIn erişilemedi (HTTP 999), PDF export bekleniyor.
- Sıradaki: e-posta kararı, görseller (portfolyo PDF'inden), tasarım, eski sıra: Aşama 4 (gerçek içerik, kullanıcının CV'leri), Aşama 5 (PDF export).
- Tasarım şimdilik minimal (tek CSS bloğu, `src/layouts/Base.astro`).

## İçerik nerede
`src/content/{sanat,analist}/{tr,en}.json` (ad, unvan, hakkında, bölümler/maddeler). UI metinleri: `src/content/ui.json`.
