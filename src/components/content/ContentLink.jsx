import { Link } from "@tanstack/react-router";

// Renders an internal route as a client-side link and anything else as a plain
// anchor, so a destination typed in the CMS can never break the router.
const INTERNAL = new Set([
  "/",
  "/products",
  "/about",
  "/contact",
  "/custom-order",
  "/privacy-policy",
  "/returns-policy",
]);

function isInternal(target) {
  if (!target.startsWith("/")) return false;
  if (INTERNAL.has(target)) return true;
  return target.startsWith("/products/") || target.startsWith("/order/");
}

export default function ContentLink({ to, children, ...props }) {
  const target = String(to || "").trim();

  if (isInternal(target)) {
    return (
      <Link to={target} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={target || "/"} {...props}>
      {children}
    </a>
  );
}