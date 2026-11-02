import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartTooltip from "../common/ChartTooltip";
import { formatCurrency } from "../../utils/format";

// rows: [{ label, spent, budget }]  (budget is null when none was set)
export default function BudgetComparisonChart({ rows, height = 280 }) {
  const data = rows.map((row) => ({
    label: row.label,
    Spent: row.spent,
    Budget: row.budget ?? undefined,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={4}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "var(--muted)", fontSize: 12 }} />
        <YAxis
          width={52}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--muted)", fontSize: 12 }}
          tickFormatter={(value) => formatCurrency(value, { compact: true })}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(113, 98, 207, 0.06)" }} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Bar dataKey="Spent" fill="#7162cf" radius={[6, 6, 0, 0]} maxBarSize={30} />
        <Bar dataKey="Budget" fill="#38a995" radius={[6, 6, 0, 0]} maxBarSize={30} />
      </BarChart>
    </ResponsiveContainer>
  );
}
