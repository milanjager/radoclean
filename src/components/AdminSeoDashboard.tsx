import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import {
  RefreshCw, ArrowUpRight, ArrowDownRight, AlertTriangle,
  CheckCircle2, XCircle, ExternalLink, Send, Loader2,
} from "lucide-react";
import { format } from "date-fns";

type Snapshot = {
  siteVerified: boolean;
  siteUrl: string;
  message?: string;
  range?: { start: string; end: string; prevStart: string; prevEnd: string };
  dailyTrend?: { rows?: Array<{ keys: string[]; clicks: number; impressions: number; ctr: number; position: number }> };
  topPages?: { rows?: Array<{ keys: string[]; clicks: number; impressions: number; ctr: number; position: number }> };
  topQueries?: { rows?: Array<{ keys: string[]; clicks: number; impressions: number; ctr: number; position: number }> };
  prevTotals?: { rows?: Array<{ clicks: number; impressions: number; ctr: number; position: number }> };
  inspections?: Array<{ url: string; ok: boolean; status: number; body: any }>;
  sitemaps?: { sitemap?: Array<any> };
  fetched_at?: string;
  cached?: boolean;
};

function sumRows(rows: Array<{ clicks: number; impressions: number; position: number; ctr: number }> = []) {
  const clicks = rows.reduce((s, r) => s + (r.clicks ?? 0), 0);
  const impressions = rows.reduce((s, r) => s + (r.impressions ?? 0), 0);
  const ctr = impressions > 0 ? clicks / impressions : 0;
  const position = rows.length > 0
    ? rows.reduce((s, r) => s + (r.position ?? 0) * (r.impressions ?? 0), 0) / Math.max(impressions, 1)
    : 0;
  return { clicks, impressions, ctr, position };
}

function Delta({ current, previous, invert = false }: { current: number; previous: number; invert?: boolean }) {
  if (!previous) return <span className="text-xs text-muted-foreground">—</span>;
  const diff = ((current - previous) / previous) * 100;
  const positive = invert ? diff < 0 : diff > 0;
  const Icon = diff === 0 ? null : positive ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs ${diff === 0 ? "text-muted-foreground" : positive ? "text-primary" : "text-destructive"}`}>
      {Icon && <Icon className="h-3 w-3" />}
      {Math.abs(diff).toFixed(1)}%
    </span>
  );
}

function MetricCard({ label, value, prev, format: fmt, invert }: {
  label: string; value: number; prev: number; format: (n: number) => string; invert?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">{fmt(value)}</CardTitle>
      </CardHeader>
      <CardContent>
        <Delta current={value} previous={prev} invert={invert} />
        <span className="text-xs text-muted-foreground ml-2">vs. předchozích 28 dní</span>
      </CardContent>
    </Card>
  );
}

const AdminSeoDashboard = () => {
  const [data, setData] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submittingSitemap, setSubmittingSitemap] = useState(false);
  const { toast } = useToast();

  const load = async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    try {
      const { data: resp, error } = await supabase.functions.invoke("gsc-dashboard", {
        body: {},
        ...(refresh ? { headers: {} } : {}),
      });
      // supabase.functions.invoke doesn't support query params directly; use fetch fallback for refresh
      if (refresh) {
        const { data: { session } } = await supabase.auth.getSession();
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gsc-dashboard?refresh=1`;
        const r = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token ?? ""}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: "{}",
        });
        const json = await r.json();
        setData(json);
      } else {
        if (error) throw error;
        setData(resp);
      }
    } catch (e: any) {
      toast({ title: "Chyba načítání", description: e.message ?? "Neznámá chyba", variant: "destructive" });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const submitSitemap = async () => {
    setSubmittingSitemap(true);
    try {
      const { data: resp, error } = await supabase.functions.invoke("gsc-submit-sitemap", { body: {} });
      if (error) throw error;
      if (resp?.submit?.ok || resp?.status?.ok) {
        toast({ title: "Sitemap odeslán", description: "Google Search Console přijal sitemap.xml." });
        load(true);
      } else {
        toast({
          title: "Sitemap selhal",
          description: JSON.stringify(resp?.submit?.body ?? resp).slice(0, 300),
          variant: "destructive",
        });
      }
    } catch (e: any) {
      toast({ title: "Chyba", description: e.message, variant: "destructive" });
    } finally {
      setSubmittingSitemap(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return null;

  if (!data.siteVerified) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Doména není ověřená v Google Search Console
          </CardTitle>
          <CardDescription>{data.message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Aby dashboard mohl načíst data, musí být <strong>{data.siteUrl}</strong> ověřená v GSC.
            Verifikační META tag je nasazený v <code className="text-xs">index.html</code> – po publikaci se ověření spustí automaticky.
          </p>
          <Button onClick={() => load(true)} disabled={refreshing} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Zkontrolovat znovu
          </Button>
        </CardContent>
      </Card>
    );
  }

  const trend = data.dailyTrend?.rows ?? [];
  const totals = sumRows(trend);
  const prev = (data.prevTotals?.rows?.[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 });
  const chartData = trend.map((r) => ({
    date: r.keys[0]?.slice(5) ?? "",
    Kliknutí: r.clicks,
    Imprese: r.impressions,
    "Pozice": Number(r.position?.toFixed(1) ?? 0),
  }));

  const sitemapEntries = data.sitemaps?.sitemap ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-bold">SEO – Google Search Console</h2>
          <p className="text-sm text-muted-foreground">
            {data.range?.start} – {data.range?.end}
            {data.fetched_at && (
              <> · načteno {format(new Date(data.fetched_at), "d.M.yyyy HH:mm")}{data.cached && " (cache)"}</>
            )}
          </p>
        </div>
        <Button onClick={() => load(true)} disabled={refreshing} variant="outline" size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Obnovit
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Kliknutí" value={totals.clicks} prev={prev.clicks} format={(n) => n.toLocaleString("cs-CZ")} />
        <MetricCard label="Imprese" value={totals.impressions} prev={prev.impressions} format={(n) => n.toLocaleString("cs-CZ")} />
        <MetricCard label="CTR" value={totals.ctr} prev={prev.ctr} format={(n) => `${(n * 100).toFixed(2)} %`} />
        <MetricCard label="Průměrná pozice" value={totals.position} prev={prev.position} format={(n) => n.toFixed(1)} invert />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trend 28 dní</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="imprGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))" }} />
                <Area yAxisId="right" type="monotone" dataKey="Imprese" stroke="hsl(var(--muted-foreground))" fill="url(#imprGrad)" />
                <Area yAxisId="left" type="monotone" dataKey="Kliknutí" stroke="hsl(var(--primary))" fill="url(#clicksGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top stránky</CardTitle>
            <CardDescription>Podle počtu kliknutí</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead className="text-right">Klik.</TableHead>
                  <TableHead className="text-right">Impr.</TableHead>
                  <TableHead className="text-right">Poz.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data.topPages?.rows ?? []).slice(0, 10).map((r) => (
                  <TableRow key={r.keys[0]}>
                    <TableCell className="max-w-[260px] truncate">
                      <a href={r.keys[0]} target="_blank" rel="noreferrer" className="hover:underline inline-flex items-center gap-1">
                        {r.keys[0].replace("https://radoclean.cz", "") || "/"}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell className="text-right">{r.clicks}</TableCell>
                    <TableCell className="text-right">{r.impressions}</TableCell>
                    <TableCell className="text-right">{r.position?.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
                {(!data.topPages?.rows || data.topPages.rows.length === 0) && (
                  <TableRow><TableCell colSpan={4} className="text-center text-sm text-muted-foreground">Žádná data</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top dotazy</CardTitle>
            <CardDescription>Klíčová slova, na která se chodí</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dotaz</TableHead>
                  <TableHead className="text-right">Klik.</TableHead>
                  <TableHead className="text-right">Impr.</TableHead>
                  <TableHead className="text-right">Poz.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data.topQueries?.rows ?? []).slice(0, 10).map((r) => (
                  <TableRow key={r.keys[0]}>
                    <TableCell className="max-w-[200px] truncate">{r.keys[0]}</TableCell>
                    <TableCell className="text-right">{r.clicks}</TableCell>
                    <TableCell className="text-right">{r.impressions}</TableCell>
                    <TableCell className="text-right">{r.position?.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
                {(!data.topQueries?.rows || data.topQueries.rows.length === 0) && (
                  <TableRow><TableCell colSpan={4} className="text-center text-sm text-muted-foreground">Žádná data</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stav indexace klíčových stránek</CardTitle>
          <CardDescription>URL Inspection API</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Verdict</TableHead>
                <TableHead>Coverage</TableHead>
                <TableHead>Robots</TableHead>
                <TableHead>Poslední crawl</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data.inspections ?? []).map((insp) => {
                const idx = insp.body?.inspectionResult?.indexStatusResult;
                const verdict = idx?.verdict ?? "?";
                const ok = verdict === "PASS";
                const partial = verdict === "PARTIAL" || verdict === "NEUTRAL";
                return (
                  <TableRow key={insp.url}>
                    <TableCell className="max-w-[260px] truncate">{insp.url.replace("https://radoclean.cz", "") || "/"}</TableCell>
                    <TableCell>
                      <Badge variant={ok ? "default" : partial ? "secondary" : "destructive"} className="gap-1">
                        {ok ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {verdict}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{idx?.coverageState ?? "—"}</TableCell>
                    <TableCell className="text-xs">{idx?.robotsTxtState ?? "—"}</TableCell>
                    <TableCell className="text-xs">{idx?.lastCrawlTime ? format(new Date(idx.lastCrawlTime), "d.M.yyyy") : "—"}</TableCell>
                  </TableRow>
                );
              })}
              {(!data.inspections || data.inspections.length === 0) && (
                <TableRow><TableCell colSpan={5} className="text-center text-sm text-muted-foreground">Žádná data</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Sitemap</CardTitle>
            <CardDescription>https://radoclean.cz/sitemap.xml</CardDescription>
          </div>
          <Button onClick={submitSitemap} disabled={submittingSitemap} size="sm">
            {submittingSitemap ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            Odeslat sitemap
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Path</TableHead>
                <TableHead className="text-right">URL</TableHead>
                <TableHead className="text-right">Errors</TableHead>
                <TableHead className="text-right">Warnings</TableHead>
                <TableHead>Poslední stažení</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sitemapEntries.map((s: any) => (
                <TableRow key={s.path}>
                  <TableCell className="max-w-[260px] truncate text-xs">{s.path}</TableCell>
                  <TableCell className="text-right">{s.contents?.[0]?.submitted ?? 0}</TableCell>
                  <TableCell className="text-right">
                    {Number(s.errors ?? 0) > 0
                      ? <Badge variant="destructive">{s.errors}</Badge>
                      : <span className="text-muted-foreground">0</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    {Number(s.warnings ?? 0) > 0
                      ? <Badge variant="secondary">{s.warnings}</Badge>
                      : <span className="text-muted-foreground">0</span>}
                  </TableCell>
                  <TableCell className="text-xs">{s.lastDownloaded ? format(new Date(s.lastDownloaded), "d.M.yyyy HH:mm") : "—"}</TableCell>
                </TableRow>
              ))}
              {sitemapEntries.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                  Žádný sitemap zatím není v Search Console. Klikni „Odeslat sitemap".
                </TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSeoDashboard;
