import { Card } from "@/components/ui/card";
import { Metric, Text, Flex } from "@tremor/react";
import { TrendingDown } from "lucide-react";
import { formatMoney } from "@/lib/utils";

export function LeakageHero({
  totalOpenLeakage,
  currency,
  openOpportunityCount,
}: {
  totalOpenLeakage: number;
  currency: string;
  openOpportunityCount: number;
}) {
  return (
    <Card className="overflow-hidden border-brand-100 bg-gradient-to-br from-brand-50 via-white to-white p-6 dark:border-brand-500/20 dark:from-brand-500/10 dark:via-ink-900 dark:to-ink-900">
      <Flex alignItems="start" justifyContent="between" flexDirection="row" className="flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            <Text className="!text-ink-500 dark:!text-ink-400">Revenue at risk this quarter</Text>
          </div>
          <Metric className="mt-1 !text-ink-950 dark:!text-white">{formatMoney(totalOpenLeakage, currency)}</Metric>
          <Text className="mt-2 max-w-md !text-ink-500 dark:!text-ink-400">
            Across {openOpportunityCount} open {openOpportunityCount === 1 ? "opportunity" : "opportunities"} in the
            current portfolio. Illustrative, based on seeded demo data, every figure below traces to the contract
            clause that produced it.
          </Text>
        </div>
      </Flex>
    </Card>
  );
}
