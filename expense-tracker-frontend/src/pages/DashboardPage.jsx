import { useCallback } from "react";
import { ChartColumn } from "lucide-react";
import InsightsPanel from "../components/ai/InsightsPanel";
import CategoryChart from "../components/analytics/CategoryChart";
import MonthlyTrendChart from "../components/analytics/MonthlyTrendChart";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import MonthPicker from "../components/common/MonthPicker";
import PageHeader from "../components/common/PageHeader";
import { PageLoader } from "../components/common/Spinner";
import QuickExpense from "../components/dashboard/QuickExpense";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import SummaryCards from "../components/dashboard/SummaryCards";
import { useAuth } from "../context/AuthContext";
import useAsyncData from "../hooks/useAsyncData";
import useMonthSelector from "../hooks/useMonthSelector";
import dashboardService from "../services/dashboardService";
import { firstName, greetingForNow } from "../utils/format";

export default function DashboardPage() {
  const { user } = useAuth();
  const month = useMonthSelector();

  const loader = useCallback(
    () => dashboardService.getDashboard(month.year, month.month),
    [month.year, month.month]
  );
  const { data, loading, error, reload, retry } = useAsyncData(loader);

  const header = (
    <PageHeader
      title={`${greetingForNow()}, ${firstName(user?.name)}`}
      subtitle={`Your spending overview for ${month.label}`}
    >
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
        <PageLoader label="Loading your dashboard…" />
      </>
    );
  }

  const { summary, categoryBreakdown, monthlyTrends, recentTransactions } = data;
  const hasTrendData = monthlyTrends.some((item) => Number(item.totalAmount) > 0);

  return (
    <>
      {header}

      <SummaryCards summary={summary} />

      <div className="dashboard-grid">
        <section className="card span-2" aria-labelledby="trend-title">
          <h2 className="card-title" id="trend-title">Monthly spending trend</h2>
          <p className="card-subtitle">Last six months, up to {month.label}</p>
          {hasTrendData ? (
            <MonthlyTrendChart trends={monthlyTrends} />
          ) : (
            <EmptyState icon={ChartColumn} title="No spending to chart yet" message="Your monthly trend appears once you add expenses." />
          )}
        </section>

        <section className="card" aria-labelledby="category-title">
          <h2 className="card-title" id="category-title">Spending by category</h2>
          <p className="card-subtitle">{month.label}</p>
          {categoryBreakdown.length > 0 ? (
            <CategoryChart categories={categoryBreakdown} />
          ) : (
            <EmptyState icon={ChartColumn} title="No expenses this month" message="Category totals will show up here." />
          )}
        </section>

        <section className="card span-2" aria-labelledby="recent-title">
          <h2 className="card-title" id="recent-title">Recent transactions</h2>
          <p className="card-subtitle">Your latest five expenses</p>
          <RecentTransactions items={recentTransactions} />
        </section>

        <section className="card" aria-labelledby="quick-title">
          <h2 className="card-title" id="quick-title">Quick expense</h2>
          <p className="card-subtitle">Add a new expense</p>
          <QuickExpense onSaved={reload} />
        </section>

        <section className="card span-3" aria-labelledby="insights-title">
          <h2 className="card-title" id="insights-title">Insights</h2>
          <p className="card-subtitle">What your spending says this month</p>
          <InsightsPanel
            summary={summary}
            categories={categoryBreakdown}
            trends={monthlyTrends}
            year={month.year}
            month={month.month}
          />
        </section>
      </div>
    </>
  );
}
