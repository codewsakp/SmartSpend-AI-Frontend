import { useCallback } from "react";
import { Wallet } from "lucide-react";
import BudgetForm from "../components/budgets/BudgetForm";
import BudgetStatusCard from "../components/budgets/BudgetStatusCard";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import MonthPicker from "../components/common/MonthPicker";
import PageHeader from "../components/common/PageHeader";
import { PageLoader } from "../components/common/Spinner";
import { useToast } from "../context/ToastContext";
import useAsyncData from "../hooks/useAsyncData";
import useMonthSelector from "../hooks/useMonthSelector";
import budgetService from "../services/budgetService";

export default function BudgetsPage() {
  const toast = useToast();
  const month = useMonthSelector();

  const loader = useCallback(
    () => budgetService.getSummary(month.year, month.month),
    [month.year, month.month]
  );
  // data is the summary, or null when no budget exists for this month
  const { data: summary, loading, error, reload, retry } = useAsyncData(loader);

  async function handleSave(amount) {
    const isUpdate = Boolean(summary);
    await budgetService.set({ amount, year: month.year, month: month.month });
    toast.success(isUpdate ? "Budget updated" : "Budget set");
    reload();
  }

  return (
    <>
      <PageHeader title="Budgets" subtitle="Plan how much you want to spend each month">
        <MonthPicker selector={month} />
      </PageHeader>

      {error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : loading ? (
        <PageLoader label="Loading budget…" />
      ) : (
        <div className="two-col">
          <section className="card" aria-labelledby="budget-set-title">
            <h2 className="card-title" id="budget-set-title">
              {summary ? "Update budget" : "Set budget"}
            </h2>
            <p className="card-subtitle">{month.label}</p>
            <BudgetForm
              key={`${month.year}-${month.month}-${summary?.budgetAmount ?? "none"}`}
              monthLabel={month.label}
              currentAmount={summary ? Number(summary.budgetAmount) : null}
              onSubmit={handleSave}
            />
          </section>

          <section className="card" aria-labelledby="budget-status-title">
            <h2 className="card-title" id="budget-status-title">Budget status</h2>
            <p className="card-subtitle">{month.label}</p>
            {summary ? (
              <BudgetStatusCard summary={summary} />
            ) : (
              <EmptyState
                icon={Wallet}
                title="No budget for this month"
                message="Set a budget to see how much you have spent and how much is left."
              />
            )}
          </section>
        </div>
      )}
    </>
  );
}
