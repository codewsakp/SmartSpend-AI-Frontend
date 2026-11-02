import { formatCurrency } from "../../utils/format";

// Shared Recharts tooltip that formats values as currency.
export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="chart-tooltip">
      {label ? <p className="chart-tooltip-title">{label}</p> : null}
      {payload.map((item) => (
        <p key={item.dataKey ?? item.name} className="chart-tooltip-row">
          <span className="legend-dot" style={{ background: item.color || item.payload?.fill }} />
          <span>{item.name}</span>
          <strong>{formatCurrency(item.value)}</strong>
        </p>
      ))}
    </div>
  );
}
