import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartTooltip from "../common/ChartTooltip";
import { formatCurrency } from "../../utils/format";

// `trends` is the backend's MonthlyTrendResponse[]: { month, year, totalAmount }.
// The last entry is the selected month and is drawn in the accent colour.
export default function MonthlyTrendChart({ trends, height = 260 }) {
  const data = trends.map((item) => ({
    label: String(item.month).slice(0, 3),
    Spent: Number(item.totalAmount),
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
        <Bar dataKey="Spent" radius={[6, 6, 0, 0]} maxBarSize={44}>
          {data.map((entry, index) => (
            <Cell
              key={entry.label + index}
              fill={index === data.length - 1 ? "var(--purple)" : "#c9c3ee"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
