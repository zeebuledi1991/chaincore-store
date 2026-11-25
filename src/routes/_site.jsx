import { createFileRoute, Outlet } from "@tanstack/react-router";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import SeoOverride from "@/components/site/SeoOverride";
import { ContentProvider } from "@/components/content/ContentProvider";
import { listSiteContent } from "@/lib/content-fns";

export const Route = createFileRoute("/_site")({
  loader: async () => {
    try {
      const fields = await listSiteContent();
      return { content: Object.fromEntries(fields.map((field) => [field.key, field.value])) };
    } catch (error) {
      return { content: {} };
    }
  },
  component: SiteLayout,
});

function SiteLayout() {
  const { content } = Route.useLoaderData();
  return (
    <ContentProvider content={content}>
      <div className="flex min-h-screen flex-col bg-background">
        <SeoOverride />
        <SiteHeader />
        <main className="flex-1 pt-[72px]">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </ContentProvider>
  );
}