import { createFileRoute, redirect } from "@tanstack/react-router";

// Old address kept alive: the About Us page now lives at /about-us.
export const Route = createFileRoute("/_site/about")({
  beforeLoad: () => {
    throw redirect({ to: "/about-us", replace: true });
  },
});