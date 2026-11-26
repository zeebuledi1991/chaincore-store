import { BLOCKCHAINS, SUPPORT_EMAIL } from "@/lib/catalog";

export const ADMIN_EMAIL = SUPPORT_EMAIL;

export function chainLabel(id) {
  const chain = BLOCKCHAINS.find((item) => item.id === id);
  return chain ? chain.name : "";
}

function randomChunk(length = 4) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

export function generateLicenseKey() {
  return `CC-${randomChunk()}-${randomChunk()}-${randomChunk()}-${randomChunk()}`;
}

export function generateOrderNumber() {
  return `CC-${Date.now().toString(36).toUpperCase()}-${randomChunk(4)}`;
}

export function generateRequestNumber() {
  return `CR-${Date.now().toString(36).toUpperCase()}-${randomChunk(4)}`;
}

export function newOrderToken() {
  return crypto.randomUUID().replace(/-/g, "");
}

// Orders created before access tokens existed get one the first time it is needed.
async function ensureOrderToken(base44, order) {
  if (order.access_token) return order.access_token;
  const token = newOrderToken();
  await base44.entities.Order.update(order.id, { access_token: token });
  return token;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

async function sendTemplate(base44, payload) {
  try {
    const result = await base44.integrations.Core.SendEmail({
      ...payload,
      category: "transactional",
      from_name: "ChainCore Technologies LLC",
    });
    if (result && result.success === false) return "failed";
    return "sent";
  } catch (error) {
    return "failed";
  }
}

/**
 * Confirms an order exactly once: issues the licence, records it, and delivers
 * the receipt plus the administrator alert. Safe to call from the OxaPay webhook
 * and from server-side payment verification — a paid order is never processed twice.
 */
export async function confirmOrder(base44, order, { origin = "", paidAmount = null, note = "" } = {}) {
  if (!order || order.status === "paid") return order;

  const paidAt = new Date();
  const isLicense = order.product_kind === "license";
  const licenseKey = order.license_key || generateLicenseKey();
  const validUntil = addDays(paidAt, isLicense ? 365 : 180);

  const updated = await base44.entities.Order.update(order.id, {
    status: "paid",
    paid_at: paidAt.toISOString(),
    last_verified_at: paidAt.toISOString(),
    license_key: licenseKey,
    license_valid_until: validUntil.toISOString(),
    notes: [order.notes, note].filter(Boolean).join(" · ").slice(0, 500),
  });

  await base44.entities.License.create({
    license_key: licenseKey,
    order_number: order.order_number,
    order_id: order.id,
    customer_name: order.customer_name,
    customer_email: order.customer_email,
    product_name: order.product_name,
    license_type: isLicense ? "software_license" : "simulation_package",
    blockchain: order.blockchain || "",
    valid_from: paidAt.toISOString(),
    valid_until: validUntil.toISOString(),
    status: "active",
  });

  const orderUrl = origin
    ? `${origin}/order/${order.id}?t=${await ensureOrderToken(base44, order)}`
    : "";
  const variables = {
    customer_name: order.customer_name || "there",
    order_number: order.order_number,
    product_name: order.product_name,
    amount: `$${Number(paidAmount ?? order.amount).toLocaleString("en-US")} USD`,
    license_key: licenseKey,
    license_valid_until: validUntil.toISOString().slice(0, 10),
    blockchain: chainLabel(order.blockchain) || "All supported networks",
    units: order.simulated_units
      ? `${Number(order.simulated_units).toLocaleString("en-US")} simulated USDT-equivalent units`
      : "Full software licence",
    order_url: orderUrl,
    support_email: SUPPORT_EMAIL,
    customer_email: order.customer_email || "",
  };

  const emailStatus = await sendTemplate(base44, {
    to: order.customer_email,
    template_name: "OrderReceipt",
    variables,
  });

  const adminStatus = await sendTemplate(base44, {
    to: ADMIN_EMAIL,
    template_name: "AdminOrderAlert",
    variables,
  });

  return base44.entities.Order.update(order.id, {
    email_status: emailStatus,
    admin_email_status: adminStatus,
  });
}