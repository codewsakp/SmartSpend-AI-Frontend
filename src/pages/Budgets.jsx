
import { useCallback, useEffect, useState } from "react";
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  CalendarDays,
  Save,
  RefreshCw,
} from "lucide-react";

import budgetService from "../services/budgetService";
import { getApiErrorMessage } from "../services/api";
import "./Budgets.css";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0);
}

function getCurrentMonth() {
  const now = new Date();

  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
}

function getMonthName(month, year) {
  return new Date(year, month - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

export default function Budgets() {
  const current = getCurrentMonth();

  const [month, setMonth] = useState(String(current.month));
  const [year, setYear] = useState(String(current.year));

  const [summary, setSummary] = useState(null);
  const [budgetAmount, setBudgetAmount] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchBudgetSummary = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await budgetService.getBudgetSummary(
        Number(year),
        Number(month)
      );

      const data = response.data;
      setSummary(data);
      setBudgetAmount(
        data?.budgetAmount != null ? String(data.budgetAmount) : ""
      );
    } catch (err) {
      setSummary(null);
      setBudgetAmount("");
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchBudgetSummary();
  }, [fetchBudgetSummary]);

  const handleSaveBudget = async (event) => {
    event.preventDefault();

    const amount = Number(budgetAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Please enter a budget amount greater than zero.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
        await budgetService.updateBudget({
            amount,
            year: Number(year),
            month: Number(month),
        });

        await fetchBudgetSummary();
        setSuccess("Your monthly budget has been saved successfully.");
        } catch (err) {
        setError(getApiErrorMessage(err));
        } finally {
        setSaving(false);
        }
  };

  const budget = Number(summary?.budgetAmount) || 0;
  const spent = Number(summary?.totalSpent) || 0;
  const remaining = Number(summary?.remainingAmount) || 0;

  const percentage = Math.min(
    100,
    Math.max(0, Number(summary?.percentageUsed) || 0)
  );

  const status = summary?.status || "Not Set";

  const progressClass =
    percentage >= 100
      ? "budget-progress-danger"
      : percentage >= 80
        ? "budget-progress-warning"
        : "budget-progress-normal";

  const monthOptions = Array.from({ length: 12 }, (_, index) => ({
    value: String(index + 1),
    label: new Date(2026, index, 1).toLocaleDateString("en-IN", {
      month: "long",
    }),
  }));

  const yearOptions = Array.from(
    { length: 5 },
    (_, index) => current.year - 2 + index
  );

  return (
    <div className="page-content budgets-page">
      <header className="topbar">
        <div className="breadcrumb">
          <span>Workspace</span>
          <span className="breadcrumb-separator">/</span>
          <strong>Budgets</strong>
        </div>

        <div className="topbar-user">
          <div className="topbar-user-avatar">
            <Wallet size={18} />
          </div>
          <span>Budget Overview</span>
        </div>
      </header>

      <section className="page-heading budgets-heading">
        <div>
          <span className="eyebrow">FINANCIAL PLANNING</span>
          <h1>Monthly Budget</h1>
          <p className="page-subtitle">
            Set your spending limit and keep track of your expenses.
          </p>
        </div>

        <div className="budget-month-label">
          <CalendarDays size={17} />
          <span>{getMonthName(Number(month), Number(year))}</span>
        </div>
      </section>

      <section className="budget-controls-panel">
        <div className="budget-controls-title">
          <div className="budget-icon-box">
            <CalendarDays size={20} />
          </div>
          <div>
            <h2>Select Period</h2>
            <p>Choose the month you want to manage.</p>
          </div>
        </div>

        <div className="budget-period-controls">
          <div className="budget-field">
            <label htmlFor="budget-month">Month</label>
            <select
              id="budget-month"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
            >
              {monthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="budget-field">
            <label htmlFor="budget-year">Year</label>
            <select
              id="budget-year"
              value={year}
              onChange={(event) => setYear(event.target.value)}
            >
              {yearOptions.map((option) => (
                <option key={option} value={String(option)}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="budget-refresh-button"
            onClick={fetchBudgetSummary}
            disabled={loading}
            title="Refresh budget"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>
      </section>

      <section className="budget-summary-grid">
        <article className="budget-summary-card">
          <div className="budget-card-top">
            <div className="budget-card-icon purple">
              <Wallet size={21} />
            </div>
            <span>Monthly Budget</span>
          </div>
          <h2>{formatCurrency(budget)}</h2>
          <p>Your planned spending limit</p>
        </article>

        <article className="budget-summary-card">
          <div className="budget-card-top">
            <div className="budget-card-icon orange">
              <TrendingDown size={21} />
            </div>
            <span>Total Spent</span>
          </div>
          <h2>{formatCurrency(spent)}</h2>
          <p>Your expenses for this month</p>
        </article>

        <article className="budget-summary-card">
          <div className="budget-card-top">
            <div className="budget-card-icon green">
              <PiggyBank size={21} />
            </div>
            <span>Remaining Budget</span>
          </div>
          <h2 className={remaining < 0 ? "budget-negative" : ""}>
            {formatCurrency(remaining)}
          </h2>
          <p>Amount available to spend</p>
        </article>
      </section>

      <section className="budget-main-grid">
        <article className="budget-panel budget-progress-panel">
          <div className="budget-panel-heading">
            <div>
              <span className="eyebrow">SPENDING OVERVIEW</span>
              <h2>Budget Usage</h2>
            </div>
            <span className="budget-status">{status}</span>
          </div>

          {loading ? (
            <div className="budget-loading">Loading budget details...</div>
          ) : (
            <>
              <div className="budget-percentage-row">
                <div>
                  <span className="budget-percentage">
                    {Number(summary?.percentageUsed || 0).toFixed(1)}%
                  </span>
                  <p>of your monthly budget used</p>
                </div>
                <div className="budget-spending-label">
                  <span>Spent</span>
                  <strong>{formatCurrency(spent)}</strong>
                </div>
              </div>

              <div
                className="budget-progress-track"
                role="progressbar"
                aria-label="Monthly budget used"
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className={`budget-progress-fill ${progressClass}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="budget-progress-footer">
                <span>0%</span>
                <span>100% of budget</span>
              </div>

              <div className="budget-insight">
                {budget <= 0 ? (
                  <p>Set a monthly budget to start tracking your spending.</p>
                ) : percentage >= 100 ? (
                  <p>
                    You have reached or exceeded your monthly budget. Review
                    your expenses before spending more.
                  </p>
                ) : percentage >= 80 ? (
                  <p>
                    You have used most of your budget. Keep an eye on your
                    remaining expenses.
                  </p>
                ) : (
                  <p>
                    You are within your budget. Keep tracking your expenses to
                    stay on target.
                  </p>
                )}
              </div>
            </>
          )}
        </article>

        <article className="budget-panel budget-form-panel">
          <div className="budget-panel-heading">
            <div>
              <span className="eyebrow">BUDGET SETTINGS</span>
              <h2>Set Monthly Limit</h2>
            </div>
          </div>

          <p className="budget-form-description">
            Enter the maximum amount you plan to spend during{" "}
            {getMonthName(Number(month), Number(year))}.
          </p>

          <form onSubmit={handleSaveBudget}>
            <div className="budget-field budget-amount-field">
              <label htmlFor="budget-amount">Budget Amount (₹)</label>
              <div className="budget-amount-input-wrap">
                <span>₹</span>
                <input
                  id="budget-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Enter your monthly budget"
                  value={budgetAmount}
                  onChange={(event) => setBudgetAmount(event.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="budget-save-button"
              disabled={saving || loading}
            >
              <Save size={17} />
              {saving ? "Saving..." : "Save Budget"}
            </button>
          </form>

          <p className="budget-form-note">
            Updating this amount will replace the budget for the selected
            month.
          </p>
        </article>
      </section>

      {error && (
        <div className="budget-message budget-error" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="budget-message budget-success" role="status">
          {success}
        </div>
      )}
    </div>
  );
}
