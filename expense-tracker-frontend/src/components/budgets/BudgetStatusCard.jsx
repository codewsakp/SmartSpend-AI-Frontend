import ProgressBar from "../common/ProgressBar";
import StatusBadge from "../common/StatusBadge";
import { formatCurrency, formatPercent } from "../../utils/format";

// `summary` is the backend's BudgetSummaryResponse:
// { budgetAmount, totalSpent, remainingAmount, percentageUsed, status }
export default function BudgetStatusCard({ summary }) {
  const over = summary.status === "OVER_BUDGET";
  const percent = Number(summary.percentageUsed);
  const tone = over ? "danger" : percent >= 80 ? "warning" : "primary";

  return (
    <div className="budget-status">
      <div className="budget-status-head">
        <StatusBadge status={summary.status} />
        <span className={`budget-percent ${over ? "text-danger" : ""}`}>
          {formatPercent(summary.percentageUsed)} used
        </span>
      </div>

      <ProgressBar percent={percent} tone={tone} label="Budget used" />

      <dl className="budget-figures">
        <div>
          <dt>Budget</dt>
          <dd>{formatCurrency(summary.budgetAmount)}</dd>
        </div>
        <div>
          <dt>Spent</dt>
          <dd>{formatCurrency(summary.totalSpent)}</dd>
        </div>
        <div>
          <dt>{over ? "Over by" : "Remaining"}</dt>
          <dd className={over ? "text-danger" : ""}>
            {formatCurrency(Math.abs(Number(summary.remainingAmount)))}
          </dd>
        </div>
      </dl>
    </div>
  );
}
