import { Link } from "react-router-dom";
import { Gauge, PiggyBank, Receipt, Wallet } from "lucide-react";
import ProgressBar from "../common/ProgressBar";
import StatusBadge from "../common/StatusBadge";
import { formatCurrency, formatPercent } from "../../utils/format";

function StatCard({ icon: Icon, label, value, children, tone = "purple" }) {
  return (
    <article className="card stat-card">
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        <span className={`stat-icon stat-icon-${tone}`} aria-hidden="true">
          <Icon size={18} />
        </span>
      </div>
      <div className="stat-value">{value}</div>
      {children ? <div className="stat-foot">{children}</div> : null}
    </article>
  );
}

// `summary` is the backend's DashboardSummaryResponse. When no budget exists
// for the month the budget fields are null and budgetStatus is BUDGET_NOT_SET.
export default function SummaryCards({ summary }) {
  const hasBudget = summary.budgetStatus !== "BUDGET_NOT_SET";
  const over = summary.budgetStatus === "OVER_BUDGET";
  const noBudgetLink = (
    <Link to="/budgets" className="text-link">Set a budget</Link>
  );

  return (
    <section className="stat-grid" aria-label="Monthly summary">
      <StatCard icon={Receipt} label="Total expenses" value={formatCurrency(summary.totalExpenses)} tone="purple">
        <span className="muted">Spent this month</span>
      </StatCard>

      <StatCard
        icon={Wallet}
        label="Monthly budget"
        value={hasBudget ? formatCurrency(summary.monthlyBudget) : "Not set"}
        tone="teal"
      >
        {hasBudget ? <StatusBadge status={summary.budgetStatus} /> : noBudgetLink}
      </StatCard>

      <StatCard
        icon={PiggyBank}
        label={over ? "Over budget by" : "Remaining budget"}
        value={hasBudget ? formatCurrency(Math.abs(Number(summary.remainingBudget))) : "—"}
        tone={over ? "red" : "blue"}
      >
        {hasBudget ? (
          <span className={over ? "text-danger" : "muted"}>
            {over ? "You have exceeded this month's budget" : "Left to spend this month"}
          </span>
        ) : (
          <span className="muted">Set a budget to track this</span>
        )}
      </StatCard>

      <StatCard
        icon={Gauge}
        label="Budget used"
        value={hasBudget ? formatPercent(summary.percentageUsed) : "—"}
        tone={over ? "red" : "amber"}
      >
        {hasBudget ? (
          <ProgressBar
            percent={summary.percentageUsed}
            tone={over ? "danger" : Number(summary.percentageUsed) >= 80 ? "warning" : "primary"}
            label="Budget used"
          />
        ) : (
          <span className="muted">No budget for this month</span>
        )}
      </StatCard>
    </section>
  );
}
