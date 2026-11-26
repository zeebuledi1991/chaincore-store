import { createFileRoute } from "@tanstack/react-router";
import AboutHero from "@/components/about/AboutHero";
import AboutTeam from "@/components/about/AboutTeam";
import AboutStory from "@/components/about/AboutStory";
import AboutCta from "@/components/about/AboutCta";

export const Route = createFileRoute("/_site/about")({
  head: () => ({
    meta: [
      { title: "About Us — ChainCore Technologies LLC" },
      {
        name: "description",
        content:
          "The innovation of Flash: how ChainCore delivers Flash products worldwide, from our first build in 2015 to global success in 2022 and beyond.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutTeam />
      <AboutStory />
      <AboutCta />
    </>
  );
}