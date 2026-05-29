import { MiniPieChart } from "@/components/charts/intelligence-charts";
import { MiniChartCard } from "@/components/home/mini-chart-card";

export function SpendBreakdownCard({
  slices,
  caption = "Estimated marketing mix · UAE delivery",
}: {
  slices: { label: string; value: number }[];
  caption?: string;
}) {
  return (
    <MiniChartCard title="Spend breakdown" caption={caption} liveState="synced">
      <MiniPieChart slices={slices} size={96} />
    </MiniChartCard>
  );
}
