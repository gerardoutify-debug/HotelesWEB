import type { Reservation, RoomCategory } from "@/lib/types/database";
import { formatPEN } from "@/lib/utils";

type ReservationEmailPayload = Reservation & { room_categories?: RoomCategory };

export function reservationEmailHtml(r: ReservationEmailPayload) {
  const cat = r.room_categories;
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>Reserva confirmada · HoneyMoon Hotel</title></head>
<body style="margin:0;background:#0a0c0f;color:#f0ede8;font-family:Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0c0f;padding:32px 0">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#0f1215;border:1px solid #1a1f2e;border-radius:16px;overflow:hidden">
        <tr><td style="padding:32px 32px 8px 32px;text-align:center">
          <div style="font-family:Georgia,serif;font-size:32px;color:#c9a96e;letter-spacing:0.08em">HoneyMoon</div>
          <div style="color:#9a9490;font-size:12px;letter-spacing:0.3em;text-transform:uppercase;margin-top:4px">Hotel & Spa</div>
        </td></tr>
        <tr><td style="padding:8px 32px 24px 32px;text-align:center">
          <h1 style="font-family:Georgia,serif;font-size:28px;color:#f0ede8;margin:16px 0 8px 0;font-weight:400">Tu reserva está confirmada</h1>
          <p style="color:#9a9490;font-size:14px;margin:0">${r.guest_full_name}, gracias por elegirnos. Te esperamos.</p>
        </td></tr>
        <tr><td style="padding:0 32px">
          <div style="background:#141820;border:1px solid #1a1f2e;border-radius:12px;padding:24px;text-align:center;margin-bottom:16px">
            <div style="color:#9a9490;font-size:11px;letter-spacing:0.2em;text-transform:uppercase">Código de reserva</div>
            <div style="font-family:Georgia,serif;font-size:30px;color:#c9a96e;margin-top:8px">${r.reservation_code}</div>
          </div>
        </td></tr>
        <tr><td style="padding:0 32px 16px 32px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#141820;border-radius:12px;border:1px solid #1a1f2e">
            <tr>
              <td style="padding:16px 20px;border-bottom:1px solid #1a1f2e;width:50%">
                <div style="color:#9a9490;font-size:11px;letter-spacing:0.18em;text-transform:uppercase">Habitación</div>
                <div style="color:#f0ede8;font-size:16px;margin-top:4px">${cat?.name ?? ""}</div>
              </td>
              <td style="padding:16px 20px;border-bottom:1px solid #1a1f2e">
                <div style="color:#9a9490;font-size:11px;letter-spacing:0.18em;text-transform:uppercase">Huéspedes</div>
                <div style="color:#f0ede8;font-size:16px;margin-top:4px">${r.adults} adultos · ${r.children} niños</div>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 20px;border-bottom:1px solid #1a1f2e">
                <div style="color:#9a9490;font-size:11px;letter-spacing:0.18em;text-transform:uppercase">Check-in</div>
                <div style="color:#f0ede8;font-size:16px;margin-top:4px">${r.check_in_date} · 15:00</div>
              </td>
              <td style="padding:16px 20px;border-bottom:1px solid #1a1f2e">
                <div style="color:#9a9490;font-size:11px;letter-spacing:0.18em;text-transform:uppercase">Check-out</div>
                <div style="color:#f0ede8;font-size:16px;margin-top:4px">${r.check_out_date} · 11:00</div>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 20px" colspan="2">
                <div style="color:#9a9490;font-size:11px;letter-spacing:0.18em;text-transform:uppercase">Total (${r.nights} noches · IGV incluido)</div>
                <div style="color:#c9a96e;font-family:Georgia,serif;font-size:28px;margin-top:4px">${formatPEN(Number(r.total_amount))}</div>
              </td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding:8px 32px 32px 32px;text-align:center">
          <p style="color:#9a9490;font-size:13px;line-height:1.6;margin:16px 0">
            Conserva este código para tu check-in. Política de cancelación: hasta 48h antes del check-in.<br>
            Recepción 24/7 · reservas@honeymoonhotel.pe · +51 1 234-5678
          </p>
        </td></tr>
      </table>
      <p style="color:#4a4845;font-size:11px;margin-top:16px">HoneyMoon Hotel · Malecón Cisneros 1420, Miraflores, Lima</p>
    </td></tr>
  </table>
</body></html>`;
}

export async function sendReservationEmail(reservation: ReservationEmailPayload) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[brevo] BREVO_API_KEY not configured, skipping email send");
    return { skipped: true };
  }
  const sender = {
    email: process.env.BREVO_SENDER_EMAIL ?? "reservas@honeymoonhotel.pe",
    name: process.env.BREVO_SENDER_NAME ?? "HoneyMoon Hotel",
  };
  const body = {
    sender,
    to: [{ email: reservation.guest_email, name: reservation.guest_full_name }],
    subject: `Reserva confirmada · ${reservation.reservation_code} · HoneyMoon Hotel`,
    htmlContent: reservationEmailHtml(reservation),
  };
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    console.error("[brevo] send failed", res.status, txt);
    return { ok: false, status: res.status, error: txt };
  }
  return { ok: true };
}
