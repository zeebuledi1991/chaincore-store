import { createFileRoute } from "@tanstack/react-router";
import CmsEditor from "@/components/admin/cms/CmsEditor";
import { listCmsContent, listContentRevisions } from "@/lib/content-fns";

export const Route = createFileRoute("/_authed/admin/content")({
  loader: async () => {
    try {
      const [fields, revisions] = await Promise.all([listCmsContent(), listContentRevisions()]);
      return { fields, revisions };
    } catch (error) {
      // Non-admins see the access screen from the admin layout instead of an error page.
      return { fields: [], revisions: [] };
    }
  },
  component: ContentPage,
});

function ContentPage() {
  const { fields, revisions } = Route.useLoaderData();
  return <CmsEditor fields={fields} revisions={revisions} />;
}