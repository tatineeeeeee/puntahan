import type { Metadata } from "next";
import { ComparisonProvider } from "@/lib/comparison-context";
import { ComparisonPage } from "@/components/compare/comparison-page";

export const metadata: Metadata = {
  title: "Compare Destinations — puntahan",
  description: "Compare Philippine destinations side by side.",
};

export default function Compare() {
  return (
    <ComparisonProvider>
      <ComparisonPage />
    </ComparisonProvider>
  );
}
