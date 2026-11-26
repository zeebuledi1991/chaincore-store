import { createFileRoute } from "@tanstack/react-router";
import ContentEditor from "@/components/admin/ContentEditor";

export const Route = createFileRoute("/_admin/admin/content")({
  head: () => ({ meta: [{ title: "Website content — ChainCore admin" }] }),
  component: ContentEditor,
});