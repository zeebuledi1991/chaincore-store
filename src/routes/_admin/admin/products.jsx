import { createFileRoute } from "@tanstack/react-router";
import ProductsManager from "@/components/admin/ProductsManager";

export const Route = createFileRoute("/_admin/admin/products")({
  head: () => ({ meta: [{ title: "Products — ChainCore admin" }] }),
  component: ProductsManager,
});