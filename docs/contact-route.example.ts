import { NextResponse } from "next/server";

/**
 * Contact form endpoint.
 *
 * Validates on the server (never trust the client's own checks), then delivers
 * via Resend if RESEND_API_KEY is configured. Without that key it logs the
 * submission and still returns 200 — so the form works end to end in local dev
 * with no accounts or env setup, and starts delivering the moment you add one.
 *
 * Uses plain fetch against the Resend REST API rather than their SDK; it's one
 * request and not worth a dependency.
 */

export const runtime = "nodejs";

type Payload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  company?: unknown;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Very small in-memory rate limit: 5 submissions per IP per 10 minutes.
 * Per-instance only — fine for a portfolio, swap for Upstash/Redis if this
 * ever needs to hold across a fleet.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic cleanup so the map can't grow without bound.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }

  return recent.length > MAX_PER_WINDOW;
}

/** Strip characters that could forge extra headers in the outbound email. */
function sanitiseHeaderValue(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let body: Payload;

  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: a filled hidden field means a bot. Return 200 so it doesn't
  // learn anything from the response.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (name.length < 2 || name.length > 120) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }
  if (message.length < 10 || message.length > 5000) {
    return NextResponse.json(
      { error: "Your message should be between 10 and 5000 characters." },
      { status: 400 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages just now. Try again in a few minutes." },
      { status: 429 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    // Dev fallback: no mail provider wired up yet.
    console.info("[contact] submission received (no mail provider configured)", {
      name,
      email,
      message: message.slice(0, 300),
    });
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: sanitiseHeaderValue(from),
        to: [sanitiseHeaderValue(to)],
        // Replies go straight back to the sender.
        reply_to: sanitiseHeaderValue(email),
        subject: `Portfolio enquiry from ${sanitiseHeaderValue(name)}`,
        html: `
          <div style="font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.6">
            <h2 style="margin:0 0 16px">New portfolio enquiry</h2>
            <p style="margin:0 0 4px"><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p style="margin:0 0 16px"><strong>Email:</strong> ${escapeHtml(email)}</p>
            <div style="padding:16px;background:#f4f4f5;border-radius:12px;white-space:pre-wrap">${escapeHtml(
              message,
            )}</div>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[contact] Resend rejected the request", res.status, detail);
      return NextResponse.json(
        { error: "Couldn't send that right now. Try emailing me directly?" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (error) {
    console.error("[contact] delivery failed", error);
    return NextResponse.json(
      { error: "Couldn't send that right now. Try emailing me directly?" },
      { status: 502 },
    );
  }
}
