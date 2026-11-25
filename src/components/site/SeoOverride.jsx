import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useContent } from "@/components/content/ContentProvider";

const PAGE_KEYS = {
  "/": "home",
  "/products": "products",
  "/about": "about",
  "/contact": "contact",
  "/custom-order": "customOrder",
  "/privacy-policy": "privacy",
  "/returns-policy": "returns",
};

// Applies the page title and description managed in the CMS. The route's own
// head() stays as the server-rendered fallback.
export default function SeoOverride() {
  const t = useContent();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const page = PAGE_KEYS[pathname];
  const title = page ? t(`seo.${page}.title`) : "";
  const description = page ? t(`seo.${page}.description`) : "";

  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", description);
    }
  }, [title, description]);

  return null;
}