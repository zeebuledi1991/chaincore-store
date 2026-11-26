import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { secrets } from "base44:runtime";
import { z } from "zod";
import { BLOCKCHAINS, SUPPORT_EMAIL, formatUsd } from "@/lib/catalog";
import {
  ADMIN_EMAIL,
  chainLabel,
  confirmOrder,
  generateOrderNumber,
  generateRequestNumber,
} from "@/lib/orders.server";

const CHAIN_IDS = BLOCKCHAINS.map((chain) => chain.id);
const SITE_ORIGIN = "https://chain-core-prime.base44.app";
const INVOICE_URL = "https://api.oxapay.com/v1/payment/invoice";
const PAYMENT_URL = "https://api.oxapay.com/v1/payment";

const emailSchema = z
  .string()
  .trim()
  .min(5)
  .max(160)
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Enter a valid email address");

// OxaPay rejects a relative callback_url, so this must always return an absolute origin.
function origin() {
  try {
    const requestUrl = getRequest()?.url;
    if (requestUrl) {
      const parsed = new URL(requestUrl);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") return parsed.origin;
    }
  } catch (error) {
    // No request scope available — fall back to the published site below.
  }
  return SITE_ORIGIN;
}

function serializeProduct(record) {
  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    kind: record.kind,
    price: record.price,
    priceLabel: record.price_label || formatUsd(record.price),
    tag: record.tag || "",
    summary: record.summary || "",
    features: record.features || [],
    simulatedUnits: record.simulated_units || 0,
    image: record.image_url || "",
    requiresBlockchain: record.requires_blockchain !== false,
    active: record.active !== false,
    sortOrder: record.sort_order || 0,
  };
}

function maskEmail(value) {
  const [name, domain] = String(value || "").split("@");
  if (!domain) return "";
  return `${name.slice(0, 1)}${"*".repeat(Math.max(name.length - 1, 2))}@${domain}`;
}

// An order id is not a credential: every order also carries a random secret that
// the buyer's order link contains and that getOrderStatus requires.
function newOrderToken() {
  return crypto.randomUUID().replace(/-/g, "");
}

function sameSecret(a, b) {
  const left = String(a || "");
  const right = String(b || "");
  if (!left || left.length !== right.length) return false;
  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return diff === 0;
}

async function fetchOxaPayInvoice(apiKey, payload) {
  const response = await fetch(INVOICE_URL, {
    method: "POST",
    headers: { merchant_api_key: apiKey, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20000),
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok || json?.status !== 200 || !json?.data?.payment_url) {
    const message =
      (typeof json?.error === "object" && json.error?.message) ||
      json?.message ||
      "The payment gateway rejected this request.";
    throw new Error(message);
  }
  return json.data;
}

async function fetchOxaPayStatus(apiKey, trackId) {
  const response = await fetch(`${PAYMENT_URL}/${encodeURIComponent(trackId)}`, {
    method: "GET",
    headers: { merchant_api_key: apiKey, "Content-Type": "application/json" },
    signal: AbortSignal.timeout(20000),
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok || json?.status !== 200 || !json?.data) return null;
  return json.data;
}

export const listProducts = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  const base44 = context.getBase44();
  const page = await base44.entities.Product.list({ sort: "sort_order", limit: 50 });
  const items = page?.items ?? page ?? [];
  return items.filter((item) => item.active !== false).map(serializeProduct);
});

export const createCheckout = createServerFn({ method: "POST" })
  .validator(
    z.object({
      productSlug: z.string().trim().min(1).max(80),
      name: z.string().trim().min(2).max(120),
      email: emailSchema,
      blockchain: z.string().trim().max(40).optional().default(""),
      walletAddress: z.string().trim().max(140).optional().default(""),
    })
  )
  .handler(async ({ data, context }) => {
    const apiKey = secrets.get("OXAPAY_API_KEY");
    if (!apiKey) {
      return {
        error:
          "Card and crypto checkout is not connected yet. Please email support@chaincore.store and we will invoice you directly.",
      };
    }

    const base44 = context.getBase44().asServiceRole;
    const productPage = await base44.entities.Product.filter(
      { slug: data.productSlug },
      { limit: 1 }
    );
    const product = (productPage?.items ?? [])[0];
    if (!product || product.active === false) {
      return { error: "This product is no longer available." };
    }

    const requiresBlockchain = product.requires_blockchain !== false;
    if (requiresBlockchain && !CHAIN_IDS.includes(data.blockchain)) {
      return { error: "Select the blockchain testing environment for this order." };
    }
    if (requiresBlockchain && !data.walletAddress) {
      return { error: "Enter the wallet address for this order." };
    }
    if (data.walletAddress && !/^[A-Za-z0-9:_-]{16,120}$/.test(data.walletAddress)) {
      return { error: "The wallet address format is not valid." };
    }

    // Every checkout gets its own invoice: an email address alone never unlocks
    // an existing order's payment link or reference.
    const orderNumber = generateOrderNumber();
    const accessToken = newOrderToken();
    const order = await base44.entities.Order.create({
      order_number: orderNumber,
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      product_kind: product.kind,
      amount: product.price,
      currency: "USD",
      status: "pending",
      payment_provider: "oxapay",
      customer_name: data.name,
      customer_email: data.email.toLowerCase(),
      blockchain: requiresBlockchain ? data.blockchain : "",
      wallet_address: data.walletAddress || "",
      simulated_units: product.simulated_units || 0,
      access_token: accessToken,
    });

    const siteOrigin = origin();
    try {
      const invoice = await fetchOxaPayInvoice(apiKey, {
        amount: Number(product.price),
        currency: "USD",
        lifetime: 60,
        fee_paid_by_payer: 0,
        under_paid_coverage: 2.5,
        callback_url: `${siteOrigin}/api/oxapay/webhook`,
        return_url: `${siteOrigin}/order/${order.id}?t=${accessToken}`,
        email: data.email.toLowerCase(),
        order_id: orderNumber,
        description: `${product.name} — ChainCore Technologies LLC`,
      });

      await base44.entities.Order.update(order.id, {
        status: "awaiting_payment",
        track_id: String(invoice.track_id || ""),
        pay_url: invoice.payment_url,
      });

      return {
        orderId: order.id,
        orderNumber,
        payUrl: invoice.payment_url,
      };
    } catch (error) {
      await base44.entities.Order.update(order.id, {
        status: "failed",
        notes: `Invoice creation failed: ${String(error?.message || error).slice(0, 300)}`,
      });
      return {
        error: `We could not start the payment. ${String(error?.message || "")} Please contact ${SUPPORT_EMAIL}.`,
      };
    }
  });

export const getOrderStatus = createServerFn({ method: "POST" })
  .validator(
    z.object({
      orderId: z.string().trim().min(6).max(64),
      token: z.string().trim().min(16).max(80),
    })
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44().asServiceRole;
    let order = null;
    try {
      order = await base44.entities.Order.get(data.orderId);
    } catch (error) {
      return { found: false };
    }
    // Nothing about the order — and never the licence key — is returned unless
    // the caller presents the order's own secret from the buyer's link.
    if (!order || !sameSecret(order.access_token, data.token)) return { found: false };

    const apiKey = secrets.get("OXAPAY_API_KEY");
    const stale =
      !order.last_verified_at ||
      Date.now() - new Date(order.last_verified_at).getTime() > 15000;

    if (order.status !== "paid" && apiKey && order.track_id && stale) {
      const remote = await fetchOxaPayStatus(apiKey, order.track_id);
      const remoteStatus = String(remote?.status || "").toLowerCase();
      if (remoteStatus === "paid") {
        order = await confirmOrder(base44, order, {
          origin: origin(),
          paidAmount: remote?.amount ?? order.amount,
          note: `Verified via OxaPay API (track ${order.track_id}).`,
        });
      } else if (remoteStatus) {
        const mapped =
          remoteStatus === "paying"
            ? "paying"
            : remoteStatus === "expired"
              ? "expired"
              : remoteStatus === "canceled" || remoteStatus === "cancelled"
                ? "cancelled"
                : remoteStatus === "failed"
                  ? "failed"
                  : order.status;
        order = await base44.entities.Order.update(order.id, {
          status: mapped,
          last_verified_at: new Date().toISOString(),
        });
      }
    }

    return {
      found: true,
      orderNumber: order.order_number,
      status: order.status,
      productName: order.product_name,
      productKind: order.product_kind,
      amount: order.amount,
      blockchain: chainLabel(order.blockchain),
      units: order.simulated_units || 0,
      email: maskEmail(order.customer_email),
      licenseKey: order.status === "paid" ? order.license_key || "" : "",
      licenseValidUntil: order.status === "paid" ? order.license_valid_until || "" : "",
      paidAt: order.paid_at || "",
      emailStatus: order.email_status || "not_sent",
      createdAt: order.created_date,
    };
  });

export const submitCustomOrder = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().trim().min(2).max(120),
      email: emailSchema,
      quantity: z.coerce.number().positive().max(1000000000),
      unit: z.enum(["K", "M", "B"]),
      blockchain: z.enum(["bnb", "ethereum", "solana", "tron"]),
      requirements: z.string().trim().max(2000).optional().default(""),
    })
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44().asServiceRole;
    const multiplier = data.unit === "K" ? 1000 : data.unit === "M" ? 1000000 : 1000000000;
    const requestedUnits = Math.round(data.quantity * multiplier);
    const requestNumber = generateRequestNumber();

    await base44.entities.CustomOrder.create({
      request_number: requestNumber,
      name: data.name,
      email: data.email.toLowerCase(),
      quantity: data.quantity,
      unit: data.unit,
      requested_units: requestedUnits,
      blockchain: data.blockchain,
      requirements: data.requirements || "",
      status: "new",
    });

    let notified = "failed";
    try {
      const result = await base44.integrations.Core.SendEmail({
        to: ADMIN_EMAIL,
        template_name: "CustomOrderRequest",
        category: "transactional",
        from_name: "ChainCore Technologies LLC",
        variables: {
          request_number: requestNumber,
          customer_name: data.name,
          customer_email: data.email,
          quantity: `${data.quantity}${data.unit}`,
          units: requestedUnits.toLocaleString("en-US"),
          blockchain: chainLabel(data.blockchain),
          requirements: data.requirements || "No additional requirements provided.",
        },
      });
      if (!result || result.success !== false) notified = "sent";
    } catch (error) {
      notified = "failed";
    }

    return { success: true, requestNumber, requestedUnits, notified };
  });

export const submitContactMessage = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().trim().min(2).max(120),
      email: emailSchema,
      subject: z.string().trim().min(3).max(160),
      message: z.string().trim().min(10).max(4000),
    })
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44().asServiceRole;
    await base44.entities.ContactMessage.create({
      name: data.name,
      email: data.email.toLowerCase(),
      subject: data.subject,
      message: data.message,
      status: "new",
    });

    let notified = "failed";
    try {
      const result = await base44.integrations.Core.SendEmail({
        to: ADMIN_EMAIL,
        template_name: "ContactMessage",
        category: "transactional",
        from_name: "ChainCore Technologies LLC",
        variables: {
          customer_name: data.name,
          customer_email: data.email,
          subject: data.subject,
          message: data.message,
        },
      });
      if (!result || result.success !== false) notified = "sent";
    } catch (error) {
      notified = "failed";
    }

    return { success: true, notified };
  });