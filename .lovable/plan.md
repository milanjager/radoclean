## Co postavíme

Admin dashboard na `/admin/seo` napojený na Google Search Console API přes existující konektor. Zobrazí klíčové metriky, chyby indexace a trendy v čase pro radoclean.cz a jeho hlavní stránky (`/`, `/cenik`, `/b2b`, `/feedback`, `/kariera`).

## Prerekvizita (musíš udělat ty)

1. **Publish → Update** – nasadí verifikační META tag na produkci.
2. Po publikaci spustím verify a přidám radoclean.cz do GSC + odešlu sitemap. Bez ověření vrací GSC API jen prázdné odpovědi.

## Sekce dashboardu

1. **Přehled** – sparkline grafy 28 dní: kliknutí, imprese, CTR, průměrná pozice (Search Analytics API).
2. **Klíčové stránky** – tabulka top URL podle traffic share s metrikami, šipkami trendu vs. předchozí období a odkazem do GSC.
3. **Top dotazy** – 25 nejvýkonnějších vyhledávacích dotazů (klíčová slova, pozice, kliknutí).
4. **Indexace** – stav z `urlInspection.index` API pro každou klíčovou URL: indexed/not indexed, last crawl, coverage state, robots.txt verdict, případné chyby.
5. **Sitemap status** – poslední odeslání `sitemap.xml`, počet URL, errors/warnings, tlačítko „Odeslat znovu".

## Technika

- **Edge function `gsc-dashboard`** – proxy přes connector-gateway (`/google_search_console/webmasters/v3/...` a `/searchconsole/v1/urlInspection/...`). Validace inputu Zod, ověření že volá admin (kontrola `user_roles`).
- **Edge function `gsc-submit-sitemap`** – PUT `/sites/{site}/sitemaps/{feedpath}`. Tlačítko v dashboardu.
- **Caching** – odpovědi z GSC se cachují v nové tabulce `gsc_snapshots (kind, payload jsonb, fetched_at)` s TTL 1 h, aby admin nehoroval API limity. RLS: jen admini selectují, edge funkce zapisuje přes service role.
- **Cron** – denní `pg_cron` job spustí `gsc-dashboard` v režimu „refresh all" + odešle sitemap, aby data byla čerstvá ráno.
- **Frontend** – stránka `src/pages/admin/SeoDashboard.tsx`, chráněná `RequireAdmin` (existující pattern). Komponenty s recharts (už v projektu): `<MetricCard>`, `<TrendChart>`, `<KeyPagesTable>`, `<IndexStatusGrid>`, `<SitemapStatus>`. Vše v sémantických tokenech dle design systému.
- **Navigace** – odkaz „SEO" v admin sidebaru.

## Pořadí

1. Migrace: tabulka `gsc_snapshots` + RLS.
2. Edge funkce `gsc-dashboard` a `gsc-submit-sitemap`.
3. Frontend stránka + komponenty + routing.
4. Cron job (po ověření že to funguje manuálně).
5. Po tvém Publish: verify domény, přidání do GSC, první odeslání sitemap, načtení dat do dashboardu.