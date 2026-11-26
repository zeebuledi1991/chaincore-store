import { createFileRoute } from "@tanstack/react-router";
import RequestsManager from "@/components/admin/RequestsManager";

export const Route = createFileRoute("/_admin/admin/requests")({
  head: () => ({ meta: [{ title: "Custom requests — ChainCore admin" }] }),
  component: RequestsManager,
});