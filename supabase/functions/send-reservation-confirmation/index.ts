import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const esc = (v: unknown): string =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

interface ReservationConfirmationRequest {
  reservationId?: string;
  email?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
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

    // Fetch the canonical reservation from the DB — never trust caller-supplied content.
    const { data: reservation, error: fetchError } = await supabase
      .from("reservations")
      .select(
        "id, name, email, phone, address, city, package_type, preferred_date, preferred_time, total_price, extras",
      )
      .eq("id", reservationId)
      .single();

    if (fetchError || !reservation) {
      return new Response(JSON.stringify({ error: "reservation not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Optional sanity check: if caller passed an email it must match the stored one
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

    const extrasArr: Array<{ label?: string }> = Array.isArray(reservation.extras)
      ? (reservation.extras as Array<{ label?: string }>)
      : [];
    const extrasHtml = extrasArr.length > 0
      ? `<ul style="margin: 0; padding-left: 20px;">${extrasArr
          .map((e) => `<li>${esc(e?.label ?? "")}</li>`) 
          .join("")}</ul>`
      : "<p>Žádné</p>";

    const emailResponse = await resend.emails.send({
      from: "Radoclean <noreply@notify.radoclean.cz>",
      to: [reservation.email],
      cc: ["veronika@radoclean.cz", "soused@radoclean.cz"],
      reply_to: "info@radoclean.cz",
      subject: "Potvrzení rezervace úklidu",
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8"></head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0; font-size: 28px;">✨ Děkujeme za rezervaci!</h1>
              </div>
              <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                <p style="font-size: 16px;">Dobrý den ${esc(reservation.name)},</p>
                <p>Děkujeme za Vaši rezervaci. Rádi potvrzujeme následující detaily Vašeho úklidu:</p>

                <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #10b981;">
                  <h3 style="margin-top: 0; color: #10b981;">📋 Detaily rezervace</h3>
                  <p><strong>Balíček:</strong> ${esc(reservation.package_type)}</p>
                  <p><strong>Datum:</strong> ${esc(formattedDate)}</p>
                  <p><strong>Čas:</strong> ${esc(reservation.preferred_time)}</p>
                  <p><strong>Adresa:</strong> ${esc(reservation.address)}, ${esc(reservation.city)}</p>
                </div>

                <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #10b981;">
                  <h3 style="margin-top: 0; color: #10b981;">🎁 Přídavné služby</h3>
                  ${extrasHtml}
                </div>

                <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #10b981;">
                  <h3 style="margin-top: 0; color: #10b981;">💰 Cena</h3>
                  <p style="font-size: 24px; font-weight: bold; color: #10b981;">${Number(reservation.total_price).toLocaleString("cs-CZ")} Kč</p>
                </div>

                <div style="background: #fef3c7; padding: 15px; border-radius: 8px;">
                  <p style="margin: 0; font-size: 14px;">
                    <strong>ℹ️ Co bude následovat?</strong><br>
                    Brzy Vás budeme kontaktovat na telefonním čísle <strong>${esc(reservation.phone)}</strong>.
                  </p>
                </div>

                <p style="margin-top: 30px;">S přáním krásného dne,<br><strong>Tým úklidové služby Radotín</strong></p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (emailResponse?.error) {
      console.error("Resend error:", JSON.stringify(emailResponse.error));
      return new Response(
        JSON.stringify({ error: "send_failed", details: emailResponse.error }),
        { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    console.log("Confirmation email sent:", emailResponse?.data?.id);

    return new Response(JSON.stringify({ success: true, id: emailResponse?.data?.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error in send-reservation-confirmation:", error);
    return new Response(JSON.stringify({ error: "internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
