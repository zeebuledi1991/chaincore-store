import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";
import { CONTENT_FIELDS } from "@/lib/content-defaults";

const FIELD_BY_KEY = new Map(CONTENT_FIELDS.map((field) => [field.key, field]));

function assertAdmin(context) {
  if (context.user?.role !== "admin") {
    throw Object.assign(new Error("Administrator access required"), { status: 403 });
  }
}

function recordsFrom(page) {
  return page?.items ?? page ?? [];
}

function hasValue(record) {
  return record?.value !== null && record?.value !== undefined;
}

// What a visitor sees: a hidden element renders empty, otherwise the published
// override when one exists, otherwise the default copy defined in code.
function liveValue(record, field) {
  if (record?.hidden) return "";
  if (hasValue(record)) return record.value;
  return field?.default ?? "";
}

async function loadRecords(base44) {
  const page = await base44.entities.SiteContent.list({ limit: 500 });
  return new Map(recordsFrom(page).map((record) => [record.key, record]));
}

// Public read used by the website itself.
export const listSiteContent = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  const base44 = context.getBase44();
  const records = await loadRecords(base44);
  return CONTENT_FIELDS.map((field) => ({
    key: field.key,
    value: liveValue(records.get(field.key), field),
  }));
});

// Admin inventory: published value, pending draft and visibility for every element.
export const listCmsContent = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    assertAdmin(context);
    const records = await loadRecords(context.getBase44().asServiceRole);
    return CONTENT_FIELDS.map((field) => {
      const record = records.get(field.key);
      const draftRaw = record?.draft_value;
      const publishedValue = hasValue(record) ? record.value : field.default;
      return {
        key: field.key,
        group: field.group,
        label: field.label,
        type: field.type || "text",
        multiline: Boolean(field.multiline),
        published: liveValue(record, field),
        draft: draftRaw ?? "",
        hasDraft: draftRaw !== null && draftRaw !== undefined && draftRaw !== publishedValue,
        hidden: Boolean(record?.hidden),
        isOverride: Boolean(record),
      };
    });
  });

// Draft preview for administrators only: drafts on top of published values.
export const previewContent = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    assertAdmin(context);
    const records = await loadRecords(context.getBase44().asServiceRole);
    const output = {};
    for (const field of CONTENT_FIELDS) {
      const record = records.get(field.key);
      const draftRaw = record?.draft_value;
      output[field.key] =
        draftRaw !== null && draftRaw !== undefined ? draftRaw : liveValue(record, field);
    }
    return output;
  });

export const saveContentDraft = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      entries: z
        .array(z.object({ key: z.string().trim().min(1).max(80), value: z.string().max(6000) }))
        .min(1)
        .max(400),
    })
  )
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    const base44 = context.getBase44().asServiceRole;
    const records = await loadRecords(base44);
    const editor = context.user?.email || "";

    const updates = [];
    const creates = [];
    for (const entry of data.entries) {
      if (!FIELD_BY_KEY.has(entry.key)) continue;
      const record = records.get(entry.key);
      if (record) updates.push({ id: record.id, draft_value: entry.value, updated_by: editor });
      else creates.push({ key: entry.key, draft_value: entry.value, updated_by: editor });
    }

    if (updates.length) await base44.entities.SiteContent.bulkUpdate(updates);
    if (creates.length) await base44.entities.SiteContent.bulkCreate(creates);
    return { saved: updates.length + creates.length };
  });

export const publishContent = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    assertAdmin(context);
    const base44 = context.getBase44().asServiceRole;
    const records = [...(await loadRecords(base44)).values()];
    const pending = records.filter(
      (record) =>
        record.draft_value !== null &&
        record.draft_value !== undefined &&
        record.draft_value !== (hasValue(record) ? record.value : undefined)
    );
    if (!pending.length) return { published: 0 };

    const editor = context.user?.email || "";
    await base44.entities.ContentRevision.bulkCreate(
      pending.map((record) => ({
        key: record.key,
        previous_value: hasValue(record) ? record.value : "",
        published_value: record.draft_value,
        action: "publish",
        changed_by: editor,
      }))
    );
    await base44.entities.SiteContent.bulkUpdate(
      pending.map((record) => ({ id: record.id, value: record.draft_value, draft_value: null }))
    );
    return { published: pending.length };
  });

export const discardContentDrafts = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    assertAdmin(context);
    const base44 = context.getBase44().asServiceRole;
    const records = [...(await loadRecords(base44)).values()].filter(
      (record) => record.draft_value !== null && record.draft_value !== undefined
    );
    if (!records.length) return { discarded: 0 };
    await base44.entities.SiteContent.bulkUpdate(
      records.map((record) => ({ id: record.id, draft_value: null }))
    );
    return { discarded: records.length };
  });

export const resetContentField = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ key: z.string().trim().min(1).max(80) }))
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    const base44 = context.getBase44().asServiceRole;
    const record = recordsFrom(
      await base44.entities.SiteContent.filter({ key: data.key }, { limit: 1 })
    )[0];
    if (!record) return { reset: false };

    await base44.entities.ContentRevision.create({
      key: data.key,
      previous_value: hasValue(record) ? record.value : "",
      published_value: "",
      action: "reset",
      changed_by: context.user?.email || "",
    });
    await base44.entities.SiteContent.delete(record.id);
    return { reset: true };
  });

export const setContentHidden = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ key: z.string().trim().min(1).max(80), hidden: z.boolean() }))
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    const base44 = context.getBase44().asServiceRole;
    const record = recordsFrom(
      await base44.entities.SiteContent.filter({ key: data.key }, { limit: 1 })
    )[0];
    if (record) await base44.entities.SiteContent.update(record.id, { hidden: data.hidden });
    else await base44.entities.SiteContent.create({ key: data.key, hidden: data.hidden });
    return { hidden: data.hidden };
  });

export const listContentRevisions = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    assertAdmin(context);
    const base44 = context.getBase44().asServiceRole;
    const page = await base44.entities.ContentRevision.list({
      sort: "-created_date",
      limit: 40,
    });
    return recordsFrom(page).map((revision) => ({
      id: revision.id,
      key: revision.key,
      label: FIELD_BY_KEY.get(revision.key)?.label || revision.key,
      previousValue: revision.previous_value ?? "",
      publishedValue: revision.published_value ?? "",
      action: revision.action || "publish",
      changedBy: revision.changed_by || "",
      createdAt: revision.created_date,
    }));
  });

export const restoreContentRevision = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ id: z.string().trim().min(1).max(64) }))
  .handler(async ({ data, context }) => {
    assertAdmin(context);
    const base44 = context.getBase44().asServiceRole;
    const revision = await base44.entities.ContentRevision.get(data.id);
    if (!revision) return { restored: false };

    const field = FIELD_BY_KEY.get(revision.key);
    const record = recordsFrom(
      await base44.entities.SiteContent.filter({ key: revision.key }, { limit: 1 })
    )[0];
    const current = record
      ? hasValue(record)
        ? record.value
        : field?.default ?? ""
      : field?.default ?? "";
    const previous = revision.previous_value ?? "";

    if (!previous) {
      if (record) await base44.entities.SiteContent.delete(record.id);
    } else if (record) {
      await base44.entities.SiteContent.update(record.id, { value: previous, draft_value: null });
    } else {
      await base44.entities.SiteContent.create({ key: revision.key, value: previous });
    }

    await base44.entities.ContentRevision.create({
      key: revision.key,
      previous_value: current,
      published_value: previous,
      action: "restore",
      changed_by: context.user?.email || "",
    });
    return { restored: true };
  });