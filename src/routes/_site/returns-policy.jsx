import { createFileRoute } from "@tanstack/react-router";
import PageHeader from "@/components/site/PageHeader";
import LegalPage from "@/components/site/LegalPage";
import { SUPPORT_EMAIL } from "@/lib/catalog";

export const Route = createFileRoute("/_site/returns-policy")({
  head: () => ({
    meta: [
      { title: "Returns Policy — ChainCore Technologies LLC" },
      {
        name: "description",
        content:
          "Refund eligibility, request procedure, digital delivery terms and support timelines for ChainCore Technologies LLC purchases.",
      },
    ],
  }),
  component: ReturnsPolicyPage,
});

const SECTIONS = [
  {
    title: "Refund request procedure",
    paragraphs: [
      `Email ${SUPPORT_EMAIL} with the subject line "Refund request", your order number, the email used at checkout and the reason for the request. We confirm receipt within one business day.`,
      "Requests must be submitted within 14 days of the payment date. We may ask for diagnostic details so we can reproduce the issue before deciding.",
    ],
  },
  {
    title: "Eligibility requirements",
    paragraphs: [
      "A refund may be approved where the delivered licence or package materially differs from what was described, where access was never delivered, or where a defect prevents the licensed functionality from operating and we cannot correct it within a reasonable period.",
    ],
    bullets: [
      "Software licence keys that have not been activated or used may be refunded within 14 days of purchase.",
      "Simulation packages are eligible for refund before the allocated simulated units have been consumed.",
      "Charges for custom engagements already in delivery are governed by the written scope agreed for that engagement.",
      "Refunds are not available where the request arises from a failure to meet the customer's own environment requirements, or from use outside the agreed licence scope.",
    ],
  },
  {
    title: "Digital product delivery terms",
    paragraphs: [
      "Licences are digital products delivered by email immediately after payment is verified. No physical shipment takes place. Because delivery is immediate, the 14-day window above is the period in which a refund can be requested.",
      "Simulation packages contain simulated test units only. They are not genuine transferable USDT, carry no monetary value and cannot be exchanged, redeemed or withdrawn. Requests based on an expectation of real USDT delivery are not eligible.",
    ],
  },
  {
    title: "Defective software support",
    paragraphs: [
      "If licensed software does not perform as described, contact us first. We investigate every reported defect and aim to provide a fix or a workaround within five business days of a reproducible report.",
      "Where a defect cannot be corrected, we will either replace the affected component, extend the licence period at no charge, or refund the affected portion of the purchase, at your election.",
    ],
  },
  {
    title: "Refund processing timelines",
    paragraphs: [
      "Approved refunds are returned through the same cryptocurrency payment channel used for the original purchase, to the sending address or an address you nominate in writing.",
      "Approved refunds are initiated within three business days. Blockchain confirmation times are outside our control, and any network fees incurred on the return transfer are deducted from the refunded amount.",
    ],
  },
  {
    title: "Customer support contact",
    paragraphs: [
      `All refund and delivery questions go to ${SUPPORT_EMAIL}. Include your order number so we can locate the transaction without delay.`,
      "ChainCore Technologies LLC · Copyright 2026 · All rights reserved.",
    ],
  },
];

function ReturnsPolicyPage() {
  return (
    <>
      <PageHeader
        label="Returns Policy"
        title="Clear terms for digital licences and simulation packages."
        description="What is refundable, how to request it, and how quickly we respond."
      />
      <LegalPage
        label="Legal"
        title="Returns Policy"
        intro="Covers software licences, simulation packages and custom engagements purchased from ChainCore Technologies LLC."
        updated="November 2026"
        sections={SECTIONS}
      />
    </>
  );
}