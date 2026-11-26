import { createFileRoute, redirect } from "@tanstack/react-router";

// Old address kept alive: the Contact Us page now lives at /contact-us.
export const Route = createFileRoute("/_site/contact")({
  beforeLoad: () => {
    throw redirect({ to: "/contact-us", replace: true });
  },
});