import { createFileRoute } from "@tanstack/react-router";
import PageHeader from "@/components/site/PageHeader";
import LegalPage from "@/components/site/LegalPage";
import { useContent } from "@/components/content/ContentProvider";
import { legalSections } from "@/lib/legal-content";

export const Route = createFileRoute("/_site/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy — ChainCore Technologies LLC" },
      {
        name: "description",
        content:
          "Refund eligibility, request procedure, refund conditions and support contacts for ChainCore Technologies LLC purchases.",
      },
    ],
  }),
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  const t = useContent();

  return (
    <>
      <PageHeader
        label={t("returns.label")}
        title={t("returns.title")}
        description={t("returns.description")}
      />
      <LegalPage
        label={t("returns.legalLabel")}
        title={t("returns.legalTitle")}
        intro={t("returns.intro")}
        updated={t("returns.updated")}
        updatedLabel="Effective date"
        sections={legalSections(t, "returns", 5)}
      />
    </>
  );
}