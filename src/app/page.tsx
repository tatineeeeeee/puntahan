import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "puntahan — Philippine Travel Guide",
  description: "Discover and share the best travel spots across the Philippines. Community-driven tips for NCR, Luzon, Visayas, and Mindanao.",
};
import { ComparisonProvider } from "@/lib/comparison-context";
import { BrowsePage } from "@/components/destinations/browse-page";
import { CompareFloatingButton } from "@/components/compare/compare-floating-button";
import { HeroSection } from "@/components/destinations/hero-section";
import { OnboardingTrigger } from "@/components/onboarding/onboarding-trigger";

export default function Home() {
  return (
    <ComparisonProvider>
      <main>
        <OnboardingTrigger />
        <HeroSection scrollTargetId="destinations-grid" />
        <div id="destinations-grid" className="mx-auto max-w-7xl px-4 pt-4 pb-8">
          <Suspense fallback={<div className="h-96 w-full animate-pulse rounded-xl bg-sand" />}>
            <BrowsePage />
          </Suspense>
        </div>
      </main>
      <CompareFloatingButton />
    </ComparisonProvider>
  );
}
