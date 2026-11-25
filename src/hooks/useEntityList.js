import { useEffect, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";

export default function useEntityList(entityName, query = {}, { sort = "-created_date", limit = 200 } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const queryKey = JSON.stringify(query);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const entity = base44.entities[entityName];
      const options = { sort, limit };
      const result = Object.keys(query).length
        ? await entity.filter(query, options)
        : await entity.list(options);
      setItems(result?.items ?? result ?? []);
      setError("");
    } catch (err) {
      setError(err?.message || "Could not load records.");
    } finally {
      setLoading(false);
    }
  }, [entityName, queryKey, sort, limit]);

  useEffect(() => {
    load();
  }, [load]);

  return { items, loading, error, refresh: load, setItems };
}