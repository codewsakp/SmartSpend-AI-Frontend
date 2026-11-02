import { formatCurrency, formatPercent } from "../../utils/format";

// rows: [{ key, fullLabel, spent, budget, percentUsed }]
export default function MonthlyTotalsTable({ rows }) {
  return (
    <div className="table-wrap">
      <table className="data-table data-table-compact">
        <thead>
          <tr>
            <th>Month</th>
            <th className="num">Spent</th>
            <th className="num">Budget</th>
            <th className="num">Used</th>
          </tr>
        </thead>
        <tbody>
          {[...rows].reverse().map((row) => (
            <tr key={row.key}>
              <td>{row.fullLabel}</td>
              <td className="num strong">{formatCurrency(row.spent)}</td>
              <td className="num">{row.budget === null ? <span className="muted">Not set</span> : formatCurrency(row.budget)}</td>
              <td className="num">
                {row.percentUsed === null ? (
                  <span className="muted">—</span>
                ) : (
                  <span className={row.percentUsed > 100 ? "text-danger" : ""}>{formatPercent(row.percentUsed)}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
