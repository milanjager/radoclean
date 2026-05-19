import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SITE_URL = "https://radoclean.cz/";
const SITE_URL_ENCODED = encodeURIComponent(SITE_URL);
const KEY_PAGES = [
  "https://radoclean.cz/",
  "https://radoclean.cz/cenik",
  "https://radoclean.cz/b2b",
  "https://radoclean.cz/feedback",
];
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";

function fmtDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

async function gscFetch(path: string, init: RequestInit = {}) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const GSC_KEY = Deno.env.get("GOOGLE_SEARCH_CONSOLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
  if (!GSC_KEY) throw new Error("GOOGLE_SEARCH_CONSOLE_API_KEY missing");

  const res = await fetch(`${GATEWAY}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": GSC_KEY,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  let body: any = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = { raw: text }; }
  if (!res.ok) {
    return { ok: false, status: res.status, body };
  }
  return { ok: true, status: res.status, body };
}

async function querySearchAnalytics(start: string, end: string, dimensions: string[], rowLimit = 25) {
  return gscFetch(`/webmasters/v3/sites/${SITE_URL_ENCODED}/searchAnalytics/query`, {
    method: "POST",
    body: JSON.stringify({ startDate: start, endDate: end, dimensions, rowLimit }),
  });
}

async function inspectUrl(inspectionUrl: string) {
  return gscFetch(`/v1/urlInspection/index:inspect`, {
    method: "POST",
    body: JSON.stringify({ inspectionUrl, siteUrl: SITE_URL }),
  });
}

async function listSitemaps() {
  return gscFetch(`/webmasters/v3/sites/${SITE_URL_ENCODED}/sitemaps`);
}

async function listSites() {
  return gscFetch(`/webmasters/v3/sites`);
}

async function buildSnapshot() {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 2); // GSC has ~2 day lag
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 27); // 28 day window
  const prevEnd = new Date(start);
  prevEnd.setUTCDate(prevEnd.getUTCDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setUTCDate(prevStart.getUTCDate() - 27);

  const startStr = fmtDate(start);
  const endStr = fmtDate(end);
  const prevStartStr = fmtDate(prevStart);
  const prevEndStr = fmtDate(prevEnd);

  const sites = await listSites();
  const siteVerified = sites.ok && Array.isArray(sites.body?.siteEntry) &&
    sites.body.siteEntry.some((s: any) => s.siteUrl === SITE_URL);

  if (!siteVerified) {
    return {
      siteVerified: false,
      siteUrl: SITE_URL,
      sitesList: sites.body,
      message: "radoclean.cz není ověřen v Google Search Console. Spusť verifikaci a přidej web.",
    };
  }

  const [dailyTrend, topPages, topQueries, prevTotals, sitemaps] = await Promise.all([
    querySearchAnalytics(startStr, endStr, ["date"], 100),
    querySearchAnalytics(startStr, endStr, ["page"], 25),
    querySearchAnalytics(startStr, endStr, ["query"], 25),
    querySearchAnalytics(prevStartStr, prevEndStr, [], 1),
    listSitemaps(),
  ]);

  const inspections = await Promise.all(
    KEY_PAGES.map(async (url) => {
      const r = await inspectUrl(url);
      return { url, ok: r.ok, status: r.status, body: r.body };
    })
  );

  return {
    siteVerified: true,
    siteUrl: SITE_URL,
    range: { start: startStr, end: endStr, prevStart: prevStartStr, prevEnd: prevEndStr },
    dailyTrend: dailyTrend.body,
    topPages: topPages.body,
    topQueries: topQueries.body,
    prevTotals: prevTotals.body,
    inspections,
    sitemaps: sitemaps.body,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Auth: caller must be admin
    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: roleOk } = await admin.rpc("has_role", {
      _user_id: userData.user.id, _role: "admin",
    });
    if (!roleOk) {
      return new Response(JSON.stringify({ error: "forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const force = url.searchParams.get("refresh") === "1";

    // Check cache
    if (!force) {
      const { data: cached } = await admin
        .from("gsc_snapshots")
        .select("payload, fetched_at")
        .eq("kind", "dashboard")
        .order("fetched_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cached && (Date.now() - new Date(cached.fetched_at).getTime()) < CACHE_TTL_MS) {
        return new Response(JSON.stringify({ ...cached.payload, fetched_at: cached.fetched_at, cached: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const snapshot = await buildSnapshot();
    const { data: inserted } = await admin
      .from("gsc_snapshots")
      .insert({ kind: "dashboard", payload: snapshot })
      .select("fetched_at")
      .single();

    return new Response(JSON.stringify({ ...snapshot, fetched_at: inserted?.fetched_at, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("gsc-dashboard error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
