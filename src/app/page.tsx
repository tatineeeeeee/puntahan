import { ComparisonProvider } from "@/lib/comparison-context";
import { BrowsePage } from "@/components/destinations/browse-page";
import { CompareFloatingButton } from "@/components/compare/compare-floating-button";

export default function Home() {
  return (
    <ComparisonProvider>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-coral">puntahan</h1>
          <p className="mt-1 text-warm-gray">Discover the Philippines</p>
        </div>
        <BrowsePage />
      </main>
      <CompareFloatingButton />
    </ComparisonProvider>
  );
}
