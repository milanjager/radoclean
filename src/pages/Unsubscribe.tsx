import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type State = "loading" | "valid" | "already" | "invalid" | "submitting" | "done" | "error";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>("loading");

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
  const endpoint = `${supabaseUrl}/functions/v1/handle-email-unsubscribe`;

  useEffect(() => {
    if (!token) { setState("invalid"); return; }
    (async () => {
      try {
        const res = await fetch(`${endpoint}?token=${encodeURIComponent(token)}`, {
          headers: { apikey: anonKey },
        });
        const data = await res.json();
        if (data.valid) setState("valid");
        else if (data.reason === "already_unsubscribed") setState("already");
        else setState("invalid");
      } catch {
        setState("error");
      }
    })();
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setState("submitting");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: anonKey },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success) setState("done");
      else if (data.reason === "already_unsubscribed") setState("already");
      else setState("error");
    } catch {
      setState("error");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <SEO
        title="Odhlášení z e-mailů | Rado Clean"
        description="Odhlaste se z e-mailové komunikace Rado Clean jedním kliknutím."
        path="/unsubscribe"
        noindex
      />
      <div className="max-w-md w-full bg-card border rounded-2xl p-8 text-center">
        {state === "loading" && (
          <>
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">Ověřuji odkaz…</p>
          </>
        )}
        {state === "valid" && (
          <>
            <h1 className="text-2xl font-bold mb-3">Odhlásit z e-mailů</h1>
            <p className="text-muted-foreground mb-6">
              Opravdu se chcete odhlásit z odběru e-mailů od RadoClean?
            </p>
            <Button onClick={confirm} variant="premium" size="lg" className="w-full">
              Potvrdit odhlášení
            </Button>
          </>
        )}
        {state === "submitting" && (
          <>
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">Odhlašuji…</p>
          </>
        )}
        {state === "done" && (
          <>
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
            <h1 className="text-2xl font-bold mb-2">Odhlášeno</h1>
            <p className="text-muted-foreground mb-6">
              Už od nás nebudete dostávat žádné e-maily.
            </p>
            <Link to="/"><Button variant="outline">Zpět na web</Button></Link>
          </>
        )}
        {state === "already" && (
          <>
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
            <h1 className="text-2xl font-bold mb-2">Již odhlášeno</h1>
            <p className="text-muted-foreground mb-6">
              Tato adresa je už z odběru odhlášena.
            </p>
            <Link to="/"><Button variant="outline">Zpět na web</Button></Link>
          </>
        )}
        {(state === "invalid" || state === "error") && (
          <>
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
            <h1 className="text-2xl font-bold mb-2">Neplatný odkaz</h1>
            <p className="text-muted-foreground mb-6">
              Odkaz pro odhlášení je neplatný nebo již vypršel.
            </p>
            <Link to="/"><Button variant="outline">Zpět na web</Button></Link>
          </>
        )}
      </div>
    </main>
  );
};

export default Unsubscribe;
