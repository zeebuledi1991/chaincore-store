import { createFileRoute } from "@tanstack/react-router";
import MessagesManager from "@/components/admin/MessagesManager";

export const Route = createFileRoute("/_admin/admin/messages")({
  head: () => ({ meta: [{ title: "Messages — ChainCore admin" }] }),
  component: MessagesManager,
});