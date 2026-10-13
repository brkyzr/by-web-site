# Brief

## Amaç
Kişisel vitrin: başvurular için CV + portfolyo sitesi. İkincil hedef: freelance iş çekmek. Blog öncelikli değil.

## Hedef kitle
İki profil, iki kitle:
- **Sanat (tiyatro):** yönetmenler, tiyatrolar, festival/prodüksiyon seçicileri.
- **İş analisti:** işe alımcılar, teknik yöneticiler (yurt içi ve yurt dışı).

## Yapı
- Ana sayfa: profil seçimi ("Sanatçı" / "İş Analisti").
- `/sanat` ve `/analist`: her birinin kendi içeriği ve CV'si.
- Her profil için başvuruda ayrı link paylaşılabilir.

## Bölümler
- **Sanat:** hakkımda, oyunlar/roller (tarih, mekân, rol), foto/video galeri, eğitim ve atölyeler, iletişim.
- **Analist:** hakkımda, deneyim, projeler/vaka çalışmaları, beceriler ve araçlar, eğitim ve sertifikalar, iletişim.
- Ortak: dil değiştirme, CV indirme (PDF export, sonraki adım).
- Olası eklemeler (sonra): basın yazıları, showreel, referanslar.

## Dil
TR + EN, iki profilde de, dil değiştirme ile (uluslararası başvurular).

## Teknoloji
- Astro (statik site). İçerik Markdown/JSON dosyalarında, TR/EN ve profil bazında ayrı.
- İçerik güncellemeleri AI ajanlarla yapılacak; kaynak: kullanıcının sağlayacağı CV ve portfolyo dosyaları.

## Hosting
- Cloudflare Pages (ücretsiz, kullanıcının hesabı var), GitHub push ile deploy.
- Adres: `byazar.pages.dev` (alan adı yok; sonra eklenebilir).
- Bütçe: şu an sıfır, tüm araçlar ücretsiz olmalı.

## Kısıtlar
- Telefon/adres gibi kişisel bilgi herkese açık sayfalara eklenmeden önce sorulur.
