import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReservationConfirmationRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  packageType: string;
  preferredDate: string;
  preferredTime: string;
  totalPrice: number;
  extras: string[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      packageType,
      preferredDate,
      preferredTime,
      totalPrice,
      extras,
    }: ReservationConfirmationRequest = await req.json();

    console.log("Processing reservation confirmation for:", email);

    // Format the date
    const formattedDate = new Date(preferredDate).toLocaleDateString("cs-CZ", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Format extras list
    const extrasHtml = extras.length > 0
      ? `<ul style="margin: 0; padding-left: 20px;">${extras.map(extra => `<li>${extra}</li>`).join("")}</ul>`
      : "<p>Žádné</p>";

    const emailResponse = await resend.emails.send({
      from: "Úklidová služba Radotín <onboarding@resend.dev>",
      to: [email],
      subject: "Potvrzení rezervace úklidu",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .detail-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #10b981; }
              .detail-row { margin: 10px 0; }
              .label { font-weight: bold; color: #374151; }
              .value { color: #6b7280; }
              .price { font-size: 24px; font-weight: bold; color: #10b981; }
              .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
              .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 28px;">✨ Děkujeme za rezervaci!</h1>
              </div>
              <div class="content">
                <p style="font-size: 16px;">Dobrý den ${name},</p>
                <p>Děkujeme za Vaši rezervaci. Rádi potvrzujeme následující detaily Vašeho úklidu:</p>
                
                <div class="detail-box">
                  <h3 style="margin-top: 0; color: #10b981;">📋 Detaily rezervace</h3>
                  <div class="detail-row">
                    <span class="label">Balíček:</span>
                    <span class="value">${packageType}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Datum:</span>
                    <span class="value">${formattedDate}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Čas:</span>
                    <span class="value">${preferredTime}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Adresa:</span>
                    <span class="value">${address}, ${city}</span>
                  </div>
                </div>

                <div class="detail-box">
                  <h3 style="margin-top: 0; color: #10b981;">🎁 Přídavné služby</h3>
                  ${extrasHtml}
                </div>

                <div class="detail-box">
                  <h3 style="margin-top: 0; color: #10b981;">💰 Cena</h3>
                  <p class="price">${totalPrice.toLocaleString("cs-CZ")} Kč</p>
                  <p style="font-size: 14px; color: #6b7280; margin: 0;">Konečná cena bez skrytých poplatků</p>
                </div>

                <div style="text-align: center;">
                  <a href="https://wa.me/420123456789" class="button">📱 Kontaktujte nás na WhatsApp</a>
                </div>

                <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px;">
                  <p style="margin: 0; font-size: 14px;">
                    <strong>ℹ️ Co bude následovat?</strong><br>
                    Brzy Vás budeme kontaktovat na telefonním čísle <strong>${phone}</strong> pro potvrzení přesného času a případné další detaily.
                  </p>
                </div>

                <p style="margin-top: 30px;">S přáním krásného dne,<br>
                <strong>Tým úklidové služby Radotín</strong></p>
              </div>
              
              <div class="footer">
                <p>Tento email byl odeslán automaticky. Prosím neodpovídejte na něj.</p>
                <p>Máte otázky? Kontaktujte nás na WhatsApp nebo zavolejte na +420 123 456 789</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-reservation-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
