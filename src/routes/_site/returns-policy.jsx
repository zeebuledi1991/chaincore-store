import { createFileRoute, redirect } from "@tanstack/react-router";

// Old address kept alive: the Refund Policy now lives at /refund-policy.
export const Route = createFileRoute("/_site/returns-policy")({
  beforeLoad: () => {
    throw redirect({ to: "/refund-policy", replace: true });
  },
});