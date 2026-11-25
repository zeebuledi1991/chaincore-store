import { createFileRoute } from "@tanstack/react-router";
import PageHeader from "@/components/site/PageHeader";
import LegalPage from "@/components/site/LegalPage";
import { useContent } from "@/components/content/ContentProvider";
import { legalSections } from "@/lib/legal-content";

export const Route = createFileRoute("/_site/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — ChainCore Technologies LLC" },
      {
        name: "description",
        content:
          "How ChainCore Technologies LLC collects, uses and protects customer information, order data and payment details.",
      },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  const t = useContent();

  return (
    <>
      <PageHeader
        label={t("privacy.label")}
        title={t("privacy.title")}
        description={t("privacy.description")}
      />
      <LegalPage
        label={t("privacy.legalLabel")}
        title={t("privacy.legalTitle")}
        intro={t("privacy.intro")}
        updated={t("privacy.updated")}
        sections={legalSections(t, "privacy", 7)}
      />
    </>
  );
}