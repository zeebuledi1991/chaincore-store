import { createFileRoute } from "@tanstack/react-router";
import { secrets } from "base44:runtime";
import { confirmOrder } from "@/lib/orders.server";

async function hmacSha512Hex(secret, payload) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let index = 0; index < a.length; index += 1) {
    diff |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return diff === 0;
}

export const Route = createFileRoute("/api/oxapay/webhook")({
  server: {
    handlers: {
      POST: async ({ request, context }) => {
        const apiKey = secrets.get("OXAPAY_API_KEY");
        if (!apiKey) return Response.json({ error: "Not configured" }, { status: 503 });

        const raw = await request.text();
        const signature = request.headers.get("hmac") || "";
        const expected = await hmacSha512Hex(apiKey, raw);
        if (!safeEqual(expected, signature)) {
          return Response.json({ error: "Invalid signature" }, { status: 401 });
        }

        let payload;
        try {
          payload = JSON.parse(raw);
        } catch (error) {
          return Response.json({ error: "Invalid payload" }, { status: 400 });
        }

        const type = String(payload?.type || "invoice").toLowerCase();
        if (type !== "invoice") return new Response("OK", { status: 200 });

        const base44 = context.getBase44().asServiceRole;
        const orderNumber = String(payload?.order_id || "");
        const trackId = String(payload?.track_id || "");

        let order = null;
        if (orderNumber) {
          const page = await base44.entities.Order.filter(
            { order_number: orderNumber },
            { limit: 1 }
          );
          order = (page?.items ?? [])[0] || null;
        }
        if (!order && trackId) {
          const page = await base44.entities.Order.filter({ track_id: trackId }, { limit: 1 });
          order = (page?.items ?? [])[0] || null;
        }
        if (!order) return new Response("OK", { status: 200 });

        const status = String(payload?.status || "").toLowerCase();
        if (status === "paid") {
          const siteOrigin = new URL(request.url).origin;
          await confirmOrder(base44, order, {
            origin: siteOrigin,
            paidAmount: payload?.amount ?? order.amount,
            note: `Confirmed by OxaPay webhook (track ${trackId || order.track_id}).`,
          });
        } else if (["paying", "expired", "failed", "canceled", "cancelled"].includes(status)) {
          const mapped =
            status === "canceled" || status === "cancelled" ? "cancelled" : status;
          if (order.status !== "paid") {
            await base44.entities.Order.update(order.id, {
              status: mapped,
              last_verified_at: new Date().toISOString(),
            });
          }
        }

        return new Response("OK", { status: 200 });
      },
    },
  },
});