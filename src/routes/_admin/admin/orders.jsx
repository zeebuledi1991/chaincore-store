import { createFileRoute } from "@tanstack/react-router";
import OrdersManager from "@/components/admin/OrdersManager";

export const Route = createFileRoute("/_admin/admin/orders")({
  head: () => ({ meta: [{ title: "Orders — ChainCore admin" }] }),
  component: OrdersManager,
});