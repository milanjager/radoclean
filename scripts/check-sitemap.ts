/**
 * Sitemap coverage check.
 *
 * Compares <Route path="..."> entries in src/App.tsx against the URLs
 * listed in public/sitemap.xml. Fails the build (exit 1) when a public
 * route is missing from the sitemap, so crawlers never silently lose
 * a page after publish.
 *
 * Private/internal routes are explicitly excluded via PRIVATE_ROUTES
 * below. To intentionally hide a new route from search, add it there.
 *
 * Runs via the `prebuild` npm script.
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// Routes that must NEVER appear in the sitemap (auth-gated, internal,
// or transactional landing pages). Keep in sync with src/App.tsx.
const PRIVATE_ROUTES = new Set<string>([
  "/admin",
  "/auth",
  "/dashboard",
  "/unsubscribe",
  "*",
]);

// Dynamic route params (":id", "$slug") can't be expanded statically.
// The sitemap generator handles those; the checker just skips them.
const isDynamic = (path: string) => /[:$*]/.test(path) && path !== "*";

function extractRoutes(appSource: string): string[] {
  const routes = new Set<string>();
  const re = /<Route\s+[^>]*path=["']([^"']+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(appSource)) !== null) routes.add(m[1]);
  return [...routes];
}

function extractSitemapPaths(sitemapXml: string): string[] {
  const paths = new Set<string>();
  const re = /<loc>\s*([^<]+?)\s*<\/loc>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(sitemapXml)) !== null) {
    try {
      const u = new URL(m[1]);
      // Normalize: strip trailing slash except for root
      const p = u.pathname.replace(/\/+$/, "") || "/";
      paths.add(p);
    } catch {
      // Ignore malformed entries; XML validation isn't our job here.
    }
  }
  return [...paths];
}

function main() {
  const appPath = resolve("src/App.tsx");
  const sitemapPath = resolve("public/sitemap.xml");

  const appSource = readFileSync(appPath, "utf8");
  const sitemapXml = readFileSync(sitemapPath, "utf8");

  const allRoutes = extractRoutes(appSource);
  const sitemapPaths = new Set(extractSitemapPaths(sitemapXml));

  const publicRoutes = allRoutes.filter(
    (p) => !PRIVATE_ROUTES.has(p) && !isDynamic(p),
  );

  const missing = publicRoutes.filter((p) => {
    const norm = p.replace(/\/+$/, "") || "/";
    return !sitemapPaths.has(norm);
  });

  // Reverse check: sitemap entries that no longer match any route.
  const routeSet = new Set(allRoutes.map((p) => p.replace(/\/+$/, "") || "/"));
  const stale = [...sitemapPaths].filter((p) => !routeSet.has(p));

  if (missing.length === 0 && stale.length === 0) {
    console.log(
      `✓ sitemap check: ${publicRoutes.length} public route(s) all present in sitemap.xml`,
    );
    return;
  }

  if (missing.length > 0) {
    console.error(
      `\n✗ Sitemap missing ${missing.length} public route(s):\n` +
        missing.map((p) => `   - ${p}`).join("\n"),
    );
    console.error(
      `\n  Add them to public/sitemap.xml, or — if they should not be` +
        `\n  indexed — add them to PRIVATE_ROUTES in scripts/check-sitemap.ts.`,
    );
  }

  if (stale.length > 0) {
    console.warn(
      `\n⚠ Sitemap lists ${stale.length} path(s) with no matching <Route>:\n` +
        stale.map((p) => `   - ${p}`).join("\n"),
    );
  }

  if (missing.length > 0) process.exit(1);
}

main();
