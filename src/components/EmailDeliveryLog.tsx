import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw, AlertCircle } from "lucide-react";

type LogRow = {
  message_id: string;
  template_name: string;
  recipient_email: string;
  status: string;
  error_message: string | null;
  created_at: string;
  metadata: { idempotency_key?: string } | null;
};

type Props = {
  kind: "reservation" | "inquiry";
  entityId: string;
};

// Map raw template names -> human label + audience.
function describeTemplate(name: string): { label: string; audience: string } {
  const base = name.replace(/-copy$/, "");
  const isCopy = name.endsWith("-copy");
  const map: Record<string, { label: string; audience: string }> = {
    "reservation-confirmation": { label: "Potvrzení rezervace", audience: "Zákazník" },
    "reservation-admin-notification": { label: "Notifikace o rezervaci", audience: "Admin" },
    "inquiry-confirmation": { label: "Potvrzení poptávky", audience: "Zákazník" },
    "inquiry-admin-notification": { label: "Notifikace o poptávce", audience: "Admin" },
  };
  const entry = map[base] ?? { label: base, audience: "—" };
  return isCopy
    ? { label: `${entry.label} (kopie)`, audience: "Soused" }
    : entry;
}

function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "sent":
      return "default";
    case "pending":
      return "secondary";
    case "failed":
    case "dlq":
    case "bounced":
    case "complained":
      return "destructive";
    case "suppressed":
      return "outline";
    default:
      return "secondary";
  }
}

function statusClasses(status: string): string {
  switch (status) {
    case "sent":
      return "bg-green-600 hover:bg-green-600 text-white";
    case "pending":
      return "bg-yellow-500 hover:bg-yellow-500 text-white";
    case "suppressed":
      return "border-orange-500 text-orange-600";
    default:
      return "";
  }
}

const EmailDeliveryLog = ({ kind, entityId }: Props) => {
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const keys =
    kind === "reservation"
      ? [
          `reservation-confirm-${entityId}`,
          `reservation-admin-${entityId}`,
          `reservation-confirm-${entityId}-copy`,
          `reservation-admin-${entityId}-copy`,
        ]
      : [
          `inquiry-confirm-${entityId}`,
          `inquiry-admin-${entityId}`,
          `inquiry-confirm-${entityId}-copy`,
          `inquiry-admin-${entityId}-copy`,
        ];

  const fetchLog = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("email_send_log")
        .select("message_id, template_name, recipient_email, status, error_message, created_at, metadata")
        .in("metadata->>idempotency_key", keys)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Deduplicate by message_id, keeping the latest status (rows are already sorted DESC).
      const seen = new Set<string>();
      const latest: LogRow[] = [];
      for (const r of (data as LogRow[]) ?? []) {
        if (seen.has(r.message_id)) continue;
        seen.add(r.message_id);
        latest.push(r);
      }
      setRows(latest);
    } catch (e: any) {
      console.error("Failed to load email delivery log", e);
      setError(e?.message ?? "Nepodařilo se načíst log doručení.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, entityId]);

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Doručení emailů</h3>
          <span className="text-xs text-muted-foreground">({rows.length})</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchLog}
          disabled={loading}
          aria-label="Obnovit"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="p-4">
        {error && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!error && loading && rows.length === 0 && (
          <p className="text-sm text-muted-foreground">Načítám…</p>
        )}

        {!error && !loading && rows.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Žádné emaily zatím nebyly zařazeny pro tuto{" "}
            {kind === "reservation" ? "rezervaci" : "poptávku"}.
          </p>
        )}

        {rows.length > 0 && (
          <ul className="space-y-3">
            {rows.map((row) => {
              const desc = describeTemplate(row.template_name);
              return (
                <li
                  key={row.message_id}
                  className="flex flex-col gap-1 rounded-md border bg-background p-3 text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium">{desc.label}</div>
                    <Badge
                      variant={statusVariant(row.status)}
                      className={statusClasses(row.status)}
                    >
                      {row.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">{desc.audience}:</span>{" "}
                    {row.recipient_email}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(row.created_at).toLocaleString("cs-CZ")}
                  </div>
                  {row.error_message && (
                    <div className="mt-1 rounded border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive">
                      {row.error_message}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EmailDeliveryLog;
