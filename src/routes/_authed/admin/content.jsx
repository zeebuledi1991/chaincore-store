import { createFileRoute } from "@tanstack/react-router";
import ContentEditor from "@/components/admin/ContentEditor";
import { listSiteContent } from "@/lib/content-fns";

export const Route = createFileRoute("/_authed/admin/content")({
  loader: () => listSiteContent(),
  component: ContentPage,
});

function ContentPage() {
  const fields = Route.useLoaderData();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Website content</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Every line of text on the public website is editable here. Change a field and press save —
        the live site updates immediately.
      </p>
      <ContentEditor fields={fields} />
    </div>
  );
}