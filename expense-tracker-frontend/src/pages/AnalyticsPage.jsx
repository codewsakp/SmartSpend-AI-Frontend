import { useCallback } from "react";
import { ChartColumn, Wallet } from "lucide-react";
import BudgetComparisonChart from "../components/analytics/BudgetComparisonChart";
import CategoryChart from "../components/analytics/CategoryChart";
import MonthlyTotalsTable from "../components/analytics/MonthlyTotalsTable";
import MonthlyTrendChart from "../components/analytics/MonthlyTrendChart";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import MonthPicker from "../components/common/MonthPicker";
import PageHeader from "../components/common/PageHeader";
import { PageLoader } from "../components/common/Spinner";
import useAsyncData from "../hooks/useAsyncData";
import useMonthSelector from "../hooks/useMonthSelector";
import budgetService from "../services/budgetService";
import dashboardService from "../services/dashboardService";
import { formatCurrency, monthNumberFromName } from "../utils/format";

// Loads the six-month trend + category breakdown, then asks the budget API for
// each of those months so spending can be compared with budgets.
async function loadAnalytics(year, month) {
  const [trends, categories] = await Promise.all([
    dashboardService.getMonthlyTrends(year, month),
    dashboardService.getCategoryBreakdown(year, month),
  ]);

  const summaries = await Promise.all(
    trends.map((item) =>
      budgetService.getSummary(item.year, monthNumberFromName(item.month) ?? month)
    )
  );

  const rows = trends.map((item, index) => {
    const summary = summaries[index];
    return {
      key: `${item.year}-${item.month}`,
      label: String(item.month).slice(0, 3),
      fullLabel: `${item.month} ${item.year}`,
      spent: Number(item.totalAmount),
      budget: summary ? Number(summary.budgetAmount) : null,
      percentUsed: summary ? Number(summary.percentageUsed) : null,
    };
  });

  return { trends, categories, rows };
}

export default function AnalyticsPage() {
  const month = useMonthSelector();
  const loader = useCallback(() => loadAnalytics(month.year, month.month), [month.year, month.month]);
  const { data, loading, error, retry } = useAsyncData(loader);

  const header = (
    <PageHeader title="Analytics" subtitle="Understand your spending patterns over time">
      <MonthPicker selector={month} />
    </PageHeader>
  );

  if (error) {
    return (
      <>
        {header}
        <ErrorState message={error} onRetry={retry} />
      </>
    );
  }
  if (loading || !data) {
    return (
      <>
        {header}
        <PageLoader label="Loading analytics…" />
      </>
    );
  }

  const { trends, categories, rows } = data;
  const hasSpending = rows.some((row) => row.spent > 0);
  const hasBudgets = rows.some((row) => row.budget !== null);

  const total = rows.reduce((sum, row) => sum + row.spent, 0);
  const average = rows.length ? total / rows.length : 0;
  const highest = rows.reduce((best, row) => (row.spent > best.spent ? row : best), rows[0]);

  return (
    <>
      {header}

      <section className="stat-grid stat-grid-3" aria-label="Six month overview">
        <article className="card stat-card">
          <span className="stat-label">6-month total</span>
          <div className="stat-value">{formatCurrency(total)}</div>
          <div className="stat-foot muted">Ending {month.label}</div>
        </article>
        <article className="card stat-card">
          <span className="stat-label">Monthly average</span>
          <div className="stat-value">{formatCurrency(average)}</div>
          <div className="stat-foot muted">Across these six months</div>
        </article>
        <article className="card stat-card">
          <span className="stat-label">Highest month</span>
          <div className="stat-value">{hasSpending ? formatCurrency(highest.spent) : "—"}</div>
          <div className="stat-foot muted">{hasSpending ? highest.fullLabel : "No spending yet"}</div>
        </article>
      </section>

      <div className="dashboard-grid">
        <section className="card span-2" aria-labelledby="an-trend">
          <h2 className="card-title" id="an-trend">Monthly spending trend</h2>
          <p className="card-subtitle">Last six months, up to {month.label}</p>
          {hasSpending ? (
            <MonthlyTrendChart trends={trends} height={300} />
          ) : (
            <EmptyState icon={ChartColumn} title="No spending yet" message="Add expenses to see your trend." />
          )}
        </section>

        <section className="card" aria-labelledby="an-category">
          <h2 className="card-title" id="an-category">Category distribution</h2>
          <p className="card-subtitle">{month.label}</p>
          {categories.length > 0 ? (
            <CategoryChart categories={categories} />
          ) : (
            <EmptyState icon={ChartColumn} title="No expenses this month" message="Nothing to break down yet." />
          )}
        </section>

        <section className="card span-2" aria-labelledby="an-budget">
          <h2 className="card-title" id="an-budget">Budget vs spending</h2>
          <p className="card-subtitle">Months without a budget show spending only</p>
          {hasBudgets ? (
            <BudgetComparisonChart rows={rows} />
          ) : (
            <EmptyState
              icon={Wallet}
              title="No budgets set in this period"
              message="Set monthly budgets on the Budgets page to compare them with your spending."
            />
          )}
        </section>

        <section className="card" aria-labelledby="an-totals">
          <h2 className="card-title" id="an-totals">Monthly totals</h2>
          <p className="card-subtitle">Spending and budget use</p>
          <MonthlyTotalsTable rows={rows} />
        </section>
      </div>
    </>
  );
}
