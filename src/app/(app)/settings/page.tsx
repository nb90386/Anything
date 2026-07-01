import { Cpu, Info, Lock } from "lucide-react";
import { FadeIn } from "@/components/landing/fade-in";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RoleSwitcherCard } from "@/components/settings/role-switcher-card";
import { ResetDemoDataCard } from "@/components/settings/reset-demo-data-card";

export const dynamic = "force-dynamic";

const PROVIDER_LABEL: Record<string, string> = {
  mock: "Mock engine (offline, deterministic)",
  anthropic: "Anthropic Claude",
  openai: "OpenAI",
};

function activeProvider(): { key: string; label: string } {
  const key = (process.env.AI_PROVIDER ?? "mock").toLowerCase();
  return { key, label: PROVIDER_LABEL[key] ?? `Unrecognized provider: ${key}` };
}

export default function SettingsPage() {
  const provider = activeProvider();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <FadeIn>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-950 dark:text-white">Settings</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-500 dark:text-ink-400">
          Role view, analysis engine status, and demo data controls for this private instance.
        </p>
      </FadeIn>

      <FadeIn delay={0.05}>
        <RoleSwitcherCard />
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Analysis engine</CardTitle>
              <CardDescription>Which engine powers contract summaries, chat, and extraction.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-ink-100 bg-ink-25 p-4 dark:border-ink-800 dark:bg-ink-900/50">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                <Cpu className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink-900 dark:text-white">{provider.label}</p>
                <p className="text-xs text-ink-500 dark:text-ink-400">
                  Set via the <code className="rounded bg-ink-100 px-1 py-0.5 dark:bg-ink-800">AI_PROVIDER</code>{" "}
                  environment variable.
                </p>
              </div>
              <Badge tone="neutral" className="ml-auto shrink-0">
                <Lock className="h-3 w-3" />
                Read-only
              </Badge>
            </div>
            <p className="flex items-start gap-2 text-xs leading-relaxed text-ink-500 dark:text-ink-400">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              This is not changeable from the UI in this demo. Switching providers means editing{" "}
              <code className="rounded bg-ink-100 px-1 py-0.5 dark:bg-ink-800">.env.local</code> and restarting the
              server, since it involves server-side API keys that should never be exposed to the browser.
            </p>
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={0.15}>
        <ResetDemoDataCard />
      </FadeIn>

      <FadeIn delay={0.2}>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Brand</CardTitle>
              <CardDescription>Where the visual identity in this app comes from.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300">
              The violet color palette used throughout this app is an informed approximation inspired by Malbek&apos;s
              public identity, not verified official brand assets. No official Malbek logo, wordmark, or brand file
              is included in this codebase; see <code className="rounded bg-ink-100 px-1 py-0.5 text-xs dark:bg-ink-800">assets/brand/README.md</code>{" "}
              for how real assets would be added if this were ever authorized. This is a private, non-public demo
              and is not affiliated with or endorsed by Malbek Inc.
            </p>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
