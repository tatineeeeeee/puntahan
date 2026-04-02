import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "puntahan — Discover the Philippines",
  description:
    "Community-driven travel guide for Philippine destinations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable} suppressHydrationWarning>
      <body
        className="min-h-dvh bg-background text-foreground font-sans antialiased"
        suppressHydrationWarning
      >
        <ConvexClientProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-coral focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
          >
            Skip to content
          </a>
          <Header />
          <div id="main-content" className="pb-16 sm:pb-0">{children}</div>
          <BottomNav />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
