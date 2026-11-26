import { base44 } from "@/api/base44Client";

const items = (page) => page?.items ?? page ?? [];

export async function listAll(entity, sort = "-created_date", limit = 200) {
  const page = await base44.entities[entity].list({ sort, limit });
  return items(page);
}

export async function listContentRecords() {
  return listAll("SiteContent", "key", 500);
}

// One record per content key. Saving creates the override the first time and
// updates it afterwards, so the live site picks the value up on its next load.
export async function saveContent(key, value, email, hidden = false) {
  const existing = items(await base44.entities.SiteContent.filter({ key }, { limit: 1 }))[0];
  const payload = { key, value, hidden, updated_by: email || "" };
  if (existing) return base44.entities.SiteContent.update(existing.id, payload);
  return base44.entities.SiteContent.create(payload);
}

export async function saveRecord(entity, id, values) {
  if (id) return base44.entities[entity].update(id, values);
  return base44.entities[entity].create(values);
}

export async function removeRecord(entity, id) {
  return base44.entities[entity].delete(id);
}