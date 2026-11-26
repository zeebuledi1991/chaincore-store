import { createServerFn } from "@tanstack/react-start";
import { CONTENT_FIELDS } from "@/lib/content-defaults";

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

// Public read used by the website itself.
export const listSiteContent = createServerFn({ method: "GET" }).handler(async ({ context }) => {
  const base44 = context.getBase44();
  const page = await base44.entities.SiteContent.list({ limit: 500 });
  const records = new Map(recordsFrom(page).map((record) => [record.key, record]));
  return CONTENT_FIELDS.map((field) => ({
    key: field.key,
    value: liveValue(records.get(field.key), field),
  }));
});