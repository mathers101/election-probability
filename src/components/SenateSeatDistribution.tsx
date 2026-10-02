import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { expectedSeats, type SenateSeatPdfs } from "@/lib/calculate-probability";

const SERIES = [
  { key: "D" as const, label: "Democratic caucus", color: "#2563eb" },
  { key: "R" as const, label: "Republican", color: "#dc2626" },
];

const chartConfig = {
  D: { label: "Democratic caucus", color: "#2563eb" },
  R: { label: "Republican", color: "#dc2626" },
} satisfies ChartConfig;

export default function SenateSeatDistribution({ pdfs }: { pdfs: SenateSeatPdfs }) {
  const minSeats = 44;
  const maxSeats = 56;
  const chartData = Array.from({ length: maxSeats - minSeats + 1 }, (_, index) => {
    const seats = minSeats + index;
    return { seats, D: pdfs.D[seats] ?? 0, R: pdfs.R[seats] ?? 0 };
  });

  return (
    <section className="mx-auto mt-4 grid w-full max-w-5xl gap-4 px-4 lg:grid-cols-[0.7fr_1.3fr]" aria-label="Senate seat distribution">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        {SERIES.map(({ key, label, color }) => (
          <Card key={key}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Expected {label} seats</p>
              <p className="mt-1 text-3xl font-bold" style={{ color }}>{expectedSeats(pdfs[key]).toFixed(1)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-4 sm:p-6">
          <h2 className="mb-1 text-lg font-semibold">Probability by seat count</h2>
          <p className="mb-3 text-sm text-muted-foreground">Chance of each party’s total seat count under these predictions.</p>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart accessibilityLayer data={chartData} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="seats"
                type="number"
                domain={[minSeats, maxSeats]}
                ticks={[44, 47, 50, 53, 56]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                allowDataOverflow
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value: number) => `${(value * 100).toFixed(0)}%`}
                width={48}
              />
              <ChartTooltip
                cursor={{ strokeDasharray: "4 4" }}
                content={
                  <ChartTooltipContent
                    className="min-w-[210px] rounded-md border-border/70 bg-background/98 px-3 py-2.5 shadow-lg"
                    indicator="line"
                    labelClassName="border-b border-border/60 pb-2 text-sm font-semibold text-foreground"
                    labelFormatter={(_, payload) => `${payload?.[0]?.payload?.seats ?? ""} seats`}
                    formatter={(value, name) => {
                      const series = chartConfig[String(name) as keyof typeof chartConfig];
                      return (
                        <div className="flex w-full items-center gap-2">
                          <span className="h-0.5 w-3 shrink-0 rounded-full" style={{ backgroundColor: series.color }} />
                          <span className="flex-1 text-muted-foreground">{series.label}</span>
                          <span className="font-mono font-semibold tabular-nums text-foreground">
                            {(Number(value) * 100).toFixed(2)}%
                          </span>
                        </div>
                      );
                    }}
                  />
                }
              />
              <Line dataKey="D" type="linear" stroke="var(--color-D)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
              <Line dataKey="R" type="linear" stroke="var(--color-R)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ChartContainer>
          <div className="mt-2 flex justify-center gap-6 text-sm">
            {SERIES.map(({ key, label, color }) => <span key={key} className="flex items-center gap-2"><span className="h-0.5 w-5" style={{ backgroundColor: color }} />{label}</span>)}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
