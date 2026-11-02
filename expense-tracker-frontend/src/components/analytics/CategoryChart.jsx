import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import ChartTooltip from "../common/ChartTooltip";
import { CHART_COLORS } from "../../utils/constants";
import { formatCurrency, formatPercent } from "../../utils/format";

// `categories` is the backend's CategoryAnalyticsResponse[]:
// { category, totalAmount, percentage } (already sorted highest first).
export default function CategoryChart({ categories, height = 200 }) {
  const data = categories.map((item) => ({
    name: item.category,
    value: Number(item.totalAmount),
  }));

  return (
    <div className="category-chart">
      <div className="category-chart-plot">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="92%"
              paddingAngle={data.length > 1 ? 2 : 0}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="category-legend">
        {categories.map((item, index) => (
          <li key={item.category}>
            <span className="legend-dot" style={{ background: CHART_COLORS[index % CHART_COLORS.length] }} />
            <span className="legend-name">{item.category}</span>
            <span className="legend-value">{formatCurrency(item.totalAmount)}</span>
            <span className="legend-percent">{formatPercent(item.percentage)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
