import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Disclaimer, SampleBanner } from "@/components/disclaimer";
import { AutoRefresh } from "@/components/auto-refresh";
import { pageContext } from "@/lib/queries";

export const metadata: Metadata = {
  title: "PolyAlpha Lab — Prediction-Market Quant Research",
  description: "Autonomous Polymarket paper-trading research system. Research tool only. Not financial advice.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let sample = false;
  try {
    sample = (await pageContext()).sample;
  } catch {
    /* db may not be ready at build */
  }
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Disclaimer />
        {sample && <SampleBanner />}
        <div className="mx-auto flex max-w-[1500px] gap-0">
          <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/[0.06] bg-base-850/40 backdrop-blur-xl lg:flex">
            <div className="flex items-center gap-2 px-5 py-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-neon-cyan to-neon-violet text-sm font-bold text-base-900">P</div>
              <div>
                <div className="text-sm font-semibold leading-tight text-white">PolyAlpha Lab</div>
                <div className="text-[10px] uppercase tracking-widest text-white/35">Quant Research</div>
              </div>
            </div>
            <Nav />
            <div className="mt-auto p-4">
              <Disclaimer inline />
            </div>
          </aside>
          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="text-xs text-white/30">Polymarket · public read-only data · $10,000 paper bankroll</div>
              <AutoRefresh seconds={15} />
            </div>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
