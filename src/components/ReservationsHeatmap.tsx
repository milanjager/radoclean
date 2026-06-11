import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Row = { preferred_date: string; preferred_time: string };

const DAYS = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7..20

const ReservationsHeatmap = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<"30" | "90" | "365" | "all">("90");

  useEffect(() => {
    (async () => {
      setLoading(true);
      let q = supabase.from("reservations").select("preferred_date, preferred_time");
      if (range !== "all") {
        const days = parseInt(range, 10);
        const from = new Date();
        from.setDate(from.getDate() - days);
        q = q.gte("preferred_date", from.toISOString().slice(0, 10));
      }
      const { data, error } = await q;
      if (!error) setRows((data as Row[]) || []);
      setLoading(false);
    })();
  }, [range]);

  const { matrix, max, totalsByDay, totalsByHour, total } = useMemo(() => {
    const m: number[][] = Array.from({ length: 7 }, () => Array(HOURS.length).fill(0));
    const td = Array(7).fill(0);
    const th = Array(HOURS.length).fill(0);
    let t = 0;
    for (const r of rows) {
      if (!r.preferred_date || !r.preferred_time) continue;
      const d = new Date(r.preferred_date + "T00:00:00");
      // Monday = 0
      const dayIdx = (d.getDay() + 6) % 7;
      const hour = parseInt(r.preferred_time.split(":")[0], 10);
      const hIdx = HOURS.indexOf(hour);
      if (hIdx === -1) continue;
      m[dayIdx][hIdx] += 1;
      td[dayIdx] += 1;
      th[hIdx] += 1;
      t += 1;
    }
    const mx = Math.max(1, ...m.flat());
    return { matrix: m, max: mx, totalsByDay: td, totalsByHour: th, total: t };
  }, [rows]);

  const cellStyle = (v: number) => {
    if (v === 0) return { backgroundColor: "hsl(var(--muted))" };
    const ratio = v / max;
    // Use primary color with variable opacity
    return {
      backgroundColor: `hsl(var(--primary) / ${0.15 + ratio * 0.85})`,
    };
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Heatmapa rezervací</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Rozložení rezervací podle dne v týdnu a hodiny ({total} rezervací)
          </p>
        </div>
        <Select value={range} onValueChange={(v) => setRange(v as typeof range)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">Posledních 30 dní</SelectItem>
            <SelectItem value="90">Posledních 90 dní</SelectItem>
            <SelectItem value="365">Poslední rok</SelectItem>
            <SelectItem value="all">Vše</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `60px repeat(${HOURS.length}, minmax(36px, 1fr)) 50px`,
                }}
              >
                <div />
                {HOURS.map((h) => (
                  <div
                    key={h}
                    className="text-xs text-center text-muted-foreground font-medium pb-1"
                  >
                    {h}
                  </div>
                ))}
                <div className="text-xs text-center text-muted-foreground font-semibold pb-1">
                  Σ
                </div>

                {DAYS.map((day, di) => (
                  <>
                    <div
                      key={`d-${di}`}
                      className="text-xs text-muted-foreground font-medium flex items-center"
                    >
                      {day}
                    </div>
                    {HOURS.map((_, hi) => {
                      const v = matrix[di][hi];
                      return (
                        <div
                          key={`c-${di}-${hi}`}
                          className="aspect-square rounded flex items-center justify-center text-xs font-medium transition-transform hover:scale-110 cursor-default"
                          style={cellStyle(v)}
                          title={`${day} ${HOURS[hi]}:00 — ${v} rezervací`}
                        >
                          {v > 0 ? v : ""}
                        </div>
                      );
                    })}
                    <div
                      key={`s-${di}`}
                      className="text-xs text-center font-semibold flex items-center justify-center text-muted-foreground"
                    >
                      {totalsByDay[di]}
                    </div>
                  </>
                ))}

                <div className="text-xs text-muted-foreground font-semibold pt-1">
                  Σ
                </div>
                {totalsByHour.map((v, i) => (
                  <div
                    key={`th-${i}`}
                    className="text-xs text-center text-muted-foreground font-semibold pt-1"
                  >
                    {v}
                  </div>
                ))}
                <div />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-6 text-xs text-muted-foreground">
              <span>Méně</span>
              {[0, 0.2, 0.4, 0.6, 0.8, 1].map((r, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded"
                  style={{
                    backgroundColor:
                      r === 0
                        ? "hsl(var(--muted))"
                        : `hsl(var(--primary) / ${0.15 + r * 0.85})`,
                  }}
                />
              ))}
              <span>Více</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReservationsHeatmap;
