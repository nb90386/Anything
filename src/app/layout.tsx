import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { ensureSeeded } from "@/lib/seed";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Contract Intelligence Copilot: Independent CLM Portfolio Demo",
  description:
    "An AI-powered contract lifecycle management demo: upload contracts, extract risk, track obligations, compare amendments, and turn a portfolio into commercial insight. An independent portfolio project inspired by the CLM product space; not affiliated with Malbek Inc.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await ensureSeeded();
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} h-full`} suppressHydrationWarning>
      <body className="h-full font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
