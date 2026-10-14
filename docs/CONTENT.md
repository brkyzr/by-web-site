# İçerik şeması

`src/content/{sanat,analist}/{tr,en}.json`. TR ve EN aynı bölüm ve madde `id`'lerini taşımalı (`npm run check` doğrular).

**Bölüm:** `id`, `title`, `nav` (kısa etiket: karo ve üst bar), `items`. İsteğe bağlı: `filters` (kategori kimlikleri; yalnızca kullanılanlar görünür), `undatedTitle` (tarihsiz maddelerin başlığı), `subsections` (başlıklı kredi listesi).

**Madde:** `title`, `meta` (görünen dönem/yer/topluluk satırı), `text`. İsteğe bağlı: `id` (sanat'ta zorunlu), `date` (`YYYY` veya `YYYY-MM`; ≥2 tarihli madde varsa bölüm zaman çizelgesi olur), `categories`, `roles` (liste), `links` (`label`, `url`), `photo` + `alt`, `featured` (tek sayfa CV), `practice` / `training` (beceri satırları), `company` + `ongoing` (freelance kredisi).

Tarihsiz maddeler zaman çizelgesinin altında kompakt listede görünür. Rol alanı boş bırakılan kredide rol gösterilmez (uydurma yok).

PDF CV: `npm run cv` (Chrome gerekir). Sanat CV'si `scripts/cv.mjs` içindeki `ONE_PAGE` ayarıyla tek sayfaya indirilir.
