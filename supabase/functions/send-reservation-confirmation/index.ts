import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyWebhookSecret } from "../_shared/webhook-auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-secret",
};

interface ReservationConfirmationRequest {
  reservationId?: string;
  email?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!(await verifyWebhookSecret(req))) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }


  try {
    const body: ReservationConfirmationRequest = await req.json().catch(() => ({}));
    const reservationId = body.reservationId;
    const requestEmail = body.email;

    if (!reservationId || typeof reservationId !== "string") {
      return new Response(JSON.stringify({ error: "reservationId required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: reservation, error: fetchError } = await supabase
      .from("reservations")
      .select(
        "id, name, email, phone, address, city, postal_code, package_type, preferred_date, preferred_time, total_price, extras, notes",
      )
      .eq("id", reservationId)
      .single();

    if (fetchError || !reservation) {
      return new Response(JSON.stringify({ error: "reservation not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (requestEmail && requestEmail.toLowerCase() !== reservation.email.toLowerCase()) {
      return new Response(JSON.stringify({ error: "email mismatch" }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const formattedDate = new Date(reservation.preferred_date).toLocaleDateString("cs-CZ", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const extras = Array.isArray(reservation.extras) ? reservation.extras : [];

    const sharedData = {
      name: reservation.name,
      phone: reservation.phone,
      packageType: reservation.package_type,
      formattedDate,
      preferredTime: reservation.preferred_time,
      address: reservation.address,
      city: reservation.city,
      postalCode: reservation.postal_code,
      extras,
      totalPrice: reservation.total_price,
    };

    // Customer confirmation — recipient + content derived server-side from
    // reservations table via reservationId (anon callers cannot inject either)
    const { error: customerErr } = await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "reservation-confirmation",
        reservationId: reservation.id,
        idempotencyKey: `reservation-confirm-${reservation.id}`,
      },
    });
    if (customerErr) console.error("Customer email enqueue failed:", customerErr);

    // Admin notification — same DB-derived path; template has hard-coded `to`
    const { error: adminErr } = await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "reservation-admin-notification",
        reservationId: reservation.id,
        idempotencyKey: `reservation-admin-${reservation.id}`,
      },
    });
    if (adminErr) console.error("Admin email enqueue failed:", adminErr);

    return new Response(
      JSON.stringify({ success: true, customerError: customerErr?.message ?? null, adminError: adminErr?.message ?? null }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (error) {
    console.error("Error in send-reservation-confirmation:", error);
    return new Response(JSON.stringify({ error: "internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
