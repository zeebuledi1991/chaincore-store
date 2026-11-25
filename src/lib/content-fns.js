import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";
import { CONTENT_FIELDS } from "@/lib/content-defaults";

// Public read: every editable field with the value currently stored for it.
export const listSiteContent = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  const base44 = context.getBase44();
  const page = await base44.entities.SiteContent.list({ limit: 500 });
  const records = page?.items ?? page ?? [];
  const overrides = new Map(
    records.filter((record) => record.key).map((record) => [record.key, record.value ?? ""])
  );
  return CONTENT_FIELDS.map((field) => ({
    key: field.key,
    group: field.group,
    label: field.label,
    multiline: Boolean(field.multiline),
    value: overrides.has(field.key) ? overrides.get(field.key) : field.default,
  }));
});

export const saveSiteContent = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      entries: z
        .array(z.object({ key: z.string().trim().min(1).max(80), value: z.string().max(4000) }))
        .min(1)
        .max(400),
    })
  )
  .handler(async ({ data, context }) => {
    if (context.user?.role !== "admin") {
      throw Object.assign(new Error("Administrator access required"), { status: 403 });
    }
    const base44 = context.getBase44().asServiceRole;
    const page = await base44.entities.SiteContent.list({ limit: 500 });
    const existing = new Map((page?.items ?? []).map((record) => [record.key, record]));

    const updates = [];
    const creates = [];
    for (const entry of data.entries) {
      const record = existing.get(entry.key);
      if (record) {
        if ((record.value ?? "") !== entry.value) updates.push({ id: record.id, value: entry.value });
      } else {
        creates.push({ key: entry.key, value: entry.value });
      }
    }

    if (updates.length) await base44.entities.SiteContent.bulkUpdate(updates);
    if (creates.length) await base44.entities.SiteContent.bulkCreate(creates);

    return { saved: updates.length + creates.length };
  });